import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Download, Droplets } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const STORAGE_KEY = "suelo-firme-diario";
const FIRST_ENTRY_KEY = "suelo-firme-diario-first";

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
  { value: "no-llegue", label: "No llegué a tiempo", emoji: "😓", color: "#E8C49A" },
];

const CAUSA_OPTIONS = ["Tos", "Risa", "Ejercicio", "Sin razón clara", "Otro"];

export default function Diario() {
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [step, setStep] = useState<Step | null>(null);
  const [draft, setDraft] = useState<Partial<Entry>>({});
  const [showFirstEntryMsg, setShowFirstEntryMsg] = useState(false);
  const [missedYesterday, setMissedYesterday] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Entry[];
        setEntries(parsed);

        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yd = yesterday.toDateString();
        const hasYesterday = parsed.some(
          (e) => new Date(e.timestamp).toDateString() === yd
        );
        const hasToday = parsed.some(
          (e) => new Date(e.timestamp).toDateString() === today
        );
        if (!hasYesterday && parsed.length > 0 && !hasToday) {
          setMissedYesterday(true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const persist = (next: Entry[]) => {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

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
    const content = `DIARIO MICCIONAL — Suelo Firme\n${new Date().toLocaleDateString("es-ES")}\n\n${lines.join("\n")}`;
    const el = document.createElement("a");
    el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    el.setAttribute("download", "diario-miccional-suelo-firme.txt");
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    toast.success("✓ Diario descargado");
  };

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

  const groupedEntries = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    entries.forEach((e) => {
      const key = formatDate(e.timestamp);
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return Object.entries(map).reverse();
  }, [entries]);

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
        {/* Missed yesterday gentle nudge */}
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
              <p className="text-xs mt-1" style={{ color: "#6B6259" }}>
                registros
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "#3D6B66" }}>
                {stats.avgMin}m
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B6259" }}>
                intervalo prom.
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "#C08A4E" }}>
                {stats.escapes}
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B6259" }}>
                con escape
              </p>
            </div>
          </div>
        )}

        {/* First entry success message */}
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

        {/* STEP: Record a new entry */}
        {step === null && (
          <button
            onClick={startEntry}
            className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mb-8"
            style={{
              background: "#3D6B66",
              color: "#fff",
              minHeight: "88px",
              border: "none",
            }}
          >
            <Plus className="w-7 h-7" />
            <span className="text-lg font-semibold">Registrar ida al baño</span>
          </button>
        )}

        {/* STEP: urgencia */}
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
                  style={{ background: opt.color + "30", border: `2px solid ${opt.color}60`, minHeight: "64px" }}
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

        {/* STEP: escape */}
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
                style={{ background: "#A9C6B830", border: "2px solid #A9C6B860", color: "#2B2420", minHeight: "64px" }}
              >
                No
              </button>
              <button
                onClick={() => selectEscape(true)}
                className="rounded-xl py-5 font-semibold text-base transition-all hover:scale-[1.02]"
                style={{ background: "#E8C49A30", border: "2px solid #E8C49A60", color: "#2B2420", minHeight: "64px" }}
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
                      style={{ background: "#FAF7F2", border: "1px solid #E5E0D8", color: "#2B2420" }}
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

        {/* STEP: liquido */}
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
                  style={{ background: "#FAF7F2", border: "1px solid #E5E0D8", color: "#2B2420" }}
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
              Nada / no recuerdo → guardar igual
            </button>
          </div>
        )}

        {/* STEP: done */}
        {step === "done" && (
          <div
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ background: "#A9C6B830", border: "1px solid #A9C6B860" }}
          >
            <p className="text-2xl mb-2">✓</p>
            <p className="font-semibold" style={{ color: "#2B2420" }}>
              Registro guardado
            </p>
            <button
              className="mt-4 text-sm font-medium underline"
              style={{ color: "#3D6B66" }}
              onClick={() => setStep(null)}
            >
              Agregar otro
            </button>
          </div>
        )}

        {/* Entries list */}
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
                          <span className="text-xl">{opt?.emoji ?? "💧"}</span>
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
              <button
                onClick={downloadDiary}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-medium transition-all hover:scale-[1.01]"
                style={{ background: "#fff", border: "1px solid #E5E0D8", color: "#3D6B66" }}
              >
                <Download className="w-4 h-4" />
                Descargar diario para tu médico
              </button>
            )}
          </div>
        )}

        {entries.length === 0 && step === null && (
          <div
            className="rounded-xl p-6 text-center text-sm leading-relaxed"
            style={{ border: "1px dashed #E5E0D8", color: "#6B6259" }}
          >
            <p className="mb-2 text-2xl">📋</p>
            <p>
              Cada vez que vayas al baño, tocá el botón de arriba. La app
              calcula el tiempo entre visitas por vos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
