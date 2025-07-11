import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Job = sequelize.define('Job', {
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
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'completed', 'cancelled', 'closed'),
    defaultValue: 'open'
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  assignedDeveloperId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  proposalsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isUrgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default Job;