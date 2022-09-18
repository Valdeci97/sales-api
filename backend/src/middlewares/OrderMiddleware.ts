import { NextFunction, Request, Response } from 'express';
import { customerId, products } from '../utils/joiSchemas/orders';

export default class OrderMiddleware {
  public validateCustomerId = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    const { error } = customerId.validate(req.body);
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  };

  public validateProductsArray = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    const { error } = products.validate(req.body);
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  };
}
