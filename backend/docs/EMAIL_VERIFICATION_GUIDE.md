# 📧 Sistema de Verificación de Email

## ✅ COMPLETADO

Sistema completo de verificación de email para todos los usuarios registrados, con emails HTML profesionales y sistema de tokens seguros.

---

## 📦 Archivos Creados

### Backend

#### 1. `/backend/src/services/email.service.js`
**Servicio de envío de emails con Nodemailer**

**Características:**
- Soporte para Gmail y SMTP personalizado
- Modo de prueba con Ethereal Email
- Templates HTML profesionales y responsivos
- Emails de texto plano como fallback
- Logging de todos los envíos
- Preview URLs en desarrollo

**Proveedores soportados:**
- **Gmail** (recomendado para desarrollo)
- **SMTP** personalizado (para producción)
- **Ethereal** (testing automático)

**Tipos de emails:**
```javascript
emailService.sendVerificationEmail(user, token)    // Verificación de cuenta
emailService.sendWelcomeEmail(user)                // Bienvenida post-verificación
emailService.sendPasswordResetEmail(user, token)   // Reseteo de contraseña
emailService.sendPasswordChangedEmail(user)        // Confirmación de cambio
emailService.sendEmail({ to, subject, html, text }) // Email genérico
```

#### 2. `/backend/src/models/User.js` (Actualizado)
**Campos agregados al modelo:**
```javascript
emailVerified: Boolean              // Estado de verificación
verificationToken: String           // Token hasheado SHA-256
verificationTokenExpires: Date      // Expiración (24 horas)
passwordResetToken: String          // Token de reseteo hasheado
passwordResetExpires: Date          // Expiración (1 hora)
```

**Métodos agregados:**
```javascript
user.generateVerificationToken()           // Genera token de verificación
user.generatePasswordResetToken()          // Genera token de reseteo
User.verifyEmailToken(token)               // Verifica token de email
User.verifyResetToken(token)               // Verifica token de reseteo
```

#### 3. `/backend/src/services/auth.service.js`
**Servicio de autenticación actualizado**

**Funcionalidades:**
- Registro con envío automático de verificación
- Login con validación de credenciales
- Verificación de tokens JWT
- Cambio de contraseña con notificación

**Métodos:**
```javascript
authService.register(userData)                      // Registro + email
authService.login(email, password)                  // Login
authService.verifyToken(token)                      // Verificar JWT
authService.changePassword(userId, old, new)        // Cambiar contraseña
```

#### 4. `/backend/src/routes/verification.routes.js`
**API REST de verificación**

**Endpoints:**

```javascript
GET /api/verification/verify-email?token=xxx
// Verificar email con token
// Retorna: { success, message }

POST /api/verification/resend-verification
// Reenviar email de verificación
// Body: { email }
// Retorna: { success, message }

POST /api/verification/forgot-password
// Solicitar reseteo de contraseña
// Body: { email }
// Retorna: { success, message }

POST /api/verification/reset-password
// Resetear contraseña con token
// Body: { token, newPassword }
// Retorna: { success, message }

POST /api/verification/send-bulk-verification
// Enviar verificación masiva (admin)
// Retorna: { success, data: { sent, failed, errors } }

GET /api/verification/verification-stats
// Estadísticas de verificación
// Retorna: { total, verified, unverified, verificationRate }
```

### Frontend

#### 5. `/frontend/src/components/auth/EmailVerification.jsx`
**Componente de verificación de email**

**Funcionalidades:**
- Verificación automática desde URL con token
- Formulario para reenviar email
- Mensajes de éxito/error
- Estados de carga
- Información sobre el proceso

#### 6. `/frontend/src/components/auth/EmailVerification.css`
**Estilos del componente de verificación**

---

## 🚀 Configuración

### 1. Instalar Nodemailer

```bash
cd backend
npm install nodemailer
```

### 2. Configurar Variables de Entorno

Crear archivo `/backend/.env` con:

```env
# Email Configuration
EMAIL_PROVIDER=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion
EMAIL_FROM_NAME=DevsHouse

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=tu-secreto-super-seguro
JWT_EXPIRES_IN=7d
```

### 3. Configurar Gmail (Recomendado)

**Paso 1:** Activar verificación en 2 pasos
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos
3. Actívala

**Paso 2:** Generar contraseña de aplicación
1. Seguridad → Contraseñas de aplicaciones
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Escribe "DevsHouse Backend"
4. Copia la contraseña generada (16 caracteres)
5. Pégala en `EMAIL_APP_PASSWORD`

**Paso 3:** Configurar .env
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  # Sin espacios
EMAIL_FROM_NAME=DevsHouse
```

### 4. Integrar en tu Backend

```javascript
// En backend/src/app.js o index.js
import verificationRoutes from './routes/verification.routes.js';

app.use('/api/verification', verificationRoutes);
```

### 5. Agregar Ruta en Frontend

```javascript
// En frontend/src/App.jsx
import EmailVerification from './components/auth/EmailVerification';

<Route path="/verify-email" element={<EmailVerification />} />
```

---

## 📧 Templates de Email

### 1. Email de Verificación

**Asunto:** ✅ Verifica tu cuenta de DevsHouse

**Contenido:**
- Saludo personalizado
- Botón de verificación destacado
- Enlace alternativo para copiar
- Advertencia de expiración (24h)
- Footer con información legal

**Diseño:**
- Gradiente púrpura (#667eea → #764ba2)
- Responsive
- Compatible con todos los clientes de email

### 2. Email de Bienvenida

**Asunto:** 🎉 ¡Bienvenido/a a DevsHouse!

**Contenido:**
- Confirmación de verificación
- Resumen de funcionalidades:
  - 📚 Convenios Educativos
  - 💡 Emprendimientos
  - 💼 Empleos
  - 🤖 IA de Búsqueda
- Botón para comenzar

### 3. Email de Reseteo de Contraseña

**Asunto:** 🔐 Reseteo de Contraseña - DevsHouse

**Contenido:**
- Botón para resetear
- Advertencias de seguridad
- Expiración en 1 hora
- Instrucciones si no fue solicitado

### 4. Email de Confirmación de Cambio

**Asunto:** 🔒 Tu contraseña ha sido actualizada

**Contenido:**
- Confirmación del cambio
- Fecha y hora del cambio
- Instrucciones si no fue realizado por el usuario

---

## 🔒 Seguridad

### Tokens

**Verificación de Email:**
- Token aleatorio de 32 bytes
- Hasheado con SHA-256
- Expiración: 24 horas
- Un solo uso

**Reseteo de Contraseña:**
- Token aleatorio de 32 bytes
- Hasheado con SHA-256
- Expiración: 1 hora
- Un solo uso

### Implementación Segura

```javascript
// Generación (en User model)
const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex');
const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

// El token original se envía al email
// El token hasheado se guarda en la base de datos

// Verificación
const hashedToken = crypto.createHash('sha256').update(tokenFromURL).digest('hex');
const user = await User.findOne({
  verificationToken: hashedToken,
  verificationTokenExpires: { $gt: Date.now() }
});
```

### Best Practices

1. **Nunca** guardar tokens en texto plano
2. **Siempre** establecer expiración
3. **Invalidar** tokens después de un solo uso
4. **No revelar** si un email existe (en forgot-password)
5. **Notificar** cambios de contraseña por email

---

## 📊 Flujos de Usuario

### Flujo de Registro

```
1. Usuario se registra
   ↓
2. Backend crea usuario (emailVerified: false)
   ↓
3. Backend genera token de verificación
   ↓
4. Backend envía email con enlace
   ↓
5. Usuario hace clic en el enlace
   ↓
6. Frontend redirige a /verify-email?token=xxx
   ↓
7. Backend verifica token y marca email como verificado
   ↓
8. Backend envía email de bienvenida
   ↓
9. Usuario puede usar todas las funcionalidades
```

### Flujo de Reenvío

```
1. Usuario no recibió el email
   ↓
2. Va a /verify-email
   ↓
3. Ingresa su email y solicita reenvío
   ↓
4. Backend genera nuevo token
   ↓
5. Backend envía nuevo email
   ↓
6. Usuario recibe email y verifica
```

### Flujo de Reseteo de Contraseña

```
1. Usuario olvida contraseña
   ↓
2. Hace clic en "Olvidé mi contraseña"
   ↓
3. Ingresa su email
   ↓
4. Backend genera token de reseteo
   ↓
5. Backend envía email con enlace
   ↓
6. Usuario hace clic en el enlace
   ↓
7. Frontend muestra formulario de nueva contraseña
   ↓
8. Usuario ingresa nueva contraseña
   ↓
9. Backend valida token y actualiza contraseña
   ↓
10. Backend envía email de confirmación
```

---

## 🧪 Testing

### Probar con Ethereal Email (Desarrollo)

Si no configuras Gmail, el sistema usa automáticamente Ethereal:

```javascript
// Salida en logs del backend:
Cuenta de email de prueba creada {
  user: 'random@ethereal.email',
  webmail: 'https://ethereal.email/messages'
}

Preview URL: https://ethereal.email/message/xxx
```

Abre la Preview URL para ver el email sin enviarlo realmente.

### Probar Verificación Manual

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# 2. Verificar logs del backend para ver el token

# 3. Verificar email
curl "http://localhost:3000/api/verification/verify-email?token=TOKEN_AQUI"

# 4. Reenviar verificación
curl -X POST http://localhost:3000/api/verification/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
```

### Estadísticas

```bash
curl http://localhost:3000/api/verification/verification-stats
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "total": 100,
    "verified": 85,
    "unverified": 15,
    "verificationRate": "85.00"
  }
}
```

---

## 📈 Funcionalidades Adicionales

### Verificación Masiva (Admin)

Para enviar emails a todos los usuarios no verificados:

```javascript
POST /api/verification/send-bulk-verification
```

Respuesta:
```json
{
  "success": true,
  "message": "Verificación enviada a 15 usuarios",
  "data": {
    "sent": 15,
    "failed": 0,
    "errors": []
  }
}
```

### Personalización de Templates

Los templates están en `email.service.js`. Puedes personalizarlos:

```javascript
// Cambiar colores
background: linear-gradient(135deg, #TU-COLOR-1, #TU-COLOR-2);

// Cambiar logo
<h1>🚀 Tu Nombre</h1>

// Cambiar contenido
<p>Tu mensaje personalizado</p>
```

---

## ⚠️ Troubleshooting

### Email no se envía

**Problema:** No llega el email
**Soluciones:**
1. Verificar configuración en .env
2. Revisar logs del backend
3. Comprobar contraseña de aplicación de Gmail
4. Verificar que no esté en spam
5. Usar Ethereal para testing

### Token expirado

**Problema:** "Token inválido o expirado"
**Solución:** Solicitar reenvío desde /verify-email

### Email ya verificado

**Problema:** Intenta verificar email ya verificado
**Solución:** No es necesario hacer nada, el usuario ya puede usar la plataforma

### Gmail bloquea el envío

**Problema:** Gmail no permite enviar
**Soluciones:**
1. Activar verificación en 2 pasos
2. Generar contraseña de aplicación nueva
3. Verificar que EMAIL_APP_PASSWORD sea correcto
4. Intentar con cuenta de Gmail diferente

---

## 🔗 Integración Completa

### Backend (app.js)

```javascript
import express from 'express';
import verificationRoutes from './routes/verification.routes.js';
import emailService from './services/email.service.js';

const app = express();

// Verificar conexión de email al iniciar
emailService.verifyConnection();

// Rutas
app.use('/api/verification', verificationRoutes);

// ... resto del código
```

### Frontend (App.jsx)

```javascript
import EmailVerification from './components/auth/EmailVerification';

<Routes>
  <Route path="/verify-email" element={<EmailVerification />} />
  {/* ... otras rutas */}
</Routes>
```

---

## ✅ Checklist de Implementación

Backend:
- [x] Servicio de email creado
- [x] Modelo User actualizado con campos de verificación
- [x] Rutas de verificación creadas
- [x] Servicio de auth actualizado
- [ ] Instalar nodemailer: `npm install nodemailer`
- [ ] Configurar .env con credenciales de email
- [ ] Integrar rutas en app.js
- [ ] Probar envío de emails

Frontend:
- [x] Componente EmailVerification creado
- [x] Estilos CSS creados
- [ ] Agregar ruta en App.jsx
- [ ] Probar verificación desde navegador

Testing:
- [ ] Registrar nuevo usuario
- [ ] Verificar que llegue email
- [ ] Hacer clic en enlace de verificación
- [ ] Verificar que llegue email de bienvenida
- [ ] Probar reenvío de verificación
- [ ] Probar reseteo de contraseña

---

## 🎯 Resultado Final

✅ **Sistema completo de verificación de email**
- Backend: Servicio de email + Rutas API + Modelo actualizado
- Frontend: Componente de verificación
- Emails: 4 tipos de emails HTML profesionales
- Seguridad: Tokens hasheados con expiración
- Testing: Soporte para Ethereal Email
- Admin: Verificación masiva

**Estado**: ✅ COMPLETADO - Requiere instalación de nodemailer y configuración de .env

**Próximo paso**: 
1. `cd backend && npm install nodemailer`
2. Configurar .env con credenciales de Gmail
3. Integrar rutas en app.js
