import { Request, Response, NextFunction } from 'express';
import { uuidSchema } from '../utils/joiSchemas/uuid';

export default class GuidMiddleware {
  public validateGuid = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    const { id } = req.params;
    const { error } = uuidSchema.validate(id);
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  }
}
