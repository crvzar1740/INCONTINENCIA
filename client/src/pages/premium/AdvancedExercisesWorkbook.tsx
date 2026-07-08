import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, BookOpen } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface WeekExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration: string;
  completed: boolean;
  notes: string;
}

interface Week {
  week: number;
  title: string;
  focus: string;
  exercises: WeekExercise[];
}

export default function AdvancedExercisesWorkbook() {
  const [, setLocation] = useLocation();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [saving, setSaving] = useState(false);

  const [weeks, setWeeks] = useState<Week[]>([
    {
      week: 1,
      title: "Fundamentos - Semana 1",
      focus: "Aprender la técnica correcta",
      exercises: [
        { id: "1-1", name: "Contracciones rápidas (Kegel rápido)", sets: 3, reps: 10, duration: "5 min", completed: false, notes: "" },
        { id: "1-2", name: "Contracciones lentas (Kegel lento)", sets: 3, reps: 5, duration: "5 min", completed: false, notes: "" },
        { id: "1-3", name: "Contracciones sostenidas", sets: 3, reps: 3, duration: "5 min", completed: false, notes: "" },
      ],
    },
    {
      week: 2,
      title: "Progresión - Semana 2",
      focus: "Aumentar intensidad",
      exercises: [
        { id: "2-1", name: "Contracciones rápidas intensas", sets: 4, reps: 15, duration: "6 min", completed: false, notes: "" },
        { id: "2-2", name: "Contracciones lentas prolongadas", sets: 3, reps: 8, duration: "6 min", completed: false, notes: "" },
        { id: "2-3", name: "Ejercicio de escalera", sets: 2, reps: 5, duration: "5 min", completed: false, notes: "" },
      ],
    },
    {
      week: 3,
      title: "Consolidación - Semana 3",
      focus: "Estabilizar ganancias",
      exercises: [
        { id: "3-1", name: "Rutina combinada", sets: 4, reps: 20, duration: "8 min", completed: false, notes: "" },
        { id: "3-2", name: "Relajación profunda", sets: 3, reps: 5, duration: "7 min", completed: false, notes: "" },
        { id: "3-3", name: "Ejercicios en posición de pie", sets: 2, reps: 10, duration: "5 min", completed: false, notes: "" },
      ],
    },
  ]);

  const toggleExercise = (weekIdx: number, exerciseIdx: number) => {
    const newWeeks = [...weeks];
    newWeeks[weekIdx].exercises[exerciseIdx].completed = !newWeeks[weekIdx].exercises[exerciseIdx].completed;
    setWeeks(newWeeks);
  };

  const updateNotes = (weekIdx: number, exerciseIdx: number, notes: string) => {
    const newWeeks = [...weeks];
    newWeeks[weekIdx].exercises[exerciseIdx].notes = notes;
    setWeeks(newWeeks);
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("✓ Tu progreso ha sido guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el progreso");
    } finally {
      setSaving(false);
    }
  };

  const activeWeek = weeks.find(w => w.week === currentWeek);
  const completedExercises = activeWeek?.exercises.filter(e => e.completed).length || 0;
  const totalExercises = activeWeek?.exercises.length || 0;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const totalCompletedAll = weeks.reduce((acc, w) => acc + w.exercises.filter(e => e.completed).length, 0);
  const totalExercisesAll = weeks.reduce((acc, w) => acc + w.exercises.length, 0);
  const overallProgress = (totalCompletedAll / totalExercisesAll) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation("/pack-premium")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="text-2xl font-bold text-primary">INCONTINENCIA</div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Workbook de Ejercicios Avanzados
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Guía progresiva de 12 semanas con ejercicios especializados para fortalecer el suelo pélvico. Cada semana aumenta la intensidad y complejidad de los ejercicios.
            </p>
          </div>

          {/* Overall Progress */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Tu Progreso General</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-foreground">Ejercicios Completados</span>
                  <span className="text-2xl font-bold text-primary">{totalCompletedAll}/{totalExercisesAll}</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.round(overallProgress)}% completado de todo el programa
              </p>
            </div>
          </Card>

          {/* Week Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Selecciona Tu Semana</h2>
            <div className="grid grid-cols-3 gap-4">
              {weeks.map((week) => (
                <button
                  key={week.week}
                  onClick={() => setCurrentWeek(week.week)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    currentWeek === week.week
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-bold text-foreground mb-1">Semana {week.week}</div>
                  <div className="text-xs text-muted-foreground">{week.focus}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Week Content */}
          {activeWeek && (
            <Card className="p-8 mb-8 border-2 border-primary/20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">{activeWeek.title}</h2>
                <p className="text-muted-foreground">{activeWeek.focus}</p>
              </div>

              {/* Week Progress */}
              <div className="mb-8 p-4 bg-primary/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-foreground">Progreso de Esta Semana</span>
                  <span className="text-lg font-bold text-primary">{completedExercises}/{totalExercises}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Exercises List */}
              <div className="space-y-4">
                {activeWeek.exercises.map((exercise, idx) => (
                  <Card key={exercise.id} className={`p-6 border-l-4 ${exercise.completed ? "border-l-primary bg-primary/5" : "border-l-muted"}`}>
                    <div className="flex gap-4 mb-4">
                      <Checkbox
                        checked={exercise.completed}
                        onCheckedChange={() => toggleExercise(weeks.indexOf(activeWeek), idx)}
                        className="w-6 h-6 mt-1"
                      />
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold flex items-center gap-2 ${exercise.completed ? "text-primary" : "text-foreground"}`}>
                          {exercise.completed && <CheckCircle2 className="w-5 h-5" />}
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {exercise.sets} series × {exercise.reps} repeticiones • {exercise.duration}
                        </p>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Agrega notas sobre cómo te sentiste, dificultad, observaciones, etc."
                      value={exercise.notes}
                      onChange={(e) => updateNotes(weeks.indexOf(activeWeek), idx, e.target.value)}
                      className="text-sm"
                    />
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* Save Button */}
          <Button
            onClick={saveProgress}
            disabled={saving}
            className="btn-primary w-full text-lg mb-8"
          >
            {saving ? "Guardando..." : "Guardar Mi Progreso"}
          </Button>

          {/* Tips Section */}
          <Card className="p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">💡 Consejos para Mejores Resultados</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Realiza los ejercicios 3-4 veces al día para mejores resultados</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>La consistencia es más importante que la intensidad</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Verás mejoras después de 2-3 semanas de práctica regular</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Si sientes dolor, detente y consulta con un profesional</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
