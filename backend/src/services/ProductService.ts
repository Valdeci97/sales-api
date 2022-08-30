import { Product } from '@prisma/client';
import Service from '.';
import ProductModel from '../models/ProductModel';
import HttpException from '../utils/exceptions/HttpException';

const PRODUCT_NOT_FOUND = 'Product not found!';

export default class ProductService extends Service<Product> {
  private model: ProductModel;

  constructor(model: ProductModel = new ProductModel()) {
    super();
    this.model = model;
  }

  public async create(obj: Product): Promise<Product> {
    const product = await this.model.create(obj);
    return product;
  }

  public async list(): Promise<Product[]> {
    return this.model.list();
  }

  public async listById(id: string): Promise<Product | null> {
    return this.model.listById(id);
  }

  public async update(obj: Product): Promise<Product> {
    const product = this.model.listById(obj.id);
    if (!product) {
      throw new HttpException(404, PRODUCT_NOT_FOUND);
    }
    const updatedProduct = await this.model.update(obj);
    return updatedProduct;
  }

  public async destroy(id: string): Promise<void> {
    const product = await this.model.listById(id);
    if (!product) throw new HttpException(404, PRODUCT_NOT_FOUND);
    await this.model.destroy(id);
  }
}
