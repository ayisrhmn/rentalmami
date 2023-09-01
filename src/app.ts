import express, { Express } from 'express';
import listEndpoints from 'express-list-endpoints';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import {
  unitRoutes,
  purchaseRoutes,
  salesRoutes,
  dashboardRoutes,
  roleRoutes,
  userRoutes,
} from './routes';

interface Route {
  methods: string[];
  path: string;
}

export const app: Express = express();

app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'));
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
]);

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
  console.log(`⚡️[rentalmami]: Server is running on port ${PORT}`);

  if (process.env.NODE_ENV !== 'production') {
    console.log('List endpoints:');
    const routes = listEndpoints(app);
    routes.forEach((route: Route) => {
      console.log(`${route.methods.join(', ')} - ${route.path}`);
    });
  }
});
