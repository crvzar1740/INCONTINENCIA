import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Video,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    id: "tiempo-mejora",
    category: "Progreso y expectativas",
    question: "¿Cuánto tiempo tarda en mejorar la incontinencia?",
    answer:
      "Con entrenamiento del piso pélvico bien hecho, muchas mujeres notan cambios entre las semanas 4 y 6, y la mejora sigue consolidándose hasta los 3-6 meses de práctica constante. Si tu problema es más de urgencia que de esfuerzo, el reentrenamiento vesical suele mostrar resultados dentro de las primeras 4 a 6 semanas. La consistencia importa más que la intensidad.",
  },
  {
    id: "de-pie",
    category: "Ejercicios",
    question: "¿Puedo hacer los ejercicios de pie o tienen que ser acostada?",
    answer:
      "Sí. Acostada es más fácil aislar el músculo al principio, pero el objetivo final es que la contracción funcione de pie, caminando y en movimiento — que es donde realmente la necesitás. Una vez que domines la técnica acostada, progresá a sentada, de pie y en movimiento.",
  },
  {
    id: "incomodidad",
    category: "Ejercicios",
    question: "¿Es normal sentir cansancio muscular al hacer los ejercicios?",
    answer:
      "Sí, una fatiga leve es esperable, igual que con cualquier otro entrenamiento muscular. Lo que no es normal es el dolor agudo o punzante. Si eso aparece, detené el ejercicio ese día y, si se repite, consultá con un kinesiólogo de piso pélvico antes de seguir.",
  },
  {
    id: "no-mejora",
    category: "Progreso y expectativas",
    question: "Llevo semanas haciendo los ejercicios y no noto cambios. ¿Qué hago?",
    answer:
      "Antes de pensar que \"no funciona\", vale revisar tres cosas: si estás contrayendo el músculo correcto (muchas mujeres activan glúteos o abdomen sin darse cuenta), si la frecuencia es suficiente (menos de 3 veces por semana suele no alcanzar), y si tu tipo de incontinencia es principalmente de urgencia — en ese caso el entrenamiento muscular solo no es la herramienta principal, conviene sumar reentrenamiento vesical. Si después de eso seguís sin cambios en 8-12 semanas, es razonable pedir una evaluación de piso pélvico con biofeedback para confirmar que el patrón de contracción es el correcto.",
  },
  {
    id: "senales-alarma",
    category: "Señales de alarma",
    question: "¿Cuándo la incontinencia deja de ser \"algo para trabajar en casa\" y necesita atención médica?",
    answer:
      "Buscá atención médica, no un programa de ejercicios, si aparece sangre en la orina, dolor al orinar, fiebre, dificultad para empezar u orinar, o si la incontinencia aparece de forma repentina y severa sin relación con el parto. Ninguna de estas señales se resuelve con entrenamiento de piso pélvico — necesitan evaluación clínica primero.",
  },
  {
    id: "peso-bulto",
    category: "Señales de alarma",
    question: "Siento peso o como un bulto en la vagina, ¿es lo mismo que la incontinencia?",
    answer:
      "No, y es importante diferenciarlo. Esa sensación puede indicar un descenso de órganos pélvicos (prolapso), que a veces coexiste con la incontinencia pero se evalúa y trata de forma distinta. Si notás esto, sumalo como dato específico en tu próxima consulta — cambia el enfoque del tratamiento.",
  },
  {
    id: "productos-ejercicio",
    category: "Productos",
    question: "¿Qué productos conviene usar mientras hago ejercicio?",
    answer:
      "Los protectores diseñados específicamente para actividad física están pensados para no marcarse ni perder forma bajo ropa ajustada, a diferencia de un protector estándar. En la Guía de Decisión de Productos de este pack encontrás el criterio completo para elegir cualquier marca disponible en tu país.",
  },
  {
    id: "dejar-productos",
    category: "Productos",
    question: "¿En algún momento voy a poder dejar de usar productos?",
    answer:
      "Muchas mujeres reducen o dejan de necesitarlos a medida que el entrenamiento avanza, sobre todo si la incontinencia es leve a moderada. Otras prefieren seguir usando un protector fino como respaldo, incluso con buen control — es una decisión personal, no un fracaso del tratamiento.",
  },
  {
    id: "postparto-cesarea",
    category: "Postparto específico",
    question: "Tuve cesárea, ¿igual puedo tener incontinencia y me sirve este programa?",
    answer:
      "Sí. El embarazo en sí — el peso del útero, los cambios hormonales, la relajación del tejido conectivo — ya ejerce carga sobre el piso pélvico independientemente de si el parto fue vaginal o por cesárea. El programa de entrenamiento aplica igual en ambos casos.",
  },
  {
    id: "postparto-lactancia",
    category: "Postparto específico",
    question: "¿La lactancia influye en la incontinencia?",
    answer:
      "Puede influir indirectamente: los niveles bajos de estrógeno durante la lactancia pueden hacer que el tejido vaginal esté más fino y sensible, lo cual a veces se nota como mayor urgencia o molestia. No es motivo para suspender el entrenamiento, pero es útil saberlo si notás cambios en la sensibilidad.",
  },
  {
    id: "vida-sexual",
    category: "Vida íntima",
    question: "¿La incontinencia y estos ejercicios afectan mi vida sexual?",
    answer:
      "La incontinencia puede afectar la vida sexual — por pérdidas durante la relación o por la ansiedad anticipatoria de que ocurran, algo mucho más común de lo que se habla. La buena noticia es que el mismo entrenamiento que mejora el control urinario suele mejorar también la conciencia y el tono del piso pélvico en general. Si hay dolor durante las relaciones, eso es un motivo aparte de consulta específica, no algo que el entrenamiento por sí solo resuelva.",
  },
  {
    id: "derivar-profesional",
    category: "Cuándo derivar",
    question: "¿Cuándo conviene pasar de \"hacerlo por mi cuenta\" a ver a un profesional en persona?",
    answer:
      "Tiene sentido buscar un kinesiólogo de piso pélvico si: no identificás con claridad el músculo aunque sigas las instrucciones, no hay ninguna mejora después de 8-12 semanas de práctica constante, notás peso o bulto vaginal, hay dolor durante el ejercicio o las relaciones, o simplemente querés confirmar con biofeedback que estás haciendo la técnica correcta. Ir a esa consulta no es un fracaso del programa — es el paso lógico siguiente para casos que necesitan más precisión.",
  },
];

const CATEGORY_ORDER = [
  "Progreso y expectativas",
  "Ejercicios",
  "Señales de alarma",
  "Productos",
  "Postparto específico",
  "Vida íntima",
  "Cuándo derivar",
];

export default function ExpertSessions() {
  const [, setLocation] = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
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

      <div className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Consultas y Guía Clínica con Especialistas
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Consultá directamente con especialistas en piso pélvico sobre tu caso puntual:
              ejercicios, productos o el aspecto emocional. Mientras terminamos de definir el formato
              exacto de las sesiones 1 a 1, esta guía reúne las respuestas más buscadas — con el
              mismo criterio clínico que usaría un especialista en una consulta real.
            </p>
          </div>

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
              Estamos terminando de definir el formato exacto de agenda. Mientras tanto, esta guía
              cubre las consultas más frecuentes — es posible que tu duda ya esté resuelta acá.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              Guía de consultas frecuentes
            </h2>

            <div className="space-y-8">
              {CATEGORY_ORDER.map((category) => {
                const items = FAQS.filter((f) => f.category === category);
                if (items.length === 0) return null;
                return (
                  <div key={category}>
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded" />
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {items.map((faq) => {
                        const isOpen = openId === faq.id;
                        return (
                          <Card key={faq.id} className="overflow-hidden">
                            <button
                              className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
                              onClick={() => setOpenId(isOpen ? null : faq.id)}
                            >
                              <h4 className="text-base font-semibold text-foreground">{faq.question}</h4>
                              <span className="text-primary text-xl flex-shrink-0">{isOpen ? "−" : "+"}</span>
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-6">
                                <div className="bg-background p-4 rounded-lg border border-border">
                                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                </div>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="mt-12 p-6 bg-destructive/5 border-destructive/30">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">
                Esta guía es educativa y no reemplaza una consulta médica. Si tenés sangre en la
                orina, dolor, fiebre o un cambio repentino y marcado en tus síntomas, consultá con un
                profesional de salud antes de continuar con cualquier programa de autoejercicio.
              </p>
            </div>
          </Card>

          <Card className="mt-8 p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">💡 Cómo aprovechar al máximo las sesiones cuando abran</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Anotá tus dudas puntuales a medida que te surjan, así llegás con todo listo</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Revisá primero esta guía — muchas preguntas frecuentes ya están resueltas acá</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Llevá registro de tu diario vesical o tu progreso de ejercicios para compartir en la consulta</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Priorizá 2 o 3 preguntas concretas antes que un relato general — se aprovecha mejor el tiempo</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
