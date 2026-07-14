import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Heart, Shield, Zap, Users, BookOpen, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { tools } from "@/lib/tools";

export default function Home() {
  const [, setLocation] = useLocation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { user } = useAuth();

  const pains = [
    "La sensación constante de que se va a tener un accidente durante el ejercicio.",
    "La falta de confianza al salir y participar en actividades sociales.",
    "La angustia de tener que buscar baños con frecuencia.",
    "La incomodidad y el dolor que se siente al intentar contener la orina.",
    "La preocupación y ansiedad que genera la propensidad a mancharse.",
    "La presión social sobre cómo se supone que hay que 'aguantar' este tipo de cosas en silencio.",
  ];

  const failedSolutions = [
    "Usar productos desechables que no ofrecen la protección adecuada — han resultado insuficientes durante la actividad física.",
    "Beber menos agua para controlar las ganas de orinar — lleva a la deshidratación y otros problemas de salud.",
    "Intentar ejercicios sin una guía adecuada — resulta frustrante y causa incomodidad.",
    "Ignorar el problema por miedo a ser juzgada — ha llevado a una disminución en la calidad de vida.",
    "Habituales visitas al médico que no resultan en soluciones prácticas — dejan a la usuaria desanimada y sin respuestas.",
  ];

  const features = [
    {
      title: "Ejercicios de Suelo Pélvico",
      description: "Proporciona una guía simple y efectiva para fortalecer los músculos del piso pélvico, con ejercicios que se pueden hacer en cualquier lugar.",
      icon: Zap,
    },
    {
      title: "Recomendaciones de Productos",
      description: "Incluye una lista de los mejores productos de incontinencia y recomendaciones de uso.",
      icon: Shield,
    },
    {
      title: "Acceso a la Comunidad de Apoyo",
      description: "Conecta a las usuarias para compartir experiencias y soluciones, fomentando un espacio seguro para intercambio de consejos.",
      icon: Users,
    },
    {
      title: "Plan de Acción",
      description: "Un sistema estructurado que lleva a la usuaria desde el reconocimiento del problema hasta la implementación de soluciones efectivas.",
      icon: BookOpen,
    },
  ];

  const testimonials = [
    {
      name: "María, 38 años",
      text: "Volví a correr mis 5km sin frenar cada dos cuadras a buscar un baño. Me tomó 7 semanas haciendo los ejercicios todas las mañanas mientras tomaba mate.",
    },
    {
      name: "Laura, 45 años",
      text: "Pensé que después de dos partos esto ya era mi nueva normalidad. A las 4 semanas me di cuenta de que ya no llevaba protector al gimnasio.",
    },
    {
      name: "Sofía, 32 años",
      text: "Lo que más me ayudó no fueron solo los ejercicios — fue entender que no estaba rota. Le pasa a un montón de mujeres y nadie habla de esto.",
    },
    {
      name: "Catalina, 50 años",
      text: "Volví a jugar con mis nietos en el patio, saltar la soga con ellos, sin el miedo de siempre. Eso no tiene precio.",
    },
  ];

  const faqs = [
    {
      question: "¿Cuánto tiempo tardaré en ver resultados?",
      answer: "Muchas personas comienzan a notar cambios en 2-3 semanas con la práctica consistente de los ejercicios. Los resultados más significativos generalmente se ven después de 6-8 semanas.",
    },
    {
      question: "¿Necesito equipo especial para los ejercicios?",
      answer: "No. Los ejercicios de suelo pélvico se pueden hacer en cualquier lugar, sin equipo especial. Algunos ejercicios opcionales pueden usar pelotas de estabilidad, pero no son necesarios.",
    },
    {
      question: "¿Puedo hacer esto si tengo una cesárea?",
      answer: "Sí, pero es importante esperar la aprobación de tu médico (generalmente 6-8 semanas después de la cesárea). Luego puedes comenzar con ejercicios suaves y progresar gradualmente.",
    },
    {
      question: "¿Qué pasa si tengo una recaída y una pérdida?",
      answer: "Las recaídas son parte normal del proceso de aprendizaje. No significa que hayas fallado. Simplemente vuelve a los ejercicios y ajusta tu plan. A muchas personas les pasa esto y luego progresan aún más.",
    },
    {
      question: "¿Hay garantía si no funciona para mí?",
      answer: "Sí, ofrecemos una garantía de 7 días sin preguntas. Si no estás satisfecha, te devolvemos tu dinero completamente.",
    },
    {
      question: "¿Cuánto acceso tengo después de comprar?",
      answer: "Tienes acceso de por vida a todo el contenido. No hay suscripciones recurrentes. Compras una vez y accedes siempre.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="text-sm text-muted-foreground">Tu piso pélvico, a tu ritmo</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background to-accent/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-secondary font-semibold mb-4 text-lg">Para quienes quieren recuperar el control</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Volvé a correr, saltar y reír con el control que creías perdido
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Un método en 3 fases —no una lista de consejos sueltos— para que recuperes el control de tu piso pélvico y vuelvas a moverte sin calcular dónde está el baño más cercano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="btn-primary text-lg"
                onClick={() => {
                  if (user?.hasBaseAccess === 1 || user?.hasPremium === 1) {
                    setLocation("/tools/pelvic-exercises");
                  } else {
                    window.location.href = "https://pay.hotmart.com/F106710907A";
                  }
                }}
              >
                Quiero Empezar Hoy
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg border-secondary text-secondary hover:bg-secondary/10"
                onClick={() => document.getElementById("testimonios")?.scrollIntoView({ behavior: "smooth" })}
              >
                Ver Testimonios
              </Button>
            </div>
            <p className="text-micro-cta">Porque quiero volver al gimnasio sin miedo a las pérdidas</p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="section-title text-center mb-12">El Problema: 6 Dolores que Vives Cada Día</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pains.map((pain, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <p className="text-foreground leading-relaxed">{pain}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Failed Solutions Section */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container">
          <h2 className="section-title text-center mb-12">Soluciones que Ya Intentaste (y No Funcionaron)</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {failedSolutions.map((solution, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-destructive bg-white">
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-destructive flex-shrink-0">✕</div>
                  <p className="text-foreground leading-relaxed">{solution}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="section-title text-center mb-4">Un método, no una lista de consejos</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            La mayoría de los consejos sobre incontinencia se quedan en "hacé Kegel". El problema es que nadie te explica un orden — y sin orden es fácil abandonar a la semana 2.
          </p>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mt-4">
            <Card className="p-6 border-t-4 border-t-primary">
              <p className="text-sm font-semibold text-primary mb-2">Fase 1</p>
              <h3 className="text-lg font-bold text-foreground mb-2">Activación</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Reconectar con músculos que dejaste de sentir hace años. Sin esto, cualquier ejercicio se hace a ciegas.</p>
            </Card>
            <Card className="p-6 border-t-4 border-t-secondary">
              <p className="text-sm font-semibold text-secondary mb-2">Fase 2</p>
              <h3 className="text-lg font-bold text-foreground mb-2">Resistencia progresiva</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Fuerza real, no solo repetición. Cada semana un poco más de exigencia, sin forzar.</p>
            </Card>
            <Card className="p-6 border-t-4 border-t-accent">
              <p className="text-sm font-semibold text-accent-foreground mb-2">Fase 3</p>
              <h3 className="text-lg font-bold text-foreground mb-2">Integración al movimiento</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Llevar ese control a correr, saltar o levantar a tu hijo — no solo a estar acostada haciendo ejercicios.</p>
            </Card>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container">
          <h2 className="section-title text-center mb-12">Cómo Funciona</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-8 hover:shadow-lg transition-shadow">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stack of Tools Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="section-title text-center mb-4">Stack de Herramientas Incluidas</h2>
          <p className="section-subtitle text-center">10 recursos diseñados para tu transformación</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <Card
                key={idx}
                onClick={() => {
                  const hasAccess = tool.isPremium
                    ? user?.hasPremium === 1
                    : user?.hasBaseAccess === 1 || user?.hasPremium === 1;
                  if (hasAccess) {
                    setLocation(tool.path);
                  } else {
                    window.location.href = tool.isPremium
                      ? "https://pay.hotmart.com/I106724680Y"
                      : "https://pay.hotmart.com/F106710907A";
                  }
                }}
                className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${tool.isPremium ? "border-2 border-accent bg-accent/5" : "border border-border"}`}
              >
                {tool.image && (
                  <div className="w-full aspect-square overflow-hidden">
                    <img src={tool.image} alt={tool.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-foreground text-lg flex-1">{tool.title}</h3>
                    {tool.isPremium && <span className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold">Premium</span>}
                  </div>
                  <p className="text-sm text-secondary font-semibold mb-2">{tool.format}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-16 md:py-24 bg-accent/5">
        <div className="container">
          <h2 className="section-title text-center mb-12">Lo Que Dicen Quienes Ya Recuperaron el Control</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-8 bg-white">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-accent text-lg">★</span>
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-4 italic">"{testimonial.text}"</p>
                <p className="font-bold text-secondary">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="section-title text-center mb-12">Preguntas Frecuentes</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className="border border-border cursor-pointer hover:border-primary transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className="font-bold text-foreground text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-primary transition-transform ${
                      expandedFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {expandedFaq === idx && (
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border pt-4">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
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

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Tu primer día sin miedo empieza ahora
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No hace falta esperar al lunes que viene. La fase de activación empieza con 10 minutos.
            </p>
            <Button
              size="lg"
              className="btn-secondary text-lg mb-4"
              onClick={() => {
                if (user?.hasBaseAccess === 1 || user?.hasPremium === 1) {
                  setLocation("/tools/pelvic-exercises");
                } else {
                  window.location.href = "https://pay.hotmart.com/F106710907A";
                }
              }}
            >
              Acceder Ahora
            </Button>
            <p className="text-micro-cta">Porque merezco disfrutar de mi vida sin limitaciones</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Suelo Firme</h3>
              <p className="text-sm opacity-80">Ejercicios reales para tu piso pélvico, sin vergüenza.</p>
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
