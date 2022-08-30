/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/exceptions/HttpException';
import { Model } from '../interfaces/ModelInterface';
import { RequestWithBody } from '../interfaces/RequestWithBody';

export default abstract class Controller<T> {
  public abstract route: string;

  protected service: Model<T>;

  protected readonly statusCode = {
    ok: 200,
    created: 201,
    noContent: 204,
    notFound: 404,
  };

  constructor(service: Model<T>) {
    this.service = service;
  }

  public abstract create(
    req: RequestWithBody<T>,
    res: Response,
    next: NextFunction
  ): any;

  public read = async (
    _req: Request,
    res: Response<Array<T | Partial<T>>>,
    next: NextFunction
  ): Promise<typeof res | void> => {
    try {
      const obj = await this.service.list();
      return res.status(this.statusCode.ok).json(obj);
    } catch (err) {
      next(new HttpException());
    }
  };

  public abstract readOne(
    req: Request,
    res: Response<T | Partial<T>>,
    next: NextFunction
  ): any;

  public abstract update(
    req: RequestWithBody<T>,
    res: Response,
    next: NextFunction
  ): any;

  public abstract delete(req: Request, res: Response, next: NextFunction): any;
}
