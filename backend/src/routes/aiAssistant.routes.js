import express from 'express';
import aiDiagnostic from '../services/aiDiagnostic.service.js';
import errorMonitor from '../utils/errorMonitor.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================
// ENDPOINTS DE ASISTENTE IA
// ============================================

// Diagnosticar un error específico
router.post('/diagnose', async (req, res) => {
  try {
    const { error, context } = req.body;

    if (!error || !error.message) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un objeto de error con mensaje'
      });
    }

    const diagnosis = await aiDiagnostic.diagnose({
      message: error.message,
      stack: error.stack,
      name: error.name,
      context
    });

    logger.info('Diagnóstico solicitado', { 
      error: error.message,
      userId: req.user?.id 
    });

    res.json({
      success: true,
      data: diagnosis
    });

  } catch (error) {
    logger.error('Error al diagnosticar', error);
    res.status(500).json({
      success: false,
      error: 'Error al generar diagnóstico'
    });
  }
});

// Obtener ayuda interactiva
router.post('/help', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere una consulta'
      });
    }

    const help = await aiDiagnostic.getInteractiveHelp(query);

    res.json({
      success: true,
      data: help
    });

  } catch (error) {
    logger.error('Error al obtener ayuda', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener ayuda'
    });
  }
});

// Ejecutar auto-reparación
router.post('/autofix', async (req, res) => {
  try {
    const { fixFunction, args = [] } = req.body;

    if (!fixFunction) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere el nombre de la función de auto-fix'
      });
    }

    const result = await aiDiagnostic.executeAutoFix(fixFunction, ...args);

    logger.security('Auto-fix ejecutado', {
      function: fixFunction,
      userId: req.user?.id,
      result: result.success
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Error al ejecutar auto-fix', error);
    res.status(500).json({
      success: false,
      error: 'Error al ejecutar auto-fix'
    });
  }
});

// Analizar patrón de errores recientes
router.get('/analyze-pattern', async (req, res) => {
  try {
    const analysis = await aiDiagnostic.analyzeErrorPattern();

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    logger.error('Error al analizar patrón', error);
    res.status(500).json({
      success: false,
      error: 'Error al analizar patrón de errores'
    });
  }
});

// Diagnosticar error por ID
router.get('/diagnose/:errorId', async (req, res) => {
  try {
    const { errorId } = req.params;
    const errors = errorMonitor.getRecentErrors(500);
    const error = errors.find(e => e.id === errorId);

    if (!error) {
      return res.status(404).json({
        success: false,
        error: 'Error no encontrado'
      });
    }

    const diagnosis = await aiDiagnostic.diagnose(error);

    res.json({
      success: true,
      data: {
        error,
        diagnosis
      }
    });

  } catch (error) {
    logger.error('Error al diagnosticar por ID', error);
    res.status(500).json({
      success: false,
      error: 'Error al diagnosticar'
    });
  }
});

// Obtener sugerencias rápidas para problemas comunes
router.get('/quick-fixes', (req, res) => {
  try {
    const quickFixes = [
      {
        id: 'clear-cache',
        title: 'Limpiar caché del navegador',
        description: 'Soluciona problemas de carga y actualización',
        steps: [
          'Presiona Ctrl + Shift + R (Windows/Linux) o Cmd + Shift + R (Mac)',
          'O abre DevTools (F12) → pestaña Application → Clear storage'
        ],
        category: 'frontend',
        difficulty: 'easy'
      },
      {
        id: 'restart-server',
        title: 'Reiniciar servidor backend',
        description: 'Soluciona problemas de conexión',
        steps: [
          'Detener el servidor (Ctrl + C en la terminal)',
          'Ejecutar: cd backend && npm start',
          'Esperar mensaje: "Servidor iniciado en puerto 3001"'
        ],
        category: 'backend',
        difficulty: 'easy'
      },
      {
        id: 'check-env',
        title: 'Verificar variables de entorno',
        description: 'Soluciona errores de configuración',
        steps: [
          'Verificar que exista el archivo .env en backend/',
          'Comprobar que DB_TYPE esté configurado (sqlite o postgres)',
          'Verificar que JWT_SECRET tenga un valor',
          'Reiniciar el servidor después de cambios'
        ],
        category: 'configuration',
        difficulty: 'medium'
      },
      {
        id: 'clear-auth',
        title: 'Limpiar sesión de autenticación',
        description: 'Soluciona problemas de login',
        steps: [
          'Abrir consola del navegador (F12)',
          'Ejecutar: localStorage.clear()',
          'Ejecutar: location.reload()',
          'Volver a iniciar sesión'
        ],
        category: 'auth',
        difficulty: 'easy'
      },

      {
        id: 'npm-install',
        title: 'Reinstalar dependencias',
        description: 'Soluciona errores de módulos faltantes',
        steps: [
          'Ejecutar: cd backend && npm install',
          'Ejecutar: cd frontend && npm install',
          'Reiniciar ambos servidores',
          'Verificar que no haya errores en la instalación'
        ],
        category: 'dependencies',
        difficulty: 'medium'
      }
    ];

    res.json({
      success: true,
      data: quickFixes
    });

  } catch (error) {
    logger.error('Error al obtener quick fixes', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener soluciones rápidas'
    });
  }
});

// Healthcheck del asistente IA
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    features: {
      diagnosis: true,
      autoFix: true,
      interactiveHelp: true,
      patternAnalysis: true,
      quickFixes: true
    }
  });
});

export default router;
