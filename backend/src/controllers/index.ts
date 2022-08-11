/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';
import { Model } from '../interfaces/ModelInterface';
import { RequestWithBody } from '../interfaces/RequestWithBody';

export default abstract class Controller<T> {
  public abstract route: string;

  protected service: Model<T>;

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
    res: Response<T[]>,
    next: NextFunction
  ): Promise<typeof res | void> => {
    try {
      const obj = await this.service.list();
      return res.status(200).json(obj);
    } catch (err) {
      next(new HttpException(500, 'Internal server error!'));
    }
  };

  public abstract readOne(
    req: Request<{ id: string }>,
    res: Response<T>,
    next: NextFunction
  ): any;

  public abstract update(
    req: Request<T>,
    res: Response,
    next: NextFunction
  ): any;

  public abstract delete(req: Request, res: Response, next: NextFunction): any;
}
