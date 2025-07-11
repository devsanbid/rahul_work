import { sequelize } from '../config/database.js';
import { QueryTypes } from 'sequelize';

const addAdminSettingsFields = async () => {
  try {
    console.log('Adding admin settings fields to User table...');
    
    const alterQueries = [
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "companyName" VARCHAR(255);',
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "companyWebsite" VARCHAR(255);',
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "companyAddress" TEXT;',
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "emailNotifications" BOOLEAN DEFAULT true;',
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "pushNotifications" BOOLEAN DEFAULT true;',
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "smsNotifications" BOOLEAN DEFAULT false;',
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "marketingNotifications" BOOLEAN DEFAULT false;',
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "theme" VARCHAR(10) DEFAULT \'light\';',
      'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "language" VARCHAR(50) DEFAULT \'english\';'
    ];

    for (const query of alterQueries) {
      try {
        await sequelize.query(query, { type: QueryTypes.RAW });
        console.log(`✓ Executed: ${query}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`- Column already exists: ${query}`);
        } else {
          console.error(`✗ Error executing: ${query}`, error.message);
        }
      }
    }

    console.log('✓ Admin settings fields migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

addAdminSettingsFields();