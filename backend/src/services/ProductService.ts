import { PrismaClient } from '@prisma/client';
import { database } from '../database';
import { Model } from '../interfaces/ModelInterface';
import { Product } from '../types/ProductType';

export default class ProductService implements Model<Product> {
  private model: PrismaClient;

  constructor(model = database) {
    this.model = model;
  }

  public async create({
    name,
    price,
    quantity,
  }: Product): Promise<Product | null> {
    const product = await this.model.product.create({
      data: {
        name,
        price,
        quantity,
      },
    });
    return product;
  }

  public async list(): Promise<Product[]> {
    return this.model.product.findMany();
  }

  public async listById({ id }: Product): Promise<Product | null> {
    const product = this.model.product.findFirst({ where: { id } });
    return product;
  }
}
