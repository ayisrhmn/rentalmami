import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
  appName: 'rentalmami',
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  secretKey: process.env.SECRET_KEY as string,
};

export default appConfig;
