import { sequelize } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const addCompletedStatus = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    console.log('Adding completed status to Proposals enum...');
    
    await sequelize.query(`
      ALTER TYPE "enum_Proposals_status" ADD VALUE IF NOT EXISTS 'completed';
    `);
    
    console.log('Successfully added completed status to Proposals enum');
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('IF NOT EXISTS')) {
      console.log('Completed status already exists in enum');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Database connection refused. Please ensure PostgreSQL is running.');
      console.error('You can start PostgreSQL and run this script again, or the enum will be updated when the server starts.');
    } else {
      console.error('Error adding completed status:', error);
      throw error;
    }
  } finally {
    try {
      await sequelize.close();
    } catch (closeError) {
      console.log('Database was not connected, no need to close.');
    }
  }
};

addCompletedStatus().catch(console.error);