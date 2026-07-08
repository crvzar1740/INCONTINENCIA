import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, CheckCircle2, Calendar, MessageSquare, Video } from "lucide-react";
import { useLocation } from "wouter";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function ExpertSessions() {
  const [, setLocation] = useLocation();

  const [faqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "¿Cuánto tiempo tarda en mejorar la incontinencia?",
      category: "Progreso",
      answer: "La mayoría de las mujeres ven mejoras después de 2-3 semanas de práctica consistente. Los resultados óptimos generalmente se logran después de 3-6 meses. Cada cuerpo es diferente, así que sé paciente contigo misma.",
    },
    {
      id: "2",
      question: "¿Puedo hacer ejercicios de Kegel mientras estoy de pie?",
      category: "Ejercicios",
      answer: "Sí, absolutamente. Una vez que domines los ejercicios acostada, puedes practicarlos de pie, sentada o incluso mientras caminas. Esto te permite hacer los ejercicios en cualquier momento del día.",
    },
    {
      id: "3",
      question: "¿Es normal sentir incomodidad al hacer ejercicios?",
      category: "Salud",
      answer: "Es normal sentir una leve fatiga muscular, similar a cualquier otro ejercicio. Sin embargo, si sientes dolor agudo, detente y consulta con un profesional de salud. La incomodidad leve desaparece con la práctica.",
    },
    {
      id: "4",
      question: "¿Qué productos son mejores para el ejercicio?",
      category: "Productos",
      answer: "Para ejercicio, recomendamos usar protectores especiales para actividad física o pants absorbentes de cintura alta. Estos ofrecen mayor protección durante el movimiento y son discretos bajo la ropa deportiva.",
    },
    {
      id: "5",
      question: "¿Puedo dejar de usar productos si mejoro?",
      category: "Progreso",
      answer: "Sí, muchas mujeres pueden reducir o dejar de usar productos después de mejorar significativamente. Sin embargo, algunos prefieren seguir usándolos como medida de seguridad. La decisión es personal.",
    },
  ]);

  const categories = Array.from(new Set(faqs.map(f => f.category)));

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
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Sesiones Privadas con Expertos
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Consultá directamente con especialistas en piso pélvico sobre tu caso puntual: ejercicios, productos o el aspecto emocional. Podés preparar tus preguntas y revisar las respuestas de otras usuarias mientras definimos el mejor formato para las sesiones 1 a 1.
            </p>
          </div>

          {/* How Sessions Will Work */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Así van a funcionar tus sesiones con especialistas
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-l-4 border-l-primary">
                <MessageSquare className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Elegís el tema</h3>
                <p className="text-sm text-muted-foreground">Ejercicios, productos o manejo emocional — según lo que necesites en ese momento.</p>
              </Card>
              <Card className="p-6 border-l-4 border-l-primary">
                <Video className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Sesión 1 a 1</h3>
                <p className="text-sm text-muted-foreground">Consulta directa con un especialista, previa reserva de tu turno.</p>
              </Card>
              <Card className="p-6 border-l-4 border-l-primary">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Preparás tus preguntas</h3>
                <p className="text-sm text-muted-foreground">Llegás a la sesión con tus dudas puntuales para aprovechar mejor el tiempo.</p>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic">
              Estamos terminando de definir el formato exacto de agenda. Mientras tanto, revisá las preguntas frecuentes de abajo — es posible que tu duda ya esté resuelta ahí.
            </p>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              Preguntas Frecuentes de Expertos
            </h2>

            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded" />
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {faqs
                      .filter(f => f.category === category)
                      .map((faq) => (
                        <Card key={faq.id} className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                          <h4 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h4>
                          <div className="bg-background p-4 rounded-lg border border-border">
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <Card className="mt-12 p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">💡 Cómo Aprovechar al Máximo las Sesiones</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Prepara tus preguntas antes de cada sesión</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Toma notas de las recomendaciones de los expertos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Anotá tus dudas a medida que te surjan, así no se te olvidan para la sesión</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Revisa las preguntas frecuentes para resolver dudas rápidamente</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
