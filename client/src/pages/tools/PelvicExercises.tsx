import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Pause,
  Play,
  RotateCcw,
  TrendingUp,
  Flame,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

/* ─── Design tokens ─── */
const SAGE = "#3D6B66";
const TERRA = "#9C5D52";
const BRONZE = "#C08A4E";
const CREAM = "#FAF7F2";
const DARK = "#2B2420";
const MUTED = "#6B6259";
const BORDER = "#E5E0D8";

/* ─── Storage keys ─── */
const PROGRESS_KEY = "suelo-firme-pelvic-progress";
const HISTORY_KEY = "suelo-firme-kegel-history";

/* ─── Types ─── */
interface ExerciseSpec {
  id: string;
  name: string;
  position: string;
  contractSeconds: number;
  restSeconds: number;
  reps: number;
  sets: number;
  cue: string;
  guided: boolean;
}

interface Phase {
  id: number;
  name: string;
  weeks: string;
  intro: string;
  exercises: ExerciseSpec[];
}

interface SessionEntry {
  date: string;        // "YYYY-MM-DD"
  exerciseId: string;
  totalSeconds: number; // reps * sets * contractSeconds
}

/* ─── Program data ─── */
const PHASES: Phase[] = [
  {
    id: 1,
    name: "Activación",
    weeks: "Semanas 1-2",
    intro:
      "El objetivo de esta fase no es fuerza, es reconexión: identificar el músculo correcto y aprender a contraerlo sin usar glúteos, abdomen o muslos.",
    exercises: [
      {
        id: "identificar",
        name: "Identificar el músculo",
        position: "De pie o sentada, en tu próxima ida al baño",
        contractSeconds: 0,
        restSeconds: 0,
        reps: 1,
        sets: 1,
        cue: "La próxima vez que orines, intentá frenar el chorro a la mitad. El músculo que se activa ahí es tu piso pélvico. Hacelo una sola vez para identificarlo — no lo repitas como ejercicio regular, interrumpir el chorro seguido puede irritar la vejiga.",
        guided: false,
      },
      {
        id: "lenta-f1",
        name: "Contracción lenta con respiración",
        position: "Acostada boca arriba, rodillas flexionadas, pies apoyados",
        contractSeconds: 4,
        restSeconds: 8,
        reps: 8,
        sets: 3,
        cue: "Contraé hacia arriba y adentro (nunca hacia abajo, como si empujaras). Exhalá mientras contraés, inhalá mientras relajás. Si sentís que se tensan los glúteos o el abdomen, estás usando el músculo equivocado.",
        guided: true,
      },
    ],
  },
  {
    id: 2,
    name: "Resistencia progresiva",
    weeks: "Semanas 3-5",
    intro:
      "Ya identificaste el músculo. Ahora el trabajo es de resistencia real: sostener más tiempo y sumar velocidad, no solo repetir.",
    exercises: [
      {
        id: "lenta-f2",
        name: "Contracción lenta progresiva",
        position: "Acostada o sentada",
        contractSeconds: 8,
        restSeconds: 8,
        reps: 12,
        sets: 3,
        cue: "Mismo movimiento que en la Fase 1, pero sosteniendo más tiempo. Si a los 6 segundos ya perdés la contracción, quedate en el tiempo que puedas sostener con calidad — forzar de más cansa el músculo antes de tiempo.",
        guided: true,
      },
      {
        id: "rapida-f2",
        name: "Contracciones rápidas",
        position: "Sentada",
        contractSeconds: 1,
        restSeconds: 2,
        reps: 10,
        sets: 3,
        cue: "Después de las lentas, sumá contracciones cortas y rápidas. Estas entrenan la respuesta inmediata del músculo — la que necesitás al toser o reírte de golpe.",
        guided: true,
      },
    ],
  },
  {
    id: 3,
    name: "Integración al movimiento",
    weeks: "Semana 6 en adelante",
    intro:
      "Acá es donde el trabajo se traduce en la vida real: sostener el control mientras te movés, no solo mientras estás quieta.",
    exercises: [
      {
        id: "de-pie",
        name: "Contracción de pie",
        position: "De pie, apoyo firme",
        contractSeconds: 6,
        restSeconds: 8,
        reps: 10,
        sets: 2,
        cue: "El mismo ejercicio de la Fase 2, pero de pie. Es más difícil de lo que parece — la gravedad suma presión sobre el piso pélvico.",
        guided: true,
      },
      {
        id: "anticipacion",
        name: "La técnica de anticipación",
        position: "En cualquier momento del día",
        contractSeconds: 0,
        restSeconds: 0,
        reps: 1,
        sets: 1,
        cue: "Contraé el piso pélvico un segundo ANTES de toser, estornudar, reírte fuerte o levantar algo pesado — no durante, antes. Esta técnica (conocida clínicamente como \"the knack\") es una de las que más reduce las pérdidas por esfuerzo.",
        guided: false,
      },
      {
        id: "en-movimiento",
        name: "Contracción en movimiento",
        position: "Caminando o subiendo escaleras",
        contractSeconds: 0,
        restSeconds: 0,
        reps: 1,
        sets: 1,
        cue: "Mantené una contracción leve y sostenida mientras camínas unos minutos o subís un tramo de escaleras. El objetivo es que el músculo aguante activo durante el movimiento, no solo en reposo.",
        guided: false,
      },
    ],
  },
];

type TimerMode = "idle" | "contract" | "rest" | "done";

/* ─── Guided timer ─── */
function GuidedTimer({
  exercise,
  onComplete,
}: {
  exercise: ExerciseSpec;
  onComplete: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("idle");
  const [secondsLeft, setSecondsLeft] = useState(exercise.contractSeconds);
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalReps = exercise.reps * exercise.sets;
  const repsDone =
    (currentSet - 1) * exercise.reps + (currentRep - 1);
  const progressPct =
    mode === "done" ? 100 : Math.round((repsDone / totalReps) * 100);

  const reset = () => {
    setRunning(false);
    setMode("idle");
    setSecondsLeft(exercise.contractSeconds);
    setCurrentRep(1);
    setCurrentSet(1);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const start = () => {
    setRunning(true);
    setMode("contract");
    setSecondsLeft(exercise.contractSeconds);
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        if (mode === "contract") {
          setMode("rest");
          return exercise.restSeconds;
        }
        if (currentRep < exercise.reps) {
          setCurrentRep((r) => r + 1);
          setMode("contract");
          return exercise.contractSeconds;
        }
        if (currentSet < exercise.sets) {
          setCurrentSet((s) => s + 1);
          setCurrentRep(1);
          setMode("contract");
          return exercise.contractSeconds;
        }
        setRunning(false);
        setMode("done");
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete();
        return 0;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode]);

  /* Breathing animation scale */
  const breathScale =
    mode === "contract"
      ? 1.18
      : mode === "rest"
      ? 0.92
      : 1;

  return (
    <div
      className="mt-4 rounded-xl border p-5"
      style={{ background: CREAM, borderColor: BORDER }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm" style={{ color: MUTED }}>
          Serie {currentSet}/{exercise.sets} · Rep {currentRep}/{exercise.reps}
        </span>
        <span className="text-sm" style={{ color: MUTED }}>
          {progressPct}%
        </span>
      </div>

      <div
        className="w-full rounded-full h-2 overflow-hidden mb-5"
        style={{ background: "#E5E0D8" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progressPct}%`,
            background: `linear-gradient(to right, ${SAGE}, ${BRONZE})`,
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        {/* Breathing circle */}
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold"
          style={{
            transform: `scale(${breathScale})`,
            transition: "transform 0.6s ease-in-out, background 0.4s",
            background:
              mode === "contract"
                ? SAGE
                : mode === "rest"
                ? "#C9BEDD"
                : "#EFEBE5",
            color:
              mode === "contract" || mode === "rest" ? "#fff" : MUTED,
          }}
        >
          {mode === "done" ? (
            <CheckCircle2 className="w-12 h-12" />
          ) : (
            secondsLeft
          )}
        </div>
        <p
          className="mt-5 text-lg font-semibold"
          style={{ color: DARK }}
        >
          {mode === "idle" && "Lista para empezar"}
          {mode === "contract" && "Contraé · exhalá"}
          {mode === "rest" && "Relajá · inhalá"}
          {mode === "done" && "¡Completado!"}
        </p>
        {mode !== "idle" && mode !== "done" && (
          <p className="text-xs mt-1" style={{ color: MUTED }}>
            {mode === "contract"
              ? "hacia arriba y adentro"
              : "soltá completamente"}
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        {mode === "idle" && (
          <Button
            onClick={start}
            className="flex items-center gap-2"
            style={{ background: SAGE, color: "#fff" }}
          >
            <Play className="w-4 h-4" /> Empezar ejercicio guiado
          </Button>
        )}
        {(mode === "contract" || mode === "rest") && (
          <Button
            onClick={() => setRunning((r) => !r)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {running ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {running ? "Pausar" : "Continuar"}
          </Button>
        )}
        {mode !== "idle" && (
          <Button
            onClick={reset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </Button>
        )}
      </div>
    </div>
  );
}

/* ─── Progress Tracker ─── */
function ProgressTracker({ history }: { history: SessionEntry[] }) {
  /* 7-day calendar strip */
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    return d.toISOString().slice(0, 10);
  });
  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

  const datesWithSessions = new Set(history.map((s) => s.date));

  /* Streak: consecutive days ending today */
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date(today);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (datesWithSessions.has(key)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [history]);

  /* 4-week totals (total contraction seconds per week) */
  const weeklyTotals = useMemo(() => {
    const weeks: number[] = [0, 0, 0, 0];
    history.forEach((s) => {
      const diff = Math.floor(
        (today.getTime() - new Date(s.date).getTime()) / (7 * 24 * 3600 * 1000)
      );
      if (diff >= 0 && diff < 4) {
        weeks[3 - diff] += s.totalSeconds;
      }
    });
    return weeks; // [oldest … newest]
  }, [history]);

  const maxWeek = Math.max(...weeklyTotals, 1);
  const currentWeekSec = weeklyTotals[3];
  const prevWeekSec = weeklyTotals[2];
  const trend =
    prevWeekSec > 0
      ? Math.round(((currentWeekSec - prevWeekSec) / prevWeekSec) * 100)
      : null;

  /* SVG bar + trend line */
  const chartW = 240;
  const chartH = 72;
  const barW = 36;
  const gap = (chartW - barW * 4) / 5;

  const barHeights = weeklyTotals.map((v) =>
    Math.round((v / maxWeek) * (chartH - 12))
  );

  const linePoints = weeklyTotals
    .map((_, i) => {
      const cx = gap + i * (barW + gap) + barW / 2;
      const cy = chartH - 4 - barHeights[i];
      return `${cx},${cy}`;
    })
    .join(" ");

  const weekLabels = ["hace 3s", "hace 2s", "semana ant.", "esta semana"];

  if (history.length === 0) {
    return (
      <Card
        className="p-5 mb-6"
        style={{ border: `1px solid ${BORDER}`, background: "#fff" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4" style={{ color: SAGE }} />
          <p className="font-semibold text-sm" style={{ color: DARK }}>
            Tu progreso aparece aquí
          </p>
        </div>
        <p className="text-xs" style={{ color: MUTED }}>
          Completá tu primer ejercicio guiado y el tracker empieza a registrar tu evolución semana a semana.
        </p>
      </Card>
    );
  }

  return (
    <Card
      className="p-5 mb-6"
      style={{ border: `1px solid ${BORDER}`, background: "#fff" }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: SAGE }} />
          <p className="font-semibold text-sm" style={{ color: DARK }}>
            Tu progreso
          </p>
        </div>
        {streak > 0 && (
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "#E8C49A30", color: BRONZE }}
          >
            <Flame className="w-3.5 h-3.5" />
            {streak} {streak === 1 ? "día seguido" : "días seguidos"}
          </div>
        )}
      </div>

      {/* 7-day calendar strip */}
      <div className="flex gap-1.5 mb-5">
        {weekDays.map((date, i) => {
          const hasSession = datesWithSessions.has(date);
          const isToday = date === today.toISOString().slice(0, 10);
          const dow = new Date(date).getDay(); // 0=Sun
          const labelIdx = dow === 0 ? 6 : dow - 1;
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-md flex items-center justify-center"
                style={{
                  height: "28px",
                  background: hasSession
                    ? SAGE
                    : isToday
                    ? "#A9C6B830"
                    : "#EFEBE5",
                  border: isToday ? `1.5px solid ${SAGE}` : "none",
                }}
              >
                {hasSession && (
                  <CheckCircle2
                    className="w-3.5 h-3.5"
                    style={{ color: "#fff" }}
                  />
                )}
              </div>
              <span
                className="text-xs"
                style={{
                  color: isToday ? SAGE : MUTED,
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {dayLabels[labelIdx]}
              </span>
            </div>
          );
        })}
      </div>

      {/* 4-week bar chart + trend line */}
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>
        Segundos de contracción por semana
      </p>

      <svg
        width="100%"
        viewBox={`0 0 ${chartW} ${chartH + 16}`}
        className="overflow-visible"
      >
        {/* Grid line at top */}
        <line
          x1="0"
          y1="4"
          x2={chartW}
          y2="4"
          stroke={BORDER}
          strokeWidth="0.8"
          strokeDasharray="3 3"
        />

        {/* Bars */}
        {weeklyTotals.map((val, i) => {
          const bh = barHeights[i];
          const bx = gap + i * (barW + gap);
          const by = chartH - 4 - bh;
          return (
            <g key={i}>
              <rect
                x={bx}
                y={by}
                width={barW}
                height={bh}
                rx="4"
                fill={i === 3 ? SAGE : "#A9C6B850"}
              />
              {val > 0 && (
                <text
                  x={bx + barW / 2}
                  y={by - 3}
                  textAnchor="middle"
                  fontSize="9"
                  fill={i === 3 ? SAGE : MUTED}
                  fontWeight={i === 3 ? "600" : "400"}
                >
                  {val}s
                </text>
              )}
              <text
                x={bx + barW / 2}
                y={chartH + 12}
                textAnchor="middle"
                fontSize="8.5"
                fill={MUTED}
              >
                {weekLabels[i]}
              </text>
            </g>
          );
        })}

        {/* Trend polyline — only draw if at least 2 non-zero weeks */}
        {weeklyTotals.filter((v) => v > 0).length >= 2 && (
          <polyline
            points={linePoints}
            fill="none"
            stroke={TERRA}
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray="3 2"
          />
        )}

        {/* Dots on trend line */}
        {weeklyTotals.map((val, i) => {
          if (val === 0) return null;
          const cx = gap + i * (barW + gap) + barW / 2;
          const cy = chartH - 4 - barHeights[i];
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="3"
              fill={TERRA}
              stroke="#fff"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* Trend summary */}
      {currentWeekSec > 0 && (
        <div
          className="mt-4 rounded-lg px-4 py-3 flex items-center gap-3"
          style={{
            background: trend !== null && trend > 0 ? "#A9C6B820" : "#EFEBE5",
          }}
        >
          <TrendingUp
            className="w-4 h-4 flex-shrink-0"
            style={{ color: trend !== null && trend > 0 ? SAGE : MUTED }}
          />
          <p className="text-xs leading-snug" style={{ color: DARK }}>
            {trend !== null ? (
              trend > 0 ? (
                <>
                  Esta semana hiciste{" "}
                  <strong style={{ color: SAGE }}>{currentWeekSec}s</strong> de
                  contracción —{" "}
                  <strong style={{ color: SAGE }}>+{trend}%</strong> más que la
                  semana anterior. Estás mejorando.
                </>
              ) : trend < 0 ? (
                <>
                  Esta semana:{" "}
                  <strong>{currentWeekSec}s</strong> de contracción. La semana pasada
                  fue un poco más. Sin presión — la constancia es lo que cuenta.
                </>
              ) : (
                <>
                  Esta semana:{" "}
                  <strong style={{ color: SAGE }}>{currentWeekSec}s</strong> de
                  contracción. Mismo nivel que la semana anterior. Sostenido.
                </>
              )
            ) : (
              <>
                Esta semana:{" "}
                <strong style={{ color: SAGE }}>{currentWeekSec}s</strong> de
                contracción total. Seguí sumando para ver la tendencia.
              </>
            )}
          </p>
        </div>
      )}
    </Card>
  );
}

/* ─── Main page ─── */
export default function PelvicExercises() {
  const [, setLocation] = useLocation();
  const [activePhase, setActivePhase] = useState(1);
  const [completedExercises, setCompletedExercises] = useState<
    Record<string, boolean>
  >({});
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionEntry[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      try {
        setCompletedExercises(JSON.parse(savedProgress));
      } catch {
        /* ignore */
      }
    }

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        setSessionHistory(JSON.parse(savedHistory));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const markComplete = (exerciseId: string) => {
    /* Update completion map */
    setCompletedExercises((prev) => {
      const next = { ...prev, [exerciseId]: true };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });

    /* Log session for progress tracker */
    const exercise = PHASES.flatMap((p) => p.exercises).find(
      (e) => e.id === exerciseId
    );
    if (exercise && exercise.guided && exercise.contractSeconds > 0) {
      const entry: SessionEntry = {
        date: new Date().toISOString().slice(0, 10),
        exerciseId,
        totalSeconds: exercise.reps * exercise.sets * exercise.contractSeconds,
      };
      setSessionHistory((prev) => {
        const next = [...prev, entry];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        return next;
      });
    }

    toast.success("✓ Ejercicio completado");
  };

  const phase = PHASES.find((p) => p.id === activePhase)!;
  const totalExercises = PHASES.reduce((acc, p) => acc + p.exercises.length, 0);
  const totalCompleted = Object.values(completedExercises).filter(Boolean).length;

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
          <div className="text-2xl font-bold" style={{ color: SAGE }}>
            Suelo Firme
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <div className="py-12 md:py-16">
        <div className="container max-w-3xl">

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: DARK }}
            >
              Tu programa de 3 fases
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: MUTED }}>
              Activación → Resistencia progresiva → Integración al movimiento.
              Avanzá a tu ritmo: lo importante es la calidad de cada contracción,
              no apurar las fases.
            </p>
          </div>

          {/* ─── Progress Tracker ─── */}
          <ProgressTracker history={sessionHistory} />

          {/* Overall progress bar */}
          <Card
            className="p-6 mb-8"
            style={{
              background: "linear-gradient(135deg, #3D6B6608, #C08A4E08)",
              border: `1px solid ${BORDER}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: DARK }}>
                Ejercicios completados
              </span>
              <span className="text-sm" style={{ color: MUTED }}>
                {totalCompleted}/{totalExercises}
              </span>
            </div>
            <div
              className="w-full rounded-full h-2 overflow-hidden"
              style={{ background: "#EFEBE5" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(totalCompleted / totalExercises) * 100}%`,
                  background: `linear-gradient(to right, ${SAGE}, ${BRONZE})`,
                }}
              />
            </div>
          </Card>

          {/* Phase tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {PHASES.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className="flex-shrink-0 px-4 py-3 rounded-lg border text-left transition-colors"
                style={{
                  borderColor:
                    activePhase === p.id ? SAGE : BORDER,
                  background:
                    activePhase === p.id ? `${SAGE}15` : "#fff",
                }}
              >
                <p
                  className="text-xs font-semibold mb-0.5"
                  style={{ color: activePhase === p.id ? SAGE : MUTED }}
                >
                  Fase {p.id} · {p.weeks}
                </p>
                <p
                  className="font-bold text-sm"
                  style={{ color: DARK }}
                >
                  {p.name}
                </p>
              </button>
            ))}
          </div>

          {/* Phase intro */}
          <Card
            className="p-5 mb-6 border-l-4"
            style={{ borderLeftColor: TERRA, background: "#9C5D5208" }}
          >
            <div className="flex gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: TERRA }} />
              <p className="text-sm leading-relaxed" style={{ color: DARK }}>
                {phase.intro}
              </p>
            </div>
          </Card>

          {/* Exercises */}
          <div className="space-y-4 mb-8">
            {phase.exercises.map((exercise) => {
              const isDone = !!completedExercises[exercise.id];
              const isOpen = expandedExercise === exercise.id;
              return (
                <Card
                  key={exercise.id}
                  className="p-6 border-l-4 transition-colors"
                  style={{
                    borderLeftColor: isDone ? SAGE : BORDER,
                    background: isDone ? `${SAGE}08` : "#fff",
                  }}
                >
                  <button
                    className="w-full text-left"
                    onClick={() =>
                      setExpandedExercise(isOpen ? null : exercise.id)
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className="text-lg font-semibold flex items-center gap-2"
                          style={{ color: DARK }}
                        >
                          {isDone && (
                            <CheckCircle2
                              className="w-5 h-5"
                              style={{ color: SAGE }}
                            />
                          )}
                          {exercise.name}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: MUTED }}>
                          {exercise.position}
                        </p>
                        {exercise.guided && (
                          <p
                            className="text-xs font-semibold mt-1"
                            style={{ color: TERRA }}
                          >
                            {exercise.contractSeconds}s contracción ·{" "}
                            {exercise.restSeconds}s descanso · {exercise.reps}{" "}
                            reps × {exercise.sets} series
                          </p>
                        )}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                      <p
                        className="text-sm leading-relaxed mb-2"
                        style={{ color: MUTED }}
                      >
                        <strong style={{ color: DARK }}>
                          Cómo saber si lo hacés bien:{" "}
                        </strong>
                        {exercise.cue}
                      </p>

                      {exercise.guided ? (
                        <GuidedTimer
                          exercise={exercise}
                          onComplete={() => markComplete(exercise.id)}
                        />
                      ) : (
                        !isDone && (
                          <Button
                            onClick={() => markComplete(exercise.id)}
                            className="mt-3 flex items-center gap-2"
                            style={{ background: SAGE, color: "#fff" }}
                          >
                            <CheckCircle2 className="w-4 h-4" /> Marcar como
                            hecho
                          </Button>
                        )
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Safety note */}
          <Card
            className="p-6"
            style={{ background: "#C08A4E08", border: `1px solid ${BRONZE}40` }}
          >
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              <strong style={{ color: DARK }}>Antes de avanzar de fase:</strong>{" "}
              pasá a la siguiente solo cuando puedas completar la fase actual sin
              fatiga ni dolor. Si sentís dolor agudo (no fatiga muscular normal)
              en cualquier ejercicio, detenete y consultá con un profesional de
              salud pélvica.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
