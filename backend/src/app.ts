import express, { Router, ErrorRequestHandler } from 'express';
import cors from 'cors';
import GlobalMiddleware from './middlewares';
import logger from './logger';

export default class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  public start(PORT: number | string = 3001): void {
    this.app.listen(PORT, () => logger.info(`Server running at port: ${PORT}`));
  }

  public addRouter(router: Router): void {
    this.app.use(router);
  }

  public getApp(): express.Application {
    return this.app;
  }

  public addErrorMiddleware(
    middleware: ErrorRequestHandler = new GlobalMiddleware().error
  ): void {
    this.app.use(middleware);
  }

  public addStaticRoute(route: string, directory: string): void {
    this.app.use(route, express.static(directory));
  }
}
