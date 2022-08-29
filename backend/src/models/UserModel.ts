import { PrismaClient, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { database } from '../database';
import HttpException from '../utils/exceptions/HttpException';

export default class UserModel {
  private db: PrismaClient;

  private readonly hashSalts = 10;

  private readonly emailInUse = 'Email already in use';

  private readonly notFound = 'User not found';

  private readonly equalPassword =
    'New password must be different than the old one';

  constructor(model: PrismaClient = database) {
    this.db = model;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findFirst({ where: { email } });
    return user;
  }

  public async create({ name, email, password }: User): Promise<User> {
    const hashed = await hash(password, this.hashSalts);
    const user = await this.db.user.create({
      data: { name, email, password: hashed },
    });
    return user;
  }

  public async list(): Promise<Array<Partial<User>>> {
    const users = await this.db.user.findMany({
      select: { id: true, name: true, email: true, avatar: true },
    });
    return users;
  }

  public async listById(id: string): Promise<Partial<User> | null> {
    const user = await this.db.user.findFirst({ where: { id } });
    return user;
  }

  public async update(obj: User): Promise<User> {
    const user = await this.listById(obj.id);
    if (!user) throw new HttpException(404, this.notFound);
    return this.handleUpdate(obj);
  }

  public async destroy(id: string): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }

  private async isInvalidEmailToUpdate(
    email: string,
    id: string
  ): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) return false;
    return user.id !== id;
  }

  private async isInvalidPasswordToUpdate(
    password: string,
    id: string
  ): Promise<boolean> {
    const user = await this.db.user.findFirst({ where: { id } });
    if (!user) return true;
    const isInvalid = compare(password, user.password);
    return isInvalid;
  }

  private async updateNameEmail(
    name: string,
    email: string,
    id: string
  ): Promise<User> {
    const isInValidEmail = await this.isInvalidEmailToUpdate(email, id);
    if (isInValidEmail) throw new HttpException(409, this.emailInUse);
    const user = await this.db.user.update({
      where: { id },
      data: { name, email },
    });
    return user;
  }

  private async updateNamePassword(
    name: string,
    password: string,
    id: string
  ): Promise<User> {
    const isInValidPassword = await this.isInvalidPasswordToUpdate(
      password,
      id
    );
    if (isInValidPassword) throw new HttpException(409, this.equalPassword);
    const hashed = await hash(password, this.hashSalts);
    const user = await this.db.user.update({
      where: { id },
      data: { name, password: hashed },
    });
    return user;
  }

  private async updateName(name: string, id: string): Promise<User> {
    const user = await this.db.user.update({ where: { id }, data: { name } });
    return user;
  }

  private async updateUser(
    name: string,
    email: string,
    password: string,
    id: string
  ): Promise<User> {
    if (!email && !password) return this.updateName(name, id);
    const [isInValidEmail, isInValidPassword] = await Promise.all([
      this.isInvalidEmailToUpdate(email, id),
      this.isInvalidPasswordToUpdate(password, id),
    ]);
    if (isInValidEmail) throw new HttpException(409, this.emailInUse);
    if (isInValidPassword) throw new HttpException(409, this.equalPassword);
    const hashed = await hash(password, this.hashSalts);
    const user = await this.db.user.update({
      where: { id },
      data: { name, email, password: hashed },
    });
    return user;
  }

  private async handleUpdate({
    id,
    name,
    email,
    password,
  }: User): Promise<User> {
    if (email && !password) return this.updateNameEmail(name, email, id);
    if (!email && password) return this.updateNamePassword(name, password, id);
    return this.updateUser(name, email, password, id);
  }
}
