import { Card } from "@/components/ui/card";
import { AccessGate } from "@/components/AccessGate";
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Droplets,
  ShieldAlert,
  Calculator,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const STORAGE_KEY = "suelo-firme-premium-shopping-guide";

type Actividad = "poca" | "moderada" | "intensa" | null;
type Momento = "dia" | "noche" | "ejercicio" | null;
type Cantidad = "gotas" | "moderada" | "abundante" | null;

interface QuizAnswers {
  actividad: Actividad;
  momento: Momento;
  cantidad: Cantidad;
}

interface CalcState {
  precio: string;
  unidades: string;
  diasQueDuran: string;
}

interface StoredState {
  answers: QuizAnswers;
  calc: CalcState;
}

const DEFAULT_STATE: StoredState = {
  answers: { actividad: null, momento: null, cantidad: null },
  calc: { precio: "", unidades: "", diasQueDuran: "" },
};

function recommend(answers: QuizAnswers): { categoria: string; motivo: string }[] {
  const out: { categoria: string; motivo: string }[] = [];
  if (answers.cantidad === "gotas") {
    out.push({
      categoria: "Protector de absorción ligera",
      motivo: "Para pérdidas en gotas (al toser, reír o levantarte), un protector diseñado específicamente para orina — no un protector de ciclo menstrual — es suficiente y más cómodo.",
    });
  } else if (answers.cantidad === "moderada") {
    out.push({
      categoria: "Ropa interior o pants absorbentes de cintura alta",
      motivo: "Para un volumen moderado, la cobertura de cintura completa evita fugas laterales que un protector angosto no puede contener.",
    });
  } else if (answers.cantidad === "abundante") {
    out.push({
      categoria: "Protección de máxima absorción + evaluación profesional",
      motivo: "Un volumen abundante y frecuente merece protección de alta capacidad, pero también amerita una consulta — puede haber opciones (desde bladder training hasta un pesario) que reduzcan la necesidad de tanta protección.",
    });
  }
  if (answers.momento === "noche") {
    out.push({
      categoria: "Compresa nocturna de larga duración",
      motivo: "Buscá una con capa antideslizante en la base — de nada sirve la absorción si el producto se mueve mientras dormís.",
    });
  }
  if (answers.momento === "ejercicio" || answers.actividad === "intensa") {
    out.push({
      categoria: "Protección específica para actividad física",
      motivo: "Los productos pensados para movimiento están diseñados para no marcarse ni perder forma bajo ropa ajustada, a diferencia de un protector estándar.",
    });
  }
  return out;
}

function SmartShoppingChecklistContent() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<StoredState>(DEFAULT_STATE);

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

  const setAnswer = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    persist({ ...state, answers: { ...state.answers, [key]: value } });
  };

  const setCalc = (field: keyof CalcState, value: string) => {
    persist({ ...state, calc: { ...state.calc, [field]: value } });
  };

  const quizComplete = state.answers.actividad && state.answers.momento && state.answers.cantidad;
  const recommendations = quizComplete ? recommend(state.answers) : [];

  const precio = parseFloat(state.calc.precio.replace(",", "."));
  const unidades = parseFloat(state.calc.unidades.replace(",", "."));
  const dias = parseFloat(state.calc.diasQueDuran.replace(",", "."));
  const costoPorUso = !isNaN(precio) && !isNaN(unidades) && unidades > 0 ? precio / unidades : null;
  const costoPorDia = !isNaN(precio) && !isNaN(dias) && dias > 0 ? precio / dias : null;

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
              <ShoppingBag className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Guía de Decisión: Productos y Cuidado de la Piel
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              No es una lista de marcas ni de precios — esos cambian según el país y el momento. Es
              el criterio real para elegir cualquier producto que tengas enfrente, cuidar tu piel
              mientras lo usás, y entender qué otras opciones existen más allá de un protector.
            </p>
          </div>

          {/* Quiz */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">¿Por dónde empezar?</h2>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">¿Cuánta actividad física hacés por semana?</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: "poca", label: "Poca o ninguna" },
                    { v: "moderada", label: "Moderada" },
                    { v: "intensa", label: "Intensa / entreno seguido" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setAnswer("actividad", opt.v as Actividad)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        state.answers.actividad === opt.v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">¿Cuándo notás más pérdidas?</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: "dia", label: "Durante el día" },
                    { v: "noche", label: "De noche" },
                    { v: "ejercicio", label: "Durante el ejercicio" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setAnswer("momento", opt.v as Momento)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        state.answers.momento === opt.v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">¿Qué cantidad pierdes normalmente?</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: "gotas", label: "Gotas ocasionales" },
                    { v: "moderada", label: "Cantidad moderada" },
                    { v: "abundante", label: "Cantidad abundante" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setAnswer("cantidad", opt.v as Cantidad)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        state.answers.cantidad === opt.v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {quizComplete && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-3">Con base en tus respuestas, priorizá:</p>
                <div className="space-y-3">
                  {recommendations.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-primary/30">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{r.categoria}</p>
                        <p className="text-xs text-muted-foreground mt-1">{r.motivo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* How to evaluate any product */}
          <Card className="p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Cómo evaluar cualquier producto antes de comprarlo</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Ya sea que lo veas en una farmacia, un supermercado o una tienda online, hacete estas
              cinco preguntas antes de decidir:
            </p>
            <div className="space-y-4">
              {[
                {
                  q: "¿Está diseñado para orina o para flujo menstrual?",
                  a: "La orina tiene un pH distinto y se libera de forma más súbita. Un producto pensado para incontinencia absorbe más rápido y neutraliza mejor el olor que uno menstrual.",
                },
                {
                  q: "¿El material que toca la piel es transpirable?",
                  a: "Los materiales que no dejan pasar el aire retienen humedad contra la piel, lo que aumenta el riesgo de irritación con el uso prolongado — más relevante cuanto más horas lo uses seguido.",
                },
                {
                  q: "¿Tiene fragancia agregada?",
                  a: "Las fragancias son una causa frecuente de irritación en piel ya expuesta a humedad. Preferí siempre versiones sin perfume, aunque el aroma prometa \"frescura\".",
                },
                {
                  q: "¿Cómo es el cierre o la sujeción?",
                  a: "Un producto que se mueve pierde toda su capacidad de absorción, sin importar cuánto absorba en el papel. Para uso nocturno o deportivo, priorizá los que tienen base antideslizante o ajuste tipo ropa interior.",
                },
                {
                  q: "¿Cuánto cuesta por uso, no por paquete?",
                  a: "Un paquete más caro con más unidades suele salir más barato por uso. Usá la calculadora de abajo antes de decidir solo por el precio de tapa.",
                },
              ].map((item, idx) => (
                <div key={idx} className="border-l-4 border-l-primary/40 pl-4">
                  <p className="font-semibold text-foreground text-sm mb-1">{item.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Cost calculator */}
          <Card className="p-6 md:p-8 mb-8 border-2 border-accent/20">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-bold text-foreground">Calculadora de costo real</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Ingresá los datos de cualquier producto que estés considerando y compará opciones de
              forma justa.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Precio del paquete</label>
                <input
                  type="text"
                  placeholder="ej: 4500"
                  value={state.calc.precio}
                  onChange={(e) => setCalc("precio", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Unidades en el paquete</label>
                <input
                  type="text"
                  placeholder="ej: 20"
                  value={state.calc.unidades}
                  onChange={(e) => setCalc("unidades", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Días que te duran</label>
                <input
                  type="text"
                  placeholder="ej: 10"
                  value={state.calc.diasQueDuran}
                  onChange={(e) => setCalc("diasQueDuran", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            {(costoPorUso !== null || costoPorDia !== null) && (
              <div className="grid md:grid-cols-2 gap-4">
                {costoPorUso !== null && (
                  <div className="bg-background rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Costo por unidad</p>
                    <p className="text-2xl font-bold text-primary">{costoPorUso.toFixed(2)}</p>
                  </div>
                )}
                {costoPorDia !== null && (
                  <div className="bg-background rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Costo por día de uso</p>
                    <p className="text-2xl font-bold text-accent">{costoPorDia.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Skin care */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Cuidado de la piel</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              El contacto prolongado con humedad afecta la barrera natural de la piel y puede generar
              lo que se conoce como dermatitis asociada a incontinencia — enrojecimiento, ardor y en
              casos avanzados, pequeñas heridas. Se previene con una rutina simple:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-primary font-bold text-sm">1.</span>
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Limpiá</strong> la zona apenas puedas después de cada pérdida, con un producto sin jabón y pH neutro. Evitá frotar — secá con toques suaves.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold text-sm">2.</span>
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Protegé</strong> con una crema barrera antes de colocar el protector. Las de dimeticona (silicona) son las que menos interfieren con la absorción del producto; las de óxido de zinc son mejores si ya hay irritación.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold text-sm">3.</span>
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Evitá</strong> capas gruesas de vaselina o cremas muy densas — pueden tapar el producto absorbente y reducir su eficacia.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold text-sm">4.</span>
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Revisá</strong> la piel una vez por día. Si ves enrojecimiento que no mejora en 48 horas, ardor persistente o pequeñas heridas, es momento de consultar — puede necesitar un tratamiento específico, no solo más crema.</p>
              </div>
            </div>
          </Card>

          {/* Other conservative options */}
          <Card className="p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Más allá de los protectores: otras opciones conservadoras</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Los protectores manejan el síntoma. Estas opciones apuntan a la causa y tienen evidencia
              real detrás — pero todas requieren indicación o seguimiento profesional, no son
              productos para autoindicarse online.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-l-secondary pl-4">
                <p className="font-semibold text-foreground text-sm">Conos o pesas vaginales</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  Se insertan y se sostienen contrayendo el piso pélvico, aumentando el peso
                  gradualmente. Las revisiones de estudios controlados muestran que son mejores que no
                  hacer nada y tan efectivos como el entrenamiento muscular convencional — aunque
                  cerca de 1 de cada 5 mujeres los abandona por incomodidad. Es una alternativa válida
                  si preferís esta forma de entrenar antes que las contracciones voluntarias solas.
                </p>
              </div>
              <div className="border-l-4 border-l-secondary pl-4">
                <p className="font-semibold text-foreground text-sm">Biofeedback</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  Un dispositivo mide la contracción muscular en tiempo real y te da una señal visual
                  o sonora — útil para confirmar que estás contrayendo el músculo correcto, algo que
                  hasta un tercio de las mujeres no logra identificar por instrucción verbal sola.
                </p>
              </div>
              <div className="border-l-4 border-l-secondary pl-4">
                <p className="font-semibold text-foreground text-sm">Pesario</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  Un dispositivo de silicona que se coloca en la vagina para dar soporte estructural.
                  Requiere que un profesional lo ajuste a tu anatomía — no es algo que se compre
                  genérico. Puede ser una gran opción si hay además sensación de peso o descenso de
                  órganos pélvicos.
                </p>
              </div>
            </div>
          </Card>

          {/* Red flags */}
          <Card className="p-6 bg-destructive/5 border-destructive/30">
            <div className="flex gap-3">
              <ShieldAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">
                <strong>Cuando un producto ya no alcanza:</strong> si necesitás cambiar de protector
                cada hora, si la cantidad de pérdida va en aumento, o si sentís peso o bulto vaginal
                además de las pérdidas, no es momento de buscar un producto más absorbente — es
                momento de una consulta con un kinesiólogo de piso pélvico o uroginecólogo para
                evaluar otras alternativas.
              </p>
            </div>
          </Card>

          <div className="mt-6 flex gap-3 bg-muted/60 rounded-lg p-4">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Esta guía no recomienda marcas específicas porque la disponibilidad y el precio varían
              mucho según el país y cambian con el tiempo. El objetivo es que puedas evaluar con
              criterio cualquier producto que tengas al alcance, hoy y en el futuro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SmartShoppingChecklist() {
  return (
    <AccessGate tier="premium">
      <SmartShoppingChecklistContent />
    </AccessGate>
  );
}
