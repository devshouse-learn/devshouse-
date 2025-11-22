import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import emailValidationService from '../services/emailValidation.service.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor proporciona un nombre'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'Por favor proporciona un email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor proporciona un email válido',
      ],
      validate: [
        {
          validator: async function(email) {
            // Verificar que no exista otro usuario con el mismo email
            const user = await mongoose.models.User.findOne({ email });
            if (user && user._id.toString() !== this._id?.toString()) {
              return false;
            }
            return true;
          },
          message: 'Este correo electrónico ya está registrado',
        },
        {
          validator: async function(email) {
            // Validar que el email sea real y no desechable
            const validation = await emailValidationService.quickValidateEmail(email);
            if (!validation.valid) {
              this.emailValidationError = validation.reason;
              return false;
            }
            return true;
          },
          message: function() {
            return this.emailValidationError || 'Email no válido o no existe';
          },
        }
      ],
    },
    password: {
      type: String,
      required: [true, 'Por favor proporciona una contraseña'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No incluir en consultas por defecto
      validate: {
        validator: async function(password) {
          // Si es un documento nuevo o la contraseña ha cambiado
          if (!this.isNew && !this.isModified('password')) {
            return true;
          }
          
          // Verificar que ningún otro usuario tenga la misma contraseña hasheada
          const users = await mongoose.models.User.find({}).select('+password');
          
          for (const user of users) {
            // Excluir el usuario actual
            if (user._id.toString() === this._id?.toString()) {
              continue;
            }
            
            // Si la contraseña ya está hasheada (actualización), comparar directamente
            if (password.startsWith('$2a$') || password.startsWith('$2b$')) {
              if (user.password === password) {
                return false;
              }
            } else {
              // Si es nueva contraseña, comparar con las hasheadas existentes
              const isMatch = await bcrypt.compare(password, user.password);
              if (isMatch) {
                return false;
              }
            }
          }
          
          return true;
        },
        message: 'Esta contraseña ya está en uso por otro usuario. Por favor elige una diferente',
      },
    },
    role: {
      type: String,
      enum: ['usuario', 'moderador', 'admin'],
      default: 'usuario',
    },
    status: {
      type: String,
      enum: ['activo', 'inactivo', 'suspendido'],
      default: 'activo',
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'La biografía no puede exceder 500 caracteres'],
    },
    phone: String,
    location: String,
    company: String,
    website: String,
    permissions: [String],
    lastLogin: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Índices para optimizar búsquedas
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Middleware: Hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña ha sido modificada o es nueva
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Si la contraseña ya está hasheada, no volver a hashear
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
      return next();
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

// Método para verificar si el email ya existe
userSchema.statics.isEmailTaken = async function(email, excludeUserId) {
  const user = await this.findOne({ email: email.toLowerCase() });
  if (!user) return false;
  if (excludeUserId && user._id.toString() === excludeUserId) return false;
  return true;
};

// Método para verificar si la contraseña ya está en uso
userSchema.statics.isPasswordInUse = async function(password, excludeUserId) {
  const users = await this.find({}).select('+password');
  
  for (const user of users) {
    // Excluir el usuario actual si se proporciona
    if (excludeUserId && user._id.toString() === excludeUserId) {
      continue;
    }
    
    // Comparar la contraseña con las existentes
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return true;
    }
  }
  
  return false;
};

// Método para generar token de verificación
userSchema.methods.generateVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
  
  return token;
};

// Método para generar token de reseteo de contraseña
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hora
  
  return token;
};

// Método para verificar token de verificación
userSchema.statics.verifyEmailToken = async function(token) {
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await this.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });
  
  return user;
};

// Método para verificar token de reseteo
userSchema.statics.verifyResetToken = async function(token) {
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  
  return user;
};

export default mongoose.model('User', userSchema);
