/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import { PrismaClient, UserToken } from '@prisma/client';
import { database } from '../database';
import { DbResponse } from '../types/DbResponse';

export default class UserTokenService {
  private model: PrismaClient;

  constructor(model: PrismaClient = database) {
    this.model = model;
  }

  public async findByToken(token: string): Promise<DbResponse> {
    const userToken = await this.model.userToken.findFirst({
      where: { token },
    });
    if (!userToken) {
      return this.createDbResponse(404, 'There no user with such token.');
    }
    return this.createDbResponse(200, '', userToken);
  }

  public async createToken(userId: string): Promise<DbResponse> {
    const userToken = await this.model.userToken.create({
      data: {
        user_id: userId,
      },
    });
    return this.createDbResponse(201, '', userToken);
  }

  private createDbResponse(
    status: number,
    message: string = '',
    data: UserToken = {
      id: '',
      token: '',
      user_id: '',
      generated_at: new Date(),
    }
  ): DbResponse {
    return [status, message, data];
  }
}
