import { sequelize } from '../config/database.js';
import { User, Job, JobRequest, Project, Proposal, Review, Payment, Withdrawal, Notification } from '../models/index.js';
import bcrypt from 'bcryptjs';

const resetDatabase = async () => {
  try {
    console.log('🔄 Starting database reset...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    console.log('🔨 Resetting all tables...');
    await sequelize.sync({ force: true });
    
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@devhire.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      isVerified: true,
      location: 'System',
      bio: 'System Administrator'
    });
    
    console.log('✅ Database reset completed successfully!');
    console.log('📧 Admin credentials:');
    console.log('   Email: admin@devhire.com');
    console.log('   Password: admin123');
    console.log(`   User ID: ${adminUser.id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();