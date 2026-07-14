import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { tools, type Tool } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Lock, LogOut, Sparkles, Star } from "lucide-react";

const BASE_LINK = "https://pay.hotmart.com/F106710907A";
const PREMIUM_LINK = "https://pay.hotmart.com/I106724680Y";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, logout } = useAuth();
  const markUpsellSeen = trpc.auth.markUpsellSeen.useMutation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (!user) return;
    if (user.hasBaseAccess === 1 && user.hasPremium !== 1 && user.hasSeenUpsell !== 1) {
      const timer = setTimeout(() => {
        markUpsellSeen.mutate();
        setLocation("/upsell");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tu espacio...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const baseTools = tools.filter((tool) => !tool.isPremium);
  const premiumTools = tools.filter((tool) => tool.isPremium);
  const hasPremium = user.hasPremium === 1;

  const goToTool = (tool: Tool) => {
    const hasAccess = tool.isPremium
      ? user.hasPremium === 1
      : user.hasBaseAccess === 1 || user.hasPremium === 1;
    if (hasAccess) {
      setLocation(tool.path);
    } else {
      window.location.href = tool.isPremium ? PREMIUM_LINK : BASE_LINK;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm hidden sm:block">{user.email}</span>
            <Button variant="outline" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-1">Tu espacio personal</p>
            <h1 className="text-2xl font-bold mb-2">¡Hola de nuevo! 👋</h1>
            <p className="text-white/90 text-sm max-w-md">
              Acá tenés todas tus herramientas para recuperar el control a tu ritmo.
            </p>
          </div>
        </div>

        {/* Base tools */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Tus herramientas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {baseTools.map((tool) => (
              <Card
                key={tool.path}
                onClick={() => goToTool(tool)}
                className="p-5 border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm mb-1">{tool.title}</h3>
                    <p className="text-secondary text-xs font-semibold mb-1">{tool.format}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{tool.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium */}
        {hasPremium ? (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
              Pack Premium — 6 herramientas avanzadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {premiumTools.map((tool) => (
                <Card
                  key={tool.path}
                  onClick={() => goToTool(tool)}
                  className="p-4 border-2 border-accent bg-accent/5 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground text-xs leading-tight">{tool.title}</p>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent-foreground transition-colors flex-shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">Pack Premium — 6 herramientas avanzadas</h3>
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">BLOQUEADO</span>
                </div>
                <p className="text-white/90 text-sm">
                  Protocolo de Retorno al Impacto, Reentrenamiento Vesical, Acompañamiento con Especialista y más.
                </p>
              </div>
              <Button
                onClick={() => setLocation("/pack-premium")}
                className="bg-white text-primary hover:bg-white/90 font-bold px-6 whitespace-nowrap"
              >
                Desbloquear →
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
