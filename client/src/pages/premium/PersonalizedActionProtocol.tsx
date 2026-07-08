import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Target, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface ProtocolStep {
  id: string;
  week: number;
  step: string;
  description: string;
  completed: boolean;
}

export default function PersonalizedActionProtocol() {
  const [, setLocation] = useLocation();
  const [diagnosis, setDiagnosis] = useState("");
  const [protocolCreated, setProtocolCreated] = useState(false);
  const [saving, setSaving] = useState(false);

  const [steps, setSteps] = useState<ProtocolStep[]>([
    { id: "1", week: 1, step: "Evaluación inicial", description: "Completa el cuestionario de diagnóstico", completed: false },
    { id: "2", week: 1, step: "Selecciona ejercicios", description: "Elige los ejercicios según tu nivel", completed: false },
    { id: "3", week: 2, step: "Comienza rutina diaria", description: "Realiza 3-4 sesiones de ejercicios", completed: false },
    { id: "4", week: 2, step: "Compra productos", description: "Adquiere los productos recomendados", completed: false },
    { id: "5", week: 3, step: "Seguimiento semanal", description: "Registra tu progreso", completed: false },
    { id: "6", week: 4, step: "Evaluación de progreso", description: "Revisa mejoras y ajusta plan", completed: false },
  ]);

  const createProtocol = () => {
    if (!diagnosis.trim()) {
      toast.error("Por favor describe tu situación");
      return;
    }
    setProtocolCreated(true);
    toast.success("✓ Tu protocolo personalizado ha sido creado");
  };

  const toggleStep = (id: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("✓ Tu protocolo ha sido guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el protocolo");
    } finally {
      setSaving(false);
    }
  };

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const weeks = Array.from(new Set(steps.map(s => s.week)));

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
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Plan de Acción con Protocolo
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Diagnóstico personalizado + protocolo paso a paso. Tracking de adherencia semanal y ajustes automáticos según tu progreso.
            </p>
          </div>

          {!protocolCreated ? (
            <Card className="p-8 border-2 border-primary/20 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Crea Tu Protocolo Personalizado</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Describe tu situación actual *
                  </label>
                  <Textarea
                    placeholder="Cuéntanos: ¿Cuándo comenzó la incontinencia? ¿En qué situaciones es más frecuente? ¿Qué actividades te preocupan? ¿Has intentado algo antes?"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="min-h-40"
                  />
                </div>

                <Button
                  onClick={createProtocol}
                  className="btn-primary w-full text-lg"
                >
                  Crear Mi Protocolo
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* Progress Card */}
              <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <h2 className="text-2xl font-bold text-foreground mb-4">Tu Progreso</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-foreground">Pasos Completados</span>
                      <span className="text-2xl font-bold text-primary">{completedSteps}/{totalSteps}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progressPercentage)}% completado de tu protocolo
                  </p>
                </div>
              </Card>

              {/* Protocol Steps by Week */}
              <div className="space-y-8">
                {weeks.map((week: number) => (
                  <div key={week}>
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded" />
                      Semana {week}
                    </h3>
                    <div className="space-y-3">
                      {steps
                        .filter(s => s.week === week)
                        .map((step) => (
                          <Card key={step.id} className={`p-6 border-l-4 ${step.completed ? "border-l-primary bg-primary/5" : "border-l-muted"}`}>
                            <div className="flex gap-4">
                              <Checkbox
                                checked={step.completed}
                                onCheckedChange={() => toggleStep(step.id)}
                                className="w-6 h-6 mt-1"
                              />
                              <div className="flex-1">
                                <h4 className={`text-lg font-semibold flex items-center gap-2 ${step.completed ? "text-primary" : "text-foreground"}`}>
                                  {step.completed && <CheckCircle2 className="w-5 h-5" />}
                                  {step.step}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <Button
                onClick={saveProgress}
                disabled={saving}
                className="btn-primary w-full text-lg mt-8 mb-8"
              >
                {saving ? "Guardando..." : "Guardar Mi Protocolo"}
              </Button>

              {/* Tips Section */}
              <Card className="p-8 bg-accent/5 border-accent">
                <h3 className="text-xl font-bold text-foreground mb-4">💡 Consejos para Seguir Tu Protocolo</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Marca cada paso conforme lo completes para mantener la motivación</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>La consistencia es clave: sigue el protocolo sin saltarte pasos</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Si algo no funciona, ajusta según tus necesidades personales</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Revisa tu protocolo cada semana para evaluar tu progreso</span>
                  </li>
                </ul>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
