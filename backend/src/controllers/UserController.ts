import { Request, Response, NextFunction } from 'express';
import Controller from '.';
import HttpException from '../exceptions/HttpException';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import UserService from '../services/UserService';
import { User } from '../types/UserType';

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
      const [code, message, user] = await this.service.create(body);
      if (code === 409) {
        return res.status(code).json({ message });
      }
      return res.status(code).json({ message, user });
    } catch (err) {
      next(new HttpException());
    }
  };

  public readOne = async (
    req: Request,
    res: Response<User>,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const user = await this.service.listById(id);
      if (!user) return next(new HttpException(404, 'User not found!'));
      return res.status(200).json(user);
    } catch (err) {
      next(new HttpException());
    }
  };

  public update = async (
    _req: RequestWithBody<User>,
    res: Response,
    _next: NextFunction
  ): Promise<Response | void> => {
    const users = await this.service.list();
    console.log(users);
    return res.status(200).end();
  };

  public delete = async (
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response | void> => {
    const users = await this.service.list();
    console.log(users);
    return res.status(200).end();
  };
}