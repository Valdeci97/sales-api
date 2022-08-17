import { PrismaClient } from '@prisma/client';
import { addHours, isAfter } from 'date-fns';
import { database } from '../database';
import { ResetPassword } from '../types/ResetPassword';

export default class PasswordService {
  private model: PrismaClient;

  private date = Date.now();

  private LIMIT_TO_VALIDATE_A_TOKEN = 2;

  constructor(model: PrismaClient = database) {
    this.model = model;
  }

  public async resetPassword({
    token,
    password,
  }: ResetPassword): Promise<string> {
    const userToken = await this.model.userToken.findFirst({
      where: { token },
    });
    if (!userToken) return '';

    const user = await this.model.user.findFirst({
      where: { id: userToken.user_id },
    });
    if (!user) return '';
    if (this.isInvalidToken(userToken.generated_at)) return '';
    return password;
  }

  private isInvalidToken(date: Date | number): boolean {
    const compare = addHours(date, this.LIMIT_TO_VALIDATE_A_TOKEN);
    return isAfter(this.date, compare);
  }
}
