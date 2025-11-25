import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Agreement = sequelize.define('Agreement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  schoolName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'school_name',
  },
  schoolType: {
    type: DataTypes.ENUM('university', 'technical', 'bootcamp', 'high-school'),
    allowNull: false,
    field: 'school_type',
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true,
    },
    field: 'contact_email',
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    field: 'contact_phone',
  },
  description: {
    type: DataTypes.TEXT,
  },
  programName: {
    type: DataTypes.STRING(200),
    field: 'program_name',
  },
  duration: {
    type: DataTypes.STRING(100),
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date',
  },
  benefits: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'archived'),
    defaultValue: 'pending',
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
}, {
  tableName: 'agreements',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['school_name'],
    },
    {
      fields: ['school_type'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

export default Agreement;
