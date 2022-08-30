import { PrismaClient, Product } from '@prisma/client';
import { database } from '../database';

export default class ProductModel {
  private db: PrismaClient;

  constructor(db: PrismaClient = database) {
    this.db = db;
  }

  public async create({ name, price, quantity }: Product): Promise<Product> {
    const product = await this.db.product.create({
      data: { name, price, quantity },
    });
    return product;
  }

  public async list(): Promise<Product[]> {
    const products = await this.db.product.findMany();
    return products;
  }

  public async listById(id: string): Promise<Product | null> {
    const product = await this.db.product.findFirst({ where: { id } });
    return product;
  }

  public async update({
    id,
    name,
    price,
    quantity,
  }: Product): Promise<Product> {
    const updatedProduct = await this.db.product.update({
      where: { id },
      data: { name, price, quantity },
    });
    return updatedProduct;
  }

  public async destroy(id: string): Promise<void> {
    await this.db.product.delete({ where: { id } });
  }
}
