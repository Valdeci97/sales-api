import { Request, Response, NextFunction } from 'express';
import { userEmail, username, userPassword } from '../utils/joiSchemas/user';

export default class UserMiddleware {
  public validateName = (
    req: Request,
    res: Response,
    next: NextFunction  
  ): Response | void => {
    const { error } = username.validate(req.body);
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  }

  public validateEmail = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    const { error } = userEmail.validate(req.body);
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  }

  public validatePassword = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    const { error } = userPassword.validate(req.body);
    if (error) {
      const [code, message] = error.message.split('/');
      return res.status(Number(code)).json({ message });
    }
    next();
  }
}
