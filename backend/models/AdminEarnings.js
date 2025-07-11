import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const AdminEarnings = sequelize.define('AdminEarnings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  withdrawalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Withdrawals',
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
  originalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  feeAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  feePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending'
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: 'Withdrawal processing fee'
  }
}, {
  timestamps: true
});

export default AdminEarnings;