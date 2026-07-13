import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

const HOTMART_LINKS = {
  base: "https://pay.hotmart.com/F106710907A",
  premium: "https://pay.hotmart.com/I106724680Y",
} as const;

type Tier = "base" | "premium";

export function AccessGate({ tier, children }: { tier: Tier; children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <p style={{ color: "#6B6259" }}>Cargando...</p>
      </div>
    );
  }

  const hasPremium = user?.hasPremium === 1;
  const hasBaseAccess = user?.hasBaseAccess === 1 || hasPremium;
  const hasAccess = tier === "premium" ? hasPremium : hasBaseAccess;

  if (!hasAccess) {
    const isPremiumGate = tier === "premium";
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FAF7F2" }}>
        <div className="max-w-md text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "#3D6B6620" }}
          >
            <Lock className="w-7 h-7" style={{ color: "#3D6B66" }} />
          </div>
          <h1 className="text-2xl font-semibold mb-3" style={{ color: "#2B2420" }}>
            {isPremiumGate ? "Esta herramienta es parte de Suelo Firme™ Premium" : "Esta herramienta es parte de Suelo Firme™"}
          </h1>
          <p className="mb-8 leading-relaxed" style={{ color: "#6B6259" }}>
            {isPremiumGate
              ? "Todavía no tenés acceso al Pack Premium. Podés sumarlo cuando quieras, a tu ritmo."
              : "Todavía no tenés acceso a esta herramienta. Podés sumarla cuando quieras."}
          </p>
          <Button
            onClick={() => {
              window.location.href = HOTMART_LINKS[isPremiumGate ? "premium" : "base"];
            }}
            className="w-full text-base py-6"
            style={{ background: "#3D6B66", color: "#fff" }}
          >
            {isPremiumGate ? "Ver Suelo Firme™ Premium" : "Ver Suelo Firme™"}
          </Button>
          <button
            onClick={() => setLocation("/")}
            className="mt-5 text-sm underline block mx-auto"
            style={{ color: "#6B6259" }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
