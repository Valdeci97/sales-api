import { PrismaClient } from '@prisma/client';
import { database } from '../database';
import { Model } from '../interfaces/ModelInterface';
import { Product } from '../types/ProductType';
import { ProductResponse } from '../types/ProductResponse';

const PRODUCT_NOT_FOUND = 'Product not found!';
const NOT_FOUND = 'Product not found!';
const CREATED = 'Product created successfully';

export default class ProductService implements Model<Product> {
  private model: PrismaClient;

  constructor(model = database) {
    this.model = model;
  }

  public async create({
    name,
    price,
    quantity,
  }: Product): Promise<ProductResponse> {
    await this.model.product.create({
      data: {
        name,
        price,
        quantity,
      },
    });
    return ProductService.createProductResponse(201, CREATED);
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
  }: Product): Promise<ProductResponse> {
    const product = this.model.product.findFirst({ where: { id } });
    if (!product) {
      return ProductService.createProductResponse(404, PRODUCT_NOT_FOUND);
    }
    const updateProduct = await this.model.product.update({
      where: { id },
      data: { name, price, quantity },
    });
    return ProductService.createProductResponse(200, '', updateProduct);
  }

  public async destroy(id: string): Promise<ProductResponse> {
    const product = await this.model.product.findFirst({ where: { id } });
    if (!product) return ProductService.createProductResponse(404, NOT_FOUND);
    await this.model.product.delete({ where: { id } });
    return ProductService.createProductResponse(204);
  }

  private static createProductResponse(
    status: number,
    message: string = '',
    data: Product = { id: '', name: '', price: 0, quantity: 0 }
  ): ProductResponse {
    return [status, message, data];
  }
}
