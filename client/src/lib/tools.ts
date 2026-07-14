export interface Tool {
  title: string;
  format: string;
  description: string;
  isPremium: boolean;
  path: string;
  image: string;
}

export const tools: Tool[] = [
  {
    title: "Programa de Ejercicios de Piso Pélvico",
    format: "App interactiva con timer guiado",
    description: "Programa de 3 fases (activación, resistencia, integración) con timer guiado y técnica de anticipación para toser, reír o levantar peso sin miedo.",
    isPremium: false,
    path: "/tools/pelvic-exercises",
    image: "/images/base/pelvic-exercises.jpg",
  },
  {
    title: "Checklist de Productos",
    format: "Checklist interactivo",
    description: "Criterios reales para elegir protección según tu nivel de actividad y momento del día — no una lista genérica.",
    isPremium: false,
    path: "/tools/products-checklist",
    image: "/images/base/products-checklist.jpg",
  },
  {
    title: "Plan de Acción",
    format: "Hoja de ruta descargable",
    description: "Armá tu propio plan de 8 semanas combinando ejercicios y productos según tus objetivos, listo para descargar.",
    isPremium: false,
    path: "/tools/action-plan",
    image: "/images/base/action-plan.jpg",
  },
  {
    title: "Preguntas Frecuentes",
    format: "Banco de respuestas chequeado",
    description: "Respuestas claras a las dudas más comunes sobre ejercicios, productos y progreso.",
    isPremium: false,
    path: "/tools/qa-session",
    image: "/images/base/qa-session.jpg",
  },
  {
    title: "Protocolo de Retorno al Impacto",
    format: "Programa de 8 semanas",
    description: "El puente entre tu programa base y correr, saltar o volver a entrenar en serio: chequeo de diástasis, respiración con carga y test de disposición basado en criterios clínicos reales.",
    isPremium: true,
    path: "/premium/advanced-exercises-workbook",
    image: "/images/premium/advanced-exercises.jpg",
  },
  {
    title: "Guía de Decisión: Productos y Cuidado de la Piel",
    format: "Quiz + calculadora",
    description: "Criterio real para evaluar cualquier producto, rutina de cuidado de la piel y calculadora de costo por uso.",
    isPremium: true,
    path: "/premium/smart-shopping-checklist",
    image: "/images/premium/smart-shopping.jpg",
  },
  {
    title: "Protocolo de Reentrenamiento Vesical",
    format: "Diario vesical de 3 días",
    description: "Plan de vaciado programado y técnicas de supresión de urgencia — la herramienta clínica específica para la urgencia y la frecuencia.",
    isPremium: true,
    path: "/premium/personalized-action-protocol",
    image: "/images/premium/action-protocol.jpg",
  },
  {
    title: "Programa de Acompañamiento con Especialista",
    format: "1 sesión en vivo incluida",
    description: "Videoconsulta en vivo con una kinesióloga real (matrícula verificable) para ajustar tu progreso. Sesiones adicionales disponibles por separado.",
    isPremium: true,
    path: "/premium/expert-sessions",
    image: "/images/premium/expert-sessions.jpg",
  },
  {
    title: "Guía de Reconstrucción Emocional y Conductual",
    format: "Terapia cognitivo-conductual",
    description: "Registro de pensamientos, mapa de actividades evitadas con exposición gradual y respiración para la ansiedad anticipatoria.",
    isPremium: true,
    path: "/premium/emotional-guide",
    image: "/images/premium/emotional-guide.jpg",
  },
  {
    title: "Guía de Comunicación y Red de Apoyo",
    format: "Espacio privado de reflexión",
    description: "Cómo hablarlo con tu pareja, tu entorno y tu médico, más un espacio privado guardado solo en tu dispositivo.",
    isPremium: true,
    path: "/premium/exclusive-community",
    image: "/images/premium/community.jpg",
  },
];
