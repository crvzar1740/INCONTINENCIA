# Suelo Firme - Gestión de Incontinencia Urinaria

**Recupera tu confianza. Vuelve al gimnasio sin miedo a los escapes.**

## 📌 Descripción del Proyecto

Suelo Firme es una plataforma digital integral diseñada para mujeres de 30 a 50 años que buscan gestionar la incontinencia urinaria durante actividades físicas o momentos de estrés. Combina ejercicios especializados de suelo pélvico, recomendaciones de productos, apoyo comunitario y un plan de acción personalizado.

## 🎯 Público Objetivo

Mujeres madres activas (30-50 años) que desean:
- Recuperar confianza en su cuerpo
- Volver al gimnasio sin preocupaciones
- Disfrutar de actividades al aire libre sin limitaciones
- Recibir apoyo de otras mujeres en situación similar

## 🏗️ Estructura del Proyecto

### Páginas Principales
- **Home** (`/`) - Landing page con propuesta de valor, testimonios y FAQ
- **Upsell** (`/upsell`) - Página de venta del Pack Premium ($97)
- **Downsell** (`/downsell`) - Oferta especial 50% descuento ($48.50)
- **Thank You** (`/thank-you`) - Página de agradecimiento post-compra

### Herramientas Principales (4)
1. **Guía de Ejercicios** (`/tools/pelvic-exercises`) - Tracker interactivo de ejercicios Kegel
2. **Checklist de Productos** (`/tools/products-checklist`) - Selector de productos recomendados
3. **Plan de Acción** (`/tools/action-plan`) - Generador de planes personalizados
4. **Sesión Q&A** (`/tools/qa-session`) - Preguntas y respuestas con expertos

### Pack Premium (6 Herramientas)
1. **Workbook de Ejercicios Avanzados** (`/premium/advanced-exercises-workbook`)
2. **Checklist de Compra Inteligente** (`/premium/smart-shopping-checklist`)
3. **Plan de Acción con Protocolo** (`/premium/personalized-action-protocol`)
4. **Sesiones Privadas con Expertos** (`/premium/expert-sessions`)
5. **Guía Emocional y Psicológica** (`/premium/emotional-guide`)
6. **Comunidad Exclusiva de Apoyo** (`/premium/exclusive-community`)

### Página de Catálogo
- **Pack Premium** (`/pack-premium`) - Grid con todos los recursos premium

## 🎨 Diseño y Branding

**Paleta de Colores (profesional, calibrada para producto premium ~$90):**
- Verde Azulado Profundo: `#3D6B66` (primario — transmite confianza clínica)
- Terracota Apagada: `#9C5D52` (secundario — cálido, sobrio)
- Bronce Dorado: `#C08A4E` (acento — elegante, no mostaza)
- Fondo Crema Cálido: `#FAF8F5`
- Texto Principal: `#2B2420` (marrón carbón, no negro puro)

**Tipografía:** Cálida y femenina, orientada a mujeres 30-50 años

**Responsividad:** 100% responsive en móvil, tablet y desktop

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + Tailwind CSS 4 + TypeScript
- **Backend:** Express.js + tRPC 11
- **Base de Datos:** MySQL/TiDB
- **Autenticación:** Manus OAuth
- **Almacenamiento:** S3 (para assets)

## 📦 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/crvzar1740/INCONTINENCIA.git
cd INCONTINENCIA

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
pnpm dev

# Compilar para producción
pnpm build
pnpm start
```

## 🚀 Características Principales

### ✅ Implementadas
- [x] Landing page persuasiva con 6 dolores urgentes
- [x] Sección de soluciones fallidas (5 opciones)
- [x] Mecanismo único de funcionamiento
- [x] Stack de 10 herramientas (4 principales + 6 premium)
- [x] Testimonios adaptados al nicho
- [x] FAQ con 6-7 preguntas frecuentes
- [x] Garantía de 7 días
- [x] 4 herramientas principales interactivas
- [x] 6 herramientas premium con guardado en BD
- [x] Micro-CTAs persuasivos
- [x] 100% responsive en móvil

### 🔄 Próximas Fases
- [ ] Integración de Stripe para pagos reales
- [ ] Sistema de autenticación completo (login/registro)
- [ ] Email marketing (Mailchimp/SendGrid)
- [ ] Dashboard de usuario
- [ ] Historial de progreso
- [ ] Notificaciones push
- [ ] Integración con redes sociales

## 📊 Base de Datos

Las tablas principales incluyen:
- `users` - Información de usuarios
- `pelvic_exercises` - Progreso de ejercicios
- `products_checklist` - Selecciones de productos
- `action_plans` - Planes personalizados
- `qa_sessions` - Preguntas y respuestas
- `advanced_exercises` - Ejercicios premium
- `smart_shopping` - Compras inteligentes
- `action_protocols` - Protocolos personalizados
- `expert_sessions` - Sesiones con expertos
- `emotional_modules` - Módulos emocionales
- `community_posts` - Posts de comunidad

## 🔐 Seguridad

- Autenticación OAuth integrada
- Protección de rutas con `protectedProcedure`
- Variables de entorno sensibles
- HTTPS en producción
- Validación de datos en servidor

## 📝 Micro-CTAs Utilizados

- "Porque quiero volver al gimnasio sin miedo a los escapes"
- "Para recuperar mi confianza y disfrutar de mi vida"
- "Necesito una solución real y efectiva"
- "Estoy lista para cambiar mi vida"

## 🤝 Contribuir

Este es un proyecto privado. Para cambios o sugerencias, contacta al equipo de desarrollo.

## 📄 Licencia

Todos los derechos reservados © 2026 Suelo Firme

## 📞 Soporte

Para soporte técnico o preguntas sobre el producto, contacta a: support@incontinencia.com

---

**Última actualización:** Julio 2026
**Versión:** 1.0.0
**Estado:** En producción
