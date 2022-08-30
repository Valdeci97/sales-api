import path from 'path';
import fs from 'fs/promises';
import { Avatar } from '../types/Avatar';
import config from '../utils/upload';
import UserModel from '../models/UserModel';
import HttpException from '../utils/exceptions/HttpException';

export default class AvatarService {
  private model: UserModel;

  constructor(model: UserModel = new UserModel()) {
    this.model = model;
  }

  public async updateAvatar({ id, fileName }: Avatar): Promise<void> {
    const user = await this.model.findUserById(id);
    if (!user) throw new HttpException(404, 'User not found');
    if (user.avatar) {
      const filePath = path.join(config.directory, user.avatar);
      const fileExists = await fs.stat(filePath);
      if (fileExists) {
        await fs.unlink(filePath);
      }
    }
    await this.model.updateAvatar(fileName, id);
  }
}
