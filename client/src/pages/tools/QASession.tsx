import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, MessageCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  category: string;
  answer: string;
  answered: boolean;
  userSubmitted?: boolean;
}

export default function QASession() {
  const [, setLocation] = useLocation();
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Ejercicios");
  const [submitting, setSubmitting] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "¿Cuántas veces al día debo hacer los ejercicios de Kegel?",
      category: "Ejercicios",
      answer: "Se recomienda realizar los ejercicios de Kegel 3-4 veces al día, cada sesión de 5-10 minutos. La consistencia es más importante que la intensidad. Después de 2-3 semanas de práctica regular, comenzarás a notar mejoras.",
      answered: true,
      userSubmitted: false,
    },
    {
      id: 2,
      question: "¿Qué productos son mejores para el ejercicio?",
      category: "Productos",
      answer: "Para ejercicio, recomendamos usar protectores especiales para actividad física o pants absorbentes de cintura alta. Estos ofrecen mayor protección durante el movimiento y son discretos bajo la ropa deportiva.",
      answered: true,
      userSubmitted: false,
    },
    {
      id: 3,
      question: "¿Cuánto tiempo tarda en mejorar la incontinencia?",
      category: "Progreso",
      answer: "La mayoría de las mujeres ven mejoras después de 2-3 semanas de práctica consistente. Sin embargo, los resultados óptimos generalmente se logran después de 3-6 meses. Cada cuerpo es diferente, así que sé paciente contigo misma.",
      answered: true,
      userSubmitted: false,
    },
    {
      id: 4,
      question: "¿Puedo hacer ejercicios de Kegel mientras estoy de pie?",
      category: "Ejercicios",
      answer: "Sí, absolutamente. Una vez que domines los ejercicios acostada, puedes practicarlos de pie, sentada o incluso mientras caminas. Esto te permite hacer los ejercicios en cualquier momento del día.",
      answered: true,
      userSubmitted: false,
    },
    {
      id: 5,
      question: "¿Es normal sentir incomodidad al hacer ejercicios?",
      category: "Salud",
      answer: "Es normal sentir una leve fatiga muscular, similar a cualquier otro ejercicio. Sin embargo, si sientes dolor agudo, detente y consulta con un profesional de salud. La incomodidad leve desaparece con la práctica.",
      answered: true,
      userSubmitted: false,
    },
  ]);

  const submitQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error("Por favor escribe tu pregunta");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newQ: Question = {
        id: Date.now(),
        question: newQuestion,
        category: selectedCategory,
        answer: "",
        answered: false,
        userSubmitted: true,
      };

      setQuestions([newQ, ...questions]);
      setNewQuestion("");
      toast.success("✓ Tu pregunta ha sido enviada. Un experto te responderá pronto");
    } catch (error) {
      toast.error("Error al enviar la pregunta");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["Ejercicios", "Productos", "Progreso", "Salud", "Otros"];
  const answeredQuestions = questions.filter(q => q.answered);
  const unansweredQuestions = questions.filter(q => !q.answered);

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

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Sesión de Preguntas y Respuestas con Expertos
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Accede a respuestas de expertos sobre ejercicios, productos, progreso y salud. Haz tus propias preguntas y recibe orientación personalizada.
            </p>
          </div>

          {/* Submit Question Form */}
          <Card className="p-8 mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Haz Tu Pregunta
            </h2>

            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Tu Pregunta *
                </label>
                <Textarea
                  placeholder="Escribe tu pregunta aquí. Sé lo más específica posible para recibir una respuesta más útil."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="min-h-32"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={submitQuestion}
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
              >
                <Send className="w-5 h-5" />
                {submitting ? "Enviando..." : "Enviar Pregunta"}
              </Button>
            </div>
          </Card>

          {/* Unanswered Questions */}
          {unansweredQuestions.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-secondary" />
                Preguntas Pendientes de Respuesta
              </h2>
              <div className="space-y-4">
                {unansweredQuestions.map(q => (
                  <Card key={q.id} className="p-6 border-l-4 border-l-secondary bg-secondary/5">
                    <div className="flex gap-3 mb-2">
                      <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-xs font-semibold rounded-full">
                        {q.category}
                      </span>
                      {q.userSubmitted && (
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                          Tu pregunta
                        </span>
                      )}
                    </div>
                    <p className="text-foreground font-semibold">{q.question}</p>
                    <p className="text-sm text-muted-foreground mt-2">Un experto está preparando la respuesta...</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Answered Questions */}
          {answeredQuestions.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Respuestas de Expertos ({answeredQuestions.length})
              </h2>
              <div className="space-y-4">
                {answeredQuestions.map(q => (
                  <Card key={q.id} className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                    <div className="flex gap-3 mb-3">
                      <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                        {q.category}
                      </span>
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{q.question}</h3>
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <p className="text-muted-foreground leading-relaxed">{q.answer}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          <Card className="mt-12 p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">💡 Consejos para Hacer Buenas Preguntas</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Sé específica: cuanto más detalles proporciones, mejor será la respuesta</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Selecciona la categoría correcta para que tu pregunta llegue al experto adecuado</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Revisa las preguntas ya respondidas, tu duda podría estar allí</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Revisá esta sección más tarde: el especialista va agregando las respuestas acá</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
