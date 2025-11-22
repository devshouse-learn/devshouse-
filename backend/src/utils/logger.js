import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURACIÓN DE LOGS
// ============================================

const LOG_DIR = path.join(__dirname, '../../logs');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'errors.log');
const ACCESS_LOG_FILE = path.join(LOG_DIR, 'access.log');
const SECURITY_LOG_FILE = path.join(LOG_DIR, 'security.log');
const ACTIVITY_LOG_FILE = path.join(LOG_DIR, 'activity.log');

// Crear directorio de logs si no existe
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ============================================
// NIVELES DE LOG
// ============================================

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  SECURITY: 'SECURITY',
};

// ============================================
// COLORES PARA CONSOLA
// ============================================

const COLORS = {
  ERROR: '\x1b[31m', // Rojo
  WARN: '\x1b[33m', // Amarillo
  INFO: '\x1b[36m', // Cyan
  DEBUG: '\x1b[35m', // Magenta
  SECURITY: '\x1b[91m', // Rojo brillante
  RESET: '\x1b[0m',
};

// ============================================
// CLASE LOGGER
// ============================================

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogsInMemory = 1000;
    this.rotateSize = 10 * 1024 * 1024; // 10MB
  }

  // Formatear mensaje de log
  formatLog(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      pid: process.pid,
    };
  }

  // Escribir en archivo
  writeToFile(filePath, content) {
    try {
      // Verificar tamaño del archivo y rotar si es necesario
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > this.rotateSize) {
          this.rotateLog(filePath);
        }
      }

      fs.appendFileSync(filePath, content + '\n', 'utf8');
    } catch (error) {
      console.error('Error escribiendo log:', error);
    }
  }

  // Rotar logs cuando son muy grandes
  rotateLog(filePath) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const rotatedPath = filePath.replace('.log', `-${timestamp}.log`);
    
    try {
      fs.renameSync(filePath, rotatedPath);
      console.log(`📁 Log rotado: ${rotatedPath}`);
    } catch (error) {
      console.error('Error rotando log:', error);
    }
  }

  // Log genérico
  log(level, message, meta = {}) {
    const logEntry = this.formatLog(level, message, meta);
    
    // Guardar en memoria
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs.shift();
    }

    // Formatear para consola y archivo
    const consoleMessage = `${COLORS[level]}[${logEntry.timestamp}] [${level}]${COLORS.RESET} ${message}`;
    const fileMessage = JSON.stringify(logEntry);

    // Mostrar en consola (solo en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      console.log(consoleMessage);
      if (Object.keys(meta).length > 0) {
        console.log('  Meta:', meta);
      }
    }

    return { consoleMessage, fileMessage, logEntry };
  }

  // ERROR: Errores críticos
  error(message, error = null, meta = {}) {
    const errorMeta = {
      ...meta,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : null,
    };

    const { fileMessage } = this.log(LOG_LEVELS.ERROR, message, errorMeta);
    this.writeToFile(ERROR_LOG_FILE, fileMessage);

    // Notificar errores críticos (implementar según necesidad)
    if (meta.critical) {
      this.notifyCriticalError(message, error);
    }
  }

  // WARN: Advertencias
  warn(message, meta = {}) {
    const { fileMessage } = this.log(LOG_LEVELS.WARN, message, meta);
    this.writeToFile(ERROR_LOG_FILE, fileMessage);
  }

  // INFO: Información general
  info(message, meta = {}) {
    const { fileMessage } = this.log(LOG_LEVELS.INFO, message, meta);
    this.writeToFile(ACTIVITY_LOG_FILE, fileMessage);
  }

  // DEBUG: Debug (solo en desarrollo)
  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LOG_LEVELS.DEBUG, message, meta);
    }
  }

  // SECURITY: Eventos de seguridad
  security(message, meta = {}) {
    const { fileMessage } = this.log(LOG_LEVELS.SECURITY, message, meta);
    this.writeToFile(SECURITY_LOG_FILE, fileMessage);
  }

  // ACCESS: Logs de acceso HTTP
  access(req, res, responseTime) {
    const accessLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      user: req.user?.email || 'anonymous',
    };

    const fileMessage = JSON.stringify(accessLog);
    this.writeToFile(ACCESS_LOG_FILE, fileMessage);

    // Log en consola (desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      const color = res.statusCode >= 400 ? COLORS.ERROR : COLORS.INFO;
      console.log(
        `${color}[${accessLog.timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms${COLORS.RESET}`
      );
    }
  }

  // Notificar errores críticos
  notifyCriticalError(message, error) {
    // Aquí puedes implementar:
    // - Envío de email
    // - Notificación a Slack
    // - Envío a servicio de monitoreo (Sentry, etc.)
    console.error(`🚨 ERROR CRÍTICO: ${message}`);
    if (error) {
      console.error(error);
    }
  }

  // Obtener logs recientes
  getRecentLogs(limit = 100, level = null) {
    let logs = this.logs;
    
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    
    return logs.slice(-limit);
  }

  // Obtener estadísticas de logs
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {},
      lastHour: 0,
    };

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    this.logs.forEach(log => {
      // Contar por nivel
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;

      // Contar última hora
      if (new Date(log.timestamp) > oneHourAgo) {
        stats.lastHour++;
      }
    });

    return stats;
  }

  // Limpiar logs antiguos
  cleanOldLogs(daysToKeep = 30) {
    const files = fs.readdirSync(LOG_DIR);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    files.forEach(file => {
      const filePath = path.join(LOG_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Log antiguo eliminado: ${file}`);
      }
    });
  }
}

// ============================================
// MIDDLEWARE DE LOGGING
// ============================================

export const requestLogger = (logger) => {
  return (req, res, next) => {
    const startTime = Date.now();

    // Capturar cuando se envía la respuesta
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      logger.access(req, res, responseTime);
    });

    next();
  };
};

// ============================================
// MIDDLEWARE DE ERRORES
// ============================================

export const errorLogger = (logger) => {
  return (err, req, res, next) => {
    logger.error('Error en request', err, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      user: req.user?.email,
      body: req.body,
      params: req.params,
      query: req.query,
    });

    next(err);
  };
};

// ============================================
// MONITOR DE ERRORES NO CAPTURADOS
// ============================================

export const setupErrorMonitoring = (logger) => {
  // Errores no capturados
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error, { critical: true });
    console.error('🔥 UNCAUGHT EXCEPTION:', error);
    // Dar tiempo para escribir los logs antes de salir
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  // Promesas rechazadas no manejadas
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', reason, {
      critical: true,
      promise: promise.toString(),
    });
    console.error('🔥 UNHANDLED REJECTION:', reason);
  });

  // Señales de terminación
  process.on('SIGTERM', () => {
    logger.info('SIGTERM recibido, cerrando servidor...');
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT recibido, cerrando servidor...');
    process.exit(0);
  });
};

// ============================================
// EXPORTAR INSTANCIA SINGLETON
// ============================================

const logger = new Logger();

export { logger, Logger, LOG_LEVELS };
export default logger;
