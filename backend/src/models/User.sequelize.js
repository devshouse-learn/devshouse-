import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es requerido' },
      len: {
        args: [2, 100],
        msg: 'El nombre debe tener entre 2 y 100 caracteres',
      },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      msg: 'Este correo electrónico ya está registrado',
    },
    validate: {
      isEmail: { msg: 'Debe ser un email válido' },
      notEmpty: { msg: 'El email es requerido' },
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es requerida' },
      len: {
        args: [6, 100],
        msg: 'La contraseña debe tener al menos 6 caracteres',
      },
    },
  },
  role: {
    type: DataTypes.ENUM('usuario', 'moderador', 'admin'),
    defaultValue: 'usuario',
    allowNull: false,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'email_verified',
  },
  verificationToken: {
    type: DataTypes.STRING,
    field: 'verification_token',
  },
  verificationTokenExpires: {
    type: DataTypes.DATE,
    field: 'verification_token_expires',
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    field: 'password_reset_token',
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    field: 'password_reset_expires',
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'login_attempts',
  },
  lockUntil: {
    type: DataTypes.DATE,
    field: 'lock_until',
  },
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['verification_token'] },
    { fields: ['password_reset_token'] },
  ],
});

// Hook: Hashear contraseña antes de crear
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hook: Hashear contraseña antes de actualizar si cambió
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Método de instancia: Comparar contraseña
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método de instancia: Generar token de verificación
User.prototype.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
  return token;
};

// Método de instancia: Generar token de reset de contraseña
User.prototype.generatePasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
  return token;
};

// Método estático: Verificar token de email
User.verifyEmailToken = async function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpires: {
        [sequelize.Sequelize.Op.gt]: new Date(),
      },
    },
  });
  
  return user;
};

// Método estático: Verificar token de reset
User.verifyResetToken = async function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        [sequelize.Sequelize.Op.gt]: new Date(),
      },
    },
  });
  
  return user;
};

// Método de instancia: Incrementar intentos de login
User.prototype.incrementLoginAttempts = async function() {
  // Si ya está bloqueado y el tiempo expiró, resetear
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.update({
      loginAttempts: 1,
      lockUntil: null,
    });
    return;
  }
  
  // Incrementar intentos
  const updates = {
    loginAttempts: this.loginAttempts + 1,
  };
  
  // Bloquear después de 5 intentos
  if (updates.loginAttempts >= 5) {
    updates.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas
  }
  
  await this.update(updates);
};

// Método de instancia: Resetear intentos de login
User.prototype.resetLoginAttempts = async function() {
  await this.update({
    loginAttempts: 0,
    lockUntil: null,
  });
};

// Método de instancia: Verificar si está bloqueado
User.prototype.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Excluir password en consultas por defecto
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.verificationToken;
  delete values.passwordResetToken;
  return values;
};

export default User;
