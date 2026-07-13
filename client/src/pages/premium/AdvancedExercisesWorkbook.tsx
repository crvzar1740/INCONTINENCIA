import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AccessGate } from "@/components/AccessGate";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Info,
  Ruler,
  Wind,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const STORAGE_KEY = "suelo-firme-premium-impact-protocol";

interface BlockExercise {
  id: string;
  name: string;
  detail: string;
  dose: string;
}

interface Block {
  id: number;
  weeks: string;
  title: string;
  goal: string;
  exercises: BlockExercise[];
}

const BLOCKS: Block[] = [
  {
    id: 1,
    weeks: "Semanas 1-2",
    title: "Base funcional",
    goal:
      "Trasladar la contracción que ya dominás en el programa base a posiciones de pie y con carga liviana — sentadillas, subir a un escalón — coordinando siempre la contracción con la exhalación.",
    exercises: [
      {
        id: "sentadilla-peso-corporal",
        name: "Sentadilla con coordinación respiratoria",
        detail:
          "Bajás inhalando (relajás el piso pélvico), subís exhalando mientras contraés — el mismo patrón de \"anticipación\" que ya usás para toser, aplicado a un movimiento de fuerza real.",
        dose: "3 series de 10",
      },
      {
        id: "step-up",
        name: "Subida a escalón",
        detail:
          "Un pie sube al escalón, exhalás y contraés al empujar hacia arriba. Simulá el gesto de subir escaleras con upa, sin apurarte.",
        dose: "3 series de 8 por pierna",
      },
    ],
  },
  {
    id: 2,
    weeks: "Semanas 3-4",
    title: "Carga funcional",
    goal:
      "Sumar el tipo de carga que manejás en la vida real (bolsas, upa, mochila) mientras sostenés la técnica — es donde más mujeres pierden el control, porque nunca entrenaron con peso.",
    exercises: [
      {
        id: "peso-muerto-carga",
        name: "Bisagra de cadera con carga liviana",
        detail:
          "Sostené algo con peso moderado (una bolsa con 2-3kg, una mochila) y practicá el movimiento de levantar algo del piso activando el piso pélvico un segundo antes de la fuerza — no durante.",
        dose: "3 series de 8",
      },
      {
        id: "unilateral",
        name: "Trabajo a una pierna",
        detail:
          "Apoyo en un solo pie (sentadilla búlgara o balance con leve flexión de rodilla). Entrena la estabilidad que necesitás para correr, donde el cuerpo pasa todo el tiempo en apoyo unipodal.",
        dose: "3 series de 8 por pierna",
      },
    ],
  },
  {
    id: 3,
    weeks: "Semanas 5-6",
    title: "Preparación de impacto",
    goal:
      "Introducir impacto controlado y de baja intensidad antes de saltar a correr. El objetivo es que el piso pélvico aprenda a absorber la carga repetitiva, no solo la fuerza puntual.",
    exercises: [
      {
        id: "marcha-elevada",
        name: "Marcha con elevación de rodilla",
        detail: "En el lugar, elevando rodillas a la cadera, ritmo sostenido, sin perder la contracción de base.",
        dose: "3 series de 30 segundos",
      },
      {
        id: "mini-salto",
        name: "Mini-saltos con talones al piso",
        detail:
          "Saltos muy pequeños, casi un rebote, sin despegar mucho del piso. Si notás pérdida, peso o dolor, quedate en la marcha elevada una semana más.",
        dose: "3 series de 10",
      },
    ],
  },
  {
    id: 4,
    weeks: "Semanas 7-8",
    title: "Impacto real",
    goal:
      "Reintroducir el movimiento que motivó todo esto: correr, saltar, reírte sin miedo. Avanzás acá solo si aprobaste el test de disposición de más abajo.",
    exercises: [
      {
        id: "trote-lugar",
        name: "Trote suave en el lugar",
        detail: "Ritmo cómodo, respiración fluida, sin apretar la mandíbula ni contener el aire.",
        dose: "3 series de 1 minuto",
      },
      {
        id: "soga-liviana",
        name: "Salto de soga liviano (o simulado)",
        detail: "Saltos bajos y controlados. Parás apenas sientas fatiga en la técnica, no cuando duela.",
        dose: "3 series de 20 saltos",
      },
    ],
  },
];

const READINESS_ITEMS = [
  {
    id: "fuerza-rapida",
    group: "Fuerza de base",
    label: "Podés hacer 10 contracciones rápidas de pie sin perder la técnica",
  },
  {
    id: "fuerza-sostenida",
    group: "Fuerza de base",
    label: "Podés sostener 8-12 contracciones de 6 a 8 segundos cada una",
  },
  {
    id: "fuerza-resistencia",
    group: "Fuerza de base",
    label: "Podés sostener una contracción submáxima (30-50% de esfuerzo) durante 60 segundos",
  },
  {
    id: "func-sentadilla",
    group: "Funcional",
    label: "Sentadilla a una pierna x10 por lado, sin dolor ni compensaciones evidentes",
  },
  {
    id: "func-salto",
    group: "Funcional",
    label: "Saltar en el lugar x10 sin pérdida de orina ni sensación de peso",
  },
  {
    id: "func-trote",
    group: "Funcional",
    label: "Trotar en el lugar 1 minuto sin síntomas durante ni después",
  },
  {
    id: "sintoma-dolor",
    group: "Síntomas",
    label: "No sentís dolor pélvico, lumbar ni abdominal con estos movimientos",
  },
  {
    id: "sintoma-perdida",
    group: "Síntomas",
    label: "No hay pérdida de orina durante ni en las horas siguientes al esfuerzo",
  },
  {
    id: "sintoma-peso",
    group: "Síntomas",
    label: "No sentís peso, arrastre o bulto en la vagina durante ni después del esfuerzo",
  },
];

interface StoredState {
  completed: Record<string, boolean>;
  readiness: Record<string, boolean>;
  diastasis: { above: string; at: string; below: string; doming: boolean; checked: boolean };
}

const DEFAULT_STATE: StoredState = {
  completed: {},
  readiness: {},
  diastasis: { above: "", at: "", below: "", doming: false, checked: false },
};

function AdvancedExercisesWorkbookContent() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<StoredState>(DEFAULT_STATE);
  const [activeBlock, setActiveBlock] = useState(1);

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

  const toggleExercise = (id: string) => {
    const next = { ...state, completed: { ...state.completed, [id]: !state.completed[id] } };
    persist(next);
  };

  const toggleReadiness = (id: string) => {
    const next = { ...state, readiness: { ...state.readiness, [id]: !state.readiness[id] } };
    persist(next);
  };

  const updateDiastasis = (field: keyof StoredState["diastasis"], value: string | boolean) => {
    persist({ ...state, diastasis: { ...state.diastasis, [field]: value } });
  };

  const saveDiastasisCheck = () => {
    persist({ ...state, diastasis: { ...state.diastasis, checked: true } });
    toast.success("✓ Registro guardado");
  };

  const block = BLOCKS.find((b) => b.id === activeBlock)!;
  const totalExercises = BLOCKS.reduce((acc, b) => acc + b.exercises.length, 0);
  const totalCompleted = Object.values(state.completed).filter(Boolean).length;

  const readinessGroups = Array.from(new Set(READINESS_ITEMS.map((i) => i.group)));
  const readinessTotal = READINESS_ITEMS.length;
  const readinessChecked = Object.values(state.readiness).filter(Boolean).length;
  const isReady = readinessChecked === readinessTotal;

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
              <Activity className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Protocolo de Retorno al Impacto
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tu programa base te enseñó a activar el piso pélvico. Este protocolo es el puente hacia
              lo que realmente querés recuperar: correr, saltar con tus hijos, volver a la clase de
              baile o al gimnasio sin calcular cada movimiento. Está basado en los criterios que usan
              los kinesiólogos de piso pélvico para evaluar si un cuerpo está listo para volver al
              impacto (guías de Goom, Donnelly y Brockwell, reforzadas por el consenso internacional
              Delphi de 2024).
            </p>
          </div>

          {/* Diastasis check */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Chequeo de diástasis abdominal</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Antes de sumar carga, vale la pena saber en qué estado está la línea media de tu
              abdomen. La diástasis (separación de los rectos abdominales) es muy común después del
              parto y en la mayoría de los casos mejora con ejercicio bien dosificado — la evidencia
              muestra reducciones significativas de la separación con programas de fortalecimiento
              del core, sin necesidad de evitar el ejercicio abdominal por completo.
            </p>
            <div className="bg-background rounded-lg border border-border p-5 mb-5">
              <p className="text-sm font-semibold text-foreground mb-3">Cómo hacerlo:</p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Acostate boca arriba, rodillas flexionadas, pies apoyados.</li>
                <li>Levantá apenas la cabeza y los hombros del piso, como si iniciaras un abdominal.</li>
                <li>
                  Con los dedos horizontales, palpá la línea media del abdomen a la altura del
                  ombligo, dos dedos arriba y dos dedos abajo. Contá cuántos dedos entran en el hueco.
                </li>
                <li>Notá también si hay abultamiento (doming) en la línea media al levantar la cabeza.</li>
              </ol>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Arriba del ombligo</label>
                <input
                  type="text"
                  placeholder="ej: 2 dedos"
                  value={state.diastasis.above}
                  onChange={(e) => updateDiastasis("above", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">En el ombligo</label>
                <input
                  type="text"
                  placeholder="ej: 3 dedos"
                  value={state.diastasis.at}
                  onChange={(e) => updateDiastasis("at", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Abajo del ombligo</label>
                <input
                  type="text"
                  placeholder="ej: 1 dedo"
                  value={state.diastasis.below}
                  onChange={(e) => updateDiastasis("below", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={state.diastasis.doming}
                onChange={(e) => updateDiastasis("doming", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Noto abultamiento en la línea media al levantar la cabeza</span>
            </label>
            <Button onClick={saveDiastasisCheck} variant="outline" className="mb-4">
              Guardar registro
            </Button>
            <div className="rounded-lg border-l-4 border-l-secondary bg-secondary/5 p-4 flex gap-3">
              <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Una separación de más de 2 dedos de ancho, o abultamiento marcado, no es una
                urgencia — pero sí es una buena razón para sumar una consulta con un kinesiólogo de
                piso pélvico antes de avanzar a los bloques de impacto. No es un diagnóstico, es una
                referencia para saber con quién conviene chequear antes de cargar más.
              </p>
            </div>
          </Card>

          {/* Breathing */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-bold text-foreground">Respiración y activación en 360°</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              El diafragma y el piso pélvico trabajan como un sistema: cuando inhalás, el diafragma
              baja y el piso pélvico se relaja levemente; cuando exhalás, el diafragma sube y el piso
              pélvico puede contraerse. Coordinar esto es la base de cualquier movimiento con carga —
              sentadillas, levantar a upa, correr.
            </p>
            <div className="bg-background rounded-lg border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-2">Practicalo así antes de cada bloque:</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sentada o de pie, apoyá una mano en las costillas bajas y otra en el abdomen. Inhalá
                por la nariz sintiendo que las costillas se expanden hacia los costados (no solo el
                pecho sube). Exhalá de a poco por la boca, contrayendo el piso pélvico hacia arriba y
                adentro en el último tercio de la exhalación. Repetí 8 a 10 veces antes de empezar
                cualquier ejercicio con carga — es lo que después vas a usar automáticamente en cada
                sentadilla o salto.
              </p>
            </div>
          </Card>

          {/* Progressive program */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground mb-2">Programa de 8 semanas</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Avanzá de bloque solo cuando completes el anterior sin dolor ni pérdidas. No hay
              problema en quedarte 2-3 semanas en el mismo bloque si lo necesitás.
            </p>
          </div>

          <Card className="p-4 mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Progreso general</span>
              <span className="text-sm text-muted-foreground">{totalCompleted}/{totalExercises} ejercicios</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
                style={{ width: `${(totalCompleted / totalExercises) * 100}%` }}
              />
            </div>
          </Card>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {BLOCKS.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBlock(b.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border text-left transition-colors ${
                  activeBlock === b.id ? "border-primary bg-primary/10" : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <p className={`text-xs font-semibold mb-0.5 ${activeBlock === b.id ? "text-primary" : "text-muted-foreground"}`}>
                  {b.weeks}
                </p>
                <p className="font-bold text-foreground text-sm">{b.title}</p>
              </button>
            ))}
          </div>

          <Card className="p-5 mb-6 border-l-4 border-l-secondary bg-secondary/5">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{block.goal}</p>
            </div>
          </Card>

          <div className="space-y-4 mb-10">
            {block.exercises.map((ex) => {
              const isDone = !!state.completed[ex.id];
              return (
                <Card key={ex.id} className={`p-6 border-l-4 ${isDone ? "border-l-primary bg-primary/5" : "border-l-border"}`}>
                  <button className="w-full text-left flex items-start gap-3" onClick={() => toggleExercise(ex.id)}>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{ex.name}</h3>
                      <p className="text-xs text-secondary font-semibold mt-1">{ex.dose}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{ex.detail}</p>
                    </div>
                  </button>
                </Card>
              );
            })}
          </div>

          {/* Readiness screen */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-primary">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Test de disposición para el impacto</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Antes de correr, saltar en serio o volver a una clase de alto impacto, revisá esta
              lista. Son los mismos criterios que se usan clínicamente para evaluar si el cuerpo está
              listo para volver a correr después del parto — no hace falta un plazo fijo de semanas,
              lo que importa es cumplir estos puntos.
            </p>
            <div className="space-y-6">
              {readinessGroups.map((group) => (
                <div key={group}>
                  <p className="text-sm font-bold text-foreground mb-3">{group}</p>
                  <div className="space-y-2">
                    {READINESS_ITEMS.filter((i) => i.group === group).map((item) => {
                      const checked = !!state.readiness[item.id];
                      return (
                        <label
                          key={item.id}
                          className="flex items-start gap-3 bg-background rounded-lg border border-border p-3 cursor-pointer hover:border-primary/40"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleReadiness(item.id)}
                            className="w-5 h-5 mt-0.5"
                          />
                          <span className="text-sm text-foreground leading-relaxed">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Criterios cumplidos</span>
                <span className="text-sm text-muted-foreground">{readinessChecked}/{readinessTotal}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-4">
                <div
                  className={`h-full transition-all duration-300 ${isReady ? "bg-primary" : "bg-accent"}`}
                  style={{ width: `${(readinessChecked / readinessTotal) * 100}%` }}
                />
              </div>
              {isReady ? (
                <div className="flex gap-3 bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">
                    Cumplís los criterios. Podés reintroducir el impacto de forma gradual — arrancá
                    con trotes cortos o clases de bajo impacto e ité subiendo la intensidad semana a
                    semana, prestando atención a los síntomas.
                  </p>
                </div>
              ) : (
                <div className="flex gap-3 bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">
                    Todavía te faltan algunos criterios — no es un retroceso, es información útil.
                    Seguí trabajando en los bloques anteriores hasta poder marcar todos los puntos.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Safety */}
          <Card className="p-6 bg-destructive/5 border-destructive/30">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">
                <strong>Detenete y consultá con un profesional</strong> si notás dolor pélvico o
                lumbar que no cede, una sensación de peso o bulto en la vagina que aparece o empeora
                con el esfuerzo, o si las pérdidas de orina aumentan en vez de mejorar a medida que
                avanzás. Ninguno de estos son motivo de alarma inmediata, pero sí señales de que
                conviene una evaluación de piso pélvico antes de seguir sumando carga.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdvancedExercisesWorkbook() {
  return (
    <AccessGate tier="premium">
      <AdvancedExercisesWorkbookContent />
    </AccessGate>
  );
}
