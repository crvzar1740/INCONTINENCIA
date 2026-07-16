import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AccessGate } from "@/components/AccessGate";
import { Target, ArrowLeft, Plus, Trash2, Info, Wind, Timer, Coffee, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const STORAGE_KEY = "suelo-firme-premium-bladder-protocol";

interface DiaryEntry {
  id: string;
  hora: string;
  volumen: "chico" | "mediano" | "grande";
  urgencia: number;
  perdida: boolean;
  liquido: string;
}

interface StoredState {
  entries: DiaryEntry[];
  intervaloActual: string;
  irritantesNotados: string;
}

const DEFAULT_STATE: StoredState = {
  entries: [],
  intervaloActual: "",
  irritantesNotados: "",
};

const IRRITANTS = [
  { name: "Cafeína (café, té, mate, gaseosas cola)", why: "Estimula la vejiga y actúa como diurético — es el irritante más respaldado por evidencia." },
  { name: "Alcohol", why: "Reduce la hormona que le indica al riñón retener agua, además de irritar directamente la vejiga." },
  { name: "Edulcorantes artificiales", why: "La evidencia en personas es mixta, pero pueden agravar síntomas en vejigas sensibles." },
  { name: "Bebidas carbonatadas", why: "El gas puede irritar la mucosa vesical, incluso en versiones sin cafeína." },
  { name: "Cítricos y tomate", why: "Su acidez puede irritar el revestimiento de la vejiga en personas sensibles." },
  { name: "Picante", why: "Puede aumentar la urgencia en algunas personas, aunque el efecto es muy individual." },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function PersonalizedActionProtocolContent() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<StoredState>(DEFAULT_STATE);
  const [form, setForm] = useState({ hora: "", volumen: "mediano" as DiaryEntry["volumen"], urgencia: 3, perdida: false, liquido: "" });

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

  const addEntry = () => {
    if (!form.hora) {
      toast.error("Ingresá la hora de esta micción");
      return;
    }
    const entry: DiaryEntry = { id: genId(), ...form };
    const entries = [...state.entries, entry].sort((a, b) => a.hora.localeCompare(b.hora));
    persist({ ...state, entries });
    setForm({ hora: "", volumen: "mediano", urgencia: 3, perdida: false, liquido: "" });
    toast.success("✓ Registro agregado");
  };

  const removeEntry = (id: string) => {
    persist({ ...state, entries: state.entries.filter((e) => e.id !== id) });
  };

  const stats = useMemo(() => {
    const entries = state.entries;
    if (entries.length < 2) return null;
    const times = entries.map((e) => {
      const [h, m] = e.hora.split(":").map(Number);
      return h * 60 + m;
    });
    const intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i - 1]);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const perdidas = entries.filter((e) => e.perdida).length;
    return {
      avgIntervalMin: Math.round(avgInterval),
      totalVoids: entries.length,
      perdidas,
    };
  }, [state.entries]);

  const suggestedSchedule = useMemo(() => {
    if (!stats) return null;
    const base = stats.avgIntervalMin;
    return [
      { semana: "Semanas 1-2", intervalo: base },
      { semana: "Semanas 3-4", intervalo: base + 15 },
      { semana: "Semanas 5-6", intervalo: base + 30 },
      { semana: "Semanas 7-8", intervalo: Math.min(base + 60, 210) },
    ];
  }, [stats]);

  const downloadDiary = () => {
    const lines = state.entries.map(
      (e) => `${e.hora} | Volumen: ${e.volumen} | Urgencia: ${e.urgencia}/5 | Pérdida: ${e.perdida ? "Sí" : "No"} | Líquido: ${e.liquido || "-"}`
    );
    const content = `DIARIO VESICAL - Suelo Firme\n${new Date().toLocaleDateString("es-ES")}\n\n${lines.join("\n")}\n\nPromedio entre micciones: ${stats?.avgIntervalMin ?? "-"} minutos\nTotal de micciones registradas: ${stats?.totalVoids ?? 0}\nPérdidas registradas: ${stats?.perdidas ?? 0}`;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", "diario-vesical-suelo-firme.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("✓ Diario descargado");
  };

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
              <Target className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Protocolo de Reentrenamiento Vesical
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tu programa base fortalece el músculo. Esto es distinto: es una técnica clínica de
              primera línea para la urgencia y la frecuencia — cuando sentís que tenés que ir "ya" o
              vas al baño muchas más veces de las necesarias. Se llama bladder training y tiene décadas
              de respaldo en guías clínicas de urología.
            </p>
          </div>

          {/* Bladder diary */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-primary/20">
            <h2 className="text-xl font-bold text-foreground mb-2">Paso 1: Diario vesical de 3 días</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Es la herramienta que se usa clínicamente antes de armar cualquier plan: registrá cada
              vez que vayas al baño durante 3 días. No hace falta ser exacta con los mililitros — una
              estimación de chico/mediano/grande alcanza para ver el patrón real.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Hora</label>
                <input
                  type="time"
                  value={form.hora}
                  onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Líquido que tomaste antes (opcional)</label>
                <input
                  type="text"
                  placeholder="ej: café, agua, mate"
                  value={form.liquido}
                  onChange={(e) => setForm((f) => ({ ...f, liquido: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-foreground mb-2">Volumen aproximado</label>
              <div className="flex gap-2">
                {(["chico", "mediano", "grande"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, volumen: v }))}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      form.volumen === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground hover:border-primary/40"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-foreground mb-2">
                Nivel de urgencia sentida (1 = nada urgente, 5 = no podías esperar)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm((f) => ({ ...f, urgencia: n }))}
                    className={`w-10 h-10 rounded-lg border text-sm font-bold transition-colors ${
                      form.urgencia === n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground hover:border-primary/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.perdida}
                onChange={(e) => setForm((f) => ({ ...f, perdida: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Hubo pérdida antes de llegar al baño</span>
            </label>

            <Button onClick={addEntry} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Agregar registro
            </Button>

            {state.entries.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-foreground mb-3">Tus registros ({state.entries.length})</p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {state.entries.map((e) => (
                    <div key={e.id} className="flex items-center justify-between bg-background rounded-lg border border-border p-3">
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">{e.hora}</span>
                        <span className="text-muted-foreground"> · {e.volumen} · urgencia {e.urgencia}/5{e.perdida ? " · con pérdida" : ""}{e.liquido ? ` · ${e.liquido}` : ""}</span>
                      </div>
                      <button onClick={() => removeEntry(e.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button onClick={downloadDiary} variant="outline" className="mt-4 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Descargar diario
                </Button>
              </div>
            )}
          </Card>

          {/* Timed voiding plan */}
          {stats && suggestedSchedule && (
            <Card className="p-6 md:p-8 mb-8 border-2 border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Paso 2: Tu plan de vaciado programado</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Hoy tu intervalo promedio entre micciones es de <strong className="text-foreground">{stats.avgIntervalMin} minutos</strong>.
                El objetivo del bladder training es alargarlo gradualmente — de a 15 a 30 minutos por
                vez — hasta llegar a un intervalo cómodo de 3 a 4 horas. No se trata de aguantar hasta
                el dolor, sino de ir corriendo el límite de a poco.
              </p>
              <div className="space-y-3">
                {suggestedSchedule.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-background rounded-lg border border-border p-4">
                    <span className="text-sm font-semibold text-foreground">{s.semana}</span>
                    <span className="text-sm text-primary font-bold">Meta: cada {s.intervalo} min</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3 bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Si en una semana no llegás a la meta, quedate un poco más en el intervalo actual —
                  no hay apuro. La evidencia muestra mejoras significativas en la frecuencia y la
                  urgencia dentro de las primeras 4 a 6 semanas para la mayoría de las personas.
                </p>
              </div>
            </Card>
          )}

          {!stats && (
            <Card className="p-6 mb-8 bg-muted/40 border-dashed border-2 border-border">
              <p className="text-sm text-muted-foreground text-center">
                Cargá al menos 2 registros en el diario para que te generemos tu plan de vaciado
                programado.
              </p>
            </Card>
          )}

          {/* Urge suppression */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Paso 3: Técnicas para cuando llega la urgencia</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              La urgencia es una ola: sube, llega a un pico y baja sola en 1 a 2 minutos si no corrés
              al baño. Estas técnicas te ayudan a atravesar ese pico sin perder el control ni ceder al
              impulso de salir corriendo — lo que a largo plazo empeora la sensibilidad de la vejiga.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-l-primary pl-4">
                <p className="font-semibold text-foreground text-sm">Contracciones rápidas ("freeze and squeeze")</p>
                <p className="text-sm text-muted-foreground mt-1">Quedate quieta y hacé 3 a 5 contracciones rápidas del piso pélvico. Esto envía una señal al cerebro que inhibe la contracción de la vejiga.</p>
              </div>
              <div className="border-l-4 border-l-primary pl-4">
                <p className="font-semibold text-foreground text-sm">Respiración lenta</p>
                <p className="text-sm text-muted-foreground mt-1">Inhalá contando 4, exhalá contando 6. El sistema nervioso que controla la vejiga responde a la calma del cuerpo — respirar rápido y con ansiedad empeora la urgencia.</p>
              </div>
              <div className="border-l-4 border-l-primary pl-4">
                <p className="font-semibold text-foreground text-sm">Distracción mental activa</p>
                <p className="text-sm text-muted-foreground mt-1">Contá hacia atrás desde 100 de 7 en 7, o enfocate en una tarea concreta. Sacar la atención de la sensación reduce su intensidad.</p>
              </div>
              <div className="border-l-4 border-l-primary pl-4">
                <p className="font-semibold text-foreground text-sm">Quedate quieta, no corras</p>
                <p className="text-sm text-muted-foreground mt-1">Correr o tensar el cuerpo aumenta la presión abdominal y empeora la urgencia. Parate firme, respirá, contraé, y recién ahí caminá con calma al baño.</p>
              </div>
            </div>
          </Card>

          {/* Irritants */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-bold text-foreground">Irritantes vesicales a tener en cuenta</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              No hace falta eliminar todo de golpe — la reacción a cada uno es individual. Usá tu
              diario para ver si alguno de estos coincide con tus episodios de mayor urgencia.
            </p>
            <div className="space-y-3 mb-5">
              {IRRITANTS.map((item, idx) => (
                <div key={idx} className="bg-background rounded-lg border border-border p-4">
                  <p className="font-semibold text-foreground text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.why}</p>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                ¿Notaste algún patrón propio? Anotalo acá
              </label>
              <textarea
                value={state.irritantesNotados}
                onChange={(e) => persist({ ...state, irritantesNotados: e.target.value })}
                placeholder="ej: siempre que tomo mate a la tarde, tengo más urgencia a la noche"
                className="w-full min-h-24 px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </Card>

          {/* Expectations */}
          <Card className="p-6 bg-accent/5 border-accent">
            <p className="text-sm text-foreground leading-relaxed">
              <strong>Expectativa realista:</strong> este protocolo apunta específicamente a la
              urgencia y la frecuencia. Si tus pérdidas son sobre todo al toser, reír o hacer
              esfuerzo, el trabajo de fuerza del programa base sigue siendo tu herramienta principal
              — muchas mujeres combinan ambos porque tienen un poco de los dos tipos.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PersonalizedActionProtocol() {
  return (
    <AccessGate tier="premium">
      <PersonalizedActionProtocolContent />
    </AccessGate>
  );
}
