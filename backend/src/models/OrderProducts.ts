/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client';
import { database } from '../database';
import { OrderProductRequest } from '../types/Order';

export default class OrderProductsModel {
  private db: PrismaClient;

  constructor(db: PrismaClient = database) {
    this.db = db;
  }

  public async create({
    orderId,
    product,
  }: OrderProductRequest): Promise<void> {
    await this.db.orderProduct.create({
      data: {
        order_id: orderId,
        quantity: product.quantity,
        price: product.price,
        product_id: product.id,
      },
    });
  }
}
