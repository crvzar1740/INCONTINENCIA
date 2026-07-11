import { ArrowLeft, ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const STORAGE_KEY = "suelo-firme-lecciones";

interface Lesson {
  id: number;
  title: string;
  emoji: string;
  subtitle: string;
  cards: { title: string; body: string }[];
  question: { text: string; options: string[]; correctIndex: number; funFact: string };
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Irritantes vesicales",
    emoji: "☕",
    subtitle: "Nutrición y vejiga",
    cards: [
      {
        title: "Algunos líquidos irritan la vejiga",
        body: "La cafeína —café, té, mate, gaseosas cola— es el irritante más respaldado por evidencia. Actúa como diurético Y estimula directamente la vejiga. No significa que tengas que dejarlo, sino entender cómo te afecta.",
      },
      {
        title: "El alcohol también suma",
        body: "Reduce la hormona que le dice al riñón que retenga agua. Doble efecto: más orina producida Y vejiga más sensible. Identificarlo en tu diario te ayuda a ver el patrón personal.",
      },
      {
        title: "Carbonatadas y cítricos",
        body: "El gas puede irritar la mucosa vesical, incluso en versiones sin cafeína. Los cítricos y el tomate pueden empeorar síntomas en personas sensibles por su acidez.",
      },
      {
        title: "La estrategia no es eliminar todo",
        body: "La reacción a cada irritante es muy individual. Usá tu diario para ver si alguno coincide con tus episodios de mayor urgencia — ahí está la información real.",
      },
    ],
    question: {
      text: "¿Cuál es el irritante vesical con más respaldo científico?",
      options: ["Agua con gas", "Cafeína", "Jugo de naranja", "Pimienta"],
      correctIndex: 1,
      funFact: "La cafeína estimula los receptores de la vejiga de forma directa además de actuar como diurético. Las guías EAU 2026 la mencionan como el irritante más documentado.",
    },
  },
  {
    id: 2,
    title: "Hidratación correcta",
    emoji: "💧",
    subtitle: "El mito del 'tomar menos'",
    cards: [
      {
        title: "Tomar menos agua NO ayuda",
        body: "Es uno de los mitos más comunes. Al restringir líquidos, la orina se concentra y se vuelve más irritante para la vejiga — lo que empeora la urgencia y la frecuencia.",
      },
      {
        title: "¿Cuánto agua es adecuada?",
        body: "Las guías clínicas recomiendan entre 1.5 y 2 litros de agua por día para la mayoría de las personas. Si notás que tomás mucho más, reducir levemente puede ayudar — pero no por debajo de 1.5 L.",
      },
      {
        title: "Distribuir a lo largo del día",
        body: "Tomar mucho de golpe llena la vejiga rápidamente. Distribuir la ingesta en pequeñas cantidades durante el día es más amigable con la vejiga.",
      },
      {
        title: "Reducir en la noche",
        body: "Si la frecuencia nocturna es un problema, podés reducir la ingesta de líquidos 2-3 horas antes de dormir. Hidratarte bien durante el día y menos en la tarde-noche.",
      },
    ],
    question: {
      text: "¿Qué pasa cuando tomás muy poca agua?",
      options: [
        "La vejiga se irrita menos",
        "La orina se concentra y puede irritar más la vejiga",
        "La urgencia desaparece",
        "El piso pélvico se fortalece solo",
      ],
      correctIndex: 1,
      funFact: "La orina concentrada tiene mayor osmolaridad y activa los receptores de la vejiga de forma más intensa. Las guías recomiendan NO restringir líquidos como tratamiento.",
    },
  },
  {
    id: 3,
    title: "Manejar la urgencia",
    emoji: "🌊",
    subtitle: "La urgencia es una ola",
    cards: [
      {
        title: "La urgencia sube y baja sola",
        body: "La urgencia es una ola: sube, llega a un pico y baja sola en 1 a 2 minutos si no corrés al baño. El problema es que si siempre corres, nunca entrenás la vejiga a esperar.",
      },
      {
        title: "Freeze and squeeze",
        body: "Quedate quieta y hacé 3 a 5 contracciones rápidas del piso pélvico. Esto envía una señal al cerebro que inhibe la contracción de la vejiga. Es la técnica con más evidencia para la urgencia aguda.",
      },
      {
        title: "Respiración lenta",
        body: "Inhalá contando 4, exhalá contando 6. El sistema nervioso que controla la vejiga responde a la calma del cuerpo. Respirar rápido y con ansiedad empeora la urgencia.",
      },
      {
        title: "Quedate quieta, no corras",
        body: "Correr o tensar el cuerpo aumenta la presión abdominal y empeora la urgencia. Parate firme, respirá, contraé el piso pélvico, y recién ahí caminá con calma al baño.",
      },
    ],
    question: {
      text: "¿Qué técnica ayuda más en el momento de urgencia aguda?",
      options: [
        "Correr al baño lo más rápido posible",
        "Tomar mucha agua",
        "Contracciones rápidas del piso pélvico",
        "Cruzar las piernas y esperar",
      ],
      correctIndex: 2,
      funFact: "Esta técnica se llama 'freeze and squeeze' en las guías clínicas. Las contracciones rápidas del piso pélvico activan un reflejo inhibitorio sobre la vejiga.",
    },
  },
  {
    id: 4,
    title: "Mitos vs. realidad",
    emoji: "🔍",
    subtitle: "Lo que te dijeron vs. lo que es real",
    cards: [
      {
        title: "MITO: 'Es normal después de tener hijos'",
        body: "FALSO. Es común —muchas mujeres lo viven— pero no es algo que deba aceptarse como definitivo. La incontinencia urinaria tiene tratamientos efectivos bien documentados. Común ≠ normal.",
      },
      {
        title: "MITO: 'Si no mejora con Kegel, no hay solución'",
        body: "FALSO. El PFMT (entrenamiento de piso pélvico) es primera línea, pero hay múltiples estrategias: bladder training, modificación de hábitos, fisioterapia especializada, y opciones médicas si hace falta.",
      },
      {
        title: "MITO: 'La incontinencia solo le pasa a personas mayores'",
        body: "FALSO. Afecta a mujeres de todas las edades — postparto, perimenopausia, jóvenes atletas. En algunos estudios, más del 30% de mujeres menores de 45 reportan algún grado de pérdida.",
      },
      {
        title: "REALIDAD: Se puede mejorar significativamente",
        body: "Más del 65% de las usuarias de programas de entrenamiento de piso pélvico basados en evidencia reportan mejoras significativas en semanas. Requiere constancia, pero los resultados son reales.",
      },
    ],
    question: {
      text: "¿Cuál de estas afirmaciones es VERDADERA?",
      options: [
        "La incontinencia es inevitable con la edad",
        "Solo el ejercicio Kegel puede solucionar la incontinencia",
        "La incontinencia es tratable con alta tasa de éxito",
        "Tomar menos agua siempre ayuda",
      ],
      correctIndex: 2,
      funFact: "Las guías EAU 2026 clasifican el PFMT como tratamiento de primera línea con nivel de evidencia A para la incontinencia urinaria de esfuerzo y mixta.",
    },
  },
  {
    id: 5,
    title: "Piso pélvico y deporte",
    emoji: "🏃‍♀️",
    subtitle: "Sin abandonar el gimnasio",
    cards: [
      {
        title: "No tenés que dejar de moverte",
        body: "La inactividad física empeora la condición general y el peso corporal puede aumentar la presión sobre el piso pélvico. El objetivo es adaptar el ejercicio, no eliminarlo.",
      },
      {
        title: "Impacto alto durante el entrenamiento",
        body: "Saltar, correr y levantar peso generan alta presión intraabdominal. Si hay pérdidas durante estas actividades, la estrategia es progresar gradualmente y usar la técnica de anticipación (contraer antes del impacto).",
      },
      {
        title: "La técnica de anticipación ('the knack')",
        body: "Contraé el piso pélvico un segundo ANTES de toser, estornudar, saltar o levantar algo pesado — no durante, antes. Es una de las técnicas con más respaldo clínico para pérdidas de esfuerzo.",
      },
      {
        title: "Ejercicios de bajo impacto como puente",
        body: "Natación, ciclismo, yoga, pilates de suelo — son amigables con el piso pélvico mientras se progresa en el entrenamiento. Podés mantener tu vida activa con inteligencia.",
      },
    ],
    question: {
      text: "¿Cuándo debés contraer el piso pélvico para prevenir pérdidas?",
      options: [
        "Después de toser o saltar",
        "Un segundo antes del esfuerzo",
        "Durante el impacto",
        "Solo cuando sentís urgencia",
      ],
      correctIndex: 1,
      funFact: "La técnica 'the knack' fue estudiada por Miller et al. y redujo las pérdidas de esfuerzo en un 73% con solo unas semanas de práctica consciente.",
    },
  },
  {
    id: 6,
    title: "Cuándo ver a un profesional",
    emoji: "👩‍⚕️",
    subtitle: "El autocuidado tiene límites",
    cards: [
      {
        title: "Esta app es acompañamiento, no diagnóstico",
        body: "Todo lo que hacés aquí está basado en evidencia, pero no reemplaza una evaluación profesional. Un fisioterapeuta de piso pélvico puede ver cosas que ninguna app puede detectar.",
      },
      {
        title: "Señales para consultar ya",
        body: "Dolor durante la actividad sexual, dolor pélvico crónico, sensación de bulto o presión en la zona vaginal, pérdidas de orina con sangre, infecciones urinarias frecuentes. Estos síntomas requieren evaluación médica.",
      },
      {
        title: "Si no ves mejora en 4-6 semanas",
        body: "Si hacés los ejercicios con constancia y no notás cambios, puede haber causas específicas (hipertonía del piso pélvico, prolapso leve, etc.) que necesitan evaluación en persona.",
      },
      {
        title: "La fisioterapeuta de piso pélvico",
        body: "Es la profesional especializada en esta área. Puede hacer biofeedback, evaluación muscular real, y personalizar el tratamiento a tu situación específica. Muchas obras sociales y prepagas la cubren.",
      },
    ],
    question: {
      text: "¿Cuánto tiempo de constancia sin mejora justifica consultar un profesional?",
      options: ["1 semana", "4-6 semanas", "6 meses", "Solo si hay dolor"],
      correctIndex: 1,
      funFact: "Las guías clínicas recomiendan una revisión profesional si no hay respuesta al PFMT supervisado en 3 meses, y antes si hay síntomas de alarma.",
    },
  },
];

interface LessonState {
  completed: number[];
  unlockedUntil: number;
  lastUnlockDate: string;
}

export default function Lecciones() {
  const [, setLocation] = useLocation();
  const [lessonState, setLessonState] = useState<LessonState>({
    completed: [],
    unlockedUntil: 1,
    lastUnlockDate: "",
  });
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as LessonState;
        const today = new Date().toDateString();
        if (parsed.lastUnlockDate !== today && parsed.unlockedUntil < LESSONS.length) {
          const updated = { ...parsed, unlockedUntil: parsed.unlockedUntil + 1, lastUnlockDate: today };
          setLessonState(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } else {
          setLessonState(parsed);
        }
      } catch {
        const today = new Date().toDateString();
        const init = { completed: [], unlockedUntil: 1, lastUnlockDate: today };
        setLessonState(init);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      }
    } else {
      const today = new Date().toDateString();
      const init = { completed: [], unlockedUntil: 1, lastUnlockDate: today };
      setLessonState(init);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
    }
  }, []);

  const openLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCardIndex(0);
    setShowQuestion(false);
    setSelectedAnswer(null);
    setAnswerRevealed(false);
  };

  const nextCard = () => {
    if (cardIndex < activeLesson!.cards.length - 1) {
      setCardIndex((i) => i + 1);
    } else {
      setShowQuestion(true);
    }
  };

  const selectAnswer = (idx: number) => {
    if (answerRevealed) return;
    setSelectedAnswer(idx);
    setAnswerRevealed(true);
  };

  const completeLesson = () => {
    const id = activeLesson!.id;
    if (!lessonState.completed.includes(id)) {
      const updated = { ...lessonState, completed: [...lessonState.completed, id] };
      setLessonState(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setActiveLesson(null);
  };

  if (activeLesson) {
    const card = activeLesson.cards[cardIndex];
    const isCorrect = selectedAnswer === activeLesson.question.correctIndex;

    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#FAF7F2" }}>
        <nav
          className="sticky top-0 z-50 backdrop-blur-sm border-b"
          style={{ background: "#FAF7F2cc", borderColor: "#E5E0D8" }}
        >
          <div className="container py-4 flex items-center gap-4">
            <button
              onClick={() => setActiveLesson(null)}
              className="flex items-center gap-1 font-medium hover:opacity-70 transition-opacity"
              style={{ color: "#3D6B66" }}
            >
              <ArrowLeft className="w-5 h-5" />
              Salir
            </button>
            <div className="flex-1">
              <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "#E5E0D8" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    background: "#3D6B66",
                    width: showQuestion
                      ? "100%"
                      : `${((cardIndex + 1) / activeLesson.cards.length) * 80}%`,
                  }}
                />
              </div>
            </div>
            <span className="text-xs" style={{ color: "#6B6259" }}>
              {showQuestion ? "Pregunta" : `${cardIndex + 1}/${activeLesson.cards.length}`}
            </span>
          </div>
        </nav>

        <div className="flex-1 flex flex-col container max-w-lg py-8">
          {!showQuestion ? (
            <>
              <div className="text-5xl mb-6">{activeLesson.emoji}</div>
              <h2
                className="text-xl font-semibold mb-4 leading-snug"
                style={{ color: "#2B2420" }}
              >
                {card.title}
              </h2>
              <p
                className="text-base leading-relaxed flex-1"
                style={{ color: "#6B6259", lineHeight: 1.7 }}
              >
                {card.body}
              </p>
              <button
                onClick={nextCard}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl py-4 font-semibold text-base transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "#3D6B66", color: "#fff", minHeight: "56px" }}
              >
                {cardIndex < activeLesson.cards.length - 1 ? (
                  <>Siguiente <ChevronRight className="w-5 h-5" /></>
                ) : (
                  "Ir a la pregunta"
                )}
              </button>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">🤔</div>
              <p
                className="text-lg font-semibold mb-6 leading-snug"
                style={{ color: "#2B2420" }}
              >
                {activeLesson.question.text}
              </p>
              <div className="space-y-3 flex-1">
                {activeLesson.question.options.map((opt, idx) => {
                  let bg = "#fff";
                  let border = "#E5E0D8";
                  let color = "#2B2420";
                  if (answerRevealed) {
                    if (idx === activeLesson.question.correctIndex) {
                      bg = "#A9C6B830";
                      border = "#3D6B66";
                      color = "#3D6B66";
                    } else if (idx === selectedAnswer && !isCorrect) {
                      bg = "#E8C49A30";
                      border = "#9C5D52";
                      color = "#9C5D52";
                    }
                  } else if (idx === selectedAnswer) {
                    bg = "#3D6B6620";
                    border = "#3D6B66";
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(idx)}
                      className="w-full text-left rounded-xl px-5 py-4 text-sm font-medium transition-all"
                      style={{ background: bg, border: `2px solid ${border}`, color, minHeight: "56px" }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answerRevealed && (
                <div
                  className="mt-5 rounded-xl p-4 text-sm leading-relaxed"
                  style={{ background: isCorrect ? "#A9C6B830" : "#E8C49A30", border: `1px solid ${isCorrect ? "#A9C6B860" : "#E8C49A60"}` }}
                >
                  <p className="font-semibold mb-1" style={{ color: "#2B2420" }}>
                    {isCorrect ? "¡Ya lo sabías! 🌟" : "Dato nuevo para vos 💡"}
                  </p>
                  <p style={{ color: "#6B6259" }}>{activeLesson.question.funFact}</p>
                </div>
              )}

              {answerRevealed && (
                <button
                  onClick={completeLesson}
                  className="mt-5 w-full rounded-xl py-4 font-semibold text-base transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: "#3D6B66", color: "#fff", minHeight: "56px" }}
                >
                  Lección completada ✓
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  const streak = lessonState.completed.length;

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{ background: "#FAF7F2cc", borderColor: "#E5E0D8" }}
      >
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-1 font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#3D6B66" }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="flex-1 text-center font-semibold text-lg" style={{ color: "#2B2420" }}>
            Lecciones
          </div>
          <div className="w-16" />
        </div>
      </nav>

      <div className="container max-w-xl py-8">
        {/* Streak */}
        {streak > 0 && (
          <div
            className="rounded-xl p-4 mb-6 text-center text-sm"
            style={{ background: "#A9C6B830", border: "1px solid #A9C6B860", color: "#3D6B66" }}
          >
            <strong>{streak} {streak === 1 ? "lección" : "lecciones"} completadas.</strong>{" "}
            {streak >= 3 ? "Seguís aprendiendo sobre tu cuerpo. Sigamos." : "Seguís sumando."}
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "#2B2420" }}>
            Lecciones de 2 minutos
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#6B6259" }}>
            Hábitos pequeños que suman control real. Se desbloquea una nueva por día.
          </p>
        </div>

        <div className="space-y-3">
          {LESSONS.map((lesson) => {
            const isUnlocked = lesson.id <= lessonState.unlockedUntil;
            const isDone = lessonState.completed.includes(lesson.id);

            return (
              <button
                key={lesson.id}
                onClick={() => isUnlocked && openLesson(lesson)}
                disabled={!isUnlocked}
                className="w-full text-left rounded-xl px-5 py-4 flex items-center gap-4 transition-all"
                style={{
                  background: isDone ? "#A9C6B820" : "#fff",
                  border: isDone
                    ? "1px solid #A9C6B860"
                    : isUnlocked
                    ? "1px solid #E5E0D8"
                    : "1px solid #E5E0D830",
                  opacity: isUnlocked ? 1 : 0.5,
                  cursor: isUnlocked ? "pointer" : "default",
                }}
              >
                <span className="text-2xl w-10 text-center">{lesson.emoji}</span>
                <div className="flex-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: isDone ? "#3D6B66" : "#2B2420" }}
                  >
                    {lesson.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B6259" }}>
                    {lesson.subtitle}
                  </p>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#3D6B66" }} />
                ) : isUnlocked ? (
                  <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "#6B6259" }} />
                ) : (
                  <Lock className="w-4 h-4 flex-shrink-0" style={{ color: "#6B6259" }} />
                )}
              </button>
            );
          })}
        </div>

        <p
          className="text-xs text-center mt-6 leading-relaxed"
          style={{ color: "#6B6259" }}
        >
          Si saltás un día, el progreso no se borra. Retomás cuando quieras.
        </p>
      </div>
    </div>
  );
}
