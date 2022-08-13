import { Request, Response, NextFunction } from 'express';
import { productName, productPrice, productQuantity } from '../joiSchemas/product';

export default class ProductMiddleware {
  public validateName = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    const { error } = productName.validate(req.body);
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  };

  public validatePrice = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    const { error } = productPrice.validate(req.body, { convert: false });
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  }

  public validateQuantity = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    const { error } = productQuantity.validate(req.body, { convert: false });
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  }
}
