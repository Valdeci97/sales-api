import { PrismaClient, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import Service from '.';
import { database } from '../database';
import { ServiceResponse } from '../types/ServiceResponse';
import HttpException from '../utils/exceptions/HttpException';

const USER_NOT_FOUND = 'User not found!';
const EMAIL_IN_USE = 'Email already in use.';
const EQUAL_PASSWORD = 'New password must be different than the old one.';

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

  async update(obj: User): Promise<ServiceResponse<User>> {
    const user = await this.model.user.findFirst({ where: { id: obj.id } });
    if (!user) return this.createResponse(404, USER_NOT_FOUND);
    const updatedUser = await this.updateUserInfo(obj);
    return this.createResponse(200, '', updatedUser);
  }

  async destroy(id: string): Promise<ServiceResponse<User>> {
    const user = await this.model.user.findFirst({ where: { id } });
    if (!user) return this.createResponse(404, USER_NOT_FOUND);
    await this.model.user.delete({ where: { id } });
    return this.createResponse(204);
  }

  private async findByEmail(email: string): Promise<User | null> {
    return this.model.user.findFirst({ where: { email } });
  }

  private async isInvalidEmailToUpdate(
    email: string,
    id: string
  ): Promise<boolean | null> {
    const user = await this.findByEmail(email);
    return user && user.id !== id;
  }

  private async isInvalidPasswordToUpdate(password: string, id: string) {
    const user = await this.model.user.findFirst({ where: { id } });
    if (!user) throw new HttpException(404, USER_NOT_FOUND);
    const isValid = await compare(password, user.password);
    return isValid;
  }

  private async updateUserInfo({
    id,
    name,
    email,
    password,
  }: User): Promise<User> {
    if (email && !password) return this.updateEmail(name, email, id);
    if (!email && password) return this.updatePassword(name, password, id);
    const user = await this.updateUser(id, name, email, password);
    return user;
  }

  private async updateName(name: string, id: string): Promise<User> {
    const user = await this.model.user.update({
      where: { id },
      data: { name },
    });
    return user;
  }

  private async updateEmail(
    name: string,
    email: string,
    id: string
  ): Promise<User> {
    const isInValidEmail = await this.isInvalidEmailToUpdate(email, id);
    if (isInValidEmail) throw new HttpException(409, EMAIL_IN_USE);
    const user = await this.model.user.update({
      where: { id },
      data: { name, email },
    });
    return user;
  }

  private async updatePassword(
    name: string,
    password: string,
    id: string
  ): Promise<User> {
    const isInValidPassword = await this.isInvalidPasswordToUpdate(
      password,
      id
    );
    if (isInValidPassword) throw new HttpException(409, EQUAL_PASSWORD);
    const hashed = await hash(password, this.hashSalts);
    const user = await this.model.user.update({
      where: { id },
      data: { name, password: hashed },
    });
    return user;
  }

  private async updateUser(
    id: string,
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    if (!email && !password) return this.updateName(name, id);
    const [isInValidEmail, isInValidPassword] = await Promise.all([
      this.isInvalidEmailToUpdate(email, id),
      this.isInvalidPasswordToUpdate(password, id),
    ]);
    if (isInValidEmail) throw new HttpException(409, EMAIL_IN_USE);
    if (isInValidPassword) throw new HttpException(409, EQUAL_PASSWORD);
    const hashed = await hash(password, this.hashSalts);
    const user = await this.model.user.update({
      where: { id },
      data: { name, email, password: hashed },
    });
    return user;
  }
}
