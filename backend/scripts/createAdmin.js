import { sequelize } from '../config/database.js';
import { User } from '../models/index.js';

const createAdminDirect = async () => {
  try {
    console.log('🔧 Creating admin user...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    const existingUser = await User.findOne({ where: { email: 'admin@gmail.com' } });
    if (existingUser) {
      console.log('❌ Admin user already exists!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   User ID: ${existingUser.id}`);
      process.exit(1);
    }
    
    const adminUser = await User.create({
      name: 'Admin Account',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      isVerified: true,
      location: 'System',
      bio: 'System Administrator'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Admin credentials:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: admin123');
    console.log(`   User ID: ${adminUser.id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminDirect();