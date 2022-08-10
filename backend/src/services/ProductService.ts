import { PrismaClient } from '@prisma/client';
import { database } from '../database';
import { Model } from '../interfaces/ModelInterface';
import { Product } from '../types/ProductType';
import { ServiceResponse } from '../types/ServiceResponse';

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

  public async update({
    id,
    name,
    price,
    quantity,
  }: Product): Promise<Product | ServiceResponse> {
    const product = this.model.product.findFirst({ where: { id } });
    if (!product) return [404, { message: 'Product not found!' }];
    const updateProduct = this.model.product.update({
      where: { id },
      data: { name, price, quantity },
    });
    return updateProduct;
  }

  public async destroy({ id }: Product): Promise<ServiceResponse> {
    const product = await this.model.product.findFirst({ where: { id } });
    if (!product) return [404, { message: 'Product not found!' }];
    await this.model.product.delete({ where: { id } });
    return [204, { message: 'Product deleted successfully!' }];
  }
}
