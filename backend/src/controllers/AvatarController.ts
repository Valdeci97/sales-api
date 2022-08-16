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
      const [code, message] = await this.service.updateAvatar({ id, fileName });
      return res.status(code).json({ message });
    } catch (err) {
      next(new HttpException());
    }
  };
}
