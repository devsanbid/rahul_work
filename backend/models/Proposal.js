import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Proposal = sequelize.define('Proposal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id'
    }
  },
  developerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  proposedBudget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  proposedTimeline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'withdrawn', 'completed'),
    defaultValue: 'pending'
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['jobId', 'developerId']
    }
  ]
});

export default Proposal;