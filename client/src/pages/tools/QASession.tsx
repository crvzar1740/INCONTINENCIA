import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, HelpCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "kegel-frecuencia",
    category: "Ejercicios",
    question: "¿Cuántas veces al día debo hacer los ejercicios?",
    answer:
      "Con el programa de este pack alcanza con una sesión diaria siguiendo la fase en la que estés (Activación, Resistencia progresiva o Integración). Hacer más series de las indicadas no acelera el progreso — el músculo necesita descanso entre sesiones para fortalecerse, igual que cualquier otro músculo.",
  },
  {
    id: "kegel-de-pie",
    category: "Ejercicios",
    question: "¿Puedo hacer los ejercicios de pie desde el principio?",
    answer:
      "No es lo ideal. La Fase 1 (Activación) está pensada acostada porque es más fácil identificar el músculo correcto sin la gravedad sumando presión. Una vez que domines la contracción acostada y sentada, la Fase 3 ya incluye la versión de pie.",
  },
  {
    id: "dolor-normal",
    category: "Ejercicios",
    question: "¿Es normal sentir incomodidad al hacer los ejercicios?",
    answer:
      "Una fatiga muscular leve es esperable, igual que con cualquier entrenamiento. Lo que no es normal es el dolor agudo o punzante. Si eso aparece, detené el ejercicio ese día y, si se repite, consultá con un profesional de salud pélvica antes de seguir.",
  },
  {
    id: "producto-ejercicio",
    category: "Productos",
    question: "¿Qué producto conviene usar mientras hago actividad física?",
    answer:
      "Depende de tu nivel de pérdida y del tipo de actividad — no hay una única respuesta correcta. La herramienta Checklist de Productos de este mismo pack te ayuda a identificar qué categoría te conviene según tu situación puntual.",
  },
  {
    id: "tiempo-resultados",
    category: "Progreso",
    question: "¿Cuánto tiempo tarda en notarse una mejora?",
    answer:
      "La mayoría empieza a notar cambios entre la semana 2 y 3 de práctica consistente. Los resultados más sólidos suelen consolidarse entre la semana 6 y 8. El factor que más influye no es la intensidad, sino la constancia diaria.",
  },
  {
    id: "recaida",
    category: "Progreso",
    question: "¿Qué pasa si tengo una recaída y una pérdida después de semanas de mejora?",
    answer:
      "Es parte normal del proceso, no una señal de que hiciste algo mal. Cambios hormonales, cansancio o un esfuerzo puntual más fuerte de lo habitual pueden generar un retroceso temporal. Volvé a la fase en la que te sentías firme y retomá desde ahí, sin necesidad de empezar de cero.",
  },
  {
    id: "cuando-consultar",
    category: "Salud",
    question: "¿Cuándo debería consultar a un profesional en lugar de seguir solo con el programa?",
    answer:
      "Si notás dolor pélvico o lumbar que no cede, sensación de peso o bulto en la vagina, o si las pérdidas aumentan en lugar de mejorar después de varias semanas de práctica constante, es momento de una evaluación profesional. Ninguna guía digital reemplaza una evaluación de piso pélvico en persona cuando aparecen esas señales.",
  },
  {
    id: "cesarea",
    category: "Salud",
    question: "¿Puedo empezar el programa si tuve una cesárea?",
    answer:
      "Sí, pero esperá la aprobación de tu médico antes de arrancar — generalmente entre 6 y 8 semanas después de la cesárea. Una vez que tengas el visto bueno, empezá por la Fase 1 igual que cualquier otra usuaria, sin saltar etapas.",
  },
];

const CATEGORIES = ["Todas", "Ejercicios", "Productos", "Progreso", "Salud"];

export default function QASession() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleFaqs =
    activeCategory === "Todas" ? FAQS : FAQS.filter((f) => f.category === activeCategory);

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
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Preguntas Frecuentes
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Respuestas claras a las dudas más comunes sobre ejercicios, productos, progreso y
              salud — basadas en el mismo criterio clínico que usamos en el resto del programa.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-muted-foreground hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="space-y-4 mb-10">
            {visibleFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <Card
                  key={faq.id}
                  className="border border-border cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                >
                  <div className="p-6 flex justify-between items-center gap-4">
                    <div>
                      <p className="text-xs text-secondary font-semibold mb-1">{faq.category}</p>
                      <h3 className="font-bold text-foreground text-lg">{faq.question}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* No fake live-expert promise — real contact instead */}
          <Card className="p-6 bg-accent/5 border-accent">
            <div className="flex gap-3">
              <HelpCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  ¿No encontraste tu pregunta acá?
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Este banco de respuestas se actualiza con las dudas más frecuentes, pero no
                  reemplaza una consulta puntual. Si tenés una pregunta específica sobre tu caso,
                  escribinos directamente.
                </p>
                <a
                  href="mailto:info@infosuelofirme.com?subject=Pregunta sobre Suelo Firme"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  info@infosuelofirme.com
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
