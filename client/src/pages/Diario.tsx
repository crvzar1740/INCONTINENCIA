import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, Download, Droplets, Bell, BellOff, Lock, FileText } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { generateMedicalReport } from "@/lib/generateMedicalReport";
import { useAuth } from "@/_core/hooks/useAuth";

const STORAGE_KEY = "suelo-firme-diario";
const FIRST_ENTRY_KEY = "suelo-firme-diario-first";
const ALARM_KEY = "suelo-firme-alarm-scheduled-at";

interface Entry {
  id: string;
  timestamp: string;
  urgencia: "tranquilo" | "apurado" | "no-llegue";
  escape: boolean;
  causaEscape: string;
  liquido: string;
}

type Step = "urgencia" | "escape" | "liquido" | "done";

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: string) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Hoy";
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";
  return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
}

const URGENCIA_OPTIONS: { value: Entry["urgencia"]; label: string; emoji: string; color: string }[] = [
  { value: "tranquilo", label: "Tranquilo", emoji: "😌", color: "#A9C6B8" },
  { value: "apurado", label: "Apurado", emoji: "😬", color: "#C9BEDD" },
  { value: "no-llegue", label: "No llegué a tiempo", emoji: "😔", color: "#E8C49A" },
];

const CAUSA_OPTIONS = ["Tos", "Risa", "Ejercicio", "Sin razón clara", "Otro"];

/* ─── Service Worker helpers ─── */
async function getSW(): Promise<ServiceWorker | null> {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    return reg.active;
  } catch {
    return null;
  }
}

function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker
    .register("/sw.js")
    .catch((err) => console.warn("SW registration failed:", err));
}

/** Cancel any pending notification and schedule a new one.
 *  `avgMinutes` = user's average interval between bathroom visits.
 *  We fire the notification at 85% of the interval so it arrives
 *  slightly before the expected urge — giving time to practice suppression. */
async function scheduleAlarm(avgMinutes: number, lastEntryTimestamp: string) {
  const sw = await getSW();
  if (!sw) return;

  // Cancel any old pending notification first
  sw.postMessage({ type: "CANCEL_NOTIF" });

  const lastMs = new Date(lastEntryTimestamp).getTime();
  const intervalMs = avgMinutes * 60 * 1000;
  const fireAt = lastMs + intervalMs * 0.85;
  const delayMs = fireAt - Date.now();

  if (delayMs <= 0) return; // past — no alarm needed

  const title = "Momento de practicar";
  const body =
    "Tu vejiga probablemente quiera ir pronto. Antes de levantarte: 3 contracciones rápidas, respirá lento. La urgencia es una ola — podés atravesarla. 💪";

  sw.postMessage({ type: "SCHEDULE_NOTIF", payload: { delayMs, title, body } });
  localStorage.setItem(ALARM_KEY, String(fireAt));
}

async function cancelAlarm() {
  const sw = await getSW();
  if (!sw) return;
  sw.postMessage({ type: "CANCEL_NOTIF" });
  localStorage.removeItem(ALARM_KEY);
}

/* ─── Component ─── */
export default function Diario() {
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [step, setStep] = useState<Step | null>(null);
  const [draft, setDraft] = useState<Partial<Entry>>({});
  const [showFirstEntryMsg, setShowFirstEntryMsg] = useState(false);
  const [missedYesterday, setMissedYesterday] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [alarmScheduledAt, setAlarmScheduledAt] = useState<number | null>(null);
  // Source of truth is the server, set only by a confirmed Hotmart webhook —
  // never trust a client-side flag for a paid feature.
  const { user } = useAuth();
  const isPremium = user?.hasPremium === 1;
  const notifPromptShownRef = useRef(false);

  /* ─── Init ─── */
  useEffect(() => {
    registerSW();

    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }

    const stored = localStorage.getItem(ALARM_KEY);
    if (stored) setAlarmScheduledAt(Number(stored));

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Entry[];
        setEntries(parsed);

        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yd = yesterday.toDateString();
        const hasYesterday = parsed.some((e) => new Date(e.timestamp).toDateString() === yd);
        const hasToday = parsed.some((e) => new Date(e.timestamp).toDateString() === today);
        if (!hasYesterday && parsed.length > 0 && !hasToday) {
          setMissedYesterday(true);
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  /* ─── Stats ─── */
  const stats = useMemo(() => {
    if (entries.length < 2) return null;
    const times = entries.map((e) => new Date(e.timestamp).getTime());
    const intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push((times[i] - times[i - 1]) / 60000);
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const escapes = entries.filter((e) => e.escape).length;
    return { avgMin: Math.round(avg), total: entries.length, escapes };
  }, [entries]);

  /* ─── Reschedule alarm whenever entries change ─── */
  useEffect(() => {
    if (!stats || notifPermission !== "granted") return;
    const lastEntry = entries[entries.length - 1];
    if (!lastEntry) return;
    scheduleAlarm(stats.avgMin, lastEntry.timestamp).then(() => {
      const stored = localStorage.getItem(ALARM_KEY);
      if (stored) setAlarmScheduledAt(Number(stored));
    });
  }, [entries, stats, notifPermission]);

  /* ─── Prompt for notification permission after 2nd entry ─── */
  useEffect(() => {
    if (
      !notifPromptShownRef.current &&
      entries.length >= 2 &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      notifPromptShownRef.current = true;
    }
  }, [entries.length]);

  const requestNotifPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("Tu navegador no soporta notificaciones");
      return;
    }
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === "granted") {
      toast.success("🔔 Notificaciones activadas");
      if (stats && entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        await scheduleAlarm(stats.avgMin, lastEntry.timestamp);
        const stored = localStorage.getItem(ALARM_KEY);
        if (stored) setAlarmScheduledAt(Number(stored));
      }
    } else {
      toast.error("Permiso denegado — podés activarlo en la configuración del navegador");
    }
  }, [stats, entries]);

  const disableAlarms = useCallback(async () => {
    await cancelAlarm();
    setAlarmScheduledAt(null);
    toast.success("Alarmas desactivadas");
  }, []);

  /* ─── Persist entries ─── */
  const persist = (next: Entry[]) => {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  /* ─── Step flow ─── */
  const startEntry = () => {
    setDraft({ id: genId(), timestamp: new Date().toISOString() });
    setStep("urgencia");
  };

  const selectUrgencia = (val: Entry["urgencia"]) => {
    setDraft((d) => ({ ...d, urgencia: val }));
    setStep("escape");
  };

  const selectEscape = (val: boolean) => {
    setDraft((d) => ({ ...d, escape: val, causaEscape: "" }));
    if (!val) setStep("liquido");
  };

  const selectCausa = (val: string) => {
    setDraft((d) => ({ ...d, causaEscape: val }));
    setStep("liquido");
  };

  const finishEntry = (liquido: string) => {
    const entry = { ...draft, liquido } as Entry;
    const next = [...entries, entry].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    persist(next);

    const isFirst = !localStorage.getItem(FIRST_ENTRY_KEY);
    if (isFirst) {
      localStorage.setItem(FIRST_ENTRY_KEY, "1");
      setShowFirstEntryMsg(true);
    } else {
      toast.success("✓ Registro guardado");
    }
    setStep("done");
    setDraft({});
    setMissedYesterday(false);
  };

  const removeEntry = (id: string) => {
    persist(entries.filter((e) => e.id !== id));
    toast.success("Registro eliminado");
  };

  const downloadDiary = () => {
    const lines = entries.map(
      (e) =>
        `${formatDate(e.timestamp)} ${formatTime(e.timestamp)} | Urgencia: ${e.urgencia} | Escape: ${e.escape ? "sí" : "no"}${e.causaEscape ? ` (${e.causaEscape})` : ""} | Líquido: ${e.liquido || "-"}`
    );
    const content = [
      "DIARIO MICCIONAL — Suelo Firme",
      new Date().toLocaleDateString("es-ES"),
      "",
      ...lines,
      "",
      stats ? `Intervalo promedio: ${stats.avgMin} minutos` : "",
      stats ? `Total de registros: ${stats.total}` : "",
      stats ? `Episodios con escape: ${stats.escapes}` : "",
    ]
      .filter((l) => l !== undefined)
      .join("\n");
    const el = document.createElement("a");
    el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    el.setAttribute("download", "diario-miccional-suelo-firme.txt");
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    toast.success("✓ Diario descargado");
  };

  const groupedEntries = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    entries.forEach((e) => {
      const key = formatDate(e.timestamp);
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return Object.entries(map).reverse();
  }, [entries]);

  /* ─── Alarm countdown display ─── */
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const minutesUntilAlarm =
    alarmScheduledAt && alarmScheduledAt > now
      ? Math.round((alarmScheduledAt - now) / 60000)
      : null;

  const showNotifPrompt =
    entries.length >= 2 &&
    "Notification" in window &&
    notifPermission === "default";

  /* ─── Render ─── */
  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{ background: "#FAF7F2cc", borderColor: "#E5E0D8" }}
      >
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-1 font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#3D6B66" }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="flex-1 text-center font-semibold text-lg" style={{ color: "#2B2420" }}>
            Mi diario
          </div>
          <div className="w-16" />
        </div>
      </nav>

      <div className="container max-w-xl py-8 pb-24">

        {/* Missed yesterday nudge */}
        {missedYesterday && (
          <div
            className="rounded-xl p-4 mb-6 text-sm leading-relaxed"
            style={{ background: "#A9C6B820", color: "#3D6B66", border: "1px solid #A9C6B850" }}
          >
            ¿Ayer se te pasó? Podés agregar un registro anterior, o simplemente seguimos desde hoy. Tu progreso sigue intacto.
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-5 h-5" style={{ color: "#3D6B66" }} />
            <h1 className="text-2xl font-semibold" style={{ color: "#2B2420" }}>
              Tu diario no es un examen. Es tu mapa.
            </h1>
          </div>
          <p className="text-sm leading-relaxed mt-2" style={{ color: "#6B6259" }}>
            Cuantos más días registres, más clara se vuelve la foto — y esa foto es lo que le da sentido a todo lo demás.
          </p>
        </div>

        {/* Stats card */}
        {stats && (
          <div
            className="rounded-xl p-5 mb-6 grid grid-cols-3 gap-4 text-center"
            style={{ background: "#fff", border: "1px solid #E5E0D8" }}
          >
            <div>
              <p className="text-2xl font-bold" style={{ color: "#3D6B66" }}>
                {stats.total}
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B6259" }}>registros</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "#3D6B66" }}>
                {stats.avgMin}m
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B6259" }}>intervalo prom.</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "#C08A4E" }}>
                {stats.escapes}
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B6259" }}>con escape</p>
            </div>
          </div>
        )}

        {/* ─── Alarm / notification panel ─── */}
        {showNotifPrompt && (
          <div
            className="rounded-xl p-5 mb-6"
            style={{ background: "#fff", border: "2px solid #A9C6B860" }}
          >
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#3D6B66" }} />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1" style={{ color: "#2B2420" }}>
                  ¿Activar alarmas inteligentes?
                </p>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B6259" }}>
                  La app calcula cuándo es probable que tu vejiga quiera ir y te avisa antes — para que practiques las técnicas de supresión antes de que la urgencia te gane.
                </p>
                <Button
                  size="sm"
                  onClick={requestNotifPermission}
                  className="font-semibold rounded-lg text-xs"
                  style={{ background: "#3D6B66", color: "#fff" }}
                >
                  Activar recordatorios
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active alarm status */}
        {notifPermission === "granted" && stats && (
          <div
            className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3"
            style={{
              background: minutesUntilAlarm ? "#A9C6B820" : "#FAF7F2",
              border: "1px solid #A9C6B860",
            }}
          >
            {minutesUntilAlarm ? (
              <Bell className="w-4 h-4 flex-shrink-0" style={{ color: "#3D6B66" }} />
            ) : (
              <BellOff className="w-4 h-4 flex-shrink-0" style={{ color: "#6B6259" }} />
            )}
            <div className="flex-1">
              {minutesUntilAlarm ? (
                <p className="text-sm" style={{ color: "#2B2420" }}>
                  Próximo recordatorio en{" "}
                  <strong style={{ color: "#3D6B66" }}>{minutesUntilAlarm} min</strong>
                  <span className="text-xs ml-1" style={{ color: "#6B6259" }}>
                    (basado en tu intervalo de {stats.avgMin} min)
                  </span>
                </p>
              ) : (
                <p className="text-sm" style={{ color: "#6B6259" }}>
                  Registrá una ida al baño para activar el próximo recordatorio.
                </p>
              )}
            </div>
            <button
              onClick={disableAlarms}
              className="text-xs underline flex-shrink-0 hover:opacity-70"
              style={{ color: "#6B6259" }}
            >
              Desactivar
            </button>
          </div>
        )}

        {/* First entry success */}
        {showFirstEntryMsg && (
          <div
            className="rounded-xl p-5 mb-6 text-sm leading-relaxed"
            style={{ background: "#A9C6B830", border: "1px solid #A9C6B860", color: "#2B2420" }}
          >
            <strong>Listo.</strong> Ese es el primer dato de tu mapa. En una semana vas a empezar a ver patrones que ni vos sabías que tenías.{" "}
            <button
              className="underline font-medium"
              style={{ color: "#3D6B66" }}
              onClick={() => setShowFirstEntryMsg(false)}
            >
              Entendido
            </button>
          </div>
        )}

        {/* ─── Record button ─── */}
        {step === null && (
          <button
            onClick={startEntry}
            className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mb-8"
            style={{ background: "#3D6B66", color: "#fff", minHeight: "88px", border: "none" }}
          >
            <Plus className="w-7 h-7" />
            <span className="text-lg font-semibold">Registrar ida al baño</span>
          </button>
        )}

        {/* ─── Step: urgencia ─── */}
        {step === "urgencia" && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#fff", border: "1px solid #E5E0D8" }}
          >
            <p className="font-semibold text-lg mb-1" style={{ color: "#2B2420" }}>
              ¿Cómo fue la urgencia?
            </p>
            <p className="text-sm mb-5" style={{ color: "#6B6259" }}>
              No hay respuesta incorrecta — solo información.
            </p>
            <div className="space-y-3">
              {URGENCIA_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectUrgencia(opt.value)}
                  className="w-full flex items-center gap-4 rounded-xl px-5 py-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: opt.color + "30",
                    border: `2px solid ${opt.color}60`,
                    minHeight: "64px",
                  }}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-medium text-base" style={{ color: "#2B2420" }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Step: escape ─── */}
        {step === "escape" && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#fff", border: "1px solid #E5E0D8" }}
          >
            <p className="font-semibold text-lg mb-1" style={{ color: "#2B2420" }}>
              ¿Hubo algún escape?
            </p>
            <p className="text-sm mb-5" style={{ color: "#6B6259" }}>
              Esto es información, no una confesión.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => selectEscape(false)}
                className="rounded-xl py-5 font-semibold text-base transition-all hover:scale-[1.02]"
                style={{
                  background: "#A9C6B830",
                  border: "2px solid #A9C6B860",
                  color: "#2B2420",
                  minHeight: "64px",
                }}
              >
                No
              </button>
              <button
                onClick={() => selectEscape(true)}
                className="rounded-xl py-5 font-semibold text-base transition-all hover:scale-[1.02]"
                style={{
                  background: "#E8C49A30",
                  border: "2px solid #E8C49A60",
                  color: "#2B2420",
                  minHeight: "64px",
                }}
              >
                Sí
              </button>
            </div>
            {draft.escape === true && (
              <>
                <p className="text-sm font-medium mb-3" style={{ color: "#2B2420" }}>
                  ¿Qué lo provocó? (opcional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {CAUSA_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => selectCausa(c)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{
                        background: "#FAF7F2",
                        border: "1px solid #E5E0D8",
                        color: "#2B2420",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                  <button
                    onClick={() => setStep("liquido")}
                    className="px-4 py-2 rounded-lg text-sm transition-all"
                    style={{ color: "#6B6259", border: "1px dashed #E5E0D8" }}
                  >
                    Prefiero no decir
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── Step: liquido ─── */}
        {step === "liquido" && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#fff", border: "1px solid #E5E0D8" }}
          >
            <p className="font-semibold text-lg mb-1" style={{ color: "#2B2420" }}>
              ¿Tomaste algo antes?
            </p>
            <p className="text-sm mb-5" style={{ color: "#6B6259" }}>
              Agua, café, mate, alcohol... ayuda a ver si algo te afecta más.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Agua", "Café", "Mate", "Té", "Alcohol", "Jugo", "Gaseosa"].map((l) => (
                <button
                  key={l}
                  onClick={() => finishEntry(l)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    background: "#FAF7F2",
                    border: "1px solid #E5E0D8",
                    color: "#2B2420",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => finishEntry("")}
              className="text-sm transition-all"
              style={{ color: "#6B6259" }}
            >
              Nada / no recuerdo — guardar igual
            </button>
          </div>
        )}

        {/* ─── Step: done ─── */}
        {step === "done" && (
          <div
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ background: "#A9C6B830", border: "1px solid #A9C6B860" }}
          >
            <p className="text-2xl mb-2">✓</p>
            <p className="font-semibold" style={{ color: "#2B2420" }}>
              Registro guardado
            </p>
            {notifPermission === "granted" && minutesUntilAlarm && (
              <p className="text-xs mt-2" style={{ color: "#6B6259" }}>
                Próximo recordatorio en {minutesUntilAlarm} min
              </p>
            )}
            <button
              className="mt-4 text-sm font-medium underline"
              style={{ color: "#3D6B66" }}
              onClick={() => setStep(null)}
            >
              Agregar otro
            </button>
          </div>
        )}

        {/* ─── Entry list ─── */}
        {groupedEntries.length > 0 && (
          <div className="space-y-6">
            {groupedEntries.map(([date, dayEntries]) => (
              <div key={date}>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "#6B6259" }}
                >
                  {date}
                </p>
                <div className="space-y-2">
                  {dayEntries.map((e) => {
                    const opt = URGENCIA_OPTIONS.find((o) => o.value === e.urgencia);
                    return (
                      <div
                        key={e.id}
                        className="flex items-center justify-between rounded-xl px-4 py-3"
                        style={{ background: "#fff", border: "1px solid #E5E0D8" }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{opt?.emoji ?? "🚽"}</span>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "#2B2420" }}>
                              {formatTime(e.timestamp)}
                              {e.escape && (
                                <span
                                  className="ml-2 text-xs px-2 py-0.5 rounded-full"
                                  style={{ background: "#E8C49A30", color: "#9C5D52" }}
                                >
                                  escape
                                </span>
                              )}
                            </p>
                            {e.liquido && (
                              <p className="text-xs" style={{ color: "#6B6259" }}>
                                {e.liquido}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeEntry(e.id)}
                          className="transition-opacity hover:opacity-50"
                          style={{ color: "#6B6259" }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {entries.length >= 4 && (
              isPremium ? (
                /* ── Premium: full PDF export ── */
                <button
                  onClick={() => {
                    try {
                      generateMedicalReport(entries);
                      toast.success("✓ PDF generado");
                    } catch {
                      toast.error("Error generando el PDF — intentá de nuevo");
                    }
                  }}
                  className="w-full rounded-xl py-5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: "#3D6B66", border: "none" }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-5 h-5" style={{ color: "#fff" }} />
                    <div className="text-left">
                      <p className="font-semibold text-sm" style={{ color: "#fff" }}>
                        Descargar informe PDF para tu médico
                      </p>
                      <p className="text-xs" style={{ color: "#A9C6B8" }}>
                        Incluye estadísticas, gráfico de intervalos y tabla de escapes
                      </p>
                    </div>
                  </div>
                </button>
              ) : (
                /* ── Paywall gate ── */
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid #E5E0D8" }}
                >
                  {/* Blurred preview */}
                  <div
                    className="px-5 py-4 flex items-center gap-3"
                    style={{ background: "#fff", filter: "blur(1px)", pointerEvents: "none", opacity: 0.5 }}
                  >
                    <FileText className="w-5 h-5" style={{ color: "#3D6B66" }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#2B2420" }}>
                        Informe PDF para tu médico
                      </p>
                      <p className="text-xs" style={{ color: "#6B6259" }}>
                        Estadísticas · gráfico de intervalos · tabla de escapes
                      </p>
                    </div>
                  </div>
                  {/* Lock overlay */}
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-4"
                    style={{ background: "#FAF7F2", borderTop: "1px solid #E5E0D8" }}
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 flex-shrink-0" style={{ color: "#9C5D52" }} />
                      <p className="text-xs leading-snug" style={{ color: "#6B6259" }}>
                        Disponible con Premium — llegá a tu próxima consulta con datos reales.
                      </p>
                    </div>
                    <button
                      onClick={() => setLocation("/upsell")}
                      className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
                      style={{ background: "#9C5D52", color: "#fff" }}
                    >
                      Ver plan
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {entries.length === 0 && step === null && (
          <div
            className="rounded-xl p-6 text-center text-sm leading-relaxed"
            style={{ border: "1px dashed #E5E0D8", color: "#6B6259" }}
          >
            <p className="mb-2 text-2xl">📝</p>
            <p>
              Cada vez que vayas al baño, tocá el botón de arriba. La app calcula el tiempo entre visitas por vos.
            </p>
          </div>
        )}

        {/* Urgency suppression quick-reference */}
        {entries.length >= 2 && (
          <div
            className="mt-8 rounded-xl p-5"
            style={{ background: "#fff", border: "1px solid #E5E0D8" }}
          >
            <p className="font-semibold text-sm mb-3" style={{ color: "#2B2420" }}>
              🌊 Cuando llegue la urgencia
            </p>
            <div className="space-y-3 text-xs leading-relaxed" style={{ color: "#6B6259" }}>
              <p>
                <strong style={{ color: "#2B2420" }}>1. Quedate quieta.</strong> Correr empeora la urgencia — aumenta la presión abdominal.
              </p>
              <p>
                <strong style={{ color: "#2B2420" }}>2. Contraé 3-5 veces rápido.</strong> Las contracciones rápidas del piso pélvico inhiben la contracción de la vejiga (freeze & squeeze).
              </p>
              <p>
                <strong style={{ color: "#2B2420" }}>3. Respirá lento.</strong> Inhalá 4 tiempos, exhalá 6. La vejiga responde al sistema nervioso — la calma la frena.
              </p>
              <p>
                <strong style={{ color: "#2B2420" }}>4. La urgencia pasa sola.</strong> En 1-2 minutos baja sin que hagas nada más. Cada vez que la atravesás, entrenás la vejiga a esperar más.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
