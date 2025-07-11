import { sequelize } from '../config/database.js';
import { QueryTypes } from 'sequelize';

const addBalanceField = async () => {
  try {
    console.log('Adding balance field to Users table...');
    
    // Check if balance column already exists
    const [results] = await sequelize.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'balance'",
      { type: QueryTypes.SELECT }
    );
    
    if (results) {
      console.log('Balance column already exists');
      return;
    }
    
    // Add balance column
    await sequelize.query(
      'ALTER TABLE Users ADD COLUMN balance DECIMAL(10,2) DEFAULT 0.00 NOT NULL'
    );
    
    console.log('Balance field added successfully!');
    
    // Update existing users to have 0 balance
    await sequelize.query(
      'UPDATE Users SET balance = 0.00 WHERE balance IS NULL'
    );
    
    console.log('Updated existing users with default balance');
    
  } catch (error) {
    console.error('Error adding balance field:', error);
  } finally {
    await sequelize.close();
  }
};

addBalanceField();