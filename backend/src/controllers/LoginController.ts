import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/exceptions/HttpException';
import LoginService from '../services/LoginService';

export default class LoginController {
  private service: LoginService;

  constructor(service = new LoginService()) {
    this.service = service;
  }

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { body } = req;
    try {
      const [code, message, user] = await this.service.login(body);
      if (message.length > 0) return res.status(code).json({ message });
      return res.status(code).json({ user });
    } catch (err) {
      next(new HttpException());
    }
  };
}
