import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { database } from '../database';
import { UserToken } from '../types/UserToken';
import { User } from '../types/UserType';
import JsonWebToken from '../utils/jwt';

export default class LoginService {
  private model: PrismaClient;

  constructor(model: PrismaClient = database) {
    this.model = model;
  }

  public async login({ email, password }: User): Promise<UserToken> {
    const user = await this.findByEmail(email);
    if (!user) return this.createUserToken(400, 'Incorrect/email or password!');
    const isSamePassword = await compare(password, user.password);
    if (!isSamePassword)
      return this.createUserToken(400, 'Incorrect/email or password!');
    const token = JsonWebToken.generate({ id: user.id });
    return this.createUserToken(200, '', {
      user: {
        id: user.id,
        name: user.name,
      },
      token,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private createUserToken(
    status: number,
    message: string = '',
    data = {
      user: {
        id: '',
        name: '',
      },
      token: '',
    }
  ): UserToken {
    return [status, message, data];
  }

  private async findByEmail(email: string) {
    return this.model.user.findFirst({ where: { email } });
  }
}
