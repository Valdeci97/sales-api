import { RequestHandler, Router } from 'express';

import Controller from '../controllers';

export default class CustomRouter<T> {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  public readRoute(
    controller: Controller<T>,
    route: string = controller.route
  ): void {
    this.router.get(route, controller.read);
  }

  public readOneRoute(
    controller: Controller<T>,
    route: string = controller.route,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.get(`${route}/:id`, ...middlewares, controller.readOne);
  }

  public createRoute(
    controller: Controller<T>,
    route: string = controller.route,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.post(route, ...middlewares, controller.create);
  }

  public updateRoute(
    controller: Controller<T>,
    route: string = controller.route,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.put(`${route}/:id`, ...middlewares, controller.update);
  }

  public deleteRoute(
    controller: Controller<T>,
    route: string = controller.route,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.delete(`${route}/:id`, ...middlewares, controller.delete);
  }

  public addGetRoute(
    reqFunc: RequestHandler,
    route: string,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.get(route, ...middlewares, reqFunc);
  }

  public addPostRoute(
    reqFunc: RequestHandler,
    route: string,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.post(route, ...middlewares, reqFunc);
  }

  public addPutRoute(
    reqFunc: RequestHandler,
    route: string,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.put(route, ...middlewares, reqFunc);
  }

  public addPatchRoute(
    reqFunc: RequestHandler,
    route: string,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.patch(route, ...middlewares, reqFunc);
  }

  public addDeleteRoute(
    reqFunc: RequestHandler,
    route: string,
    ...middlewares: RequestHandler[]
  ): void {
    this.router.delete(route, ...middlewares, reqFunc);
  }
}
