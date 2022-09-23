import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
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
      await this.service.createToken(user, user.id);
      return res.status(204).end();
    } catch (err) {
      logger.error(err);
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
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
      await this.service.resetPassword({
        token,
        password,
      });
      return res.status(200).json({ message: 'Password update successfully' });
    } catch (err) {
      logger.error(err);
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };
}
