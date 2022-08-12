import { RequestHandler, Router } from 'express';

import Controller from '../controllers';

export default class CustomRouter<T> {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  public readOneRoute(
    controller: Controller<T>,
    route: string = controller.route,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.get(`${route}/:id`, ...middlewares, controller.readOne);
  }

  public addGetRoute(
    route: string,
    reqFunc: RequestHandler,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.get(route, ...middlewares, reqFunc);
  }

  public addPostRoute(
    route: string,
    reqFunc: RequestHandler,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.post(route, ...middlewares, reqFunc);
  }

  public addPutRoute(
    route: string,
    reqFunc: RequestHandler,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.put(route, ...middlewares, reqFunc);
  }

  public addPatchRoute(
    route: string,
    reqFunc: RequestHandler,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.patch(route, ...middlewares, reqFunc);
  }

  public addDeleteRoute(
    route: string,
    reqFunc: RequestHandler,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.delete(route, ...middlewares, reqFunc);
  }
}
