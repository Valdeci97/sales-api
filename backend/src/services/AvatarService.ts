import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
import { database } from '../database';
import { Avatar, AvatarReponse } from '../types/Avatar';
import config from '../utils/upload';

export default class AvatarService {
  private model: PrismaClient;

  constructor(model: PrismaClient = database) {
    this.model = model;
  }

  // eslint-disable-next-line class-methods-use-this
  private createAvatarResponse(
    status: number,
    message: string = '',
    data: string = ''
  ): AvatarReponse {
    return [status, message, data];
  }

  public async updateAvatar({ id, fileName }: Avatar): Promise<AvatarReponse> {
    const user = await this.model.user.findFirst({ where: { id } });
    if (!user) return this.createAvatarResponse(404, 'User not found!');
    if (user.avatar) {
      const filePath = path.join(config.directory, user.avatar);
      const fileExists = await fs.stat(filePath);
      if (fileExists) {
        await fs.unlink(filePath);
      }
    }
    await this.model.user.update({
      where: { id },
      data: { avatar: fileName },
    });
    return this.createAvatarResponse(200, 'Avatar updated successfully!');
  }
}
