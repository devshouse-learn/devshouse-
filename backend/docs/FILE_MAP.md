# DevsHouse - Mapa de Archivos del Sistema

**Última actualización:** 22 de noviembre de 2025

---

## 📁 BACKEND

### 🔧 Configuración Principal

```
/backend/src/index.js
```
**Descripción:** Servidor principal de Express
**Responsabilidades:**
- Configuración de middleware (CORS, helmet, rate limiting)
- Registro de rutas
- Manejo de errores global
- Inicio del servidor

**Rutas integradas:**
- `/api/monitoring` → Sistema de monitoreo
- `/api/ai-assistant` → Asistente AI
- `/api/verification` → Verificación de email
- `/api/email-validation` → Validación real de email

---

### 📊 Sistema de Logging y Monitoreo

#### `/backend/src/utils/logger.js`
**Tamaño:** ~400 líneas
**Descripción:** Sistema de logging con 5 niveles
**Funcionalidades:**
- `Logger.error(message, error, metadata)` - Errores críticos
- `Logger.warn(message, metadata)` - Advertencias
- `Logger.info(message, metadata)` - Información general
- `Logger.debug(message, metadata)` - Debug
- `Logger.security(message, metadata)` - Eventos de seguridad

**Almacenamiento:**
- `logs/combined.log` - Todos los logs
- `logs/error.log` - Solo errores
- `logs/security.log` - Solo seguridad
- `logs/debug.log` - Solo debug

**Características:**
- Rotación automática (10MB)
- Cache en memoria (1000 logs)
- Middleware: requestLogger, errorLogger

---

#### `/backend/src/utils/errorMonitor.js`
**Tamaño:** ~350 líneas
**Descripción:** Monitor de errores en tiempo real
**Funcionalidades:**
- `trackError(error, context)` - Registrar error
- `getStats()` - Estadísticas generales
- `getRecentErrors(limit)` - Errores recientes
- `detectErrorPatterns()` - Detectar patrones
- `getActiveAlerts()` - Alertas activas

**Características:**
- Detección de errores críticos
- Alertas cuando se supera umbral
- Análisis de patrones
- Reportes automáticos

---

#### `/backend/src/routes/monitoring.routes.js`
**Tamaño:** ~300 líneas
**Descripción:** API de monitoreo
**Endpoints (8):**

1. `GET /api/monitoring/stats` - Estadísticas generales
2. `GET /api/monitoring/logs` - Obtener logs
3. `GET /api/monitoring/errors` - Errores recientes
4. `GET /api/monitoring/alerts` - Alertas activas
5. `GET /api/monitoring/report` - Generar reporte
6. `GET /api/monitoring/health` - Health check
7. `POST /api/monitoring/alerts/:id/acknowledge` - Reconocer alerta
8. `POST /api/monitoring/cleanup` - Limpiar logs antiguos

---

#### `/backend/src/middleware/errorHandler.js`
**Tamaño:** ~200 líneas
**Descripción:** Manejadores de errores
**Funciones (4):**

1. `asyncErrorHandler(fn)` - Wrapper para async/await
2. `globalErrorHandler(err, req, res, next)` - Manejador global
3. `notFoundHandler(req, res)` - 404 handler
4. `criticalErrorHandler(err)` - Errores críticos

**Características:**
- Logging automático
- Respuestas estandarizadas
- Manejo de diferentes tipos de error

---

### 🤖 Sistema de Asistente AI

#### `/backend/src/services/aiDiagnostic.service.js`
**Tamaño:** ~600 líneas
**Descripción:** Servicio de diagnóstico con IA
**Base de conocimiento:** 6 categorías, 20+ problemas

**Categorías:**
1. **auth** - Autenticación (5 problemas)
2. **connection** - Conexión (4 problemas)
3. **database** - Base de datos (4 problemas)
4. **frontend** - Frontend (3 problemas)
5. **cors** - CORS (2 problemas)
6. **permissions** - Permisos (2 problemas)

**Métodos principales:**
- `diagnose(error, context)` - Diagnosticar problema
- `findSolution(keywords)` - Buscar solución
- `getSuggestions(category)` - Obtener sugerencias
- `analyzeErrorPattern(errors)` - Analizar patrones
- `autoFix(problemId, context)` - Auto-reparación

**Funciones de auto-fix:**
- `clearAuthTokens()` - Limpiar tokens
- `checkBackendStatus()` - Verificar backend
- `resetFormState()` - Resetear formulario
- `forceReload()` - Recargar página
- `clearBrowserCache()` - Limpiar caché

---

#### `/backend/src/routes/aiAssistant.routes.js`
**Tamaño:** ~250 líneas
**Descripción:** API del asistente AI
**Endpoints (7):**

1. `POST /api/ai-assistant/diagnose` - Diagnosticar problema
2. `POST /api/ai-assistant/help` - Solicitar ayuda
3. `POST /api/ai-assistant/autofix` - Auto-reparación
4. `GET /api/ai-assistant/analyze-pattern` - Analizar patrón
5. `GET /api/ai-assistant/diagnose/:errorId` - Diagnóstico por ID
6. `GET /api/ai-assistant/quick-fixes` - Soluciones rápidas
7. `GET /api/ai-assistant/health` - Health check

---

### 📧 Sistema de Verificación de Email

#### `/backend/src/services/email.service.js`
**Tamaño:** ~350 líneas
**Descripción:** Servicio de envío de emails
**Configuración:** Gmail, SMTP custom, Ethereal (testing)

**Métodos (4):**
1. `sendVerificationEmail(user, token)` - Email de verificación
2. `sendWelcomeEmail(user)` - Email de bienvenida
3. `sendPasswordResetEmail(user, token)` - Recuperación de contraseña
4. `sendPasswordChangedEmail(user)` - Confirmación de cambio

**Templates:**
- HTML profesional con logo
- Responsive design
- Links seguros con tokens

**Variables de entorno requeridas:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_APP_PASSWORD=contraseña-de-app
```

---

#### `/backend/src/routes/verification.routes.js`
**Tamaño:** ~300 líneas
**Descripción:** API de verificación de email
**Endpoints (6):**

1. `GET /api/verification/verify-email?token=xxx` - Verificar email
2. `POST /api/verification/resend-verification` - Reenviar verificación
3. `POST /api/verification/forgot-password` - Recuperar contraseña
4. `POST /api/verification/reset-password` - Resetear contraseña
5. `POST /api/verification/send-bulk-verification` - Envío masivo (admin)
6. `GET /api/verification/verification-stats` - Estadísticas

---

### ✅ Sistema de Validación Real de Email

#### `/backend/src/services/emailValidation.service.js`
**Tamaño:** ~300 líneas
**Descripción:** Validación real con DNS y SMTP
**Tecnologías:**
- DNS: Verificación de registros MX
- SMTP: Conexión TCP a puerto 25
- Regex: Validación de formato
- Listas: Dominios confiables y desechables

**Métodos principales:**
- `validateEmailFormat(email)` - Validar formato
- `isDisposableEmail(email)` - Detectar email temporal
- `verifyMXRecords(domain)` - Verificar DNS MX
- `verifySMTPServer(mxRecord, timeout)` - Verificar SMTP
- `validateEmail(email)` - Validación completa
- `quickValidateEmail(email)` - Validación rápida (sin SMTP)
- `validateEmailBatch(emails, quick)` - Validación en lote
- `suggestEmailCorrection(email)` - Sugerir corrección

**Dominios bloqueados (15+):**
- tempmail.com, guerrillamail.com, 10minutemail.com
- mailinator.com, throwaway.email, temp-mail.org
- fakeinbox.com, trashmail.com, yopmail.com
- sharklasers.com, maildrop.cc, spam4.me

**Dominios confiables (9):**
- gmail.com, googlemail.com, outlook.com
- hotmail.com, yahoo.com, icloud.com
- protonmail.com, live.com, msn.com

---

#### `/backend/src/routes/emailValidation.routes.js`
**Tamaño:** ~200 líneas
**Descripción:** API de validación de email
**Endpoints (6):**

1. `POST /api/email-validation/validate` - Validación completa
2. `POST /api/email-validation/quick-validate` - Validación rápida
3. `POST /api/email-validation/validate-batch` - Validación en lote (máx 100)
4. `POST /api/email-validation/suggest-correction` - Sugerir corrección
5. `GET /api/email-validation/check-domain/:domain` - Verificar dominio
6. `POST /api/email-validation/check-disposable` - Verificar si es desechable

---

### 🗄️ Modelos de Datos

#### `/backend/src/models/User.js`
**Tamaño:** ~250 líneas (actualizado)
**Descripción:** Modelo de usuario con validaciones

**Campos:**
```javascript
{
  name: String (required),
  email: String (unique, lowercase, trim),
  password: String (hasheado con bcryptjs),
  role: String (enum: ["usuario", "moderador", "admin"]),
  emailVerified: Boolean (default: false),
  verificationToken: String (SHA-256),
  verificationTokenExpires: Date,
  passwordResetToken: String (SHA-256),
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Validaciones de email (2):**
1. **Unicidad** - Email no debe estar registrado
2. **Real** - Email debe ser válido (formato + no desechable + MX records)

**Métodos:**
- `generateVerificationToken()` - Generar token de verificación
- `generatePasswordResetToken()` - Generar token de reset
- `static verifyEmailToken(token)` - Verificar token de email
- `static verifyResetToken(token)` - Verificar token de reset

**Hooks:**
- `pre('save')` - Hashear contraseña antes de guardar
- `pre('save')` - Validar email antes de guardar

---

## 🖥️ FRONTEND

### 🤖 Asistente AI

#### `/frontend/src/components/ai-assistant/AIAssistantEnhanced.jsx`
**Tamaño:** ~400 líneas
**Descripción:** Chat de IA interactivo
**Características:**
- Chat con historial de mensajes
- Detección de intención (error, help, fix, general)
- 2 pestañas: Chat y Soluciones Rápidas
- Minimizable
- Formateo de markdown
- Animaciones suaves

**Estados:**
```javascript
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');
const [isOpen, setIsOpen] = useState(false);
const [isMinimized, setIsMinimized] = useState(false);
const [activeTab, setActiveTab] = useState('chat');
```

**Métodos:**
- `handleSendMessage()` - Enviar mensaje
- `detectIntent(message)` - Detectar intención
- `handleAutoFix(fixId)` - Ejecutar auto-fix
- `handleQuickFix(fix)` - Ejecutar solución rápida

---

#### `/frontend/src/components/ai-assistant/AIAssistantEnhanced.css`
**Tamaño:** ~350 líneas
**Descripción:** Estilos del asistente
**Características:**
- Posición fija en esquina inferior derecha
- Animaciones de entrada/salida
- Diseño responsive
- Colores temáticos (azul/violeta)
- Scrollbar personalizada

---

### ✅ Validador de Email

#### `/frontend/src/components/auth/EmailValidator.jsx`
**Tamaño:** ~185 líneas
**Descripción:** Componente de validación de email
**Características:**
- Input de email con validación
- Botón "Validar Email"
- Visualización de checks (✓/✗)
- Sugerencias de corrección
- Detalles del dominio
- Mensajes de error claros

**Estados:**
```javascript
const [email, setEmail] = useState('');
const [validating, setValidating] = useState(false);
const [result, setResult] = useState(null);
const [suggestions, setSuggestions] = useState([]);
```

**Checks visuales:**
- ✅ Formato válido
- ✅ No es email desechable
- ✅ Registros MX encontrados
- ✅ Servidor SMTP alcanzable

**Métodos:**
- `validateEmail()` - Llamar API de validación
- `applySuggestion(suggestion)` - Aplicar sugerencia

---

#### `/frontend/src/components/auth/EmailValidator.css`
**Tamaño:** ~300 líneas
**Descripción:** Estilos del validador
**Características:**
- Card con sombra
- Input group con botón
- Sugerencias con animación slideDown
- Result boxes con colores (verde/rojo)
- Check items con iconos (✓/✗)
- Responsive design

---

### 🔐 Contexto de Autenticación

#### `/frontend/src/context/AuthContext.jsx`
**Tamaño:** ~150 líneas
**Descripción:** Contexto global de autenticación
**Estado:**
```javascript
{
  user: null | { name, email, role, emailVerified },
  isAuthenticated: false | true,
  loading: true | false
}
```

**Métodos:**
- `login(email, password)` - Iniciar sesión
- `register(userData)` - Registrar usuario
- `logout()` - Cerrar sesión
- `checkAuth()` - Verificar autenticación

**Persistencia:** localStorage

---

## 📚 DOCUMENTACIÓN

### `/SISTEMA_COMPLETO.md`
**Tamaño:** ~1500 líneas
**Descripción:** Documentación completa del sistema
**Secciones (8):**
1. Resumen Ejecutivo
2. Arquitectura del Sistema
3. Sistema de Logging y Monitoreo
4. Sistema de Asistente AI
5. Sistema de Verificación de Email
6. Sistema de Validación Real de Email
7. Configuración y Deployment
8. Guía de Mantenimiento

---

### `/QUICK_START.md`
**Tamaño:** ~400 líneas
**Descripción:** Guía de inicio rápido
**Secciones:**
- Inicio rápido en 5 minutos
- Sistemas disponibles
- Probar funcionalidades
- Archivos importantes
- Comandos útiles
- Solución de problemas
- Checklist de verificación

---

### `/EMAIL_VALIDATION_REAL_GUIDE.md`
**Tamaño:** ~400 líneas
**Descripción:** Guía del sistema de validación real
**Contenido:**
- Descripción completa de la feature
- Integración paso a paso
- Documentación de API
- Ejemplos de uso
- Consideraciones de seguridad
- Testing y performance

---

### `/EMAIL_VERIFICATION_GUIDE.md`
**Tamaño:** ~350 líneas
**Descripción:** Guía del sistema de verificación
**Contenido:**
- Configuración de nodemailer
- Templates de email
- Flujo de verificación
- API endpoints
- Configuración de Gmail

---

### `/AI_ASSISTANT_GUIDE.md`
**Tamaño:** ~300 líneas
**Descripción:** Guía del asistente AI
**Contenido:**
- Base de conocimiento
- Funciones de auto-reparación
- API endpoints
- Integración en frontend
- Personalización

---

### `/MONITORING_SYSTEM.md`
**Tamaño:** ~250 líneas
**Descripción:** Guía del sistema de monitoreo
**Contenido:**
- Sistema de logging
- Monitor de errores
- API de monitoreo
- Configuración
- Mantenimiento

---

## 📝 ARCHIVOS DE CONFIGURACIÓN

### `/backend/.env`
```env
# Servidor
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# MongoDB
MONGODB_URI=mongodb://localhost:27017/devshouse

# JWT
JWT_SECRET=tu-clave-secreta
JWT_EXPIRES_IN=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_APP_PASSWORD=contraseña-app

# Frontend
FRONTEND_URL=http://localhost:5173

# Validación
VERIFY_SMTP_SERVER=false
SMTP_VERIFICATION_TIMEOUT=5000
MAX_BATCH_SIZE=100
```

---

### `/frontend/.env`
```env
VITE_API_URL=http://localhost:3000/api
```

---

### `/backend/package.json`
**Dependencias principales:**
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "nodemailer": "^6.9.7",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

---

### `/frontend/package.json`
**Dependencias principales:**
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.1.1",
  "vite": "^7.2.4"
}
```

---

## 📊 RESUMEN DE ENDPOINTS

### Sistema de Monitoreo (8 endpoints)
```
GET    /api/monitoring/stats
GET    /api/monitoring/logs
GET    /api/monitoring/errors
GET    /api/monitoring/alerts
GET    /api/monitoring/report
GET    /api/monitoring/health
POST   /api/monitoring/alerts/:id/acknowledge
POST   /api/monitoring/cleanup
```

---

### Asistente AI (7 endpoints)
```
POST   /api/ai-assistant/diagnose
POST   /api/ai-assistant/help
POST   /api/ai-assistant/autofix
GET    /api/ai-assistant/analyze-pattern
GET    /api/ai-assistant/diagnose/:errorId
GET    /api/ai-assistant/quick-fixes
GET    /api/ai-assistant/health
```

---

### Verificación de Email (6 endpoints)
```
GET    /api/verification/verify-email
POST   /api/verification/resend-verification
POST   /api/verification/forgot-password
POST   /api/verification/reset-password
POST   /api/verification/send-bulk-verification
GET    /api/verification/verification-stats
```

---

### Validación de Email (6 endpoints)
```
POST   /api/email-validation/validate
POST   /api/email-validation/quick-validate
POST   /api/email-validation/validate-batch
POST   /api/email-validation/suggest-correction
GET    /api/email-validation/check-domain/:domain
POST   /api/email-validation/check-disposable
```

---

## 📈 ESTADÍSTICAS DEL CÓDIGO

**Backend:**
- Archivos de servicio: 3 (~1250 líneas)
- Archivos de rutas: 4 (~1050 líneas)
- Middleware: 1 (~200 líneas)
- Utilidades: 2 (~750 líneas)
- Modelos: 1 (~250 líneas)
- **Total backend: ~3500 líneas**

**Frontend:**
- Componentes: 2 (~585 líneas)
- CSS: 2 (~650 líneas)
- Contextos: 1 (~150 líneas)
- **Total frontend: ~1385 líneas**

**Documentación:**
- Guías: 5 archivos (~3500 líneas)
- Este archivo: ~800 líneas
- **Total documentación: ~4300 líneas**

**TOTAL PROYECTO: ~9185 líneas de código y documentación**

---

## 🔍 UBICACIÓN DE FUNCIONALIDADES CLAVE

### Quiero agregar un nuevo tipo de error al monitor
**Archivo:** `/backend/src/utils/errorMonitor.js`
**Método:** `trackError(error, context)`

### Quiero agregar un nuevo problema a la IA
**Archivo:** `/backend/src/services/aiDiagnostic.service.js`
**Sección:** `this.knowledgeBase`

### Quiero cambiar el template de email de verificación
**Archivo:** `/backend/src/services/email.service.js`
**Método:** `sendVerificationEmail()`

### Quiero agregar un dominio desechable a la lista
**Archivo:** `/backend/src/services/emailValidation.service.js`
**Array:** `this.disposableEmailDomains`

### Quiero cambiar el diseño del chat de IA
**Archivo:** `/frontend/src/components/ai-assistant/AIAssistantEnhanced.css`

### Quiero personalizar los checks del validador de email
**Archivo:** `/frontend/src/components/auth/EmailValidator.jsx`
**Sección:** JSX de checks

---

**Este mapa es tu guía rápida para navegar el sistema. Todos los archivos listados están implementados y funcionando.**
