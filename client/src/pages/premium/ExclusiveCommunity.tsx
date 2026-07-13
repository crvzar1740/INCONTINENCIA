import { Card } from "@/components/ui/card";
import { AccessGate } from "@/components/AccessGate";
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Stethoscope,
  Heart,
  ShieldAlert,
  Plus,
  Trash2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const STORAGE_KEY = "suelo-firme-premium-support-guide";

interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  text: string;
}

const JOURNAL_PROMPTS = [
  "¿Qué logré esta semana que hace un mes me daba miedo intentar?",
  "¿Qué pensamiento sobre mi cuerpo quiero dejar de repetirme?",
  "¿A quién podría contarle cómo me siento con esto, aunque sea a una persona?",
  "¿Qué le diría a otra mujer que está empezando este mismo camino?",
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function ExclusiveCommunityContent() {
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [prompt, setPrompt] = useState(JOURNAL_PROMPTS[0]);
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  const persist = (next: JournalEntry[]) => {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addEntry = () => {
    if (!text.trim()) {
      toast.error("Escribí algo antes de guardar");
      return;
    }
    const entry: JournalEntry = {
      id: genId(),
      date: new Date().toLocaleDateString("es-ES"),
      prompt,
      text,
    };
    persist([entry, ...entries]);
    setText("");
    toast.success("✓ Guardado en tu espacio privado");
  };

  const removeEntry = (id: string) => {
    persist(entries.filter((e) => e.id !== id));
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
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Guía de Comunicación y Red de Apoyo
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Todavía estamos armando el foro comunitario de Suelo Firme, así que preferimos no
              simular una comunidad que no existe todavía. Mientras tanto, esto es lo que sí podemos
              darte hoy: por qué el apoyo social importa, cómo hablarlo con las personas de tu
              entorno, dónde encontrar comunidades reales y confiables, y un espacio privado propio
              para poner en palabras cómo estás llevando este proceso.
            </p>
          </div>

          {/* Why it matters */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Por qué el apoyo social importa tanto como el físico</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La investigación sobre calidad de vida en incontinencia encontró algo llamativo: la
              forma en que una persona logra sobrellevar el impacto de los síntomas en su día a día
              pesa tanto o más que la severidad misma de las pérdidas. El aislamiento y el silencio
              empeoran esa carga; hablarlo con la pareja, la familia o amigas cercanas la alivia de
              forma medible. No es un detalle emocional aparte del tratamiento — es parte del
              tratamiento.
            </p>
          </Card>

          {/* Talking to partner/friends */}
          <Card className="p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Cómo hablarlo con tu entorno cercano</h2>
            <div className="space-y-5">
              <div>
                <p className="font-semibold text-foreground text-sm mb-2">Con tu pareja</p>
                <div className="bg-background rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "Quiero contarte algo que me está pasando desde el parto — a veces pierdo orina
                    sin querer. Estoy trabajando en mejorarlo, pero necesito que lo sepas para no
                    sentir que tengo que ocultarlo todo el tiempo."
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-2">Con una amiga cercana</p>
                <div className="bg-background rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "¿Te puedo contar algo? Desde que fui mamá tengo pérdidas de orina en ciertas
                    situaciones. Es más común de lo que pensás, pero a veces me hace evitar planes.
                    Quería que lo supieras por si alguna vez necesito ir al baño antes de lo normal."
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-2">Con tu médico o kinesiólogo</p>
                <div className="bg-background rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "Tengo pérdidas de orina desde [momento]. Pasa sobre todo cuando [toso / me río /
                    siento urgencia repentina], con una frecuencia de [x veces por semana]. Ya probé
                    [ejercicios / productos] con [resultado]. ¿Qué evaluación me recomendás para
                    entender mejor qué tipo de incontinencia es?"
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Finding real communities */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-bold text-foreground">Cómo encontrar comunidades reales y confiables</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Existen espacios genuinos de apoyo mientras el foro de Suelo Firme está en desarrollo.
              Para evaluar si un grupo o comunidad online es confiable, fijate en esto:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Buscá espacios moderados por profesionales</strong> (kinesiólogos de piso pélvico, asociaciones de continencia) antes que grupos genéricos sin moderación.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Desconfiá de "curas milagrosas"</strong> o testimonios que prometen resolución total en pocos días — la evidencia real habla de semanas de trabajo constante, no de atajos.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Priorizá grupos que remiten a profesionales</strong> cuando alguien describe señales de alarma, en vez de solo dar consejos entre pares para todo.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Buscá asociaciones de continencia o colegios de kinesiología de tu país</strong> — suelen tener directorios de profesionales especializados en piso pélvico y a veces grupos de apoyo presenciales.</p>
              </div>
            </div>
            <div className="mt-5 flex gap-3 bg-secondary/5 border border-secondary/20 rounded-lg p-4">
              <MessageCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cuando el foro privado de Suelo Firme esté disponible, vas a recibir un aviso directo
                por acá — preferimos avisarte cuando exista de verdad antes que simular actividad
                que todavía no tenemos.
              </p>
            </div>
          </Card>

          {/* Private journal */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-accent/20">
            <h2 className="text-xl font-bold text-foreground mb-2">Tu espacio privado de reflexión</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Esto no se publica ni se comparte con nadie — queda guardado únicamente en este
              dispositivo. A veces poner en palabras cómo vas llevando el proceso ayuda tanto como
              hablarlo con alguien más.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-foreground mb-2">Elegí una guía para escribir (opcional)</label>
              <div className="flex flex-wrap gap-2">
                {JOURNAL_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-colors ${
                      prompt === p ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground hover:border-primary/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribí lo que quieras acá..."
              className="w-full min-h-32 px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <Button onClick={addEntry} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Guardar en mi espacio
            </Button>

            {entries.length > 0 && (
              <div className="mt-8 space-y-3">
                <p className="text-sm font-semibold text-foreground">Tus entradas anteriores</p>
                {entries.map((e) => (
                  <div key={e.id} className="bg-background rounded-lg border border-border p-4 relative">
                    <button onClick={() => removeEntry(e.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-muted-foreground mb-1">{e.date}</p>
                    <p className="text-xs text-secondary font-medium mb-2 italic">{e.prompt}</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{e.text}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-muted/40 border-dashed border-2 border-border">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este espacio de reflexión se guarda solo en tu dispositivo — si cambiás de celular o
                borrás los datos del navegador, se pierde. No es un reemplazo de terapia ni de
                seguimiento profesional; es un complemento simple para procesar el proceso día a día.
              </p>
            </div>
          </Card>

          <Card className="mt-6 p-6 bg-destructive/5 border-destructive/30">
            <div className="flex gap-3">
              <ShieldAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">
                Si notás que la angustia por esto es constante, interfiere con tu sueño o tu ánimo en
                general, o te aísla de tu vida social de forma marcada, esa es una señal para hablarlo
                con un profesional de salud mental, además del trabajo físico. No es "hacer un
                problema de algo chico" — es cuidar una parte real de tu bienestar.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ExclusiveCommunity() {
  return (
    <AccessGate tier="premium">
      <ExclusiveCommunityContent />
    </AccessGate>
  );
}
