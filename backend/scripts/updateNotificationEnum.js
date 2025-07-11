import { sequelize } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const updateNotificationEnum = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    console.log('Updating Notification type enum...');
    
    await sequelize.query(`
      ALTER TYPE "enum_Notifications_type" ADD VALUE IF NOT EXISTS 'project_completed';
    `);
    
    await sequelize.query(`
      ALTER TYPE "enum_Notifications_type" ADD VALUE IF NOT EXISTS 'proposal_accepted';
    `);
    
    await sequelize.query(`
      ALTER TYPE "enum_Notifications_type" ADD VALUE IF NOT EXISTS 'proposal_rejected';
    `);
    
    await sequelize.query(`
      ALTER TYPE "enum_Notifications_type" ADD VALUE IF NOT EXISTS 'job_hired';
    `);

    console.log('Notification enum updated successfully!');
    
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      console.log('Database connection refused. Please ensure PostgreSQL is running.');
      console.log('The enum values will be updated when the server starts and connects to the database.');
    } else if (error.message.includes('already exists')) {
      console.log('Enum values already exist. No changes needed.');
    } else {
      console.error('Error updating notification enum:', error.message);
    }
  } finally {
    try {
      await sequelize.close();
      console.log('Database connection closed.');
    } catch (closeError) {
      console.log('Database was not connected.');
    }
    process.exit(0);
  }
};

updateNotificationEnum();