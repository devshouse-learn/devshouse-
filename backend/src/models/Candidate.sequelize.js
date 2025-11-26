import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  location: {
    type: DataTypes.STRING(200),
  },
  bio: {
    type: DataTypes.TEXT,
  },
  avatar: {
    type: DataTypes.STRING(500),
  },
  resume: {
    type: DataTypes.TEXT,
  },
  technologies: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  experience: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  education: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  portfolio: {
    type: DataTypes.STRING(500),
  },
  linkedIn: {
    type: DataTypes.STRING(500),
    field: 'linked_in',
  },
  github: {
    type: DataTypes.STRING(500),
  },
  twitter: {
    type: DataTypes.STRING(500),
  },
  website: {
    type: DataTypes.STRING(500),
  },
  availability: {
    type: DataTypes.ENUM('disponible', 'no disponible', 'abierto a ofertas'),
    defaultValue: 'disponible',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    field: 'created_by',
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reports: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  underReview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'under_review',
    comment: 'True si está en revisión por moderación (30+ denuncias)',
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'archived'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'candidates',
  timestamps: false,  // Deshabilitado para evitar problemas con created_at/createdAt
  underscored: true,
  indexes: [
    {
      fields: ['email'],
    },
    {
      fields: ['availability'],
    },
    {
      fields: ['status'],
    },
  ],
});

export default Candidate;
