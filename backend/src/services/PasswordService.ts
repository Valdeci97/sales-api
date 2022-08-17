/* eslint-disable class-methods-use-this */
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { addHours, isAfter } from 'date-fns';
import { database } from '../database';
import { ResetPassword } from '../types/ResetPassword';
import { TokenResponse } from '../types/TokenResponse';

export default class PasswordService {
  private model: PrismaClient;

  private date = Date.now();

  private LIMIT_TO_VALIDATE_A_TOKEN = 2;

  private salts = 10;

  constructor(model: PrismaClient = database) {
    this.model = model;
  }

  public async resetPassword({
    token,
    password,
  }: ResetPassword): Promise<TokenResponse> {
    const userToken = await this.model.userToken.findFirst({
      where: { token },
    });
    if (!userToken) {
      return this.createTokenResponse(400, 'Token does not exist!');
    }

    const user = await this.model.user.findFirst({
      where: { id: userToken.user_id },
    });
    if (!user) return this.createTokenResponse(404, 'User not found!');
    if (this.isInvalidToken(userToken.generated_at)) {
      return this.createTokenResponse(400, 'Invalid token!');
    }
    await this.updatePassword(user.id, password);
    return this.createTokenResponse(200, 'Password updated successfully!');
  }

  private isInvalidToken(date: Date | number): boolean {
    const compare = addHours(date, this.LIMIT_TO_VALIDATE_A_TOKEN);
    return isAfter(this.date, compare);
  }

  private async updatePassword(id: string, password: string): Promise<void> {
    const hashedPassword = await hash(password, this.salts);
    await this.model.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  private createTokenResponse(
    status: number,
    message: string = '',
    data: ResetPassword = { token: '', password: '' }
  ): TokenResponse {
    return [status, message, data];
  }
}
