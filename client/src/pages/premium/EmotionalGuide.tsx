import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AccessGate } from "@/components/AccessGate";
import { Heart, ArrowLeft, Plus, Trash2, Wind, MessageCircleHeart, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const STORAGE_KEY = "suelo-firme-premium-emotional-guide";

interface AvoidedActivity {
  id: string;
  activity: string;
  difficulty: number;
  attempted: boolean;
}

interface ThoughtRecord {
  id: string;
  situation: string;
  automaticThought: string;
  evidence: string;
  balancedThought: string;
}

interface StoredState {
  activities: AvoidedActivity[];
  thoughts: ThoughtRecord[];
  weeklyCheckins: { week: string; avoided: number; attempted: number }[];
}

const DEFAULT_STATE: StoredState = {
  activities: [],
  thoughts: [],
  weeklyCheckins: [],
};

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function EmotionalGuideContent() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<StoredState>(DEFAULT_STATE);
  const [newActivity, setNewActivity] = useState({ activity: "", difficulty: 3 });
  const [newThought, setNewThought] = useState({ situation: "", automaticThought: "", evidence: "", balancedThought: "" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState({ ...DEFAULT_STATE, ...JSON.parse(saved) });
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  const persist = (next: StoredState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addActivity = () => {
    if (!newActivity.activity.trim()) {
      toast.error("Describí la actividad que estás evitando");
      return;
    }
    const activity: AvoidedActivity = { id: genId(), ...newActivity, attempted: false };
    persist({ ...state, activities: [...state.activities, activity].sort((a, b) => a.difficulty - b.difficulty) });
    setNewActivity({ activity: "", difficulty: 3 });
    toast.success("✓ Agregado a tu lista");
  };

  const toggleAttempted = (id: string) => {
    persist({
      ...state,
      activities: state.activities.map((a) => (a.id === id ? { ...a, attempted: !a.attempted } : a)),
    });
  };

  const removeActivity = (id: string) => {
    persist({ ...state, activities: state.activities.filter((a) => a.id !== id) });
  };

  const addThought = () => {
    if (!newThought.situation.trim() || !newThought.automaticThought.trim()) {
      toast.error("Completá al menos la situación y el pensamiento automático");
      return;
    }
    const thought: ThoughtRecord = { id: genId(), ...newThought };
    persist({ ...state, thoughts: [thought, ...state.thoughts] });
    setNewThought({ situation: "", automaticThought: "", evidence: "", balancedThought: "" });
    toast.success("✓ Registro guardado");
  };

  const removeThought = (id: string) => {
    persist({ ...state, thoughts: state.thoughts.filter((t) => t.id !== id) });
  };

  const attemptedCount = state.activities.filter((a) => a.attempted).length;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation("/pack-premium")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="w-20" />
        </div>
      </nav>

      <div className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Guía de Reconstrucción Emocional y Conductual
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              La incontinencia no es solo un tema físico: la evidencia muestra que suele venir
              acompañada de vergüenza, evitación de actividades sociales y baja en la autoestima —
              y que trabajar activamente ese aspecto mejora la calidad de vida tanto como el trabajo
              muscular. Estas herramientas están basadas en principios de terapia
              cognitivo-conductual, el enfoque con más evidencia para el impacto psicológico de la
              incontinencia.
            </p>
          </div>

          {/* Avoided activities / graded exposure */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-primary/20">
            <h2 className="text-xl font-bold text-foreground mb-2">Mapa de actividades evitadas</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Es muy común empezar a evitar el gimnasio, salidas largas, reuniones sociales o bailar
              "por las dudas". El problema es que evitar refuerza el miedo en vez de reducirlo. La
              técnica que mejor funciona es la exposición gradual: listar esas actividades de menor a
              mayor dificultad, y retomarlas de a una, empezando por la más fácil.
            </p>
            <div className="bg-background rounded-lg border border-border p-5 mb-6">
              <div className="grid md:grid-cols-[1fr_auto] gap-3 mb-3">
                <input
                  type="text"
                  placeholder="ej: ir a la clase de yoga, salir a caminar 40 minutos, reunión larga sin saber dónde está el baño"
                  value={newActivity.activity}
                  onChange={(e) => setNewActivity((a) => ({ ...a, activity: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-foreground">Dificultad esperada:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNewActivity((a) => ({ ...a, difficulty: n }))}
                      className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors ${
                        newActivity.difficulty === n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={addActivity} size="sm" className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Agregar a la lista
              </Button>
            </div>

            {state.activities.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">Tu lista, de menor a mayor dificultad</p>
                  <span className="text-sm text-muted-foreground">{attemptedCount}/{state.activities.length} retomadas</span>
                </div>
                {state.activities.map((a) => (
                  <div
                    key={a.id}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-4 ${
                      a.attempted ? "border-primary/40 bg-primary/5" : "border-border bg-background"
                    }`}
                  >
                    <label className="flex items-center gap-3 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={a.attempted}
                        onChange={() => toggleAttempted(a.id)}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className={`text-sm font-medium ${a.attempted ? "text-primary line-through" : "text-foreground"}`}>{a.activity}</p>
                        <p className="text-xs text-muted-foreground">Dificultad: {a.difficulty}/5</p>
                      </div>
                    </label>
                    <button onClick={() => removeActivity(a.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 flex gap-3 bg-secondary/5 border border-secondary/20 rounded-lg p-4">
              <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Empezá por la actividad de menor dificultad y llevá un protector con el que te
                sientas segura la primera vez — el objetivo de esta etapa es demostrarte que podés,
                no probar que ya no necesitás nada.
              </p>
            </div>
          </Card>

          {/* Thought record */}
          <Card className="p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-2">Registro de pensamientos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              La investigación sobre el impacto psicológico de la incontinencia describe un patrón de
              pensamientos automáticos muy específico: vergüenza, sensación de estar "sucia", creer
              que otras personas te juzgan, o pensar que tu vida "ya cambió para siempre". Escribirlos
              y revisarlos con evidencia real ayuda a que pierdan fuerza.
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Situación</label>
                <input
                  type="text"
                  placeholder="ej: tosí fuerte en una reunión y sentí que perdí un poco"
                  value={newThought.situation}
                  onChange={(e) => setNewThought((t) => ({ ...t, situation: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Pensamiento automático</label>
                <input
                  type="text"
                  placeholder="ej: seguro todos se dieron cuenta, soy un desastre"
                  value={newThought.automaticThought}
                  onChange={(e) => setNewThought((t) => ({ ...t, automaticThought: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">¿Qué evidencia real tenés a favor y en contra?</label>
                <textarea
                  placeholder="ej: nadie dijo nada ni me miró raro; la pérdida fue mínima y el protector la contuvo"
                  value={newThought.evidence}
                  onChange={(e) => setNewThought((t) => ({ ...t, evidence: e.target.value }))}
                  className="w-full min-h-20 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Pensamiento más equilibrado</label>
                <textarea
                  placeholder="ej: tuve una pérdida chica que el protector contuvo, y nadie lo notó. Esto no define quién soy"
                  value={newThought.balancedThought}
                  onChange={(e) => setNewThought((t) => ({ ...t, balancedThought: e.target.value }))}
                  className="w-full min-h-20 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <Button onClick={addThought} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Guardar registro
            </Button>

            {state.thoughts.length > 0 && (
              <div className="mt-8 space-y-3">
                <p className="text-sm font-semibold text-foreground">Tus registros anteriores</p>
                {state.thoughts.map((t) => (
                  <div key={t.id} className="bg-background rounded-lg border border-border p-4 relative">
                    <button onClick={() => removeThought(t.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-muted-foreground mb-1">Situación</p>
                    <p className="text-sm text-foreground mb-2">{t.situation}</p>
                    {t.balancedThought && (
                      <>
                        <p className="text-xs text-muted-foreground mb-1">Pensamiento equilibrado</p>
                        <p className="text-sm text-primary font-medium">{t.balancedThought}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Breathing */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-bold text-foreground">Respiración para bajar la ansiedad anticipatoria</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              El miedo a que "pase algo" antes de salir de casa o entrar a una actividad es tan real
              como la pérdida física. Esta técnica de respiración ayuda a bajar la activación del
              sistema nervioso en el momento:
            </p>
            <div className="bg-background rounded-lg border border-border p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hacé una inhalación normal por la nariz, seguida de una segunda inhalación corta y
                rápida para llenar del todo los pulmones, y después soltá el aire en una exhalación
                larga y lenta por la boca. Repetilo 1 a 3 veces. Es una de las formas más rápidas de
                bajar la activación fisiológica del estrés en el momento — usala antes de salir de
                casa o justo antes de una actividad que te genera ansiedad.
              </p>
            </div>
          </Card>

          {/* Partner communication */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircleHeart className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-bold text-foreground">Hablarlo con tu pareja</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              La investigación es clara en algo que muchas mujeres intuyen: cuando la pareja entiende
              lo que está pasando, el impacto emocional de la incontinencia baja notablemente. Callarlo
              por vergüenza suele generar más distancia que la incontinencia en sí.
            </p>
            <div className="bg-background rounded-lg border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-2">Una forma simple de empezar la conversación:</p>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "Quiero contarte algo que me está pasando desde el embarazo/parto — a veces pierdo
                orina sin querer, sobre todo con [esfuerzo/urgencia]. Estoy trabajando en mejorarlo con
                ejercicios, pero necesito que lo sepas para no sentir que tengo que ocultarlo todo el
                tiempo."
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EmotionalGuide() {
  return (
    <AccessGate tier="premium">
      <EmotionalGuideContent />
    </AccessGate>
  );
}
