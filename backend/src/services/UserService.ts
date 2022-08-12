import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import Service from '.';
import { ServiceResponse } from '../types/ServiceResponse';
import { User } from '../types/UserType';

export default class UserService extends Service<User> {
  private model: PrismaClient;

  constructor(model: PrismaClient) {
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
    const hash = hashSync(password);
    const user = await this.model.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });
    return this.createResponse(201, 'User created successfully!', user);
  }

  async list(): Promise<User[]> {
    return this.model.user.findMany();
  }

  async listById(id: string): Promise<User | null> {
    return this.model.user.findFirst({ where: { id } });
  }

  async update(_obj: User): Promise<ServiceResponse<User>> {
    return this.createResponse(500);
  }

  async destroy(_id: string): Promise<ServiceResponse<User>> {
    return this.createResponse(500);
  }

  private async findByEmail(email: string): Promise<User | null> {
    return this.model.user.findFirst({ where: { email } });
  }
}
