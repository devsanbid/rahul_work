import { sequelize } from '../config/database.js';
import { User } from '../models/index.js';

const resetDatabaseSafe = async () => {
  try {
    console.log('🔄 Starting safe database reset...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    console.log('🔨 Resetting all tables safely...');
    await sequelize.sync({ force: true, logging: false });
    
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
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    try {
      await sequelize.close();
    } catch (closeError) {
      console.error('❌ Error closing database connection:', closeError.message);
    }
    process.exit(1);
  }
};

resetDatabaseSafe();