import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor proporciona tu nombre'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: String,
    location: String,
    bio: String,
    avatar: String,
    resume: String,
    technologies: [String],
    experience: [
      {
        company: String,
        position: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        field: String,
        year: Number,
      },
    ],
    portfolio: String,
    linkedIn: String,
    github: String,
    twitter: String,
    website: String,
    availability: {
      type: String,
      enum: ['disponible', 'no disponible', 'abierto a ofertas'],
      default: 'disponible',
    },
    jobApplied: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pendiente', 'revisando', 'entrevista', 'rechazado', 'aceptado'],
          default: 'pendiente',
        },
      },
    ],
    createdBy: {
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

candidateSchema.index({ email: 1 });
candidateSchema.index({ availability: 1 });
candidateSchema.index({ createdAt: -1 });

export default mongoose.model('Candidate', candidateSchema);
