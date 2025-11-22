import express from 'express';
import emailValidationService from '../services/emailValidation.service.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================
// ENDPOINTS DE VALIDACIÓN DE EMAIL
// ============================================

// Validar un email (completo)
router.post('/validate', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido',
      });
    }

    const result = await emailValidationService.validateEmail(email);

    logger.info('Validación de email solicitada', {
      email,
      valid: result.valid,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error al validar email', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar email',
    });
  }
});

// Validación rápida (solo formato, desechables y MX)
router.post('/quick-validate', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido',
      });
    }

    const result = await emailValidationService.quickValidateEmail(email);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error en validación rápida', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar email',
    });
  }
});

// Validar múltiples emails
router.post('/validate-batch', async (req, res) => {
  try {
    const { emails, quick = true } = req.body;

    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de emails',
      });
    }

    if (emails.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Máximo 100 emails por solicitud',
      });
    }

    const result = await emailValidationService.validateEmailBatch(emails, quick);

    logger.info('Validación en lote', {
      total: result.total,
      valid: result.valid,
      invalid: result.invalid,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error en validación en lote', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar emails',
    });
  }
});

// Sugerir correcciones para un email
router.post('/suggest-correction', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido',
      });
    }

    const suggestions = emailValidationService.suggestEmailCorrection(email);

    res.json({
      success: true,
      data: {
        original: email,
        suggestions,
        hasSuggestions: suggestions.length > 0,
      },
    });
  } catch (error) {
    logger.error('Error al sugerir correcciones', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud',
    });
  }
});

// Verificar registros MX de un dominio
router.get('/check-domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;

    const result = await emailValidationService.verifyMXRecords(domain);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error al verificar dominio', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar dominio',
    });
  }
});

// Verificar si un email es desechable
router.post('/check-disposable', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido',
      });
    }

    const isDisposable = emailValidationService.isDisposableEmail(email);
    const domain = emailValidationService.extractDomain(email);

    res.json({
      success: true,
      data: {
        email,
        domain,
        isDisposable,
        message: isDisposable
          ? 'Este email es desechable y no está permitido'
          : 'Email válido',
      },
    });
  } catch (error) {
    logger.error('Error al verificar email desechable', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar email',
    });
  }
});

export default router;
