import errorMonitor from '../utils/errorMonitor.js';
import logger from '../utils/logger.js';

// ============================================
// SERVICIO DE DIAGNÓSTICO CON IA
// ============================================

class AIDiagnosticService {
  constructor() {
    // Base de conocimiento de problemas comunes
    this.knowledgeBase = {
      // Errores de autenticación
      auth: {
        patterns: ['unauthorized', 'token', 'jwt', 'authentication', 'login', 'password'],
        solutions: [
          {
            problem: 'Token expirado o inválido',
            symptoms: ['401', 'unauthorized', 'jwt expired', 'token invalid'],
            fixes: [
              'Cerrar sesión y volver a iniciar sesión',
              'Verificar que el token no haya expirado',
              'Limpiar cookies y localStorage',
              'Verificar configuración de JWT_SECRET en .env'
            ],
            autoFix: 'clearAuthTokens',
            severity: 'medium'
          },
          {
            problem: 'Credenciales incorrectas',
            symptoms: ['incorrect password', 'invalid credentials', 'user not found'],
            fixes: [
              'Verificar que el correo y contraseña sean correctos',
              'Resetear contraseña si la olvidaste',
              'Verificar que el usuario esté registrado',
              'Revisar mayúsculas/minúsculas en la contraseña'
            ],
            autoFix: null,
            severity: 'low'
          }
        ]
      },

      // Errores de conexión
      connection: {
        patterns: ['connection', 'network', 'econnrefused', 'timeout', 'fetch failed'],
        solutions: [
          {
            problem: 'Servidor backend no disponible',
            symptoms: ['econnrefused', 'net::err_connection_refused', 'fetch failed'],
            fixes: [
              'Verificar que el servidor backend esté ejecutándose',
              'Revisar que el puerto 3000 esté disponible',
              'Ejecutar: cd backend && npm start',
              'Verificar VITE_API_URL en .env del frontend'
            ],
            autoFix: 'checkBackendStatus',
            severity: 'high'
          },
          {
            problem: 'Timeout de conexión',
            symptoms: ['etimedout', 'timeout', 'request timeout'],
            fixes: [
              'Verificar conexión a internet',
              'Aumentar timeout en configuración',
              'Verificar firewall o antivirus',
              'Revisar carga del servidor'
            ],
            autoFix: 'pingServer',
            severity: 'medium'
          }
        ]
      },

      // Errores de base de datos
      database: {
        patterns: ['mongodb', 'mongoose', 'database', 'db', 'collection'],
        solutions: [
          {
            problem: 'No se puede conectar a MongoDB',
            symptoms: ['mongoerror', 'connection to mongodb failed', 'econnrefused.*27017'],
            fixes: [
              'Verificar que MongoDB esté ejecutándose',
              'Revisar MONGODB_URI en .env',
              'Verificar credenciales de MongoDB',
              'Comprobar que el puerto 27017 esté disponible'
            ],
            autoFix: 'checkMongoConnection',
            severity: 'critical'
          },
          {
            problem: 'Error de validación de datos',
            symptoms: ['validationerror', 'validation failed', 'required field'],
            fixes: [
              'Verificar que todos los campos requeridos estén presentes',
              'Revisar formato de los datos enviados',
              'Comprobar tipos de datos (string, number, etc.)',
              'Revisar modelo de Mongoose'
            ],
            autoFix: null,
            severity: 'low'
          }
        ]
      },

      // Errores de frontend
      frontend: {
        patterns: ['react', 'component', 'render', 'undefined', 'null'],
        solutions: [
          {
            problem: 'Componente React no renderiza',
            symptoms: ['nothing was returned from render', 'invalid react element'],
            fixes: [
              'Verificar que el componente retorne JSX válido',
              'Comprobar que no haya errores de sintaxis',
              'Revisar imports de componentes',
              'Verificar que useEffect no tenga bucles infinitos'
            ],
            autoFix: null,
            severity: 'medium'
          },
          {
            problem: 'Error de referencia nula',
            symptoms: ['cannot read property.*of undefined', 'cannot read property.*of null'],
            fixes: [
              'Usar optional chaining: objeto?.propiedad',
              'Validar que el objeto exista antes de acceder',
              'Usar valores por defecto: objeto ?? valorDefault',
              'Revisar estado inicial de useState'
            ],
            autoFix: null,
            severity: 'medium'
          }
        ]
      },

      // Errores de CORS
      cors: {
        patterns: ['cors', 'cross-origin', 'access-control'],
        solutions: [
          {
            problem: 'Error de CORS',
            symptoms: ['blocked by cors', 'access-control-allow-origin', 'cross-origin request blocked'],
            fixes: [
              'Configurar CORS en el backend: app.use(cors())',
              'Agregar origen permitido en configuración CORS',
              'Verificar que el frontend use la URL correcta',
              'Revisar que los headers estén configurados'
            ],
            autoFix: 'suggestCorsConfig',
            severity: 'medium'
          }
        ]
      },

      // Errores de permisos
      permissions: {
        patterns: ['forbidden', 'permission', 'role', 'access denied'],
        solutions: [
          {
            problem: 'Acceso denegado por permisos',
            symptoms: ['403', 'forbidden', 'access denied', 'insufficient permissions'],
            fixes: [
              'Verificar que el usuario tenga el rol adecuado',
              'Comprobar que la ruta esté protegida correctamente',
              'Revisar middleware de autenticación',
              'Verificar permisos en el panel de admin'
            ],
            autoFix: 'checkUserPermissions',
            severity: 'medium'
          }
        ]
      }
    };

    // Soluciones automáticas
    this.autoFixers = {
      clearAuthTokens: this.clearAuthTokens.bind(this),
      checkBackendStatus: this.checkBackendStatus.bind(this),
      pingServer: this.pingServer.bind(this),
      checkMongoConnection: this.checkMongoConnection.bind(this),
      suggestCorsConfig: this.suggestCorsConfig.bind(this),
      checkUserPermissions: this.checkUserPermissions.bind(this),
    };
  }

  // Analizar error y encontrar soluciones
  async diagnose(errorData) {
    try {
      const { message, stack, context } = errorData;
      const searchText = `${message} ${stack || ''} ${JSON.stringify(context || {})}`.toLowerCase();

      const diagnosis = {
        timestamp: new Date().toISOString(),
        error: errorData,
        possibleCauses: [],
        recommendations: [],
        autoFixAvailable: false,
        severity: 'unknown',
        category: 'unknown'
      };

      // Buscar en la base de conocimiento
      for (const [category, categoryData] of Object.entries(this.knowledgeBase)) {
        // Verificar si el error coincide con los patrones
        const matchesPattern = categoryData.patterns.some(pattern => 
          searchText.includes(pattern.toLowerCase())
        );

        if (matchesPattern) {
          diagnosis.category = category;

          // Buscar soluciones específicas
          for (const solution of categoryData.solutions) {
            const matchesSymptom = solution.symptoms.some(symptom => {
              const regex = new RegExp(symptom.toLowerCase(), 'i');
              return regex.test(searchText);
            });

            if (matchesSymptom) {
              diagnosis.possibleCauses.push(solution.problem);
              diagnosis.recommendations.push(...solution.fixes);
              diagnosis.severity = solution.severity;
              
              if (solution.autoFix) {
                diagnosis.autoFixAvailable = true;
                diagnosis.autoFixFunction = solution.autoFix;
              }
            }
          }
        }
      }

      // Si no se encontraron recomendaciones específicas, dar consejos generales
      if (diagnosis.recommendations.length === 0) {
        diagnosis.recommendations = this.getGenericRecommendations(errorData);
        diagnosis.severity = 'medium';
      }

      // Agregar información adicional basada en el contexto
      if (context) {
        diagnosis.contextAnalysis = this.analyzeContext(context);
      }

      logger.info('Diagnóstico generado', { diagnosis });
      return diagnosis;

    } catch (error) {
      logger.error('Error al generar diagnóstico', error);
      return {
        error: 'No se pudo generar el diagnóstico',
        recommendations: ['Contactar con soporte técnico']
      };
    }
  }

  // Analizar contexto del error
  analyzeContext(context) {
    const analysis = {};

    // Analizar método HTTP
    if (context.method) {
      analysis.method = {
        value: context.method,
        suggestion: context.method === 'POST' 
          ? 'Verificar datos enviados en el body'
          : 'Verificar parámetros de la URL'
      };
    }

    // Analizar código de estado
    if (context.statusCode || context.status) {
      const status = context.statusCode || context.status;
      analysis.statusCode = {
        value: status,
        meaning: this.getStatusCodeMeaning(status)
      };
    }

    // Analizar URL
    if (context.url) {
      analysis.url = {
        value: context.url,
        suggestion: this.analyzeUrl(context.url)
      };
    }

    return analysis;
  }

  // Obtener significado de código de estado
  getStatusCodeMeaning(status) {
    const meanings = {
      400: 'Solicitud incorrecta - Verificar datos enviados',
      401: 'No autorizado - Verificar autenticación',
      403: 'Prohibido - Verificar permisos',
      404: 'No encontrado - Verificar URL o recurso',
      409: 'Conflicto - Recurso duplicado',
      422: 'Datos no procesables - Verificar validación',
      500: 'Error del servidor - Revisar logs del backend',
      502: 'Bad Gateway - Problema con el servidor',
      503: 'Servicio no disponible - Servidor sobrecargado o caído'
    };

    return meanings[status] || 'Código de estado desconocido';
  }

  // Analizar URL para detectar problemas
  analyzeUrl(url) {
    if (url.includes('undefined') || url.includes('null')) {
      return 'La URL contiene valores indefinidos - Verificar parámetros';
    }
    if (!url.startsWith('http')) {
      return 'URL relativa - Verificar configuración de baseURL';
    }
    if (url.includes('localhost') && !url.includes('3000')) {
      return 'Posible puerto incorrecto - Backend debería estar en puerto 3000';
    }
    return 'URL parece correcta';
  }

  // Recomendaciones genéricas
  getGenericRecommendations(errorData) {
    const recommendations = [
      'Revisar los logs del servidor en la consola',
      'Verificar la conexión a internet',
      'Comprobar que todos los servicios estén ejecutándose',
      'Limpiar caché del navegador (Ctrl+Shift+R)',
      'Revisar la consola del navegador para más detalles'
    ];

    // Agregar recomendaciones basadas en el tipo de error
    if (errorData.message?.includes('network')) {
      recommendations.unshift('Problema de red detectado - Verificar conectividad');
    }
    if (errorData.stack?.includes('async')) {
      recommendations.push('Error en operación asíncrona - Revisar promises y async/await');
    }

    return recommendations;
  }

  // ============================================
  // FUNCIONES DE AUTO-REPARACIÓN
  // ============================================

  async clearAuthTokens() {
    return {
      action: 'clearAuthTokens',
      instructions: [
        'Ejecutar en consola del navegador: localStorage.clear()',
        'Ejecutar en consola del navegador: sessionStorage.clear()',
        'Recargar la página',
        'Volver a iniciar sesión'
      ],
      code: `
// Ejecutar en consola del navegador
localStorage.clear();
sessionStorage.clear();
location.reload();
      `.trim(),
      success: true
    };
  }

  async checkBackendStatus() {
    return {
      action: 'checkBackendStatus',
      instructions: [
        'Abrir terminal en la carpeta del proyecto',
        'Ejecutar: cd backend',
        'Ejecutar: npm start',
        'Verificar que aparezca: "Servidor iniciado en puerto 3000"'
      ],
      commands: [
        'cd backend',
        'npm start'
      ],
      success: true
    };
  }

  async pingServer() {
    return {
      action: 'pingServer',
      instructions: [
        'Verificar que el backend responda',
        'Abrir: http://localhost:3000/api/health',
        'Debe mostrar respuesta JSON',
        'Si no responde, reiniciar el servidor'
      ],
      testUrl: 'http://localhost:3000/api/health',
      success: true
    };
  }

  async checkMongoConnection() {
    return {
      action: 'checkMongoConnection',
      instructions: [
        'Verificar que MongoDB esté ejecutándose',
        'Si tienes MongoDB local: mongod --version',
        'Si usas MongoDB Atlas: verificar conexión a internet',
        'Revisar MONGODB_URI en el archivo .env',
        'Formato: mongodb://localhost:27017/devshouse o tu connection string'
      ],
      commands: [
        'mongod --version',
        'mongo --eval "db.stats()"'
      ],
      success: true
    };
  }

  async suggestCorsConfig() {
    return {
      action: 'suggestCorsConfig',
      instructions: [
        'Agregar configuración CORS en backend/src/app.js',
        'Instalar: npm install cors',
        'Importar y configurar CORS'
      ],
      code: `
// En backend/src/app.js
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
      `.trim(),
      success: true
    };
  }

  async checkUserPermissions(userId, requiredRole) {
    return {
      action: 'checkUserPermissions',
      instructions: [
        'Verificar rol del usuario en el panel de admin',
        `Rol requerido: ${requiredRole || 'admin'}`,
        'Si no tienes permisos, solicitar a un administrador',
        'Verificar que el middleware de autenticación esté configurado'
      ],
      success: true
    };
  }

  // Ejecutar auto-reparación
  async executeAutoFix(fixFunction, ...args) {
    try {
      if (this.autoFixers[fixFunction]) {
        const result = await this.autoFixers[fixFunction](...args);
        logger.info(`Auto-fix ejecutado: ${fixFunction}`, result);
        return result;
      }
      return { success: false, error: 'Función de auto-fix no encontrada' };
    } catch (error) {
      logger.error(`Error al ejecutar auto-fix: ${fixFunction}`, error);
      return { success: false, error: error.message };
    }
  }

  // Obtener ayuda interactiva
  async getInteractiveHelp(query) {
    const lowerQuery = query.toLowerCase();
    const help = {
      query,
      suggestions: [],
      relatedTopics: []
    };

    // Búsqueda en la base de conocimiento
    for (const [category, categoryData] of Object.entries(this.knowledgeBase)) {
      const matches = categoryData.patterns.some(pattern => 
        lowerQuery.includes(pattern)
      );

      if (matches) {
        help.suggestions.push({
          category,
          solutions: categoryData.solutions.map(s => ({
            problem: s.problem,
            fixes: s.fixes.slice(0, 3) // Primeras 3 soluciones
          }))
        });
      }
    }

    // Temas relacionados
    const commonIssues = [
      'No puedo iniciar sesión',
      'La página no carga',
      'Error 500',
      'No puedo conectarme al servidor',
      'Error de base de datos'
    ];

    help.relatedTopics = commonIssues.filter(issue => 
      !lowerQuery.includes(issue.toLowerCase())
    ).slice(0, 3);

    return help;
  }

  // Analizar múltiples errores recientes
  async analyzeErrorPattern() {
    const recentErrors = errorMonitor.getRecentErrors(50);
    
    if (recentErrors.length === 0) {
      return {
        message: 'No hay errores recientes para analizar',
        status: 'healthy'
      };
    }

    const analysis = {
      totalErrors: recentErrors.length,
      uniqueErrors: new Set(recentErrors.map(e => e.name)).size,
      mostCommon: {},
      pattern: null,
      recommendation: null
    };

    // Contar errores por tipo
    recentErrors.forEach(error => {
      const type = error.name || 'Unknown';
      analysis.mostCommon[type] = (analysis.mostCommon[type] || 0) + 1;
    });

    // Detectar patrones
    const errorTypes = Object.keys(analysis.mostCommon);
    if (errorTypes.length === 1) {
      analysis.pattern = 'Mismo error repetido';
      analysis.recommendation = 'Problema específico que necesita atención inmediata';
    } else if (recentErrors.length > 20 && Date.now() - new Date(recentErrors[0].timestamp).getTime() < 60000) {
      analysis.pattern = 'Cascada de errores';
      analysis.recommendation = 'Posible problema sistémico - Revisar servicio principal';
    }

    // Generar diagnóstico del error más común
    const mostCommonType = Object.entries(analysis.mostCommon)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostCommonType) {
      const [type, count] = mostCommonType;
      const sampleError = recentErrors.find(e => e.name === type);
      analysis.diagnosis = await this.diagnose(sampleError);
    }

    return analysis;
  }
}

// Exportar instancia singleton
const aiDiagnostic = new AIDiagnosticService();

export { aiDiagnostic, AIDiagnosticService };
export default aiDiagnostic;
