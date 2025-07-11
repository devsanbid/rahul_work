import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MessageReview = sequelize.define('MessageReview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  timestamps: true,
});

export default MessageReview;
