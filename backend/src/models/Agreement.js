import mongoose from 'mongoose';

const agreementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor proporciona un título'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'Por favor proporciona una descripción'],
    },
    institution: {
      type: String,
      required: [true, 'Por favor proporciona el nombre de la institución'],
    },
    type: {
      type: String,
      enum: ['formación', 'práctica', 'pasantía', 'certificación'],
      required: true,
    },
    duration: {
      type: String,
      enum: ['corto', 'mediano', 'largo'],
    },
    technologies: [String],
    startDate: Date,
    endDate: Date,
    contact: {
      email: String,
      phone: String,
      person: String,
    },
    requirements: [String],
    benefits: [String],
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
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

agreementSchema.index({ institution: 1 });
agreementSchema.index({ type: 1 });
agreementSchema.index({ createdAt: -1 });

export default mongoose.model('Agreement', agreementSchema);
