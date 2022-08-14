import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/exceptions/HttpException';

export default class GlobalMiddleware {
  public error = (
    err: HttpException,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Response => {
    console.log(err);
    const code = Number(err.status) || 500;
    const message = err.message || 'Something went wrong.';
    return res.status(code).json({ message });
  }
}
