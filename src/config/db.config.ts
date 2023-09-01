import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import appConfig from './app.config';

dotenv.config();

const sequelize = new Sequelize({
  ...appConfig.database,
  dialect: 'postgres',
  logging:
    appConfig.environment !== 'production' ? (msg) => console.log(msg) : false,
});

export default sequelize;
