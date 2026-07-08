import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Download } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface ActionPlanData {
  title: string;
  duration: string;
  exercises: string;
  products: string;
  goals: string;
}

export default function ActionPlan() {
  const [, setLocation] = useLocation();
  const [planData, setPlanData] = useState<ActionPlanData>({
    title: "",
    duration: "3 meses",
    exercises: "",
    products: "",
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
              Plan de Acción Personalizado
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Crea tu hoja de ruta personalizada para gestionar la incontinencia. Define tus ejercicios, productos y metas específicas en un plan estructurado.
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
                  <option value="1 mes">1 mes</option>
                  <option value="3 meses">3 meses</option>
                  <option value="6 meses">6 meses</option>
                  <option value="1 año">1 año</option>
                </select>
              </div>

              {/* Exercises */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Ejercicios a Realizar *
                </label>
                <Textarea
                  placeholder="Describe los ejercicios que harás diariamente. Ej: Kegel rápido 3 series de 10, Kegel lento 3 series de 5, etc."
                  value={planData.exercises}
                  onChange={(e) => handleInputChange("exercises", e.target.value)}
                  className="min-h-32"
                />
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Productos a Usar
                </label>
                <Textarea
                  placeholder="Lista los productos que usarás. Ej: Protectores diarios para el día, pants absorbentes para ejercicio, etc."
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
                  placeholder="¿Qué quieres lograr? Ej: Volver al gimnasio sin miedo, poder correr sin escapes, mejorar mi confianza, etc."
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
