import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, ShoppingBag, Target, Users, Heart, Sparkles } from "lucide-react";
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
      icon: <BookOpen className="w-8 h-8" />,
      name: "Workbook de Ejercicios Avanzados",
      description: "Guía progresiva de 12 semanas con ejercicios especializados para fortalecer el suelo pélvico. Incluye variaciones, progresión y seguimiento semanal.",
      path: "/premium/advanced-exercises-workbook",
      color: "from-primary/10 to-primary/5",
      borderColor: "border-primary/30",
    },
    {
      id: "smart-shopping",
      icon: <ShoppingBag className="w-8 h-8" />,
      name: "Checklist de Compra Inteligente",
      description: "Comparativa de productos recomendados con precios, tiendas y análisis de costo-beneficio. Historial de compras y recomendaciones personalizadas.",
      path: "/premium/smart-shopping-checklist",
      color: "from-accent/10 to-accent/5",
      borderColor: "border-accent/30",
    },
    {
      id: "action-protocol",
      icon: <Target className="w-8 h-8" />,
      name: "Plan de Acción con Protocolo",
      description: "Diagnóstico personalizado + protocolo paso a paso. Tracking de adherencia semanal y ajustes automáticos según tu progreso.",
      path: "/premium/personalized-action-protocol",
      color: "from-secondary/10 to-secondary/5",
      borderColor: "border-secondary/30",
    },
    {
      id: "expert-sessions",
      icon: <Users className="w-8 h-8" />,
      name: "Sesiones Privadas con Expertos",
      description: "Acceso a preguntas frecuentes respondidas por especialistas, historial de sesiones y recomendaciones personalizadas de expertos.",
      path: "/premium/expert-sessions",
      color: "from-primary/10 to-accent/5",
      borderColor: "border-primary/20",
    },
    {
      id: "emotional-guide",
      icon: <Heart className="w-8 h-8" />,
      name: "Guía Emocional y Psicológica",
      description: "Módulos de manejo emocional, ejercicios de mindfulness, técnicas de respiración y tracking de bienestar mental diario.",
      path: "/premium/emotional-guide",
      color: "from-accent/10 to-secondary/5",
      borderColor: "border-accent/20",
    },
    {
      id: "community",
      icon: <Sparkles className="w-8 h-8" />,
      name: "Comunidad Exclusiva de Apoyo",
      description: "Foro privado con otras mujeres, historias de éxito inspiradoras, grupos de apoyo temáticos y sesiones de grupo mensuales.",
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
                  <h3 className="font-semibold text-foreground mb-1">Guía Progresiva de 12 Semanas</h3>
                  <p className="text-sm text-muted-foreground">Ejercicios avanzados con seguimiento semanal y ajustes automáticos</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Comparativa de Productos</h3>
                  <p className="text-sm text-muted-foreground">Análisis de precios, tiendas y recomendaciones personalizadas</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Protocolo Personalizado</h3>
                  <p className="text-sm text-muted-foreground">Diagnóstico + plan paso a paso con tracking de adherencia</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Acceso a Expertos</h3>
                  <p className="text-sm text-muted-foreground">Preguntas frecuentes respondidas + sesiones privadas</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Guía Emocional</h3>
                  <p className="text-sm text-muted-foreground">Mindfulness, técnicas de respiración y tracking de bienestar</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Comunidad Exclusiva</h3>
                  <p className="text-sm text-muted-foreground">Foro privado, historias de éxito y grupos de apoyo</p>
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
