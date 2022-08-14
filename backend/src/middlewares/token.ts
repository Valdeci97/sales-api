import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/exceptions/HttpException';
import { Token } from '../types/token';
import JsonWebToken from '../utils/jwt';

export default class TokenMiddleware {
  public validate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return next(new HttpException(404, 'Token not found!'));
      }
      const token = JsonWebToken.decode(authorization);
      const { id } = token as Token;
      req.user = {
        id,
      }
      next();
    } catch (err) {
      next(new HttpException(401, 'Invalid token!'));
    }
  }
}
