import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Reaction = sequelize.define('Reaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    comment: 'ID del usuario que reaccionó',
  },
  resourceType: {
    type: DataTypes.ENUM('agreement', 'venture', 'job'),
    allowNull: false,
    field: 'resource_type',
  },
  resourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'resource_id',
    comment: 'ID del recurso (agreement_id, venture_id, job_id)',
  },
  reactionType: {
    type: DataTypes.ENUM('like', 'report'),
    allowNull: false,
    field: 'reaction_type',
  },
  reportReason: {
    type: DataTypes.TEXT,
    field: 'report_reason',
    comment: 'Razón de la denuncia (solo si reactionType = report)',
  },
}, {
  tableName: 'reactions',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'resource_type', 'resource_id', 'reaction_type'],
      name: 'unique_user_reaction',
    },
    {
      fields: ['resource_type', 'resource_id'],
    },
    {
      fields: ['reaction_type'],
    },
  ],
});

export default Reaction;
