import { PrismaClient } from '@prisma/client';
import { database } from '../database';
import { Product } from '../types/ProductType';
import { ServiceResponse } from '../types/ServiceResponse';
import Service from '.';

const PRODUCT_NOT_FOUND = 'Product not found!';
const NOT_FOUND = 'Product not found!';
const CREATED = 'Product created successfully';

export default class ProductService extends Service<Product> {
  private model: PrismaClient;

  constructor(model = database) {
    super({ id: '', name: '', price: 0, quantity: 0 });
    this.model = model;
  }

  public async create({
    name,
    price,
    quantity,
  }: Product): Promise<ServiceResponse<Product>> {
    const product = await this.model.product.create({
      data: {
        name,
        price,
        quantity,
      },
    });
    return this.createResponse(201, CREATED, product);
  }

  public async list(): Promise<Product[]> {
    return this.model.product.findMany();
  }

  public async listById(id: string): Promise<Product | null> {
    return this.model.product.findFirst({ where: { id } });
  }

  public async update({
    id,
    name,
    price,
    quantity,
  }: Product): Promise<ServiceResponse<Product>> {
    const product = this.model.product.findFirst({ where: { id } });
    if (!product) {
      return this.createResponse(404, PRODUCT_NOT_FOUND);
    }
    const updateProduct = await this.model.product.update({
      where: { id },
      data: { name, price, quantity },
    });
    return this.createResponse(200, '', updateProduct);
  }

  public async destroy(id: string): Promise<ServiceResponse<Product>> {
    const product = await this.model.product.findFirst({ where: { id } });
    if (!product) return this.createResponse(404, NOT_FOUND);
    await this.model.product.delete({ where: { id } });
    return this.createResponse(204);
  }
}
