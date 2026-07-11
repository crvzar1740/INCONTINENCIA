import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Wind,
  Zap,
  Brain,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";

/* ─── Design tokens ─── */
const SAGE    = "#3D6B66";
const TERRA   = "#9C5D52";
const BRONZE  = "#C08A4E";
const CREAM   = "#FAF7F2";
const DARK    = "#2B2420";
const MUTED   = "#6B6259";
const BORDER  = "#E5E0D8";

/* ─── Storage key ─── */
const KEY = "suelo-firme-bladder-retraining";

/* ─── Types ─── */
interface SessionLog {
  timestamp: string;      // ISO
  actualMinutes: number | null;
  weekNumber: number;
  targetMinutes: number;
  held: boolean;
}

interface ProtocolState {
  startDate: string;        // "YYYY-MM-DD"
  baselineMinutes: number;
  sessions: SessionLog[];
}

/* ─── Helpers ─── */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysSince(dateStr: string): number {
  const ms = new Date().getTime() - new Date(dateStr).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function weekNumber(startDate: string): number {
  return Math.floor(daysSince(startDate) / 7) + 1;
}

function targetMinutes(baseline: number, week: number): number {
  return baseline + (week - 1) * 15;
}

function minutesSince(isoTs: string): number {
  return Math.floor((new Date().getTime() - new Date(isoTs).getTime()) / 60000);
}

function fmtMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/* ─── Urgency coaching techniques ─── */
const TECHNIQUES = [
  {
    icon: Wind,
    color: SAGE,
    title: "Respiración 4-4-4",
    desc: "Inhalá 4 segundos, retené 4, exhalá 4. Repetí 3 veces. Activa el sistema nervioso parasimpático y frena el reflejo de urgencia.",
    action: "Hacelo ahora, sentada o de pie — sin moverte hacia el baño.",
  },
  {
    icon: Zap,
    color: TERRA,
    title: "5 Kegels rápidos",
    desc: "Contraé el suelo pélvico 5 veces, fuerte y rápido. Esto inhibe directamente el músculo detrusor y reduce la urgencia.",
    action: "Contraé y relajá rápido, 5 veces seguidas. La urgencia baja en 30-60 segundos.",
  },
  {
    icon: Brain,
    color: BRONZE,
    title: "Distracción cognitiva",
    desc: "Contá hacia atrás desde 100 de a 7 (100, 93, 86…). Mientras el córtex prefrontal está ocupado, el cerebro no puede amplificar la señal de urgencia.",
    action: "Empezá a contar. La urgencia suele ceder antes de llegar a 50.",
  },
];

/* ─── Breathing coach modal ─── */
function BreathingCoach({ onClose }: { onClose: () => void }) {
  const [count, setCount] = useState(4);
  const [phase, setPhase] = useState<"inhala" | "retiene" | "exhala">("inhala");
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1;
        setPhase((p) => {
          if (p === "inhala") { return "retiene"; }
          if (p === "retiene") { return "exhala"; }
          setCycle((c) => {
            if (c >= 2) {
              if (intervalRef.current) clearInterval(intervalRef.current);
            }
            return c + 1;
          });
          return "inhala";
        });
        return 4;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const done = cycle >= 3;
  const scale = phase === "inhala" ? 1.2 : phase === "retiene" ? 1.2 : 0.85;
  const bg = phase === "inhala" ? SAGE : phase === "retiene" ? "#4A7C9E" : "#7B8B6F";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(43,36,32,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="rounded-2xl p-8 w-80 text-center shadow-2xl"
        style={{ background: "#fff" }}
      >
        {!done ? (
          <>
            <p className="text-sm font-semibold mb-6" style={{ color: MUTED }}>
              Ciclo {cycle + 1} de 3
            </p>
            <div
              className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-lg"
              style={{
                background: bg,
                transform: `scale(${scale})`,
                transition: "transform 0.8s ease-in-out, background 0.5s",
              }}
            >
              {count}
            </div>
            <p className="mt-8 text-xl font-bold capitalize" style={{ color: DARK }}>
              {phase === "inhala" ? "Inhalá" : phase === "retiene" ? "Retené" : "Exhalá"}
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: SAGE }} />
            <p className="text-xl font-bold mb-2" style={{ color: DARK }}>
              ¡Bien hecho!
            </p>
            <p className="text-sm mb-6" style={{ color: MUTED }}>
              ¿Cómo va la urgencia? En la mayoría de los casos cede en los próximos 30 segundos.
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: SAGE }}
        >
          {done ? "Listo" : "Cerrar"}
        </button>
      </div>
    </div>
  );
}

/* ─── Weekly progress chart ─── */
function WeekChart({
  sessions,
  startDate,
  baseline,
}: {
  sessions: SessionLog[];
  startDate: string;
  baseline: number;
}) {
  const totalWeeks = weekNumber(startDate);
  const weeksToShow = Math.min(totalWeeks, 6);

  const weekData = useMemo(() => {
    return Array.from({ length: weeksToShow }, (_, i) => {
      const wk = i + 1;
      const wkSessions = sessions.filter(
        (s) => s.weekNumber === wk && s.actualMinutes !== null
      );
      const total = wkSessions.length;
      const held = wkSessions.filter((s) => s.held).length;
      const successRate = total > 0 ? Math.round((held / total) * 100) : 0;
      const target = targetMinutes(baseline, wk);
      return { wk, total, successRate, target };
    });
  }, [sessions, weeksToShow, baseline]);

  if (weeksToShow === 0 || sessions.filter((s) => s.actualMinutes !== null).length === 0) {
    return null;
  }

  const chartW = 260;
  const chartH = 80;
  const barW = Math.min(32, (chartW - 10) / weeksToShow - 6);
  const totalWidth = weeksToShow * (barW + 6) - 6;
  const startX = (chartW - totalWidth) / 2;

  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{ background: "#fff", border: `1px solid ${BORDER}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>
        Tasa de éxito por semana
      </p>
      <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} className="overflow-visible">
        <line x1="0" y1="4" x2={chartW} y2="4" stroke={BORDER} strokeWidth="0.8" strokeDasharray="3 3" />
        {weekData.map((d, i) => {
          const bx = startX + i * (barW + 6);
          const bh = Math.max(4, Math.round((d.successRate / 100) * (chartH - 12)));
          const by = chartH - 4 - bh;
          const isLast = i === weekData.length - 1;
          return (
            <g key={d.wk}>
              <rect x={bx} y={by} width={barW} height={bh} rx="4"
                fill={isLast ? SAGE : "#A9C6B870"} />
              {d.successRate > 0 && (
                <text x={bx + barW / 2} y={by - 3} textAnchor="middle"
                  fontSize="9" fill={isLast ? SAGE : MUTED} fontWeight={isLast ? "600" : "400"}>
                  {d.successRate}%
                </text>
              )}
              <text x={bx + barW / 2} y={chartH + 14} textAnchor="middle"
                fontSize="8.5" fill={MUTED}>
                S{d.wk}
              </text>
            </g>
          );
        })}
        {/* Trend line */}
        {weekData.filter((d) => d.successRate > 0).length >= 2 && (
          <polyline
            points={weekData.map((d, i) => {
              const cx = startX + i * (barW + 6) + barW / 2;
              const bh = Math.max(4, Math.round((d.successRate / 100) * (chartH - 12)));
              const cy = chartH - 4 - bh;
              return `${cx},${cy}`;
            }).join(" ")}
            fill="none" stroke={TERRA} strokeWidth="1.8"
            strokeDasharray="3 2" strokeLinejoin="round" strokeLinecap="round"
          />
        )}
        {weekData.map((d, i) => {
          if (d.successRate === 0) return null;
          const cx = startX + i * (barW + 6) + barW / 2;
          const bh = Math.max(4, Math.round((d.successRate / 100) * (chartH - 12)));
          return (
            <circle key={i} cx={cx} cy={chartH - 4 - bh} r="3"
              fill={TERRA} stroke="#fff" strokeWidth="1.5" />
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Setup screen ─── */
function SetupScreen({ onStart }: { onStart: (baseline: number) => void }) {
  const [baseline, setBaseline] = useState(60);

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: DARK }}>
          Reentrenamiento vesical
        </h1>
        <p className="text-base leading-relaxed mb-4" style={{ color: MUTED }}>
          Tu vejiga puede aprender a aguantar más. Este protocolo — respaldado por las guías EAU 2026 — te guía semana a semana, aumentando tu intervalo de a 15 minutos hasta que tu vejiga vuelva a trabajar a tu ritmo, no al de ella.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
          No es fuerza de voluntad. Es neuroplasticidad: cada vez que respondés a la urgencia con una técnica de contención en lugar de ir corriendo al baño, enseñás a tu sistema nervioso que esa señal de "urgencia" era una falsa alarma.
        </p>
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "#fff", border: `1px solid ${BORDER}` }}
      >
        <p className="font-semibold mb-1" style={{ color: DARK }}>
          ¿Con qué frecuencia vas al baño ahora?
        </p>
        <p className="text-sm mb-5" style={{ color: MUTED }}>
          Pensá en un día típico, sin contar la noche.
        </p>

        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl font-bold tabular-nums" style={{ color: SAGE }}>
            {fmtMinutes(baseline)}
          </span>
          <span className="text-sm" style={{ color: MUTED }}>entre visitas al baño</span>
        </div>

        <input
          type="range"
          min={15}
          max={150}
          step={15}
          value={baseline}
          onChange={(e) => setBaseline(Number(e.target.value))}
          className="w-full accent-[#3D6B66]"
          style={{ accentColor: SAGE }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: MUTED }}>15 min</span>
          <span className="text-xs" style={{ color: MUTED }}>2h 30min</span>
        </div>

        <div
          className="mt-5 rounded-xl p-4"
          style={{ background: `${SAGE}10` }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: SAGE }}>
            Tu protocolo de 8 semanas
          </p>
          <div className="grid grid-cols-2 gap-y-1 mt-2">
            {Array.from({ length: 8 }, (_, i) => {
              const wk = i + 1;
              const mins = targetMinutes(baseline, wk);
              return (
                <div key={wk} className="flex items-center gap-2">
                  <span className="text-xs w-14" style={{ color: MUTED }}>
                    Semana {wk}:
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: wk === 1 ? TERRA : DARK }}
                  >
                    {fmtMinutes(mins)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart(baseline)}
        className="w-full py-4 rounded-xl text-white font-bold text-base"
        style={{ background: `linear-gradient(135deg, ${SAGE}, #2D5550)` }}
      >
        Empezar mi protocolo →
      </button>

      <p className="text-center text-xs mt-4" style={{ color: MUTED }}>
        Podés reiniciar el protocolo en cualquier momento desde esta misma página.
      </p>
    </div>
  );
}

/* ─── Main dashboard ─── */
function Dashboard({
  protocol,
  onLog,
  onReset,
}: {
  protocol: ProtocolState;
  onLog: (actualMinutes: number | null) => void;
  onReset: () => void;
}) {
  const [showCoaching, setShowCoaching] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const currentWeek = weekNumber(protocol.startDate);
  const currentTarget = targetMinutes(protocol.baselineMinutes, currentWeek);

  const lastSession = protocol.sessions.length > 0
    ? protocol.sessions[protocol.sessions.length - 1]
    : null;

  /* Live elapsed counter */
  useEffect(() => {
    if (!lastSession) { setElapsed(null); return; }
    const update = () => setElapsed(minutesSince(lastSession.timestamp));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [lastSession]);

  /* Current week stats */
  const weekSessions = useMemo(() =>
    protocol.sessions.filter(
      (s) => s.weekNumber === currentWeek && s.actualMinutes !== null
    ), [protocol.sessions, currentWeek]);

  const successRate = weekSessions.length > 0
    ? Math.round(
        (weekSessions.filter((s) => s.held).length / weekSessions.length) * 100
      )
    : null;

  /* Streak: consecutive days with at least one "held" session */
  const streak = useMemo(() => {
    const heldDates = new Set(
      protocol.sessions
        .filter((s) => s.held)
        .map((s) => s.timestamp.slice(0, 10))
    );
    let count = 0;
    const d = new Date();
    while (true) {
      const k = d.toISOString().slice(0, 10);
      if (heldDates.has(k)) { count++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return count;
  }, [protocol.sessions]);

  const handleLog = () => {
    const mins = lastSession ? minutesSince(lastSession.timestamp) : null;
    onLog(mins);
    toast.success(
      mins !== null && mins >= currentTarget
        ? "✓ ¡Llegaste al objetivo! Excelente control."
        : "✓ Visita registrada."
    );
  };

  /* Progress toward target (for current elapsed) */
  const elapsedPct = elapsed !== null
    ? Math.min(100, Math.round((elapsed / currentTarget) * 100))
    : 0;

  /* Recent history (last 8 logged) */
  const history = [...protocol.sessions]
    .filter((s) => s.actualMinutes !== null)
    .reverse()
    .slice(0, 8);

  return (
    <div className="max-w-lg mx-auto">
      {/* Week badge */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: DARK }}>
            Semana {currentWeek}
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Objetivo actual:{" "}
            <strong style={{ color: SAGE }}>{fmtMinutes(currentTarget)}</strong>{" "}
            entre visitas
          </p>
        </div>
        {streak > 0 && (
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
            style={{ background: "#E8C49A30", color: BRONZE }}
          >
            <Flame className="w-3.5 h-3.5" />
            {streak} {streak === 1 ? "día" : "días"}
          </div>
        )}
      </div>

      {/* Elapsed timer card */}
      {lastSession && elapsed !== null && (
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: elapsed >= currentTarget
              ? `${SAGE}12`
              : "#fff",
            border: `1px solid ${elapsed >= currentTarget ? SAGE : BORDER}`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: elapsed >= currentTarget ? SAGE : MUTED }} />
              <span className="text-sm font-semibold" style={{ color: DARK }}>
                Tiempo desde última visita
              </span>
            </div>
            {elapsed >= currentTarget && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: SAGE, color: "#fff" }}
              >
                ¡Objetivo alcanzado!
              </span>
            )}
          </div>

          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold tabular-nums" style={{ color: elapsed >= currentTarget ? SAGE : DARK }}>
              {fmtMinutes(elapsed)}
            </span>
            <span className="text-sm mb-1" style={{ color: MUTED }}>
              / {fmtMinutes(currentTarget)}
            </span>
          </div>

          <div
            className="w-full rounded-full h-2 overflow-hidden"
            style={{ background: "#EFEBE5" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${elapsedPct}%`,
                background: elapsed >= currentTarget
                  ? `linear-gradient(to right, ${SAGE}, ${BRONZE})`
                  : `linear-gradient(to right, ${BRONZE}, ${TERRA})`,
              }}
            />
          </div>
        </div>
      )}

      {/* Log button */}
      <button
        onClick={handleLog}
        className="w-full py-5 rounded-2xl text-white font-bold text-lg mb-4 flex items-center justify-center gap-3"
        style={{ background: `linear-gradient(135deg, ${SAGE}, #2D5550)` }}
      >
        <CheckCircle2 className="w-6 h-6" />
        Registrar ida al baño
      </button>

      {/* Week stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "#fff", border: `1px solid ${BORDER}` }}
        >
          <p className="text-2xl font-bold" style={{ color: SAGE }}>
            {weekSessions.length}
          </p>
          <p className="text-xs mt-1" style={{ color: MUTED }}>registros esta semana</p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "#fff", border: `1px solid ${BORDER}` }}
        >
          <p className="text-2xl font-bold" style={{ color: successRate !== null && successRate >= 70 ? SAGE : TERRA }}>
            {successRate !== null ? `${successRate}%` : "—"}
          </p>
          <p className="text-xs mt-1" style={{ color: MUTED }}>objetivos cumplidos</p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "#fff", border: `1px solid ${BORDER}` }}
        >
          <p className="text-2xl font-bold" style={{ color: DARK }}>
            {fmtMinutes(currentTarget)}
          </p>
          <p className="text-xs mt-1" style={{ color: MUTED }}>objetivo semana {currentWeek}</p>
        </div>
      </div>

      {/* ─── Urgency coaching panel ─── */}
      <div
        className="rounded-2xl mb-6 overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}
      >
        <button
          className="w-full flex items-center justify-between p-5"
          style={{ background: showCoaching ? `${TERRA}0A` : "#fff" }}
          onClick={() => setShowCoaching((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${TERRA}15` }}
            >
              <Wind className="w-4 h-4" style={{ color: TERRA }} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ color: DARK }}>
                ¿Sentís urgencia ahora?
              </p>
              <p className="text-xs" style={{ color: MUTED }}>
                3 técnicas para aguantar sin ir al baño todavía
              </p>
            </div>
          </div>
          {showCoaching
            ? <ChevronUp className="w-4 h-4" style={{ color: MUTED }} />
            : <ChevronDown className="w-4 h-4" style={{ color: MUTED }} />
          }
        </button>

        {showCoaching && (
          <div style={{ borderTop: `1px solid ${BORDER}` }}>
            {TECHNIQUES.map((t, i) => (
              <div
                key={i}
                className="p-5"
                style={{
                  borderBottom: i < TECHNIQUES.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${t.color}15` }}
                  >
                    <t.icon className="w-4 h-4" style={{ color: t.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: DARK }}>
                      {t.title}
                    </p>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: MUTED }}>
                      {t.desc}
                    </p>
                    <p
                      className="text-xs font-medium px-3 py-1.5 rounded-lg inline-block"
                      style={{ background: `${t.color}12`, color: t.color }}
                    >
                      {t.action}
                    </p>
                    {i === 0 && (
                      <button
                        onClick={() => setShowBreathing(true)}
                        className="mt-2 ml-0 flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: SAGE }}
                      >
                        <Play className="w-3 h-3" />
                        Guiarme con el timer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly chart */}
      {protocol.sessions.filter((s) => s.actualMinutes !== null).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: SAGE }} />
            <p className="font-semibold text-sm" style={{ color: DARK }}>
              Tu evolución semanal
            </p>
          </div>
          <WeekChart
            sessions={protocol.sessions}
            startDate={protocol.startDate}
            baseline={protocol.baselineMinutes}
          />
        </div>
      )}

      {/* Recent history */}
      {history.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{ border: `1px solid ${BORDER}`, background: "#fff" }}
        >
          <p
            className="px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}
          >
            Últimas visitas registradas
          </p>
          {history.map((s, i) => {
            const dt = new Date(s.timestamp);
            const timeStr = dt.toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const dateStr = dt.toLocaleDateString("es-AR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
            return (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  borderBottom: i < history.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <div>
                  <p className="text-sm font-medium capitalize" style={{ color: DARK }}>
                    {dateStr} · {timeStr}
                  </p>
                  <p className="text-xs" style={{ color: MUTED }}>
                    {s.actualMinutes !== null
                      ? `Aguantaste ${fmtMinutes(s.actualMinutes)} · objetivo: ${fmtMinutes(s.targetMinutes)}`
                      : "Primera visita del día"}
                  </p>
                </div>
                <div>
                  {s.actualMinutes !== null && (
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{
                        background: s.held ? `${SAGE}15` : `${TERRA}15`,
                        color: s.held ? SAGE : TERRA,
                      }}
                    >
                      {s.held ? "✓ Logrado" : `${s.actualMinutes}min`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reset link */}
      <button
        onClick={onReset}
        className="text-xs underline w-full text-center mb-12"
        style={{ color: MUTED }}
      >
        Reiniciar protocolo desde cero
      </button>

      {showBreathing && <BreathingCoach onClose={() => setShowBreathing(false)} />}
    </div>
  );
}

/* ─── Page root ─── */
export default function BladderRetraining() {
  const [, setLocation] = useLocation();
  const [protocol, setProtocol] = useState<ProtocolState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      try {
        setProtocol(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
    setLoading(false);
  }, []);

  const save = (p: ProtocolState) => {
    setProtocol(p);
    localStorage.setItem(KEY, JSON.stringify(p));
  };

  const handleStart = (baseline: number) => {
    save({
      startDate: todayStr(),
      baselineMinutes: baseline,
      sessions: [],
    });
  };

  const handleLog = (actualMinutes: number | null) => {
    if (!protocol) return;
    const wk = weekNumber(protocol.startDate);
    const target = targetMinutes(protocol.baselineMinutes, wk);
    const entry: SessionLog = {
      timestamp: new Date().toISOString(),
      actualMinutes,
      weekNumber: wk,
      targetMinutes: target,
      held: actualMinutes !== null && actualMinutes >= target,
    };
    save({ ...protocol, sessions: [...protocol.sessions, entry] });
  };

  const handleReset = () => {
    localStorage.removeItem(KEY);
    setProtocol(null);
  };

  return (
    <div className="min-h-screen" style={{ background: CREAM }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{ background: `${CREAM}cc`, borderColor: BORDER }}
      >
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity"
            style={{ color: SAGE }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="text-xl font-bold" style={{ color: SAGE }}>
            Suelo Firme
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <div className="container py-12 md:py-16">
        {loading ? null : protocol === null ? (
          <SetupScreen onStart={handleStart} />
        ) : (
          <Dashboard
            protocol={protocol}
            onLog={handleLog}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
