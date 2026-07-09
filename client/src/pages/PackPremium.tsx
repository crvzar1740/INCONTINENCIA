import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Activity, ShoppingBag, Target, Users, Heart, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

interface PremiumTool {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  path: string;
  color: string;
  borderColor: string;
}

export default function PackPremium() {
  const [, setLocation] = useLocation();

  const premiumTools: PremiumTool[] = [
    {
      id: "advanced-exercises",
      icon: <Activity className="w-8 h-8" />,
      name: "Protocolo de Retorno al Impacto",
      description: "El puente entre tu programa base y correr, saltar o volver a entrenar en serio: chequeo de diástasis, respiración con carga y un test de disposición basado en criterios clínicos reales.",
      path: "/premium/advanced-exercises-workbook",
      color: "from-primary/10 to-primary/5",
      borderColor: "border-primary/30",
    },
    {
      id: "smart-shopping",
      icon: <ShoppingBag className="w-8 h-8" />,
      name: "Guía de Decisión: Productos y Cuidado de la Piel",
      description: "Criterio real para evaluar cualquier producto (no un catálogo de precios), rutina de cuidado de la piel, calculadora de costo por uso y opciones conservadoras más allá del protector.",
      path: "/premium/smart-shopping-checklist",
      color: "from-accent/10 to-accent/5",
      borderColor: "border-accent/30",
    },
    {
      id: "action-protocol",
      icon: <Target className="w-8 h-8" />,
      name: "Protocolo de Reentrenamiento Vesical",
      description: "Diario vesical de 3 días, plan de vaciado programado y técnicas de supresión de urgencia — la herramienta clínica específica para la urgencia y la frecuencia, distinta al trabajo de fuerza.",
      path: "/premium/personalized-action-protocol",
      color: "from-secondary/10 to-secondary/5",
      borderColor: "border-secondary/30",
    },
    {
      id: "expert-sessions",
      icon: <Users className="w-8 h-8" />,
      name: "Consultas y Guía Clínica con Especialistas",
      description: "Guía a fondo de preguntas frecuentes con criterio clínico real: señales de alarma, postparto, vida íntima y cuándo derivar a un profesional — mientras se define el formato de sesiones 1 a 1.",
      path: "/premium/expert-sessions",
      color: "from-primary/10 to-accent/5",
      borderColor: "border-primary/20",
    },
    {
      id: "emotional-guide",
      icon: <Heart className="w-8 h-8" />,
      name: "Guía de Reconstrucción Emocional y Conductual",
      description: "Mapa de actividades evitadas con exposición gradual, registro de pensamientos y respiración para la ansiedad anticipatoria — basado en terapia cognitivo-conductual, no en mindfulness genérico.",
      path: "/premium/emotional-guide",
      color: "from-accent/10 to-secondary/5",
      borderColor: "border-accent/20",
    },
    {
      id: "community",
      icon: <MessageCircle className="w-8 h-8" />,
      name: "Guía de Comunicación y Red de Apoyo",
      description: "Cómo hablarlo con tu pareja, tu entorno y tu médico, cómo encontrar comunidades reales mientras armamos la nuestra, y un espacio privado de reflexión guardado solo en tu dispositivo.",
      path: "/premium/exclusive-community",
      color: "from-secondary/10 to-primary/5",
      borderColor: "border-secondary/20",
    },
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

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="container">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tu Pack Premium Completo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Acceso a 6 herramientas avanzadas diseñadas para que recuperes tu confianza, controles la incontinencia y vuelvas a disfrutar de tu vida activa sin limitaciones.
            </p>
          </div>

          {/* Premium Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {premiumTools.map((tool) => (
              <Card
                key={tool.id}
                className={`p-6 bg-gradient-to-br ${tool.color} border-2 ${tool.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/50 flex items-center justify-center text-primary">
                    {tool.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {tool.description}
                </p>

                <Button
                  onClick={() => setLocation(tool.path)}
                  className="btn-primary w-full"
                >
                  Acceder Ahora
                </Button>
              </Card>
            ))}
          </div>

          {/* Benefits Section */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              ¿Qué Incluye Tu Pack Premium?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Protocolo de Retorno al Impacto</h3>
                  <p className="text-sm text-muted-foreground">Carga progresiva de 8 semanas y test de disposición para volver a correr y saltar</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Guía de Productos Basada en Evidencia</h3>
                  <p className="text-sm text-muted-foreground">Criterio de decisión, cuidado de la piel y calculadora de costo real</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Reentrenamiento Vesical</h3>
                  <p className="text-sm text-muted-foreground">Diario vesical, plan de vaciado programado y técnicas de supresión de urgencia</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Guía Clínica con Especialistas</h3>
                  <p className="text-sm text-muted-foreground">Preguntas frecuentes con criterio clínico real + sesiones 1 a 1 en definición</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Reconstrucción Emocional</h3>
                  <p className="text-sm text-muted-foreground">Exposición gradual, registro de pensamientos y técnicas de respiración</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Comunicación y Red de Apoyo</h3>
                  <p className="text-sm text-muted-foreground">Guías de conversación, comunidades confiables y espacio privado de reflexión</p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Todas las herramientas están disponibles para que explores y comiences ahora mismo.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="btn-accent"
            >
              Volver a Inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
