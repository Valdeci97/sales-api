import { Request, Response, NextFunction } from 'express';
import PasswordService from '../services/PasswordService';
import HttpException from '../utils/exceptions/HttpException';

export default class PasswordController {
  private service: PasswordService;

  constructor(service: PasswordService = new PasswordService()) {
    this.service = service;
  }

  public generateUserToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email } = req.body;
    try {
      const user = await this.service.findUserByEmail(email);
      if (!user) return next(new HttpException(404, 'User not found!'));
      const [code] = await this.service.createToken(user, user.id);
      return res.status(code).end();
    } catch (err) {
      next(new HttpException());
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { token, password } = req.body;
    try {
      const [code, message] = await this.service.resetPassword({
        token,
        password,
      });
      return res.status(code).json({ message });
    } catch (err) {
      next(new HttpException());
    }
  };
}
