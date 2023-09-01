import express, { Express } from 'express';
import listEndpoints from 'express-list-endpoints';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import appConfig from './config/app.config';

import {
  unitRoutes,
  purchaseRoutes,
  salesRoutes,
  dashboardRoutes,
  roleRoutes,
  userRoutes,
  authRoutes,
} from './routes';

interface Route {
  methods: string[];
  path: string;
}

export const app: Express = express();

app.use(morgan(appConfig.environment !== 'production' ? 'dev' : 'combined'));
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/v1', [
  unitRoutes,
  purchaseRoutes,
  salesRoutes,
  dashboardRoutes,
  roleRoutes,
  userRoutes,
  authRoutes,
]);

app.listen(appConfig.port, () => {
  console.log(
    `⚡️[${appConfig.appName}]: Server is running on port ${appConfig.port}`,
  );

  if (process.env.NODE_ENV !== 'production') {
    console.log('List endpoints:');
    const routes = listEndpoints(app);
    routes.forEach((route: Route) => {
      console.log(`${route.methods.join(', ')} - ${route.path}`);
    });
  }
});
