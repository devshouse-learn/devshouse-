import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import emailService from './email.service.js';
import logger from '../utils/logger.js';

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

class AuthService {
  // Generar JWT token
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiame',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Registrar nuevo usuario
  async register(userData) {
    try {
      const { name, email, password } = userData;

      // Verificar si el email ya existe
      const emailExists = await User.isEmailTaken(email);
      if (emailExists) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // Crear usuario
      const user = await User.create({
        name,
        email,
        password,
        role: 'usuario', // Rol por defecto
        emailVerified: false,
      });

      // Generar token de verificación
      const verificationToken = user.generateVerificationToken();
      await user.save();

      // Enviar email de verificación
      try {
        await emailService.sendVerificationEmail(user, verificationToken);
        logger.info('Email de verificación enviado', {
          userId: user._id,
          email: user.email,
        });
      } catch (error) {
        logger.error('Error al enviar email de verificación', error);
        // No fallar el registro si el email falla
      }

      // Generar JWT
      const token = this.generateToken(user._id);

      logger.info('Usuario registrado', { userId: user._id, email: user.email });

      return {
        success: true,
        message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
          },
          token,
        },
      };
    } catch (error) {
      logger.error('Error en registro', error);
      throw error;
    }
  }

  // Login
  async login(email, password) {
    try {
      // Buscar usuario por email (incluyendo password)
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Generar JWT
      const token = this.generateToken(user._id);

      logger.info('Usuario logueado', { userId: user._id, email: user.email });

      return {
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
          },
          token,
        },
      };
    } catch (error) {
      logger.error('Error en login', error);
      throw error;
    }
  }

  // Verificar token JWT
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiame');
      
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
          },
        },
      };
    } catch (error) {
      logger.error('Error al verificar token', error);
      throw new Error('Token inválido o expirado');
    }
  }

  // Cambiar contraseña
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isPasswordValid = await user.comparePassword(oldPassword);

      if (!isPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Actualizar contraseña
      user.password = newPassword;
      await user.save();

      // Enviar email de notificación
      try {
        await emailService.sendPasswordChangedEmail(user);
      } catch (error) {
        logger.error('Error al enviar notificación de cambio de contraseña', error);
      }

      logger.info('Contraseña cambiada', { userId: user._id });

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente',
      };
    } catch (error) {
      logger.error('Error al cambiar contraseña', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const authService = new AuthService();

export { authService, AuthService };
export default authService;
