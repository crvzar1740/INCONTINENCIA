import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Info, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

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

function GuidedTimer({ exercise, onComplete }: { exercise: ExerciseSpec; onComplete: () => void }) {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("idle");
  const [secondsLeft, setSecondsLeft] = useState(exercise.contractSeconds);
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalReps = exercise.reps * exercise.sets;
  const repsDone = (currentSet - 1) * exercise.reps + (currentRep - 1);
  const progressPct = mode === "done" ? 100 : Math.round((repsDone / totalReps) * 100);

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

        // time to switch phase
        if (mode === "contract") {
          setMode("rest");
          return exercise.restSeconds;
        }

        // mode === "rest": move to next rep or set, or finish
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

        // finished
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

  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">
          Serie {currentSet}/{exercise.sets} · Repetición {currentRep}/{exercise.reps}
        </span>
        <span className="text-sm text-muted-foreground">{progressPct}%</span>
      </div>

      <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-5">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold transition-colors duration-300 ${
            mode === "contract"
              ? "bg-primary text-primary-foreground"
              : mode === "rest"
              ? "bg-secondary/20 text-secondary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {mode === "done" ? <CheckCircle2 className="w-12 h-12" /> : secondsLeft}
        </div>
        <p className="mt-4 text-lg font-semibold text-foreground">
          {mode === "idle" && "Lista para empezar"}
          {mode === "contract" && "Contraé"}
          {mode === "rest" && "Relajá"}
          {mode === "done" && "¡Listo!"}
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        {mode === "idle" && (
          <Button onClick={start} className="btn-primary flex items-center gap-2">
            <Play className="w-4 h-4" /> Empezar ejercicio guiado
          </Button>
        )}
        {(mode === "contract" || mode === "rest") && (
          <Button
            onClick={() => setRunning((r) => !r)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? "Pausar" : "Continuar"}
          </Button>
        )}
        {mode !== "idle" && (
          <Button onClick={reset} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PelvicExercises() {
  const [, setLocation] = useLocation();
  const [activePhase, setActivePhase] = useState(1);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("suelo-firme-pelvic-progress");
    if (saved) {
      try {
        setCompletedExercises(JSON.parse(saved));
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  const markComplete = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const next = { ...prev, [exerciseId]: true };
      localStorage.setItem("suelo-firme-pelvic-progress", JSON.stringify(next));
      return next;
    });
    toast.success("✓ Ejercicio completado");
  };

  const phase = PHASES.find((p) => p.id === activePhase)!;
  const totalExercises = PHASES.reduce((acc, p) => acc + p.exercises.length, 0);
  const totalCompleted = Object.values(completedExercises).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tu programa de 3 fases
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Activación → Resistencia progresiva → Integración al movimiento. Avanzá a tu ritmo:
              lo importante es la calidad de cada contracción, no apurar las fases.
            </p>
          </div>

          {/* Overall progress */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Progreso general</span>
              <span className="text-sm text-muted-foreground">
                {totalCompleted}/{totalExercises} ejercicios
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
                style={{ width: `${(totalCompleted / totalExercises) * 100}%` }}
              />
            </div>
          </Card>

          {/* Phase tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {PHASES.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border text-left transition-colors ${
                  activePhase === p.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <p className={`text-xs font-semibold mb-0.5 ${activePhase === p.id ? "text-primary" : "text-muted-foreground"}`}>
                  Fase {p.id} · {p.weeks}
                </p>
                <p className="font-bold text-foreground text-sm">{p.name}</p>
              </button>
            ))}
          </div>

          {/* Phase intro */}
          <Card className="p-5 mb-6 border-l-4 border-l-secondary bg-secondary/5">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{phase.intro}</p>
            </div>
          </Card>

          {/* Exercises of the active phase */}
          <div className="space-y-4 mb-8">
            {phase.exercises.map((exercise) => {
              const isDone = !!completedExercises[exercise.id];
              const isOpen = expandedExercise === exercise.id;
              return (
                <Card key={exercise.id} className={`p-6 border-l-4 ${isDone ? "border-l-primary bg-primary/5" : "border-l-border"}`}>
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedExercise(isOpen ? null : exercise.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          {isDone && <CheckCircle2 className="w-5 h-5 text-primary" />}
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{exercise.position}</p>
                        {exercise.guided && (
                          <p className="text-xs text-secondary font-semibold mt-1">
                            {exercise.contractSeconds}s contracción · {exercise.restSeconds}s descanso · {exercise.reps} reps × {exercise.sets} series
                          </p>
                        )}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        <strong className="text-foreground">Cómo saber si lo hacés bien: </strong>
                        {exercise.cue}
                      </p>

                      {exercise.guided ? (
                        <GuidedTimer exercise={exercise} onComplete={() => markComplete(exercise.id)} />
                      ) : (
                        !isDone && (
                          <Button
                            onClick={() => markComplete(exercise.id)}
                            className="btn-primary mt-3 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Marcar como hecho
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
          <Card className="p-6 bg-accent/5 border-accent">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Antes de avanzar de fase:</strong> pasá a la
              siguiente solo cuando puedas completar la fase actual sin fatiga ni dolor. Si sentís
              dolor agudo (no fatiga muscular normal) en cualquier ejercicio, detenete y
              consultá con un profesional de salud pélvica.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
