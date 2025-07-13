import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('devhire', 'postgres', 'admin123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
