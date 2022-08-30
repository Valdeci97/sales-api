import { Request, Response, NextFunction } from 'express';
import { Customer } from '@prisma/client';
import Controller from '.';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import CustomerService from '../services/CustomerService';
import HttpException from '../utils/exceptions/HttpException';

export default class CustomerController extends Controller<Customer> {
  public route: string;

  constructor(service = new CustomerService(), route = '/customers') {
    super(service);
    this.route = route;
  }

  public create = async (
    req: RequestWithBody<Customer>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { body } = req;
    try {
      const customer = await this.service.create(body);
      return res.status(this.statusCode.created).json({ customer });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };

  public readOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const customer = await this.service.listById(id);
      return res.status(this.statusCode.ok).json({ customer });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };

  public update = async (
    req: RequestWithBody<Customer>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    req.body.id = req.params.id;
    try {
      const customer = await this.service.update(req.body);
      return res.status(this.statusCode.ok).json({ customer });
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
