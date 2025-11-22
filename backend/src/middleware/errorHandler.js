import errorMonitor from '../utils/errorMonitor.js';
import logger from '../utils/logger.js';

// ============================================
// MIDDLEWARE DE CAPTURA DE ERRORES
// ============================================

// Capturar errores de rutas asíncronas
export const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Registrar en el monitor
      errorMonitor.registerError(error, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        user: req.user?.id || 'anonymous',
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next(error);
    });
  };
};

// Middleware de manejo de errores globales
export const globalErrorHandler = (err, req, res, next) => {
  // Log del error
  logger.error('Error en request', err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    user: req.user?.id || 'anonymous',
  });

  // Registrar en monitor
  errorMonitor.registerError(err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    user: req.user?.id || 'anonymous',
    userAgent: req.get('user-agent'),
  });

  // Respuesta según tipo de error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Errores de autenticación
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'No autorizado',
      message: 'Token inválido o expirado',
    });
  }

  // Errores de duplicación (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: 'Conflicto',
      message: `El ${field} ya existe`,
    });
  }

  // Errores de cast (MongoDB)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Datos inválidos',
      message: `ID inválido: ${err.value}`,
    });
  }

  // Error genérico
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Error del servidor' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  
  logger.warn('Ruta no encontrada', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  next(error);
};

// Middleware de validación de errores críticos
export const criticalErrorHandler = (err, req, res, next) => {
  // Errores críticos que requieren atención inmediata
  const criticalErrors = [
    'ECONNREFUSED', // No se puede conectar a DB
    'ETIMEDOUT', // Timeout de DB
    'ENOTFOUND', // DNS no resuelve
    'ECONNRESET', // Conexión reseteada
  ];

  if (criticalErrors.includes(err.code)) {
    errorMonitor.createAlert('CRITICAL_ERROR', {
      message: `Error crítico: ${err.message}`,
      severity: 'critical',
      code: err.code,
      url: req.originalUrl,
    });

    logger.error('🚨 ERROR CRÍTICO DETECTADO', err, {
      code: err.code,
      url: req.originalUrl,
    });
  }

  next(err);
};

export default {
  asyncErrorHandler,
  globalErrorHandler,
  notFoundHandler,
  criticalErrorHandler,
};
