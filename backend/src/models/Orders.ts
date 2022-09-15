/* eslint-disable camelcase */
import { Order, PrismaClient } from '@prisma/client';
import { database } from '../database';
import { OrderRelations } from '../types/Order';

export default class OrderModel {
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

  public async list(id: string): Promise<(Order & OrderRelations) | null> {
    const orders = await this.db.order.findFirst({
      where: { id },
      include: { orderProduct: true, customer: true },
    });
    return orders;
  }

  // public async listById(id: string): Promise<Order | null> {
  //   const order =
  // }
}
