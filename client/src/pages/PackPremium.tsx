import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { tools } from "@/lib/tools";

export default function PackPremium() {
  const [, setLocation] = useLocation();

  const premiumTools = tools.filter((tool) => tool.isPremium);

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
                key={tool.path}
                className="overflow-hidden border-2 border-accent bg-accent/5 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {tool.image && (
                  <div className="w-full aspect-square overflow-hidden">
                    <img src={tool.image} alt={tool.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {tool.longDescription ?? tool.description}
                  </p>
                  <Button
                    onClick={() => setLocation(tool.path)}
                    className="btn-primary w-full"
                  >
                    Acceder Ahora
                  </Button>
                </div>
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
                  <h3 className="font-semibold text-foreground mb-1">Programa de Acompañamiento</h3>
                  <p className="text-sm text-muted-foreground">1 videoconsulta en vivo incluida con especialista real + seguimiento opcional aparte</p>
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
