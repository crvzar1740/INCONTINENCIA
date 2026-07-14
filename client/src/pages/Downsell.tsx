import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, CheckCircle2, Shield, Zap } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Downsell() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.hasPremium === 1) {
      setLocation("/");
    }
  }, [user]);

  const resources = [
    "Guía de Ejercicios Avanzados para el Suelo Pélvico",
    "Checklist de Productos para Control de Incontinencia",
    "Plan de Acción Personalizado",
    "Sesión de Preguntas y Respuestas con Expertos",
    "Grupo de Apoyo Exclusivo",
    "Manejo Emocional de la Incontinencia",
  ];

  const comparisons = [
    { item: "Una taza de café", price: "$5", times: "20 veces" },
    { item: "Una pizza", price: "$15", times: "6 veces" },
    { item: "Un par de zapatos", price: "$80", times: "1 vez" },
    { item: "Acceso de por vida a tu transformación", price: "$48.50", times: "AHORA" },
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
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Empathetic Headline */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-secondary/10 to-accent/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              ¿El dinero fue un problema? Te entiendo perfectamente.
            </h1>
            <p className="text-xl text-muted-foreground">
              Por eso creé esta oferta especial solo para ti.
            </p>
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-accent/20 to-primary/10 border-2 border-accent">
              <div className="text-center mb-8">
                <div className="inline-block bg-destructive text-white px-4 py-2 rounded-full font-bold mb-4">
                  OFERTA ESPECIAL: 50% DESCUENTO
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Mismo Pack Premium
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Todos los 6 recursos incluidos, acceso de por vida, sin suscripciones
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 mb-8">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-2">Precio original</p>
                  <p className="text-2xl text-muted-foreground line-through mb-4">$97</p>
                  
                  <div className="border-t-2 border-b-2 border-accent py-6">
                    <p className="text-muted-foreground text-sm mb-2">Hoy solo paga</p>
                    <div className="text-6xl font-bold text-primary mb-2">$48.50</div>
                    <p className="text-secondary font-semibold">Pago único, sin suscripciones</p>
                  </div>

                  <p className="text-sm text-muted-foreground mt-6">
                    Ahorras <span className="font-bold text-accent">$48.50</span> (50% de descuento)
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="btn-secondary w-full text-lg mb-4"
                onClick={() => {
                  window.location.href = "https://pay.hotmart.com/I106724680Y?offDiscount=DOWNSELL50";
                }}
              >
                Acceder Ahora a Mitad de Precio
              </Button>

              <button
                onClick={() => setLocation("/thank-you")}
                className="block w-full text-center text-sm underline mb-2"
                style={{ color: "#6B6259" }}
              >
                No, gracias — prefiero seguir sin el programa completo
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Esta oferta solo está disponible en esta página
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Comparison */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container">
          <h2 className="section-title text-center mb-12">Comparación de Inversión</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {comparisons.map((comp, idx) => (
                <Card key={idx} className={`p-6 flex justify-between items-center ${idx === comparisons.length - 1 ? "border-2 border-primary bg-primary/5" : "border border-border"}`}>
                  <div>
                    <p className="font-semibold text-foreground">{comp.item}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{comp.price}</p>
                    <p className="text-xs text-muted-foreground">{comp.times}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="mt-8 p-6 bg-gradient-to-r from-accent/20 to-primary/10 border-accent">
              <p className="text-center text-foreground leading-relaxed">
                <strong>Piénsalo así:</strong> Inviertes menos de lo que gastas en café en un mes, pero obtienes acceso de por vida a tu transformación completa.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="section-title text-center mb-12">Los 6 Recursos Incluidos</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3">
              {resources.map((resource, idx) => (
                <Card key={idx} className="p-4 bg-accent/5 border-l-4 border-l-primary flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground font-medium">{resource}</p>
                </Card>
              ))}
            </div>
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

      {/* Urgency Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <Card className="p-8 md:p-12 bg-gradient-to-r from-secondary/10 to-accent/10 border-2 border-secondary">
            <div className="flex gap-4 mb-6">
              <Zap className="w-8 h-8 text-secondary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Oferta Limitada</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Esta oferta especial al 50% de descuento <strong>solo está disponible en esta página</strong>. Si vuelves al home o a la página de upsell, volverá al precio regular de $97.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              No Dejes Pasar Esta Oportunidad
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Por menos de lo que gastas en café, accede a tu transformación completa.
            </p>
            <Button
              size="lg"
              className="btn-secondary text-lg mb-4"
              onClick={() => {
                window.location.href = "https://pay.hotmart.com/I106724680Y?offDiscount=DOWNSELL50";
              }}
            >
              Acceder Ahora a $48.50
            </Button>
            <p className="text-micro-cta">Porque merezco cuidarme sin gastar una fortuna</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Suelo Firme</h3>
              <p className="text-sm opacity-80">Recupera tu confianza y el control de tu cuerpo.</p>
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
            <p>&copy; 2026 Suelo Firme. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
