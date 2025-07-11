import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const JobRequest = sequelize.define('JobRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  budgetType: {
    type: DataTypes.ENUM('fixed', 'hourly'),
    allowNull: false,
    defaultValue: 'fixed'
  },
  experienceLevel: {
    type: DataTypes.ENUM('Entry Level', 'Intermediate', 'Expert'),
    allowNull: false
  },
  projectType: {
    type: DataTypes.ENUM('One-time project', 'Ongoing work', 'Contract to hire'),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'remote'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'cancelled'),
    defaultValue: 'pending'
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
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
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isUrgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default JobRequest;