/* eslint-disable camelcase */
import { Order, PrismaClient } from '@prisma/client';
import { database } from '../database';
import { OrderRelations } from '../types/Order';

export default class OrdersModel {
  private db: PrismaClient;

  constructor(db: PrismaClient = database) {
    this.db = db;
  }

  public async create(id: string): Promise<Order> {
    const order = this.db.order.create({
      data: {
        customer_id: id,
      },
    });
    return order;
  }

  public async list(customer_id: string): Promise<(Order & OrderRelations)[]> {
    const orders = await this.db.order.findMany({
      where: { customer_id },
      include: {
        orderProduct: true,
        customer: { select: { name: true, email: true } },
      },
    });
    return orders;
  }

  public async listById(id: string): Promise<(Order & OrderRelations) | null> {
    const order = await this.db.order.findFirst({
      where: { id },
      include: {
        orderProduct: true,
        customer: { select: { name: true, email: true } },
      },
    });
    return order;
  }

  public async destroy(id: string): Promise<void> {
    await this.db.order.delete({ where: { id } });
  }
}
