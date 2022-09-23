import 'dotenv/config';
import { User } from '@prisma/client';
import { addHours, isAfter } from 'date-fns';
import path from 'path';
import { ResetPassword } from '../types/ResetPassword';
import MailHandler from '../utils/MailHandler';
import UserModel from '../models/UserModel';
import UserTokenModel from '../models/UserTokenModel';
import HttpException from '../utils/exceptions/HttpException';

export default class PasswordService {
  private userModel: UserModel;

  private userTokenModel: UserTokenModel;

  private date = Date.now();

  private LIMIT_TO_VALIDATE_A_TOKEN = 2;

  private subject = 'Sales api - Mudança de senha';

  private mailPath = path.resolve(
    __dirname,
    '..',
    'utils',
    'handlebars',
    'mailView.hbs'
  );

  private URL = process.env.FORGOT_PASSWORD_URL || 'http://localhost:3000';

  constructor(
    userModel: UserModel = new UserModel(),
    userTokenModel: UserTokenModel = new UserTokenModel()
  ) {
    this.userModel = userModel;
    this.userTokenModel = userTokenModel;
  }

  private async findUser(id: string): Promise<User | null> {
    const user = await this.userModel.findUserById(id);
    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findByEmail(email);
    return user;
  }

  public async resetPassword({
    token,
    password,
  }: ResetPassword): Promise<void> {
    const userToken = await this.userTokenModel.findByToken(token);
    if (!userToken) {
      throw new HttpException(404, 'User not found');
    }
    const user = await this.findUser(userToken.user_id);
    if (!user) throw new HttpException(404, 'User not found');
    if (this.isInvalidToken(userToken.generated_at)) {
      throw new HttpException(400, 'Invalid token!');
    }
    await this.updatePassword(user.id, password);
  }

  private async updatePassword(id: string, password: string): Promise<void> {
    await this.userModel.updatePassword(password, id);
  }

  public async createToken(
    { name, email }: User,
    userId: string
  ): Promise<void> {
    const { token } = await this.userTokenModel.createToken(userId);
    await MailHandler.sendMail({
      to: { name, email },
      subject: this.subject,
      templateData: {
        file: this.mailPath,
        args: {
          name,
          link: `${this.URL}/password/reset?token=${token}`,
        },
      },
    });
  }

  private isInvalidToken(date: Date | number): boolean {
    const compare = addHours(date, this.LIMIT_TO_VALIDATE_A_TOKEN);
    return isAfter(this.date, compare);
  }
}
