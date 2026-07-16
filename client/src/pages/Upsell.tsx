import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Upsell() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.hasPremium === 1) {
      setLocation("/dashboard");
    }
  }, [user]);

  const bullets = [
    {
      emoji: "📊",
      title: "Reportes automáticos para tu médico",
      desc: "Llegá a la consulta con datos reales, no con 'creo que me pasa seguido'.",
    },
    {
      emoji: "🧘",
      title: "Rutinas de suelo pélvico guiadas y a tu ritmo",
      desc: "Sin adivinar si lo estás haciendo bien.",
    },
    {
      emoji: "⏰",
      title: "Alarmas inteligentes",
      desc: "Te avisan antes de que la urgencia te gane, no después.",
    },
    {
      emoji: "💬",
      title: "Lecciones diarias de 2 minutos",
      desc: "Hábitos pequeños que suman control real, sin sentirte en terapia.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{ background: "#FAF7F2cc", borderColor: "#E5E0D8" }}
      >
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation(user ? "/dashboard" : "/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="flex-1 text-center font-semibold text-lg" style={{ color: "#2B2420" }}>
            Suelo Firme Premium
          </div>
          <div className="w-16" />
        </div>
      </nav>

      <div className="container max-w-xl py-10 pb-16">
        {/* Headline */}
        <div className="mb-8">
          <h1
            className="text-3xl font-semibold leading-snug mb-3"
            style={{ color: "#2B2420" }}
          >
            Invierte en volver a sentirte en control de tu cuerpo.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "#6B6259" }}>
            Un pago único, acceso de por vida: acompañamiento diario, ejercicios
            guiados y reportes listos para tu médico.
          </p>
        </div>

        {/* Emotional bullets */}
        <div className="space-y-3 mb-8">
          {bullets.map((b, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl px-5 py-4"
              style={{ background: "#fff", border: "1px solid #E5E0D8" }}
            >
              <span className="text-2xl flex-shrink-0">{b.emoji}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#2B2420" }}>
                  {b.title}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "#6B6259" }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing card */}
        <div
          className="rounded-2xl p-7 mb-4"
          style={{ background: "#fff", border: "2px solid #3D6B66" }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "#6B6259" }}>
            Pack Premium
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold" style={{ color: "#2B2420" }}>
              $97
            </span>
            <span className="text-sm" style={{ color: "#6B6259" }}>
              pago único
            </span>
          </div>
          <p className="text-xs mb-6" style={{ color: "#6B6259" }}>
            Acceso de por vida. Sin suscripciones ni cargos recurrentes.
          </p>

          <Button
            size="lg"
            className="w-full text-base font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "#9C5D52", color: "#fff", minHeight: "56px" }}
            onClick={() => {
              window.location.href = "https://pay.hotmart.com/I106724680Y";
            }}
          >
            Quiero el acompañamiento completo
          </Button>

          <p className="text-center text-xs mt-4" style={{ color: "#6B6259" }}>
            Garantía de 7 días. Tus datos siempre son tuyos.
          </p>
        </div>

        {/* Objection handler */}
        <div
          className="rounded-xl p-5 mb-8 text-sm leading-relaxed"
          style={{ background: "#A9C6B820", border: "1px solid #A9C6B850", color: "#2B2420" }}
        >
          <p className="font-semibold mb-1">¿Dudás en sumarte al Premium?</p>
          <p style={{ color: "#6B6259" }}>
            Sabemos que invertir en algo más no es una decisión pequeña. Tenés 7
            días para probarlo completo. Si no sentís que te está ayudando a
            entender tu cuerpo, te devolvemos tu dinero sin preguntas.
          </p>
        </div>

        {/* Alternate variant */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: "#fff", border: "1px solid #E5E0D8" }}
        >
          <p className="font-semibold mb-2" style={{ color: "#2B2420" }}>
            Llegá a tu próxima consulta con respuestas, no con dudas.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#6B6259" }}>
            Los urólogos necesitan patrones, no recuerdos vagos de "a veces me
            pasa". Con Premium, generás en un toque un reporte con tus
            frecuencias, urgencias y escapes de las últimas semanas — el mismo
            tipo de dato que se usa en las guías clínicas actuales para decidir
            tu seguimiento.
          </p>
        </div>

        {/* Downsell */}
        <div className="text-center">
          <p className="text-sm mb-3" style={{ color: "#6B6259" }}>
            ¿Preferís una opción más accesible?
          </p>
          <button
            onClick={() => setLocation("/downsell")}
            className="text-sm font-medium underline transition-opacity hover:opacity-70"
            style={{ color: "#3D6B66" }}
          >
            Ver oferta con descuento →
          </button>
        </div>

        {/* Guarantee */}
        <div
          className="mt-10 rounded-xl p-5 flex gap-4 items-start"
          style={{ background: "#fff", border: "1px solid #E5E0D8" }}
        >
          <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#3D6B66" }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: "#2B2420" }}>
              Garantía de 7 días
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#6B6259" }}>
              Si en los primeros 7 días no sentís que te ayuda a entender tu
              cuerpo, te devolvemos tu dinero sin preguntas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}