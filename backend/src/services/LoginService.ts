import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import UserModel from '../models/UserModel';
import { UserWithToken } from '../types/UserWithToken';
import HttpException from '../utils/exceptions/HttpException';
import JsonWebToken from '../utils/jwt';

export default class LoginService {
  private model: UserModel;

  constructor(model: UserModel = new UserModel()) {
    this.model = model;
  }

  public async login({ email, password }: User): Promise<UserWithToken> {
    const user = await this.model.findByEmail(email);
    if (!user) throw new HttpException(404, 'User not found');
    const isSamePassword = await compare(password, user.password);
    if (!isSamePassword) {
      throw new HttpException(400, 'Incorrect/email or password!');
    }
    const token = JsonWebToken.generate({ id: user.id });
    return { data: { user, token } };
  }
}
