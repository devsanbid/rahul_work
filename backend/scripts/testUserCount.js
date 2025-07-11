import { User } from '../models/index.js';
import { sequelize } from '../config/database.js';

async function testUserCount() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    const userCount = await User.count();
    console.log('Total users in database:', userCount);
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status'],
      limit: 10
    });
    
    console.log('Users found:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

testUserCount();