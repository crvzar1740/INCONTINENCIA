import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Exercise {
  id: number;
  name: string;
  completed: boolean;
  notes: string;
}

export default function PelvicExercises() {
  const [, setLocation] = useLocation();
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: "Contracciones rápidas (Kegel rápido)", completed: false, notes: "" },
    { id: 2, name: "Contracciones lentas (Kegel lento)", completed: false, notes: "" },
    { id: 3, name: "Contracciones sostenidas", completed: false, notes: "" },
    { id: 4, name: "Ejercicio de escalera", completed: false, notes: "" },
    { id: 5, name: "Relajación profunda", completed: false, notes: "" },
  ]);
  const [newExercise, setNewExercise] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleExercise = (id: number) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const updateNotes = (id: number, notes: string) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, notes } : ex
    ));
  };

  const addExercise = () => {
    if (newExercise.trim()) {
      setExercises([...exercises, {
        id: Date.now(),
        name: newExercise,
        completed: false,
        notes: ""
      }]);
      setNewExercise("");
    }
  };

  const deleteExercise = (id: number) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      // Simulate API call - in production this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("✓ Tu progreso ha sido guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el progreso");
    } finally {
      setSaving(false);
    }
  };

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progressPercentage = Math.round((completedCount / exercises.length) * 100);

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
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Guía de Ejercicios Avanzados para el Suelo Pélvico
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Un workbook práctico con ejercicios avanzados para fortalecer el piso pélvico y mejorar el control de la vejiga. Marca los ejercicios que completaste y toma notas de tu progreso.
            </p>
          </div>

          {/* Progress Section */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Tu Progreso</h2>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{completedCount}</div>
                <p className="text-sm text-muted-foreground">de {exercises.length} completados</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-3">{progressPercentage}% completado</p>
          </Card>

          {/* Exercises List */}
          <div className="space-y-4 mb-8">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <div className="flex gap-4 mb-4">
                  <Checkbox
                    checked={exercise.completed}
                    onCheckedChange={() => toggleExercise(exercise.id)}
                    className="w-6 h-6 mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${exercise.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {exercise.completed && <CheckCircle2 className="w-5 h-5 text-primary inline mr-2" />}
                      {exercise.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteExercise(exercise.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <Textarea
                  placeholder="Agrega notas sobre este ejercicio (cómo te sentiste, dificultad, etc.)"
                  value={exercise.notes}
                  onChange={(e) => updateNotes(exercise.id, e.target.value)}
                  className="text-sm"
                />
              </Card>
            ))}
          </div>

          {/* Add New Exercise */}
          <Card className="p-6 mb-8 border-dashed border-2 border-accent">
            <h3 className="text-lg font-bold text-foreground mb-4">Agregar Nuevo Ejercicio</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Nombre del ejercicio"
                value={newExercise}
                onChange={(e) => setNewExercise(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addExercise()}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={addExercise}
                className="btn-accent flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              onClick={saveProgress}
              disabled={saving}
              className="btn-primary flex-1 text-lg"
            >
              {saving ? "Guardando..." : "Guardar Mi Progreso"}
            </Button>
          </div>

          {/* Tips Section */}
          <Card className="mt-12 p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">💡 Consejos para Mejores Resultados</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Realiza estos ejercicios 3-4 veces al día para mejores resultados</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Cada sesión debe durar entre 5-10 minutos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>La consistencia es más importante que la intensidad</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Notarás mejoras después de 2-3 semanas de práctica regular</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
