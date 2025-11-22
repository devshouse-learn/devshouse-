import express from 'express';
import User from '../models/User.js';
import emailService from '../services/email.service.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================
// VERIFICACIÓN DE EMAIL
// ============================================

// Verificar email con token
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token de verificación requerido',
      });
    }

    // Buscar usuario con el token
    const user = await User.verifyEmailToken(token);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    // Verificar email
    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    logger.info('Email verificado', { userId: user._id, email: user.email });

    // Enviar email de bienvenida
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (error) {
      logger.error('Error al enviar email de bienvenida', error);
    }

    res.json({
      success: true,
      message: 'Email verificado exitosamente',
      data: {
        emailVerified: true,
      },
    });
  } catch (error) {
    logger.error('Error al verificar email', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar email',
    });
  }
});

// Reenviar email de verificación
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está verificado',
      });
    }

    // Generar nuevo token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Enviar email
    await emailService.sendVerificationEmail(user, verificationToken);

    logger.info('Email de verificación reenviado', {
      userId: user._id,
      email: user.email,
    });

    res.json({
      success: true,
      message: 'Email de verificación enviado',
    });
  } catch (error) {
    logger.error('Error al reenviar verificación', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar email de verificación',
    });
  }
});

// ============================================
// RESETEO DE CONTRASEÑA
// ============================================

// Solicitar reseteo de contraseña
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Por seguridad, no revelar si el email existe
      return res.json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
      });
    }

    // Generar token de reseteo
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Enviar email
    await emailService.sendPasswordResetEmail(user, resetToken);

    logger.info('Email de reseteo de contraseña enviado', {
      userId: user._id,
      email: user.email,
    });

    res.json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
    });
  } catch (error) {
    logger.error('Error al solicitar reseteo de contraseña', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud',
    });
  }
});

// Resetear contraseña con token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token y nueva contraseña requeridos',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    // Buscar usuario con el token
    const user = await User.verifyResetToken(token).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    logger.info('Contraseña reseteada', { userId: user._id, email: user.email });

    // Enviar email de confirmación
    try {
      await emailService.sendPasswordChangedEmail(user);
    } catch (error) {
      logger.error('Error al enviar confirmación de cambio de contraseña', error);
    }

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    logger.error('Error al resetear contraseña', error);
    res.status(500).json({
      success: false,
      message: 'Error al resetear contraseña',
    });
  }
});

// ============================================
// VERIFICACIÓN MASIVA (ADMIN)
// ============================================

// Enviar verificación a todos los usuarios no verificados
router.post('/send-bulk-verification', async (req, res) => {
  try {
    // TODO: Agregar middleware de autenticación admin aquí
    
    const unverifiedUsers = await User.find({ emailVerified: false });

    if (unverifiedUsers.length === 0) {
      return res.json({
        success: true,
        message: 'No hay usuarios sin verificar',
        data: { sent: 0 },
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [],
    };

    for (const user of unverifiedUsers) {
      try {
        const verificationToken = user.generateVerificationToken();
        await user.save();

        await emailService.sendVerificationEmail(user, verificationToken);
        results.sent++;

        logger.info('Email de verificación enviado (masivo)', {
          userId: user._id,
          email: user.email,
        });
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: user.email,
          error: error.message,
        });

        logger.error('Error al enviar verificación masiva', error, {
          userId: user._id,
          email: user.email,
        });
      }
    }

    res.json({
      success: true,
      message: `Verificación enviada a ${results.sent} usuarios`,
      data: results,
    });
  } catch (error) {
    logger.error('Error en verificación masiva', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar verificaciones',
    });
  }
});

// Obtener estadísticas de verificación
router.get('/verification-stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ emailVerified: true });
    const unverifiedUsers = totalUsers - verifiedUsers;

    res.json({
      success: true,
      data: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    logger.error('Error al obtener estadísticas', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
    });
  }
});

export default router;
