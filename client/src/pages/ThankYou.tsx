import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Mail, AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function ThankYou() {
  const [, setLocation] = useLocation();

  const nextSteps = [
    {
      number: "1",
      title: "Revisa tu Email",
      description: "Busca un email de confirmación con el asunto 'Bienvenida a Suelo Firme'. Si no lo ves en tu bandeja principal, revisa la carpeta de Spam o Promociones.",
      icon: Mail,
    },
    {
      number: "2",
      title: "Abre el Link de Acceso",
      description: "En el email encontrarás un link con tus credenciales de acceso. Haz clic para entrar a tu cuenta.",
      icon: CheckCircle2,
    },
    {
      number: "3",
      title: "Comienza Tu Transformación",
      description: "Una vez dentro, tendrás acceso a todos los recursos, ejercicios, la comunidad y las sesiones con expertos.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <Home className="w-5 h-5" />
            Volver al Home
          </button>
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-12">
              <div className="inline-block bg-primary/10 rounded-full p-6 mb-6">
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                ¡Gracias por tu compra!
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Acabas de tomar un paso importante hacia tu transformación. Estamos emocionados de acompañarte en este viaje.
              </p>
            </div>

            {/* Important Notice */}
            <Card className="p-6 md:p-8 bg-gradient-to-r from-secondary/10 to-accent/10 border-2 border-secondary mb-12">
              <div className="flex gap-4">
                <AlertCircle className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">⚠️ Importante: Revisa tu Spam</h2>
                  <p className="text-foreground leading-relaxed mb-3">
                    El email con tus credenciales de acceso puede llegar a tu carpeta de <strong>Spam</strong> o <strong>Promociones</strong>. 
                  </p>
                  <p className="text-foreground leading-relaxed">
                    <strong>Acciones recomendadas:</strong>
                  </p>
                  <ul className="mt-3 space-y-2 text-foreground">
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Busca en tu carpeta de Spam o Promociones</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Marca el email como "No es spam" para que lleguen futuros emails a tu bandeja principal</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Agrega nuestro email a tus contactos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* What to Expect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Qué Esperar Ahora</h2>
              <div className="space-y-6">
                {nextSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <Card key={idx} className="p-6 md:p-8 border-l-4 border-l-primary">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            Paso {step.number}: {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary text-center mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">¿No Recibiste el Email?</h2>
              <p className="text-muted-foreground mb-6">
                Si después de 10 minutos no recibes el email, revisa tu carpeta de spam. Si aún así no lo encuentras, contáctanos.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => window.location.href = "mailto:info@infosuelofirme.com?subject=No recibí el email de acceso"}
              >
                Contactar Soporte
              </Button>
            </Card>

            {/* What's Included Reminder */}
            <Card className="p-8 md:p-12 bg-white border-2 border-accent">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Acceso Completo Incluido</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Guía de Ejercicios Avanzados</p>
                    <p className="text-sm text-muted-foreground">Workbook completo</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Checklist de Productos</p>
                    <p className="text-sm text-muted-foreground">Rellenable y personalizable</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Plan de Acción Personalizado</p>
                    <p className="text-sm text-muted-foreground">Hoja de ruta adaptada a ti</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Sesiones con Expertos</p>
                    <p className="text-sm text-muted-foreground">Preguntas y respuestas en vivo</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Comunidad Exclusiva</p>
                    <p className="text-sm text-muted-foreground">Apoyo de otras personas que están pasando por lo mismo</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Manejo Emocional</p>
                    <p className="text-sm text-muted-foreground">Guía paso a paso</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-12">
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
