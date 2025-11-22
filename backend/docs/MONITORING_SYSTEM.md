# 🔍 Sistema de Monitoreo y Registro de Errores

## ✅ COMPLETADO

Sistema completo de logging y monitoreo de errores con alertas en tiempo real.

---

## 📦 Archivos Creados

### 1. `/backend/src/utils/logger.js`
**Logger principal del sistema**
- 5 niveles de log: ERROR, WARN, INFO, DEBUG, SECURITY
- 4 archivos de log: errors.log, access.log, security.log, activity.log
- Rotación automática al alcanzar 10MB
- Almacenamiento en memoria (últimos 1000 logs)
- Salida a consola con colores (desarrollo)
- Middleware para requests y errores
- Monitoreo de excepciones no capturadas

**Métodos principales:**
```javascript
logger.error(message, error, meta)
logger.warn(message, meta)
logger.info(message, meta)
logger.debug(message, meta)
logger.security(message, meta)
logger.access(req, res, responseTime)
logger.getStats()
logger.getRecentLogs(limit, level)
```

### 2. `/backend/src/utils/errorMonitor.js`
**Monitor de errores en tiempo real**
- Registro de errores con contexto completo
- Contadores por tipo de error
- Tasas de error (errores/minuto)
- Sistema de alertas automáticas
- Detección de patrones anormales

**Umbrales de alerta:**
- errorRate: 10 errores/minuto
- criticalErrors: 5 errores críticos
- consecutiveErrors: 20 errores seguidos

**Métodos principales:**
```javascript
errorMonitor.registerError(error, context)
errorMonitor.getStats()
errorMonitor.getRecentErrors(limit, filter)
errorMonitor.getActiveAlerts()
errorMonitor.acknowledgeAlert(alertId)
errorMonitor.generateReport()
```

### 3. `/backend/src/routes/monitoring.routes.js`
**API de monitoreo para administradores**

**Endpoints disponibles:**
- `GET /api/monitoring/stats` - Estadísticas del sistema
- `GET /api/monitoring/logs` - Logs recientes
- `GET /api/monitoring/errors` - Errores recientes
- `GET /api/monitoring/alerts` - Alertas activas
- `POST /api/monitoring/alerts/:id/acknowledge` - Reconocer alerta
- `GET /api/monitoring/report` - Generar reporte
- `POST /api/monitoring/cleanup` - Limpiar datos antiguos
- `POST /api/monitoring/reset` - Resetear contadores
- `GET /api/monitoring/health` - Health check

### 4. `/backend/src/middleware/errorHandler.js`
**Middleware de manejo de errores**

**Handlers incluidos:**
- `asyncErrorHandler` - Captura errores en funciones async
- `globalErrorHandler` - Handler global de errores
- `notFoundHandler` - Handler de rutas no encontradas
- `criticalErrorHandler` - Detección de errores críticos

**Errores manejados específicamente:**
- ValidationError (Mongoose)
- UnauthorizedError (JWT)
- CastError (MongoDB)
- DuplicateKeyError (MongoDB)
- Errores de conexión críticos

---

## 🚀 Cómo Usar

### 1. Integrar en tu aplicación

```javascript
// app.js o index.js
import express from 'express';
import logger, { requestLogger, errorLogger, setupErrorMonitoring } from './utils/logger.js';
import errorMonitor from './utils/errorMonitor.js';
import monitoringRoutes from './routes/monitoring.routes.js';
import { 
  asyncErrorHandler, 
  globalErrorHandler, 
  notFoundHandler,
  criticalErrorHandler 
} from './middleware/errorHandler.js';

const app = express();

// Middleware de logging
app.use(requestLogger(logger));

// Tus rutas
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Rutas de monitoreo (solo para admins)
app.use('/api/monitoring', monitoringRoutes);

// Middleware de errores (SIEMPRE AL FINAL)
app.use(notFoundHandler);
app.use(criticalErrorHandler);
app.use(errorLogger(logger));
app.use(globalErrorHandler);

// Configurar monitoreo de errores del proceso
setupErrorMonitoring(logger);

app.listen(3000, () => {
  logger.info('Servidor iniciado en puerto 3000');
});
```

### 2. Usar en controladores

```javascript
// controllers/userController.js
import { asyncErrorHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import errorMonitor from '../utils/errorMonitor.js';

// Opción 1: Con asyncErrorHandler
export const createUser = asyncErrorHandler(async (req, res) => {
  const user = await User.create(req.body);
  logger.info('Usuario creado', { userId: user._id });
  res.json({ success: true, data: user });
});

// Opción 2: Try-catch manual
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    logger.info('Usuario actualizado', { userId: user._id });
    res.json({ success: true, data: user });
  } catch (error) {
    errorMonitor.registerError(error, {
      action: 'updateUser',
      userId: req.params.id,
    });
    next(error);
  }
};
```

### 3. Logs personalizados

```javascript
// En cualquier parte de tu código
import logger from '../utils/logger.js';

// Información general
logger.info('Usuario inició sesión', { userId: user._id, email: user.email });

// Advertencias
logger.warn('Intento de acceso sin permisos', { userId, resource: '/admin' });

// Errores
logger.error('Error al procesar pago', error, { orderId, amount });

// Debug (solo en desarrollo)
logger.debug('Datos recibidos', { body: req.body });

// Eventos de seguridad
logger.security('Intento de login fallido', { 
  email, 
  ip: req.ip, 
  attempts: loginAttempts 
});
```

### 4. Consultar el monitor desde el frontend

```javascript
// Obtener estadísticas
const response = await fetch('/api/monitoring/stats');
const { data } = await response.json();
console.log('Estadísticas:', data);

// Obtener errores recientes
const errors = await fetch('/api/monitoring/errors?limit=10');
const { data: recentErrors } = await errors.json();

// Obtener alertas activas
const alerts = await fetch('/api/monitoring/alerts');
const { data: activeAlerts } = await alerts.json();

// Reconocer una alerta
await fetch('/api/monitoring/alerts/ALERT_123/acknowledge', {
  method: 'POST',
});

// Generar reporte
const report = await fetch('/api/monitoring/report');
const { data: reportData } = await report.json();
```

---

## 📊 Estructura de Logs

### Archivo de log
```json
{
  "timestamp": "2024-01-20T10:30:45.123Z",
  "level": "ERROR",
  "message": "Error al procesar pedido",
  "meta": {
    "userId": "507f1f77bcf86cd799439011",
    "orderId": "ORD_12345",
    "error": "Payment gateway timeout"
  }
}
```

### Error registrado
```json
{
  "id": "ERR_1705748445123_abc123xyz",
  "timestamp": "2024-01-20T10:30:45.123Z",
  "message": "Payment gateway timeout",
  "name": "TimeoutError",
  "stack": "Error: Payment gateway timeout\n    at ...",
  "context": {
    "userId": "507f1f77bcf86cd799439011",
    "orderId": "ORD_12345",
    "method": "POST",
    "url": "/api/orders/checkout"
  }
}
```

### Alerta generada
```json
{
  "id": "ALERT_1705748445123",
  "type": "HIGH_ERROR_RATE",
  "timestamp": "2024-01-20T10:30:45.123Z",
  "severity": "high",
  "data": {
    "message": "Tasa alta de errores: 15 errores/minuto",
    "errorCount": 15
  },
  "acknowledged": false
}
```

---

## 🔔 Tipos de Alertas

### HIGH_ERROR_RATE
- **Trigger**: 10+ errores en 1 minuto
- **Severidad**: Alta
- **Acción**: Revisar logs de errores recientes

### CONSECUTIVE_ERRORS
- **Trigger**: 20 errores consecutivos
- **Severidad**: Crítica
- **Acción**: Posible problema sistémico, revisar inmediatamente

### CRITICAL_ERROR
- **Trigger**: Errores de conexión a base de datos, timeouts, etc.
- **Severidad**: Crítica
- **Acción**: Verificar conectividad y servicios externos

---

## 📈 Estadísticas Disponibles

```javascript
const stats = await errorMonitor.getStats();
/*
{
  total: 234,              // Total de errores registrados
  lastHour: 45,            // Errores en la última hora
  lastDay: 187,            // Errores en las últimas 24 horas
  byType: {                // Conteo por tipo
    "ValidationError": 89,
    "TimeoutError": 23,
    "UnauthorizedError": 12,
    ...
  },
  errorRate: {             // Tasa actual
    lastMinute: 3,
    timestamp: "2024-01-20T10:30:45.123Z"
  },
  activeAlerts: 2,         // Alertas sin reconocer
  topErrors: [             // Errores más frecuentes
    { type: "ValidationError", count: 89 },
    { type: "TimeoutError", count: 23 },
    ...
  ]
}
*/
```

---

## 🛡️ Protección y Seguridad

1. **Archivos de log protegidos**: Solo accesibles por el servidor
2. **API de monitoreo**: Debe estar protegida con autenticación de admin
3. **Datos sensibles**: No se registran contraseñas ni tokens
4. **Rotación automática**: Los logs se rotan automáticamente
5. **Limpieza periódica**: Logs antiguos se eliminan automáticamente

---

## ⚙️ Configuración Recomendada

### Variables de entorno (.env)
```env
NODE_ENV=production
LOG_LEVEL=info                    # error, warn, info, debug
LOG_DIR=./logs                    # Directorio de logs
LOG_MAX_SIZE=10485760             # 10MB en bytes
LOG_RETENTION_DAYS=30             # Días de retención
ERROR_MONITOR_MAX_ERRORS=500      # Errores en memoria
ERROR_RATE_THRESHOLD=10           # Errores/minuto para alerta
```

### Permisos recomendados
```bash
# Crear directorio de logs
mkdir -p backend/logs
chmod 750 backend/logs

# Solo el servidor puede escribir
chown -R node:node backend/logs
```

---

## 🧪 Testing del Sistema

```javascript
// Probar logger
logger.info('Test de información');
logger.error('Test de error', new Error('Error de prueba'));
logger.security('Test de seguridad', { ip: '127.0.0.1' });

// Probar monitor
const testError = new Error('Error de prueba');
errorMonitor.registerError(testError, { test: true });

// Verificar estadísticas
const stats = errorMonitor.getStats();
console.log('Estadísticas:', stats);

// Generar múltiples errores para probar alertas
for (let i = 0; i < 15; i++) {
  errorMonitor.registerError(new Error(`Test ${i}`), { test: true });
}

// Verificar alertas generadas
const alerts = errorMonitor.getActiveAlerts();
console.log('Alertas:', alerts);
```

---

## 📝 Próximos Pasos

1. **Integrar en app.js**: Importar y configurar todos los middlewares
2. **Proteger rutas de monitoreo**: Agregar middleware de autenticación admin
3. **Crear dashboard de monitoreo**: Panel visual en el frontend
4. **Configurar notificaciones**: Email/Slack para alertas críticas
5. **Implementar métricas**: APM (Application Performance Monitoring)

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias si faltan
- [ ] Importar logger y errorMonitor en app.js
- [ ] Agregar middleware de logging
- [ ] Agregar rutas de monitoreo
- [ ] Configurar handlers de error
- [ ] Proteger endpoints de monitoreo con auth
- [ ] Probar sistema con errores controlados
- [ ] Crear dashboard en frontend (opcional)
- [ ] Configurar alertas por email/webhook
- [ ] Documentar para el equipo

---

## 🎯 Resultado Final

✅ Sistema completo de logging con 5 niveles
✅ Monitor de errores en tiempo real
✅ Sistema de alertas automáticas
✅ API REST para consultar logs y errores
✅ Middleware de manejo de errores
✅ Rotación y limpieza automática
✅ Health check endpoint
✅ Reportes generados automáticamente

**Estado**: ✅ COMPLETADO - Listo para integrar
