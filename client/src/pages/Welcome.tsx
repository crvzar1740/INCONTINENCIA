import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    localStorage.setItem("suelo-firme-welcomed", "true");
    setLocation("/diario");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FAF7F2" }}
    >
      {/* Top bar */}
      <nav className="py-5 px-6">
        <div className="text-xl font-semibold" style={{ color: "#3D6B66" }}>
          Suelo Firme
        </div>
      </nav>

      {/* Main content */}
      <main
        className={`flex-1 flex flex-col justify-center px-6 pb-12 max-w-xl mx-auto w-full transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Soft organic shape decoration */}
        <div
          className="w-20 h-20 rounded-full mb-8 flex items-center justify-center text-4xl"
          style={{ background: "#A9C6B820" }}
        >
          🌿
        </div>

        <h1
          className="text-3xl md:text-4xl font-semibold mb-6 leading-snug"
          style={{ color: "#2B2420", letterSpacing: "-0.3px" }}
        >
          Bienvenida. Aquí no hay nada que esconder.
        </h1>

        <div
          className="space-y-4 text-lg leading-relaxed mb-10"
          style={{ color: "#6B6259", lineHeight: 1.7 }}
        >
          <p>
            Lo que estás sintiendo lo viven millones de personas —después de un
            parto, con la edad, por estrés, o sin ninguna razón clara. No es
            "algo que ya deberías haber superado" ni una señal de que tu cuerpo
            te falló.{" "}
            <strong style={{ color: "#2B2420" }}>
              Es una condición médica, real, y tratable.
            </strong>
          </p>
          <p>
            Esta app no reemplaza a tu médico ni a tu fisioterapeuta de piso
            pélvico. Es tu acompañamiento diario: te ayuda a entender tus
            patrones, a entrenar los músculos correctos y a recuperar el
            control, un día a la vez.
          </p>
          <p>
            Todo lo que vas a hacer aquí —el diario, los ejercicios, las
            alarmas— está basado en las mismas guías clínicas que usan los
            urólogos (EAU 2026) y en programas digitales que ya demostraron
            resultados reales:{" "}
            <strong style={{ color: "#3D6B66" }}>
              más de 6 de cada 10 usuarias de programas similares reportan
              mejoras notables en pocas semanas.
            </strong>
          </p>
          <p>Vamos a ir paso a paso. Sin prisa, sin juicio.</p>
        </div>

        <Button
          size="lg"
          onClick={handleStart}
          className="w-full text-lg font-semibold py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "#3D6B66",
            color: "#fff",
            minHeight: "56px",
          }}
        >
          Empezar mi seguimiento
        </Button>

        <p
          className="text-center text-sm mt-5 italic"
          style={{ color: "#9C5D52" }}
        >
          Tus datos se guardan solo en tu dispositivo.
        </p>
      </main>
    </div>
  );
}
