/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { addHours, isAfter } from 'date-fns';
import path from 'path';
import { database } from '../database';
import { ResetPassword } from '../types/ResetPassword';
import { TokenResponse } from '../types/TokenResponse';
import { DbResponse } from '../types/DbResponse';
import MailHandler from '../utils/MailHandler';
// import Mail from '../utils/Mail';

export default class PasswordService {
  private model: PrismaClient;

  private date = Date.now();

  private LIMIT_TO_VALIDATE_A_TOKEN = 2;

  private salts = 10;

  private subject = 'Sales api - Mudança de senha';

  private mailPath = path.resolve(
    __dirname,
    '..',
    'utils',
    'handlebars',
    'mailView.hbs'
  );

  constructor(model: PrismaClient = database) {
    this.model = model;
  }

  private async findUser(id: string): Promise<User | null> {
    const user = await this.model.user.findFirst({
      where: { id },
    });
    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.model.user.findFirst({
      where: { email },
    });
    return user;
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

    const user = await this.findUser(userToken.user_id);
    if (!user) return this.createTokenResponse(404, 'User not found!');
    if (this.isInvalidToken(userToken.generated_at)) {
      return this.createTokenResponse(400, 'Invalid token!');
    }
    await this.updatePassword(user.id, password);
    return this.createTokenResponse(200, 'Password updated successfully!');
  }

  private async updatePassword(id: string, password: string): Promise<void> {
    const hashedPassword = await hash(password, this.salts);
    await this.model.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  public async createToken(
    { name, email }: User,
    userId: string
  ): Promise<DbResponse> {
    const { token } = await this.model.userToken.create({
      data: { user_id: userId },
    });
    await MailHandler.sendMail({
      to: { name, email },
      subject: this.subject,
      templateData: {
        file: this.mailPath,
        args: {
          name,
          link: `http://localhost:3001/password/reset?token=${token}`,
        },
      },
    });
    return this.createDbResponse(204);
  }

  private isInvalidToken(date: Date | number): boolean {
    const compare = addHours(date, this.LIMIT_TO_VALIDATE_A_TOKEN);
    return isAfter(this.date, compare);
  }

  private createTokenResponse(
    status: number,
    message: string = '',
    data: ResetPassword = { token: '', password: '' }
  ): TokenResponse {
    return [status, message, data];
  }

  private createDbResponse(
    status: number,
    message: string = '',
    data: string = ''
  ): DbResponse {
    return [status, message, data];
  }
}
