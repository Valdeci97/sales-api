import { NextFunction, Request, Response } from 'express';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import OrderService from '../services/OrderService';
import { OrderRequest } from '../types/Order';
import HttpException from '../utils/exceptions/HttpException';

export default class OrderController {
  private service: OrderService;

  constructor(service: OrderService = new OrderService()) {
    this.service = service;
  }

  public create = async (
    req: RequestWithBody<OrderRequest>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { body } = req;
    try {
      const order = await this.service.create(body);
      if (!order) return next(new HttpException());
      return res.status(200).json({ order });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };

  public read = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const orders = await this.service.list();
      return res.status(200).json({ orders });
    } catch (err) {
      next(new HttpException());
    }
  };

  public readById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const order = await this.service.listById(id);
      return res.status(200).json({ order });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };
}
