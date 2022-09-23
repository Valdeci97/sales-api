import { Response, NextFunction, Request } from 'express';
import { Product } from '@prisma/client';
import Controller from '.';
import HttpException from '../utils/exceptions/HttpException';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import ProductService from '../services/ProductService';
import logger from '../logger';

export default class ProductController extends Controller<Product> {
  private _route: string;

  constructor(service = new ProductService(), route = '/products') {
    super(service);
    this._route = route;
  }

  public get route() {
    return this._route;
  }

  public create = async (
    req: RequestWithBody<Product>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { body } = req;
    try {
      const product = await this.service.create(body);
      return res.status(this.statusCode.created).json({ product });
    } catch (err) {
      logger.error(err);
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };

  public readOne = async (
    req: Request,
    res: Response<Product | Partial<Product>>,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const product = await this.service.listById(id);
      return res.status(this.statusCode.ok).json(product);
    } catch (err) {
      logger.error(err);
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };

  public update = async (
    req: RequestWithBody<Product>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    try {
      const productToUpdate = { id, name, quantity, price };
      const product = await this.service.update(productToUpdate);
      return res.status(this.statusCode.ok).json({ product });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    try {
      await this.service.destroy(id);
      return res.status(this.statusCode.noContent).end();
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };
}
