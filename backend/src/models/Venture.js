import mongoose from 'mongoose';

const ventureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor proporciona el nombre del emprendimiento'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'Por favor proporciona una descripción'],
    },
    category: {
      type: String,
      enum: ['tecnología', 'educación', 'servicios', 'comercio', 'otro'],
      required: true,
    },
    stage: {
      type: String,
      enum: ['idea', 'prototipo', 'mvp', 'lanzado', 'crecimiento'],
      default: 'idea',
    },
    founderEmail: {
      type: String,
      required: true,
    },
    founderName: {
      type: String,
      required: true,
    },
    website: String,
    logo: String,
    banner: String,
    technologies: [String],
    team: [
      {
        name: String,
        role: String,
        email: String,
      },
    ],
    fundingNeeded: {
      amount: Number,
      currency: String,
    },
    contact: {
      email: String,
      phone: String,
      linkedIn: String,
      twitter: String,
    },
    status: {
      type: String,
      enum: ['activo', 'archivado', 'pendiente'],
      default: 'activo',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

ventureSchema.index({ category: 1 });
ventureSchema.index({ stage: 1 });
ventureSchema.index({ createdAt: -1 });

export default mongoose.model('Venture', ventureSchema);
