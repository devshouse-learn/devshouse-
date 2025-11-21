import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor proporciona el título del puesto'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'Por favor proporciona una descripción'],
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'devops', 'qa', 'ux/ui', 'otro'],
      required: true,
    },
    level: {
      type: String,
      enum: ['junior', 'mid', 'senior', 'lead'],
      required: true,
    },
    type: {
      type: String,
      enum: ['tiempo completo', 'medio tiempo', 'freelance', 'prácticas'],
      default: 'tiempo completo',
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    location: {
      type: String,
      required: true,
    },
    remote: {
      type: String,
      enum: ['presencial', 'remoto', 'híbrido'],
      default: 'híbrido',
    },
    company: {
      name: String,
      logo: String,
      website: String,
    },
    requirements: [String],
    responsibilities: [String],
    benefits: [String],
    technologies: [String],
    contact: {
      email: String,
      phone: String,
      person: String,
    },
    applications: [
      {
        candidateId: mongoose.Schema.Types.ObjectId,
        status: {
          type: String,
          enum: ['pendiente', 'revisando', 'entrevista', 'rechazado', 'aceptado'],
          default: 'pendiente',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['activo', 'cerrado', 'archivado'],
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

jobSchema.index({ category: 1 });
jobSchema.index({ level: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

export default mongoose.model('Job', jobSchema);
