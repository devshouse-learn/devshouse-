import logger from '../utils/logger.js';

// ============================================
// MONITOR DE ERRORES EN TIEMPO REAL
// ============================================

class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.maxErrors = 500;
    this.errorCounts = {};
    this.errorRates = {};
    this.alerts = [];
    
    // Configuración de alertas
    this.thresholds = {
      errorRate: 10, // Errores por minuto
      criticalErrors: 5, // Errores críticos antes de alerta
      consecutiveErrors: 20, // Errores consecutivos
    };

    // Iniciar monitoreo
    this.startMonitoring();
  }

  // Registrar error
  registerError(error, context = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      id: this.generateErrorId(),
    };

    // Agregar a la lista
    this.errors.unshift(errorEntry);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Contar tipo de error
    const errorType = error.name || 'UnknownError';
    this.errorCounts[errorType] = (this.errorCounts[errorType] || 0) + 1;

    // Actualizar tasa de errores
    this.updateErrorRate();

    // Verificar umbrales
    this.checkThresholds();

    // Log del error
    logger.error(`Error capturado: ${error.message}`, error, context);

    return errorEntry.id;
  }

  // Generar ID único de error
  generateErrorId() {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Actualizar tasa de errores
  updateErrorRate() {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;

    // Contar errores del último minuto
    const recentErrors = this.errors.filter(
      (err) => new Date(err.timestamp).getTime() > oneMinuteAgo
    );

    this.errorRates.lastMinute = recentErrors.length;
    this.errorRates.timestamp = new Date().toISOString();
  }

  // Verificar umbrales y generar alertas
  checkThresholds() {
    // Verificar tasa de errores
    if (this.errorRates.lastMinute >= this.thresholds.errorRate) {
      this.createAlert('HIGH_ERROR_RATE', {
        message: `Tasa alta de errores: ${this.errorRates.lastMinute} errores/minuto`,
        severity: 'high',
        errorCount: this.errorRates.lastMinute,
      });
    }

    // Verificar errores consecutivos
    const recentErrors = this.errors.slice(0, this.thresholds.consecutiveErrors);
    if (recentErrors.length === this.thresholds.consecutiveErrors) {
      this.createAlert('CONSECUTIVE_ERRORS', {
        message: `${this.thresholds.consecutiveErrors} errores consecutivos detectados`,
        severity: 'critical',
        errors: recentErrors.map((e) => e.message),
      });
    }
  }

  // Crear alerta
  createAlert(type, data) {
    const alert = {
      id: `ALERT_${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      data,
      acknowledged: false,
    };

    this.alerts.unshift(alert);
    
    // Mantener solo las últimas 100 alertas
    if (this.alerts.length > 100) {
      this.alerts.pop();
    }

    // Log de la alerta
    logger.security(`🚨 Alerta generada: ${type}`, data);

    // Notificar (implementar según necesidad)
    this.notifyAlert(alert);

    return alert;
  }

  // Notificar alerta
  notifyAlert(alert) {
    // Aquí puedes implementar:
    // - Envío de email
    // - Webhook a Slack/Discord
    // - Notificación push
    // - Llamada a API de monitoreo
    console.error(`🚨 ALERTA: ${alert.type} - ${alert.data.message}`);
  }

  // Obtener estadísticas
  getStats() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const stats = {
      total: this.errors.length,
      lastHour: 0,
      lastDay: 0,
      byType: { ...this.errorCounts },
      errorRate: this.errorRates,
      activeAlerts: this.alerts.filter((a) => !a.acknowledged).length,
      topErrors: this.getTopErrors(5),
    };

    this.errors.forEach((err) => {
      const timestamp = new Date(err.timestamp).getTime();
      if (timestamp > oneHourAgo) stats.lastHour++;
      if (timestamp > oneDayAgo) stats.lastDay++;
    });

    return stats;
  }

  // Obtener errores más frecuentes
  getTopErrors(limit = 10) {
    const sorted = Object.entries(this.errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);

    return sorted.map(([type, count]) => ({ type, count }));
  }

  // Obtener errores recientes
  getRecentErrors(limit = 50, filter = {}) {
    let errors = [...this.errors];

    // Filtrar por tipo
    if (filter.type) {
      errors = errors.filter((err) => err.name === filter.type);
    }

    // Filtrar por contexto
    if (filter.context) {
      errors = errors.filter((err) =>
        JSON.stringify(err.context).includes(filter.context)
      );
    }

    return errors.slice(0, limit);
  }

  // Obtener alertas activas
  getActiveAlerts() {
    return this.alerts.filter((alert) => !alert.acknowledged);
  }

  // Reconocer alerta
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date().toISOString();
      logger.info(`Alerta reconocida: ${alertId}`);
      return true;
    }
    return false;
  }

  // Limpiar errores antiguos
  clearOldErrors(hours = 24) {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    this.errors = this.errors.filter(
      (err) => new Date(err.timestamp).getTime() > cutoffTime
    );
  }

  // Resetear contadores
  resetCounters() {
    this.errorCounts = {};
    this.errorRates = {};
    logger.info('Contadores de errores reseteados');
  }

  // Iniciar monitoreo periódico
  startMonitoring() {
    // Limpiar errores antiguos cada hora
    setInterval(() => {
      this.clearOldErrors(24);
    }, 60 * 60 * 1000);

    // Actualizar tasas cada minuto
    setInterval(() => {
      this.updateErrorRate();
    }, 60 * 1000);

    logger.info('Monitor de errores iniciado');
  }

  // Generar reporte
  generateReport() {
    const stats = this.getStats();
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalErrors: stats.total,
        lastHour: stats.lastHour,
        lastDay: stats.lastDay,
        errorRate: stats.errorRate.lastMinute,
      },
      topErrors: stats.topErrors,
      activeAlerts: this.getActiveAlerts(),
      recentErrors: this.getRecentErrors(10),
    };

    logger.info('Reporte de errores generado', { report });
    return report;
  }
}

// ============================================
// EXPORTAR INSTANCIA SINGLETON
// ============================================

const errorMonitor = new ErrorMonitor();

export { errorMonitor, ErrorMonitor };
export default errorMonitor;
