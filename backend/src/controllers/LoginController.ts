import { User } from '@prisma/client';
import { Response, NextFunction } from 'express';
import HttpException from '../utils/exceptions/HttpException';
import LoginService from '../services/LoginService';
import { RequestWithBody } from '../interfaces/RequestWithBody';

export default class LoginController {
  private service: LoginService;

  constructor(service = new LoginService()) {
    this.service = service;
  }

  public login = async (
    req: RequestWithBody<User>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { body } = req;
    try {
      const { token } = await this.service.login(body);
      return res.status(200).json({ token });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };
}
