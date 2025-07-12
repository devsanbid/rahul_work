import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ProposalFeedback = sequelize.define('ProposalFeedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  proposalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Proposals',
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  feedbackType: {
    type: DataTypes.ENUM('message', 'review'),
    allowNull: false,
    defaultValue: 'message'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'ProposalFeedbacks'
});

export default ProposalFeedback;