import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, CheckCircle2, Calendar } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Session {
  id: string;
  expertName: string;
  topic: string;
  date: string;
  completed: boolean;
  notes: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function ExpertSessions() {
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      expertName: "Dra. María López",
      topic: "Técnica correcta de ejercicios Kegel",
      date: "2026-07-15",
      completed: false,
      notes: "",
    },
    {
      id: "2",
      expertName: "Fisioterapeuta Carlos Ruiz",
      topic: "Adaptación de ejercicios para actividad física",
      date: "2026-07-22",
      completed: false,
      notes: "",
    },
    {
      id: "3",
      expertName: "Psicóloga Sofía García",
      topic: "Manejo emocional de la incontinencia",
      date: "2026-07-29",
      completed: false,
      notes: "",
    },
  ]);

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

  const toggleSession = (id: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("✓ Tu progreso de sesiones ha sido guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el progreso");
    } finally {
      setSaving(false);
    }
  };

  const completedSessions = sessions.filter(s => s.completed).length;
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
          <div className="text-2xl font-bold text-primary">INCONTINENCIA</div>
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
              Acceso a preguntas frecuentes respondidas por especialistas, historial de sesiones y recomendaciones personalizadas de expertos.
            </p>
          </div>

          {/* Upcoming Sessions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Tus Sesiones Programadas ({completedSessions}/{sessions.length})
            </h2>
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id} className={`p-6 border-l-4 ${session.completed ? "border-l-primary bg-primary/5" : "border-l-muted"}`}>
                  <div className="flex gap-4 mb-4">
                    <Checkbox
                      checked={session.completed}
                      onCheckedChange={() => toggleSession(session.id)}
                      className="w-6 h-6 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${session.completed ? "text-primary" : "text-foreground"}`}>
                          {session.expertName}
                        </h3>
                        {session.completed && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>
                      <p className="text-muted-foreground mb-2">{session.topic}</p>
                      <p className="text-sm text-muted-foreground">📅 {session.date}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={saveProgress}
            disabled={saving}
            className="btn-primary w-full text-lg mb-12"
          >
            {saving ? "Guardando..." : "Guardar Mi Progreso"}
          </Button>

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
                <span>Marca las sesiones como completadas cuando asistas</span>
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
