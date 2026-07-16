# Contenido UX y Especificación de Módulos Premium
## App de manejo de incontinencia urinaria — Base científica + Copy + Lógica de producto

> Fuente científica: consensos EAU 2026, dispositivo Altaviva (TTNS), apps Tät/Tät II, URApp, Bladder Guide. Todo el copy respeta la jerarquía clínica real: **PFMT es primera línea gold-standard**; los datos que se citan en pantalla (ej. 65.6% de mejora) provienen de estudios reales de apps como Tät, no de afirmaciones inventadas.

---

# PARTE 1 — CONTENIDO Y COPY

## 1. Pantalla de Bienvenida

**Headline**
> Bienvenida. Aquí no hay nada que esconder.

**Cuerpo**
> Lo que estás sintiendo lo viven millones de personas —después de un parto, con la edad, por estrés, o sin ninguna razón clara. No es "algo que ya deberías haber superado" ni una señal de que tu cuerpo te falló. Es una condición médica, real, y tratable.
>
> Esta app no reemplaza a tu médico ni a tu fisioterapeuta de piso pélvico. Es tu acompañamiento diario: te ayuda a entender tus patrones, a entrenar los músculos correctos y a recuperar el control, un día a la vez.
>
> Todo lo que vas a hacer aquí —el diario, los ejercicios, las alarmas— está basado en las mismas guías clínicas que usan los urólogos (EAU 2026) y en programas digitales que ya demostraron resultados reales: **más de 6 de cada 10 usuarias de programas similares reportan mejoras notables en pocas semanas**.
>
> Vamos a ir paso a paso. Sin prisa, sin juicio.

**CTA**
> Empezar mi seguimiento

**Nota de tono:** Evitar palabras como "paciente", "tratamiento" o "diagnóstico" en la bienvenida — se sienten clínicas y distantes. Usar "tú", segunda persona, cercana.

---

## 2. Instrucciones del Diario de Vejiga

**Encabezado**
> Tu diario no es un examen. Es tu mapa.

**Cuerpo introductorio**
> No necesitas anotar cada detalle a la perfección. Cuantos más días registres, más clara se vuelve la foto — y esa foto es lo que le va a dar sentido a todo lo demás en la app (tus alarmas, tus ejercicios, tus reportes).

**Micro-guía en 4 pasos (con iconografía suave, no médica)**

1. **Cuándo vas al baño** — solo toca el botón cuando orines. La app calcula el tiempo entre visitas por ti.
2. **Si sentiste urgencia** — un toque rápido: "tranquilo", "apurado" o "no llegué a tiempo". No hay respuesta incorrecta.
3. **Si hubo escape** — marca sí/no y, si quieres, qué lo provocó (tos, risa, ejercicio, no supiste). Esto es información, no una confesión.
4. **Qué tomaste** — agua, café, alcohol. Ayuda a ver si algo específico te afecta más.

**Microcopy de refuerzo (aparece tras el primer registro)**
> Listo. Ese es el primer dato de tu mapa. En una semana vas a empezar a ver patrones que ni tú sabías que tenías.

**Manejo de fricción / abandono**
> Si un día se te olvida registrar, no pasa nada — la app no rompe rachas ni te hace sentir mal. Simplemente dice:
> "¿Ayer se te pasó? Puedes agregarlo ahora, o simplemente seguimos desde hoy."

---

## 3. Mensajes del Muro de Pago (Paywall Premium)

**Principio de copy:** vender tranquilidad y control, no "features". Cada bullet conecta una función con una emoción, no con una lista técnica.

**Headline principal**
> Invierte en volver a sentirte en control de tu cuerpo.

**Subheadline**
> Por menos de lo que cuesta un café a la semana, tienes acompañamiento diario, ejercicios guiados y reportes listos para tu médico.

**Bloque de valor (bullets emocionales, no técnicos)**
- 📊 **Reportes automáticos para tu médico** — llega a la consulta con datos reales, no con "creo que me pasa seguido".
- 🧘 **Rutinas de suelo pélvico guiadas y a tu ritmo** — sin adivinar si lo estás haciendo bien.
- ⏰ **Alarmas inteligentes** — te avisan antes de que la urgencia te gane, no después.
- 💬 **Lecciones diarias de 2 minutos** — hábitos pequeños que suman control real, sin sentirte en terapia.

**CTA principal**
> Empezar mi plan de acompañamiento — $[X]/mes

**Microcopy debajo del CTA (reduce fricción sin sonar a venta agresiva)**
> Cancela cuando quieras. Tus datos siempre son tuyos.

**Variante — enfoque "antes de tu próxima cita médica"**
> Headline: Llega a tu próxima consulta con respuestas, no con dudas.
> Cuerpo: Los urólogos necesitan patrones, no recuerdos vagos de "a veces me pasa". Con Premium, generas en un toque un reporte con tus frecuencias, urgencias y escapes de las últimas semanas — el mismo tipo de dato que se usa en las guías clínicas actuales para decidir tu tratamiento.

**Manejo de objeción de precio (pantalla secundaria si el usuario duda)**
> Sabemos que suscribirte a algo más no es una decisión pequeña. Por eso: 7 días para probarlo completo, sin cargo. Si no sientes que te está ayudando a entender tu cuerpo, cancelas en un toque.

---

## 4. Guía Conceptual de Diseño UX/UI

**Paleta de color**
- Color base: **verde salvia suave** (#A9C6B8 o similar) o **lavanda cálido** (#C9BEDD) como color primario — transmiten calma clínica sin frialdad de hospital. Evitar azul quirúrgico saturado y rojo (asociado a alarma/sangre).
- Acentos: **terracota suave o durazno** para CTAs — cálido, humano, no agresivo.
- Fondo: blanco cálido o beige muy claro (#FAF7F2), nunca blanco puro clínico.
- Estados de alerta (ej. "no llegué a tiempo"): usar ámbar suave, nunca rojo intenso — un escape no es una emergencia.

**Tipografía**
- Fuente redondeada, humanista (tipo Inter, Nunito o similar) — nunca fuentes técnicas/monoespaciadas.
- Cuerpo de texto: mínimo **17–18px**, con line-height generoso (1.5–1.6). Gran parte de la población objetivo son mujeres 40+ o postparto con fatiga visual.
- Headlines: peso medio, no bold agresivo — transmite calma, no urgencia.

**Disposición y layout**
- **Una sola acción por pantalla.** Nunca pedir 4 datos del diario en una sola vista — usar pasos secuenciales grandes y táctiles.
- Botones grandes (mínimo 48px de alto), separados — pensado para personas mayores o con prisa (ej. registrando justo después de un escape).
- Evitar iconografía médica (jeringas, cruces rojas, gotas de sangre). Usar formas orgánicas, ilustraciones suaves, nunca fotografías clínicas.
- Barra de progreso del diario/rutina: circular y suave, no una barra de "cumplimiento" tipo KPI corporativo — refuerza continuidad, no rendimiento.
- Mensajes de error o "día saltado": tono neutro, nunca con íconos de alerta roja ni "¡Racha perdida!".

---

# PARTE 2 — MÓDULOS PREMIUM: LÓGICA FUNCIONAL

## Módulo 1 — Entrenamiento de Suelo Pélvico (Kegel Timer Interactivo)

**Objetivo clínico:** operacionalizar el PFMT (primera línea, gold-standard) en una rutina guiada, progresiva y sin fricción.

**Lógica de sesión**
1. **Calibración inicial:** al primer uso, la app pregunta (sin jerga) si el usuario puede identificar la contracción ("como si detuvieras el pipí a la mitad, sin apretar glúteos ni abdomen"). Si no está seguro, ofrece un video corto de referencia antes de empezar.
2. **Estructura de sesión estándar** (basada en protocolos físioterapéuticos habituales):
   - 3 series de 8–10 contracciones
   - Contracción guiada: 5 segundos (con animación de "cerrar" en pantalla)
   - Relajación guiada: 5–10 segundos (animación de "abrir/soltar")
   - Descanso entre series: 60 segundos
3. **Progresión automática:** cada semana con ≥80% de sesiones completadas, la app aumenta el tiempo de contracción en 1–2 segundos (hasta un techo de ~10s), imitando la progresión que indicaría un fisioterapeuta. Si la adherencia baja de 50%, la app NO aumenta dificultad — mantiene el nivel y ajusta el mensaje de motivación en vez de la exigencia.
4. **Feedback sensorial:** vibración suave del teléfono marcando el cambio contracción↔relajación, para usuarios que prefieren cerrar los ojos y no mirar la pantalla.
5. **Gancho de fidelidad ético:** el streak no se "rompe" visualmente — si se salta un día, se muestra como "pausa", no como pérdida. Ejemplo de microcopy: *"Tu cuerpo no perdió el progreso. Retomamos cuando quieras."*

**Integración futura (mencionar como roadmap, no como IU actual):** conexión vía HealthKit/Health Connect con sensores de presión de piso pélvico (wearables) para biofeedback real, tal como se describe en la investigación sobre neuromodulación controlada por el paciente.

---

## Módulo 2 — Reeducación Vesical con Alarmas Dinámicas

**Objetivo clínico:** implementar *bladder training* (entrenamiento de vejiga), técnica conductual estándar para IUU, usando los datos reales del diario en vez de intervalos genéricos.

**Lógica del algoritmo (descrita conceptualmente)**

1. **Línea base:** tras 5–7 días de diario, la app calcula el **intervalo promedio actual entre micciones** (tiempo real que el usuario aguanta hoy, no un ideal clínico).
2. **Meta inicial:** se fija un intervalo objetivo apenas por encima del promedio real (ej. +10–15 minutos), nunca un salto agresivo — evita frustración y falsos "fracasos".
3. **Alarma dinámica:** la app avisa unos minutos *antes* de cumplirse el intervalo objetivo, con un mensaje de preparación, no de urgencia:
   > "Faltan 5 minutos para tu próxima meta. Si sientes ganas, prueba una técnica de contención (te la mostramos) antes de ir."
4. **Evaluación semanal automática:**
   - Si el usuario cumple el intervalo objetivo en ≥80% de los casos → la meta sube otros 10–15 min la semana siguiente.
   - Si el cumplimiento está entre 50–80% → la meta se mantiene igual una semana más (consolidación).
   - Si el cumplimiento es <50% → la meta **retrocede** ligeramente. Esto se comunica sin culpa:
     > "Ajustamos tu ritmo. No es un retroceso, es calibrar mejor tu punto de partida."
5. **Técnica de contención integrada:** cuando el usuario reporta urgencia antes de tiempo, la app ofrece un micro-ejercicio de 60 segundos (respiración + contracción rápida de piso pélvico) para "ganar tiempo" — vinculando el Módulo 1 y el Módulo 2 en el momento de mayor necesidad real.

**Nota importante de producto:** este módulo debe dejar claro en su copy que la meta es un acompañamiento, no una orden médica — y sugerir consultar a un profesional si los intervalos no mejoran tras varias semanas, evitando que la app sustituya diagnóstico clínico.

---

## Módulo 3 — Lecciones Diarias Cortas (estilo Duolingo)

**Objetivo:** educación continua en micro-dosis, aumentando adherencia mediante hábito diario breve (no información médica densa de una sola vez).

**Estructura de cada lección**
- Duración: 90 segundos a 2 minutos.
- Formato: 3–4 tarjetas deslizables + 1 pregunta de refuerzo (no examen, sino "¿sabías que...?" con opción de tap).
- Sin puntuación punitiva: no hay "reprobado", solo "ya lo sabías" o "dato nuevo para ti".

**Temario sugerido (basado en la investigación adjunta)**
1. **Nutrición vesical:** irritantes comunes de la vejiga (cafeína, alcohol, bebidas carbonatadas, picante) y cómo identificarlos usando su propio diario.
2. **Hidratación correcta:** por qué tomar menos agua NO ayuda (mito común) y cuánta agua es realmente adecuada.
3. **Manejo de la urgencia:** técnicas de distracción y contención (respiración, contracción rápida) para "ganarle tiempo" a una urgencia sin correr al baño.
4. **Mitos vs. realidad:** "es normal después de tener hijos" → falso, es común pero tratable (alineado con el mensaje central de la app).
5. **Piso pélvico y ejercicio:** cómo modificar actividad física (saltos, pesas) sin abandonar el gimnasio mientras se progresa en el entrenamiento.
6. **Cuándo ver a un profesional:** señales de que el autocuidado no es suficiente y toca buscar un fisioterapeuta de piso pélvico o un urólogo.

**Lógica de desbloqueo**
- Las lecciones se desbloquean 1 por día (mecánica de hábito), pero se pueden "adelantar" con Premium para usuarios que quieren avanzar más rápido — dando valor real a la suscripción sin bloquear contenido de seguridad básico.
- Racha (streak) con el mismo principio del Módulo 1: pausas, no roturas. Mensaje tipo:
  > "3 días seguidos aprendiendo sobre tu cuerpo. Sigamos."

**Conexión entre los 3 módulos**
El hilo conductor emocional es: *el diario te muestra dónde estás → las lecciones te explican por qué → el entrenamiento y la reeducación vesical te dan las herramientas para cambiarlo.* Ningún módulo debe sentirse aislado; los reportes (paywall) deben mostrar visualmente cómo el progreso en un módulo impacta a los otros (ej. "menos urgencias esta semana, incluso en los días que no hiciste ejercicios" refuerza que el sistema está funcionando en conjunto).
