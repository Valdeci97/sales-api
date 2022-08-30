import { Request, Response, NextFunction } from 'express';
import AvatarService from '../services/AvatarService';
import HttpException from '../utils/exceptions/HttpException';

export default class AvatarController {
  private service: AvatarService;

  constructor(service = new AvatarService()) {
    this.service = service;
  }

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.user;
    const fileName = req.file?.filename;
    if (!fileName) return next(new HttpException(404, 'File not found!'));
    try {
      await this.service.updateAvatar({ id, fileName });
      return res.status(200).json({ message: 'File updated sucessfully' });
    } catch (err) {
      if (err instanceof HttpException) {
        return next(new HttpException(err.status, err.message));
      }
      next(new HttpException());
    }
  };
}
