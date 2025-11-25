import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  position: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  requirements: {
    type: DataTypes.TEXT,
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  jobType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'freelance'),
    allowNull: false,
    field: 'job_type',
  },
  experience: {
    type: DataTypes.ENUM('junior', 'mid', 'senior'),
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING(100),
  },
  salaryMin: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'salary_min',
  },
  salaryMax: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'salary_max',
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD',
  },
  benefits: {
    type: DataTypes.TEXT,
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
  applicationDeadline: {
    type: DataTypes.DATEONLY,
    field: 'application_deadline',
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'closed'),
    defaultValue: 'pending',
  },
  postedBy: {
    type: DataTypes.INTEGER,
    field: 'posted_by',
  },
  postedByEmail: {
    type: DataTypes.STRING(100),
    field: 'posted_by_email',
  },
  postedByName: {
    type: DataTypes.STRING(200),
    field: 'posted_by_name',
  },
  applicants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'jobs',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['position'],
    },
    {
      fields: ['company'],
    },
    {
      fields: ['job_type'],
    },
    {
      fields: ['experience'],
    },
    {
      fields: ['industry'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

export default Job;
