import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register, loginPending, registerPending } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const pending = mode === "login" ? loginPending : registerPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name || undefined);
      }
      setLocation("/");
    } catch (err: any) {
      toast.error(err?.message || "Ocurrió un error. Intentá de nuevo.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#FAF7F2" }}>
      <div className="w-full max-w-sm">
        <div className="text-xl font-semibold mb-8 text-center" style={{ color: "#3D6B66" }}>
          Suelo Firme™
        </div>

        <h1 className="text-2xl font-semibold mb-6 text-center" style={{ color: "#2B2420" }}>
          {mode === "login" ? "Entrá a tu cuenta" : "Creá tu cuenta"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-base"
              style={{ border: "1px solid #E5E0D8", background: "#fff" }}
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-base"
            style={{ border: "1px solid #E5E0D8", background: "#fff" }}
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Contraseña (mínimo 8 caracteres)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-base"
            style={{ border: "1px solid #E5E0D8", background: "#fff" }}
          />

          <Button
            type="submit"
            disabled={pending}
            size="lg"
            className="w-full text-lg font-semibold py-4 rounded-xl"
            style={{ background: "#3D6B66", color: "#fff", minHeight: "56px" }}
          >
            {pending ? "Un momento..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full text-center text-sm mt-5"
          style={{ color: "#9C5D52" }}
        >
          {mode === "login" ? "¿No tenés cuenta? Creala acá" : "¿Ya tenés cuenta? Entrá acá"}
        </button>
      </div>
    </div>
  );
}
