import { PrismaClient, Customer } from '@prisma/client';
import { database } from '../database';

export default class CustomerModel {
  private db: PrismaClient;

  constructor(db: PrismaClient = database) {
    this.db = db;
  }

  public async create({ name, email }: Customer): Promise<Customer> {
    const customer = await this.db.customer.create({ data: { name, email } });
    return customer;
  }

  public async list(): Promise<Customer[]> {
    const customers = this.db.customer.findMany();
    return customers;
  }

  public async listById(id: string): Promise<Customer | null> {
    const customer = this.db.customer.findFirst({ where: { id } });
    return customer;
  }

  public async update({ id, name, email }: Customer): Promise<Customer> {
    const customer = await this.db.customer.update({
      where: { id },
      data: { name, email },
    });
    return customer;
  }

  public async destroy(id: string): Promise<void> {
    await this.db.customer.delete({ where: { id } });
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.db.customer.findFirst({ where: { email } });
    return customer;
  }
}
