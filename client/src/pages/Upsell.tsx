import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Upsell() {
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + Math.random() * 30 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const premiumResources = [
    {
      title: "Guía de Ejercicios Avanzados para el Suelo Pélvico",
      format: "Workbook",
      description: "Un workbook práctico con ejercicios avanzados para fortalecer el piso pélvico y mejorar el control de la vejiga.",
    },
    {
      title: "Checklist de Productos para Control de Incontinencia",
      format: "Checklist rellenable",
      description: "Un recurso para seleccionar y etiquetar los mejores productos de incontinencia, ayudando en la decisión de compra.",
    },
    {
      title: "Plan de Acción Personalizado",
      format: "Hoja de ruta",
      description: "Una herramienta para crear un plan personalizado de ejercicios y uso de productos que se adapte a las necesidades individuales.",
    },
    {
      title: "Sesión de Preguntas y Respuestas con Expertos",
      format: "Sesión en vivo",
      description: "Oportunidad para que las usuarias hagan preguntas a expertos en salud del piso pélvico.",
    },
    {
      title: "Grupo de Apoyo Exclusivo",
      format: "Comunidad en línea",
      description: "Acceso a un grupo donde las usuarias pueden compartir experiencias y consejos de forma privada.",
    },
    {
      title: "Manejo Emocional de la Incontinencia",
      format: "Guía paso a paso",
      description: "Un recurso que aborda el aspecto emocional y psicológico de vivir con incontinencia y cómo manejarlo.",
    },
  ];

  const whyYouNeedThis = [
    "Acelera tu transformación con un plan estructurado y experto",
    "Acceso a una comunidad de apoyo que entiende exactamente lo que vives",
    "Sesiones en vivo con expertos para resolver tus dudas específicas",
    "Recursos personalizables que se adaptan a tu situación única",
    "Manejo del aspecto emocional, no solo físico",
    "Garantía de 7 días: si no estás satisfecha, devolvemos tu dinero",
  ];

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
          <div className="text-2xl font-bold text-primary">INCONTINENCIA</div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Loading Bar */}
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-foreground">Cargando tu oferta especial...</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Warning Section */}
      <section className="py-12 bg-gradient-to-r from-secondary/10 to-accent/10">
        <div className="container">
          <Card className="p-6 md:p-8 bg-white border-l-4 border-l-secondary">
            <div className="flex gap-4">
              <AlertCircle className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Espera, Hay Algo Importante</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Si ignoras el aspecto emocional de la incontinencia, corres el riesgo de:
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">❌</span>
                    <span>Aumento de la ansiedad al realizar actividades físicas</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">❌</span>
                    <span>Empeoramiento de la salud física por reducción de actividad</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">❌</span>
                    <span>Deterioro de la autoestima y autoconfianza</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">❌</span>
                    <span>Posible desarrollo de problemas de salud adicionales relacionados con la incontinencia</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Premium Resources Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="section-title text-center mb-12">6 Recursos Premium Incluidos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {premiumResources.map((resource, idx) => (
              <Card key={idx} className="p-6 border-2 border-accent bg-gradient-to-br from-white to-accent/5 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{resource.format}</p>
                  <h3 className="text-lg font-bold text-foreground">{resource.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{resource.description}</p>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm font-semibold">
                  [Mockup del recurso]
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why You Need This */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container">
          <h2 className="section-title text-center mb-12">Por Qué Necesitas Esto</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {whyYouNeedThis.map((reason, idx) => (
                <Card key={idx} className="p-4 bg-white border-l-4 border-l-primary flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground leading-relaxed">{reason}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Inversión Total</h2>
              
              <div className="bg-white rounded-lg p-8 mb-8">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground text-sm mb-2">Acceso de por vida a:</p>
                  <ul className="text-sm text-foreground space-y-1 mb-6">
                    <li>✓ 4 herramientas principales</li>
                    <li>✓ 6 recursos premium</li>
                    <li>✓ Comunidad exclusiva</li>
                    <li>✓ Sesiones con expertos</li>
                  </ul>
                </div>
                <div className="text-5xl font-bold text-primary text-center mb-4">$97</div>
                <p className="text-center text-muted-foreground text-sm">Pago único, sin suscripciones</p>
              </div>

              <Button
                size="lg"
                className="btn-secondary w-full text-lg mb-4"
                onClick={() => setLocation("/thank-you")}
              >
                Acceder al Programa Completo
              </Button>

              <p className="text-center text-sm text-secondary font-semibold mb-6">
                O si prefieres una opción más accesible →
              </p>

              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg border-accent text-accent hover:bg-accent/10"
                onClick={() => setLocation("/downsell")}
              >
                Ver Oferta Especial (50% Descuento)
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container">
          <Card className="p-8 md:p-12 bg-white border-2 border-primary text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Garantía de 7 Días</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Si en los primeros 7 días no estás completamente satisfecha con el programa, te devolvemos tu dinero sin preguntas. No hay riesgo.
            </p>
            <p className="text-secondary font-semibold">Tu satisfacción es nuestra prioridad.</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">INCONTINENCIA</h3>
              <p className="text-sm opacity-80">Recupera tu confianza después del parto.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Enlaces</h3>
              <ul className="text-sm space-y-2 opacity-80">
                <li><a href="#" className="hover:opacity-100">Privacidad</a></li>
                <li><a href="#" className="hover:opacity-100">Términos</a></li>
                <li><a href="#" className="hover:opacity-100">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Soporte</h3>
              <p className="text-sm opacity-80">¿Preguntas? Estamos aquí para ayudarte.</p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 INCONTINENCIA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
