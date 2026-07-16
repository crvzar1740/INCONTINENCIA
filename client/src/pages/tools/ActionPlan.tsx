import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AccessGate } from "@/components/AccessGate";
import { ArrowLeft, CheckCircle2, Download } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

interface ActionPlanData {
  title: string;
  duration: string;
  exercises: string;
  products: string;
  goals: string;
}

const DEFAULT_EXERCISES = `Semanas 1-2 (Activación): Contracción lenta con respiración — 3 series de 8, acostada.
Semanas 3-5 (Resistencia progresiva): Contracción lenta progresiva (3x12) + contracciones rápidas (3x10), sentada.
Semana 6 en adelante (Integración): Contracción de pie (2x10) + técnica de anticipación antes de toser, reír o levantar peso.`;

const DEFAULT_PRODUCTS = `Protector diario para uso general.
Protector específico para ejercicio si volvés a entrenar.
Compresa nocturna de larga duración si notás pérdidas mientras dormís.`;

function ActionPlanContent() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [planData, setPlanData] = useState<ActionPlanData>({
    title: "",
    duration: "8 semanas",
    exercises: DEFAULT_EXERCISES,
    products: DEFAULT_PRODUCTS,
    goals: "",
  });
  const [savedPlan, setSavedPlan] = useState<ActionPlanData | null>(null);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: keyof ActionPlanData, value: string) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
  };

  const savePlan = async () => {
    if (!planData.title || !planData.exercises || !planData.goals) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSavedPlan(planData);
      toast.success("✓ Tu plan de acción ha sido guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el plan");
    } finally {
      setSaving(false);
    }
  };

  const downloadPlan = () => {
    if (!savedPlan) return;
    
    const content = `
PLAN DE ACCIÓN PERSONALIZADO - Suelo Firme
=============================================

Título: ${savedPlan.title}
Duración: ${savedPlan.duration}

EJERCICIOS A REALIZAR:
${savedPlan.exercises}

PRODUCTOS A USAR:
${savedPlan.products}

METAS PERSONALES:
${savedPlan.goals}

Creado: ${new Date().toLocaleDateString('es-ES')}
    `.trim();

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", "plan-accion-suelo-firme.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("✓ Plan descargado exitosamente");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation(user ? "/dashboard" : "/")}
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
              Tu plan de acción, ya armado
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Te dejamos un plan de base según el método de 3 fases — ajustalo a tu ritmo, tus productos y tus metas. No hace falta que arranques de cero.
            </p>
          </div>

          {/* Form Section */}
          <Card className="p-8 mb-8 border-2 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-6">Crear Mi Plan</h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Título del Plan *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Mi plan de 3 meses para volver al gimnasio"
                  value={planData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Duración del Plan
                </label>
                <select
                  value={planData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="6 semanas">6 semanas</option>
                  <option value="8 semanas">8 semanas</option>
                  <option value="3 meses">3 meses</option>
                  <option value="6 meses">6 meses</option>
                </select>
              </div>

              {/* Exercises */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Ejercicios a Realizar * <span className="font-normal text-muted-foreground">(ya sugeridos, editalos si querés)</span>
                </label>
                <Textarea
                  value={planData.exercises}
                  onChange={(e) => handleInputChange("exercises", e.target.value)}
                  className="min-h-32"
                />
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Productos a Usar <span className="font-normal text-muted-foreground">(ya sugeridos, editalos si querés)</span>
                </label>
                <Textarea
                  value={planData.products}
                  onChange={(e) => handleInputChange("products", e.target.value)}
                  className="min-h-32"
                />
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Metas Personales *
                </label>
                <Textarea
                  placeholder="¿Qué quieres lograr? Ej: Volver al gimnasio sin miedo, poder correr sin pérdidas, mejorar mi confianza, etc."
                  value={planData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  className="min-h-32"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={savePlan}
              disabled={saving}
              className="btn-primary w-full mt-8 text-lg"
            >
              {saving ? "Guardando..." : "Guardar Mi Plan"}
            </Button>
          </Card>

          {/* Saved Plan Display */}
          {savedPlan && (
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Tu Plan Guardado</h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Título</h3>
                  <p className="text-muted-foreground">{savedPlan.title}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Duración</h3>
                  <p className="text-muted-foreground">{savedPlan.duration}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ejercicios</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{savedPlan.exercises}</p>
                </div>

                {savedPlan.products && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Productos</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{savedPlan.products}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Metas</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{savedPlan.goals}</p>
                </div>
              </div>

              <Button
                onClick={downloadPlan}
                className="btn-accent w-full flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Descargar Mi Plan
              </Button>
            </Card>
          )}

          {/* Tips Section */}
          <Card className="mt-12 p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">💡 Consejos para Tu Plan</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Sé específica: cuanto más detallado sea tu plan, mejores resultados obtendrás</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Establece metas realistas y alcanzables en el tiempo que defines</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Revisa tu plan cada semana y ajusta según sea necesario</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Descarga tu plan y tenlo a mano como referencia diaria</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ActionPlan() {
  return (
    <AccessGate tier="base">
      <ActionPlanContent />
    </AccessGate>
  );
}
