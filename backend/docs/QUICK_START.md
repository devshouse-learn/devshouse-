# DevsHouse - Guía de Inicio Rápido

## 🚀 Inicio Rápido en 5 Minutos

### 1. Configuración Inicial

```bash
# Clonar repositorio
git clone <tu-repo>
cd devshouse-

# Instalar dependencias backend
cd backend
npm install

# Instalar dependencias frontend
cd ../frontend
npm install
```

### 2. Configurar Variables de Entorno

**Backend (.env):**
```env
# Básico
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/devshouse

# JWT
JWT_SECRET=tu-clave-secreta-super-segura-cambiala-aqui
JWT_EXPIRES_IN=7d

# Email (Gmail - obtén contraseña de app en https://myaccount.google.com/security)
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Opcional - Validación de email
VERIFY_SMTP_SERVER=false
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Iniciar MongoDB

```bash
# macOS con Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# O usar MongoDB Atlas (cloud)
# Obtén tu URI en https://cloud.mongodb.com
```

### 4. Iniciar Aplicación

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# ✅ Backend corriendo en http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm run dev
# ✅ Frontend corriendo en http://localhost:5173
```

### 5. Verificar que Todo Funciona

**Abrir en navegador:**
```
http://localhost:5173
```

**Probar APIs:**
```bash
# Health check general
curl http://localhost:3000/api/health

# Sistema de monitoreo
curl http://localhost:3000/api/monitoring/health

# Asistente AI
curl http://localhost:3000/api/ai-assistant/health

# Validar email
curl -X POST http://localhost:3000/api/email-validation/quick-validate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com"}'
```

---

## 📋 Sistemas Disponibles

### 1. Sistema de Logging y Monitoreo
**Endpoints:** `http://localhost:3000/api/monitoring/*`
- `/stats` - Estadísticas generales
- `/logs` - Ver logs
- `/errors` - Errores recientes
- `/alerts` - Alertas activas

### 2. Asistente AI
**Endpoints:** `http://localhost:3000/api/ai-assistant/*`
- `/diagnose` - Diagnosticar problema
- `/help` - Solicitar ayuda
- `/autofix` - Auto-reparación
- `/quick-fixes` - Soluciones rápidas

**Frontend:** Chat flotante en la esquina inferior derecha

### 3. Verificación de Email
**Endpoints:** `http://localhost:3000/api/verification/*`
- `/verify-email?token=xxx` - Verificar email
- `/resend-verification` - Reenviar verificación
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Resetear contraseña

### 4. Validación Real de Email
**Endpoints:** `http://localhost:3000/api/email-validation/*`
- `/validate` - Validación completa
- `/quick-validate` - Validación rápida
- `/validate-batch` - Validación en lote
- `/suggest-correction` - Sugerir corrección

**Frontend:** Componente `EmailValidator` disponible

---

## 🧪 Probar Funcionalidades

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@gmail.com",
    "password": "password123",
    "role": "usuario"
  }'
```

**Lo que sucede automáticamente:**
1. ✅ Email validado (formato + no desechable + MX records)
2. ✅ Usuario creado en base de datos
3. ✅ Email de verificación enviado
4. ✅ Log registrado en sistema de monitoreo

### Validar Email
```bash
# Email válido
curl -X POST http://localhost:3000/api/email-validation/quick-validate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com"}'

# Email desechable (será rechazado)
curl -X POST http://localhost:3000/api/email-validation/quick-validate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@tempmail.com"}'

# Email con error tipográfico
curl -X POST http://localhost:3000/api/email-validation/suggest-correction \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmial.com"}'
```

### Usar Asistente AI
```bash
# Diagnosticar error
curl -X POST http://localhost:3000/api/ai-assistant/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "error": "Cannot read property user of null",
    "context": {"page": "/dashboard"}
  }'

# Solicitar ayuda
curl -X POST http://localhost:3000/api/ai-assistant/help \
  -H "Content-Type: application/json" \
  -d '{
    "question": "¿Cómo recupero mi contraseña?",
    "context": {"currentPage": "/login"}
  }'
```

### Ver Monitoreo
```bash
# Estadísticas
curl http://localhost:3000/api/monitoring/stats

# Últimos 10 errores
curl http://localhost:3000/api/monitoring/errors?limit=10

# Logs recientes
curl http://localhost:3000/api/monitoring/logs?limit=20
```

---

## 🔍 Archivos Importantes

```
devshouse-/
├── SISTEMA_COMPLETO.md          # 📘 Documentación completa del sistema
├── QUICK_START.md               # ⚡ Esta guía (inicio rápido)
│
├── backend/
│   ├── src/
│   │   ├── index.js             # ✅ Servidor principal (TODO INTEGRADO)
│   │   ├── models/
│   │   │   └── User.js          # ✅ Modelo con validaciones
│   │   ├── services/
│   │   │   ├── aiDiagnostic.service.js      # 🤖 Servicio de IA
│   │   │   ├── email.service.js             # 📧 Envío de emails
│   │   │   └── emailValidation.service.js   # ✅ Validación DNS/SMTP
│   │   ├── routes/
│   │   │   ├── monitoring.routes.js         # 📊 8 endpoints
│   │   │   ├── aiAssistant.routes.js        # 🤖 7 endpoints
│   │   │   ├── verification.routes.js       # 📧 6 endpoints
│   │   │   └── emailValidation.routes.js    # ✅ 6 endpoints
│   │   ├── middleware/
│   │   │   └── errorHandler.js              # ⚠️ Manejo de errores
│   │   └── utils/
│   │       ├── logger.js                    # 📝 Sistema de logs
│   │       └── errorMonitor.js              # 🔍 Monitor de errores
│   ├── logs/                    # Archivos de log
│   └── .env                     # Variables de entorno
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ai-assistant/
    │   │   │   └── AIAssistantEnhanced.jsx  # 🤖 Chat de IA
    │   │   └── auth/
    │   │       └── EmailValidator.jsx       # ✅ Validador de email
    │   └── context/
    │       └── AuthContext.jsx              # 🔐 Contexto de auth
    └── .env                     # Variables de entorno
```

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Iniciar backend en modo desarrollo
cd backend && npm run dev

# Iniciar frontend en modo desarrollo
cd frontend && npm run dev

# Ver logs en tiempo real
tail -f backend/logs/combined.log

# Ver solo errores
tail -f backend/logs/error.log
```

### Base de Datos
```bash
# Conectar a MongoDB
mongosh "mongodb://localhost:27017/devshouse"

# Ver usuarios
db.users.find().pretty()

# Contar usuarios verificados
db.users.countDocuments({ emailVerified: true })

# Limpiar usuarios no verificados
db.users.deleteMany({ 
  emailVerified: false,
  createdAt: { $lt: new Date(Date.now() - 24*60*60*1000) }
})
```

### Mantenimiento
```bash
# Limpiar logs antiguos (mantener 30 días)
curl -X POST http://localhost:3000/api/monitoring/cleanup?daysToKeep=30

# Resetear estadísticas
curl -X POST http://localhost:3000/api/monitoring/reset

# Backup de MongoDB
mongodump --uri="mongodb://localhost:27017/devshouse" --out=/backups/$(date +%Y%m%d)
```

---

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar puerto disponible
lsof -i :3000

# Verificar MongoDB
mongosh --eval "db.stats()"

# Ver errores
cat backend/logs/error.log
```

### Frontend no conecta
```bash
# Verificar API URL en .env
cat frontend/.env

# Probar conexión
curl http://localhost:3000/api/health
```

### Emails no se envían
```bash
# Verificar configuración
echo $EMAIL_SERVICE
echo $EMAIL_USER

# Usar modo de prueba (Ethereal)
# En .env: EMAIL_SERVICE=ethereal
# No requiere configuración, emails se guardan en https://ethereal.email
```

### Error de validación de email
```bash
# Deshabilitar verificación SMTP si es muy lenta
# En .env: VERIFY_SMTP_SERVER=false

# Probar validación manual
curl -X POST http://localhost:3000/api/email-validation/quick-validate \
  -H "Content-Type: application/json" \
  -d '{"email":"tu-email@gmail.com"}'
```

---

## 📚 Documentación Completa

Para información detallada, consultar:
- **SISTEMA_COMPLETO.md** - Documentación completa
- **MONITORING_SYSTEM.md** - Sistema de logging
- **AI_ASSISTANT_GUIDE.md** - Asistente AI
- **EMAIL_VERIFICATION_GUIDE.md** - Verificación de email
- **EMAIL_VALIDATION_REAL_GUIDE.md** - Validación real de email

---

## ✅ Checklist de Verificación

Antes de comenzar desarrollo, verificar:

- [ ] MongoDB instalado y corriendo
- [ ] Node.js >= 18 instalado
- [ ] Variables de entorno configuradas (.env)
- [ ] Dependencias instaladas (npm install)
- [ ] Backend inicia correctamente (puerto 3000)
- [ ] Frontend inicia correctamente (puerto 5173)
- [ ] Health check responde: `curl http://localhost:3000/api/health`
- [ ] Asistente AI visible en frontend
- [ ] Validación de email funciona

---

**¡Todo listo para comenzar! 🎉**

Si tienes problemas, consulta la sección de "Solución de Problemas" o revisa los logs en `backend/logs/`.
