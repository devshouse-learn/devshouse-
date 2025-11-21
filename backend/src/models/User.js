import mongoose from 'mongoose';

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
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor proporciona un email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Por favor proporciona una contraseña'],
      minlength: 6,
      select: false, // No incluir en consultas por defecto
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

export default mongoose.model('User', userSchema);
