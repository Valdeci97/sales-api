/* eslint-disable camelcase */
import { PrismaClient, UserToken } from '@prisma/client';
import { database } from '../database';

export default class userTokenModel {
  private db: PrismaClient;

  constructor(db: PrismaClient = database) {
    this.db = db;
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = await this.db.userToken.findFirst({ where: { token } });
    return userToken;
  }

  public async createToken(user_id: string): Promise<UserToken> {
    const createdUserToken = await this.db.userToken.create({
      data: { user_id },
    });
    return createdUserToken;
  }
}
