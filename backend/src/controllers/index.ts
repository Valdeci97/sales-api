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
    res: Response<T>,
    next: NextFunction
  ): Response<typeof res | undefined>;

  public read = async (
    req: Request,
    res: Response<T[]>,
    next: NextFunction
  ): Promise<typeof res | undefined> => {
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
    nex: NextFunction
  ): Promise<typeof res | undefined>;

  public abstract update(
    req: Request<T>,
    res: Response<T>,
    next: NextFunction
  ): Promise<typeof res | undefined>;

  public abstract delete(
    req: RequestWithBody<T>,
    res: Response<T>,
    next: NextFunction
  ): Promise<typeof res | undefined>;
}
