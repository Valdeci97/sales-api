import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import Service from '.';
import { database } from '../database';
import { ServiceResponse } from '../types/ServiceResponse';
import { User } from '../types/UserType';
import { UserToken } from '../types/UserToken';
import JsonWebToken from '../utils/jwt';

const USER_NOT_FOUND = 'User does found!';

export default class UserService extends Service<User> {
  private model: PrismaClient;

  private hashSalts = 10;

  constructor(model: PrismaClient = database) {
    super({ id: '', name: '', email: '', password: '', avatar: '' });
    this.model = model;
  }

  async create({
    name,
    email,
    password,
  }: User): Promise<ServiceResponse<User>> {
    const userExists = await this.findByEmail(email);
    if (userExists) {
      return this.createResponse(409, 'User already exists!');
    }
    const hashed = await hash(password, this.hashSalts);
    const user = await this.model.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });
    return this.createResponse(201, 'User created successfully!', user);
  }

  async list(): Promise<Array<Partial<User>>> {
    return this.model.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }

  async listById(id: string): Promise<Partial<User> | null> {
    return this.model.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }

  async update({ id, name, avatar }: User): Promise<ServiceResponse<User>> {
    const user = this.model.user.findFirst({ where: { id } });
    if (!user) {
      return this.createResponse(404, USER_NOT_FOUND);
    }
    const updatedUser = await this.model.user.update({
      where: { id },
      data: { name, avatar },
    });
    return this.createResponse(200, '', updatedUser);
  }

  async destroy(id: string): Promise<ServiceResponse<User>> {
    const user = this.model.user.findFirst({ where: { id } });
    if (!user) return this.createResponse(404, USER_NOT_FOUND);
    await this.model.user.delete({ where: { id } });
    return this.createResponse(204);
  }

  private async findByEmail(email: string): Promise<User | null> {
    return this.model.user.findFirst({ where: { email } });
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

  public async login({ email, password }: User): Promise<UserToken> {
    const user = await this.findByEmail(email);
    if (!user) return this.createUserToken(400, 'Incorrect/email or password!');
    const isSamePassword = await compare(password, user.password);
    if (!isSamePassword)
      return this.createUserToken(400, 'Incorrect/email or password!');
    const token = JsonWebToken.generate(user.id);
    return this.createUserToken(200, '', {
      user: {
        id: user.id,
        name: user.name,
      },
      token,
    });
  }
}
