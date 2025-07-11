import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import developerRoutes from './routes/developerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/developer', developerRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DevHire API is running!' });
});

const updateNotificationEnum = async () => {
  try {
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
    if (error.message.includes('already exists')) {
      console.log('Notification enum values already exist.');
    } else {
      console.error('Error updating notification enum:', error.message);
    }
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    await updateNotificationEnum();
    
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();