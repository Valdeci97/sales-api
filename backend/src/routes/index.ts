import { RequestHandler, Router } from 'express';

export default class CustomRouter {
  public router: Router;

  constructor() {
    this.router = Router();
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
