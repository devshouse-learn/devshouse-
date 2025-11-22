import express from 'express';
import logger from '../utils/logger.js';
import errorMonitor from '../utils/errorMonitor.js';

const router = express.Router();

// ============================================
// ENDPOINTS DE MONITOREO
// ============================================

// Obtener estadísticas del sistema
router.get('/stats', (req, res) => {
  try {
    const stats = {
      logger: logger.getStats(),
      errorMonitor: errorMonitor.getStats(),
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error al obtener estadísticas', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
    });
  }
});

// Obtener logs recientes
router.get('/logs', (req, res) => {
  try {
    const { limit = 50, level } = req.query;
    const logs = logger.getRecentLogs(parseInt(limit), level);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    logger.error('Error al obtener logs', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener logs',
    });
  }
});

// Obtener errores recientes
router.get('/errors', (req, res) => {
  try {
    const { limit = 50, type, context } = req.query;
    const errors = errorMonitor.getRecentErrors(parseInt(limit), {
      type,
      context,
    });

    res.json({
      success: true,
      data: errors,
    });
  } catch (error) {
    logger.error('Error al obtener errores', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener errores',
    });
  }
});

// Obtener alertas activas
router.get('/alerts', (req, res) => {
  try {
    const alerts = errorMonitor.getActiveAlerts();

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    logger.error('Error al obtener alertas', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alertas',
    });
  }
});

// Reconocer alerta
router.post('/alerts/:id/acknowledge', (req, res) => {
  try {
    const { id } = req.params;
    const acknowledged = errorMonitor.acknowledgeAlert(id);

    if (acknowledged) {
      res.json({
        success: true,
        message: 'Alerta reconocida',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Alerta no encontrada',
      });
    }
  } catch (error) {
    logger.error('Error al reconocer alerta', error);
    res.status(500).json({
      success: false,
      message: 'Error al reconocer alerta',
    });
  }
});

// Generar reporte
router.get('/report', (req, res) => {
  try {
    const report = errorMonitor.generateReport();

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error('Error al generar reporte', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte',
    });
  }
});

// Limpiar logs y errores antiguos
router.post('/cleanup', (req, res) => {
  try {
    const { hours = 24 } = req.body;
    
    errorMonitor.clearOldErrors(hours);
    logger.cleanOldLogs(Math.floor(hours / 24));

    logger.info(`Limpieza realizada: ${hours} horas`);

    res.json({
      success: true,
      message: `Logs y errores anteriores a ${hours} horas eliminados`,
    });
  } catch (error) {
    logger.error('Error al limpiar datos', error);
    res.status(500).json({
      success: false,
      message: 'Error al limpiar datos',
    });
  }
});

// Resetear contadores
router.post('/reset', (req, res) => {
  try {
    errorMonitor.resetCounters();

    res.json({
      success: true,
      message: 'Contadores reseteados',
    });
  } catch (error) {
    logger.error('Error al resetear contadores', error);
    res.status(500).json({
      success: false,
      message: 'Error al resetear contadores',
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  const stats = errorMonitor.getStats();
  const isHealthy = stats.errorRate.lastMinute < 10;

  res.status(isHealthy ? 200 : 503).json({
    success: true,
    healthy: isHealthy,
    data: {
      errorRate: stats.errorRate.lastMinute,
      activeAlerts: stats.activeAlerts,
      uptime: process.uptime(),
    },
  });
});

export default router;
