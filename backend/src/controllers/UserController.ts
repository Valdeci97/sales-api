import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import Controller from '.';
import HttpException from '../utils/exceptions/HttpException';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import UserService from '../services/UserService';

export default class UserController extends Controller<User> {
  public route: string;

  constructor(service = new UserService(), route = '/users') {
    super(service);
    this.route = route;
  }

  public create = async (
    req: RequestWithBody<User>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { body } = req;
    try {
      const user = await this.service.create(body);
      return res.status(this.statusCode.created).json({
        user: { id: user.id, name: user.name, avatar: user.avatar },
      });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };

  public readOne = async (
    req: Request,
    res: Response<User | Partial<User>>,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const user = await this.service.listById(id);
      if (!user) {
        return next(
          new HttpException(this.statusCode.notFound, 'User not found')
        );
      }
      return res.status(this.statusCode.ok).json(user);
    } catch (err) {
      next(new HttpException());
    }
  };

  public update = async (
    req: RequestWithBody<User>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    req.body.id = req.user.id;
    try {
      const user = await this.service.update(req.body);
      return res.status(this.statusCode.ok).json({
        user: { id: user.id, name: user.name, avatar: user.avatar },
      });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    try {
      await this.service.destroy(id);
      return res.status(this.statusCode.noContent).end();
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };
}
