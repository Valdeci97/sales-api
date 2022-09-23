import { User } from '@prisma/client';
import Service from '.';
import logger from '../logger';
import UserModel from '../models/UserModel';
import HttpException from '../utils/exceptions/HttpException';

export default class UserService extends Service<User> {
  private model: UserModel;

  private readonly userNotFound = 'User not found';

  private readonly userAlreadyExists = 'User already exists';

  constructor(model: UserModel = new UserModel()) {
    super();
    this.model = model;
  }

  async create(obj: User): Promise<User> {
    const userExists = await this.model.findByEmail(obj.email);
    if (userExists) throw new HttpException(409, this.userAlreadyExists);
    const user = await this.model.create(obj);
    logger.info('User created');
    return user;
  }

  async list(): Promise<Array<Partial<User>>> {
    return this.model.list();
  }

  async listById(id: string): Promise<Partial<User>> {
    const user = await this.model.listById(id);
    if (!user) throw new HttpException(404, 'User not found');
    return user;
  }

  async update(obj: User): Promise<User> {
    const user = await this.model.update(obj);
    logger.info('User updated');
    return user;
  }

  async destroy(id: string): Promise<void> {
    const user = await this.model.listById(id);
    if (!user) throw new HttpException(404, this.userNotFound);
    await this.model.destroy(id);
    logger.info('User deleted');
  }
}
