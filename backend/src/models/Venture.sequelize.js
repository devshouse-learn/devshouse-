import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Venture = sequelize.define('Venture', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'company_name',
  },
  industry: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  foundedYear: {
    type: DataTypes.INTEGER,
    field: 'founded_year',
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  founderName: {
    type: DataTypes.STRING(200),
    field: 'founder_name',
  },
  founderEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true,
    },
    field: 'founder_email',
  },
  founderPhone: {
    type: DataTypes.STRING(20),
    field: 'founder_phone',
  },
  description: {
    type: DataTypes.TEXT,
  },
  website: {
    type: DataTypes.STRING(200),
  },
  investmentStage: {
    type: DataTypes.ENUM('idea', 'seed', 'growth', 'expansion'),
    field: 'investment_stage',
  },
  fundingNeeded: {
    type: DataTypes.STRING(100),
    field: 'funding_needed',
  },
  teamSize: {
    type: DataTypes.STRING(50),
    field: 'team_size',
  },
  revenueModel: {
    type: DataTypes.TEXT,
    field: 'revenue_model',
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
  showInSearch: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'show_in_search',
    comment: 'Si el emprendimiento aparece en Buscar Empresa',
  },
}, {
  tableName: 'ventures',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['company_name'],
    },
    {
      fields: ['industry'],
    },
    {
      fields: ['investment_stage'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

export default Venture;
