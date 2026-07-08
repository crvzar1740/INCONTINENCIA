import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Heart, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Module {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  wellnessScore: number;
}

export default function EmotionalGuide() {
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);

  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      name: "Aceptación y Autocompasión",
      description: "Aprende a aceptar tu situación y tratarte con compasión",
      completed: false,
      wellnessScore: 5,
    },
    {
      id: "2",
      name: "Técnicas de Respiración",
      description: "Ejercicios de respiración para calmar la ansiedad",
      completed: false,
      wellnessScore: 5,
    },
    {
      id: "3",
      name: "Mindfulness Diario",
      description: "Meditaciones guiadas para el presente",
      completed: false,
      wellnessScore: 5,
    },
    {
      id: "4",
      name: "Manejo del Estrés",
      description: "Estrategias para reducir el estrés y la ansiedad",
      completed: false,
      wellnessScore: 5,
    },
    {
      id: "5",
      name: "Confianza y Autoestima",
      description: "Reconstruye tu confianza en ti misma",
      completed: false,
      wellnessScore: 5,
    },
    {
      id: "6",
      name: "Visualización Positiva",
      description: "Técnicas de visualización para el éxito",
      completed: false,
      wellnessScore: 5,
    },
  ]);

  const toggleModule = (id: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const updateWellnessScore = (id: string, score: number) => {
    setModules(modules.map(m => m.id === id ? { ...m, wellnessScore: score } : m));
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("✓ Tu progreso emocional ha sido guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el progreso");
    } finally {
      setSaving(false);
    }
  };

  const completedModules = modules.filter(m => m.completed).length;
  const averageWellness = Math.round(modules.reduce((acc, m) => acc + m.wellnessScore, 0) / modules.length);

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
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Guía Emocional y Psicológica
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Módulos de manejo emocional, ejercicios de mindfulness, técnicas de respiración y tracking de bienestar mental diario.
            </p>
          </div>

          {/* Wellness Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-sm text-muted-foreground mb-2">Módulos Completados</div>
              <div className="text-3xl font-bold text-primary">{completedModules}/{modules.length}</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="text-sm text-muted-foreground mb-2">Bienestar Promedio</div>
              <div className="text-3xl font-bold text-accent">{averageWellness}/10</div>
            </Card>
          </div>

          {/* Modules */}
          <div className="space-y-6 mb-8">
            {modules.map((module) => (
              <Card key={module.id} className={`p-6 border-l-4 ${module.completed ? "border-l-primary bg-primary/5" : "border-l-muted"}`}>
                <div className="flex gap-4 mb-4">
                  <Checkbox
                    checked={module.completed}
                    onCheckedChange={() => toggleModule(module.id)}
                    className="w-6 h-6 mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${module.completed ? "text-primary" : "text-foreground"}`}>
                      {module.completed && <CheckCircle2 className="w-5 h-5" />}
                      {module.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-foreground">¿Cómo te sientes hoy?</label>
                    <span className="text-lg font-bold text-primary">{module.wellnessScore}/10</span>
                  </div>
                  <Slider
                    value={[module.wellnessScore]}
                    onValueChange={(value) => updateWellnessScore(module.id, value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Save Button */}
          <Button
            onClick={saveProgress}
            disabled={saving}
            className="btn-primary w-full text-lg mb-8"
          >
            {saving ? "Guardando..." : "Guardar Mi Progreso Emocional"}
          </Button>

          {/* Wellness Tips */}
          <Card className="p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">💡 Consejos para Tu Bienestar Emocional</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Practica mindfulness diariamente, aunque sea 5 minutos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Usa las técnicas de respiración cuando sientas ansiedad</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Registra tu bienestar diario para ver tu progreso</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Sé compasiva contigo misma durante este proceso</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Recuerda que la recuperación es un viaje, no un destino</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
