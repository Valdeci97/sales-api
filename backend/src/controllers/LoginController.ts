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
      const { token } = await this.service.login(body);
      return res.status(200).json({ token });
    } catch (err) {
      next(new HttpException());
    }
  };
}
