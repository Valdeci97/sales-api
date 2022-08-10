import { PrismaClient } from '@prisma/client';
import { database } from '../database';
import { Model } from '../interfaces/ModelInterface';
import { IProduct } from '../interfaces/ProductInterface';

export default class ProductService implements Model<IProduct> {
  private model: PrismaClient;

  constructor(model = database) {
    this.model = model;
  }

  public async create({
    name,
    price,
    quantity,
  }: IProduct): Promise<IProduct | null> {
    const product = await this.model.product.create({
      data: {
        name,
        price,
        quantity,
      },
    });
    return product;
  }
}
