import { Response, NextFunction, Request } from 'express';
import Controller from '.';
import HttpException from '../exceptions/HttpException';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import ProductService from '../services/ProductService';
import { Product } from '../types/ProductType';

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
      const [code, message, product] = await this.service.create(body);
      return res.status(code).json({ message, user: product });
    } catch (err) {
      next(new HttpException());
    }
  };

  public readOne = async (
    req: Request,
    res: Response<Product>,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const product = await this.service.listById(id);
      if (!product) return next(new HttpException(404, 'Product not found!'));
      return res.status(200).json(product);
    } catch (err) {
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
      const [code, message, product] = await this.service.update(
        productToUpdate
      );
      if (message.length > 0) return res.status(code).json({ message });
      return res.status(code).json(product);
    } catch (err) {
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
      const [code, message] = await this.service.destroy(id);
      if (message.length > 0) return res.status(code).json({ message });
      return res.status(204).end();
    } catch (err) {
      next(new HttpException());
    }
  };
}
