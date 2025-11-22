import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// ============================================
// 1. PROTECCIÓN CONTRA ATAQUES DE FUERZA BRUTA
// ============================================

// Limitador general de requests
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: {
    error: 'Demasiadas solicitudes desde esta IP. Por favor intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador estricto para login/registro
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos
  skipSuccessfulRequests: true, // No contar requests exitosos
  message: {
    error: 'Demasiados intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos.',
  },
});

// Limitador para reseteo de contraseña
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 intentos por hora
  message: {
    error: 'Demasiados intentos de reseteo de contraseña. Por favor intenta de nuevo en 1 hora.',
  },
});

// Limitador para creación de contenido
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Máximo 10 creaciones por hora
  message: {
    error: 'Has alcanzado el límite de creación de contenido. Por favor intenta de nuevo en 1 hora.',
  },
});

// ============================================
// 2. PROTECCIÓN DE HEADERS HTTP (HELMET)
// ============================================

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' },
  xssFilter: true,
});

// ============================================
// 3. SANITIZACIÓN DE DATOS
// ============================================

// Protección contra NoSQL Injection
export const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ Intento de NoSQL injection detectado en ${req.path} - clave: ${key}`);
  },
});

// Protección contra XSS (Cross-Site Scripting)
export const preventXSS = xss();

// ============================================
// 4. VALIDACIÓN DE ENTRADA
// ============================================

export const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validación fallida',
        errors,
      });
    }

    next();
  };
};

// ============================================
// 5. DETECCIÓN DE PATRONES SOSPECHOSOS
// ============================================

export const detectSuspiciousPatterns = (req, res, next) => {
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi, // Scripts XSS
    /javascript:/gi, // JavaScript en URLs
    /on\w+\s*=/gi, // Event handlers (onClick, onLoad, etc)
    /\$\{.*?\}/g, // Template injection
    /\{\{.*?\}\}/g, // Template injection
    /(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi, // SQL injection
    /(\$where|\$regex|\$ne|\$gt|\$lt)/gi, // NoSQL injection
    /../g, // Path traversal
    /\.\.\\/g, // Path traversal
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (checkValue(value[key])) {
          return true;
        }
      }
    }
    return false;
  };

  // Verificar body, query y params
  const isSuspicious =
    checkValue(req.body) || checkValue(req.query) || checkValue(req.params);

  if (isSuspicious) {
    console.error(`🚨 Patrón sospechoso detectado en ${req.path} desde IP ${req.ip}`);
    return res.status(400).json({
      success: false,
      message: 'Solicitud rechazada por contener patrones sospechosos',
    });
  }

  next();
};

// ============================================
// 6. PROTECCIÓN CSRF
// ============================================

export const csrfProtection = (req, res, next) => {
  // Para requests que modifican datos
  const methodsToProtect = ['POST', 'PUT', 'PATCH', 'DELETE'];
  
  if (methodsToProtect.includes(req.method)) {
    const csrfToken = req.headers['x-csrf-token'];
    const sessionToken = req.session?.csrfToken;

    if (!csrfToken || csrfToken !== sessionToken) {
      return res.status(403).json({
        success: false,
        message: 'Token CSRF inválido o ausente',
      });
    }
  }

  next();
};

// ============================================
// 7. LOGGING DE ACTIVIDAD SOSPECHOSA
// ============================================

export const logSuspiciousActivity = (req, res, next) => {
  const suspiciousIndicators = [];

  // Múltiples headers de origen
  if (req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(',').length > 3) {
    suspiciousIndicators.push('Múltiples proxies detectados');
  }

  // User-agent sospechoso
  const userAgent = req.headers['user-agent'] || '';
  const suspiciousAgents = ['bot', 'crawler', 'scanner', 'nikto', 'sqlmap', 'havij'];
  if (suspiciousAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
    suspiciousIndicators.push('User-agent sospechoso');
  }

  // Requests muy rápidos
  const requestTime = Date.now();
  const lastRequestTime = req.session?.lastRequestTime || 0;
  if (requestTime - lastRequestTime < 100) {
    // Menos de 100ms
    suspiciousIndicators.push('Requests muy rápidos (posible bot)');
  }
  req.session.lastRequestTime = requestTime;

  if (suspiciousIndicators.length > 0) {
    console.warn(`⚠️ Actividad sospechosa desde IP ${req.ip}:`, suspiciousIndicators);
  }

  next();
};

// ============================================
// 8. PROTECCIÓN CONTRA ENUMERACIÓN DE USUARIOS
// ============================================

export const preventUserEnumeration = (req, res, next) => {
  // Agregar un pequeño delay aleatorio para dificultar timing attacks
  const delay = Math.floor(Math.random() * 100) + 50; // 50-150ms
  
  setTimeout(() => {
    next();
  }, delay);
};

// ============================================
// 9. VALIDACIÓN DE TAMAÑO DE PAYLOAD
// ============================================

export const limitPayloadSize = (maxSize = '10kb') => {
  return (req, res, next) => {
    const contentLength = req.headers['content-length'];
    
    if (contentLength && parseInt(contentLength) > parseSize(maxSize)) {
      return res.status(413).json({
        success: false,
        message: `Payload demasiado grande. Máximo permitido: ${maxSize}`,
      });
    }
    
    next();
  };
};

function parseSize(size) {
  const units = { kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 };
  const match = size.match(/^(\d+)(kb|mb|gb)$/i);
  if (!match) return 10240; // Default 10kb
  return parseInt(match[1]) * units[match[2].toLowerCase()];
}

// ============================================
// 10. PROTECCIÓN CONTRA CLICKJACKING
// ============================================

export const preventClickjacking = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  next();
};

// ============================================
// MIDDLEWARE COMBINADO DE SEGURIDAD
// ============================================

export const securityMiddleware = [
  securityHeaders,
  sanitizeData,
  preventXSS,
  detectSuspiciousPatterns,
  logSuspiciousActivity,
  preventClickjacking,
];

export default {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  createLimiter,
  securityHeaders,
  sanitizeData,
  preventXSS,
  validateInput,
  detectSuspiciousPatterns,
  csrfProtection,
  logSuspiciousActivity,
  preventUserEnumeration,
  limitPayloadSize,
  preventClickjacking,
  securityMiddleware,
};
