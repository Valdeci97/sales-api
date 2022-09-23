import { Product } from '@prisma/client';
import Service from '.';
import logger from '../logger';
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
    logger.info('Product created');
    return product;
  }

  public async list(): Promise<Product[]> {
    return this.model.list();
  }

  public async listById(id: string): Promise<Product> {
    const product = await this.model.listById(id);
    if (!product) throw new HttpException(404, 'Product not found!');
    return product;
  }

  public async update(obj: Product): Promise<Product> {
    const product = this.model.listById(obj.id);
    if (!product) throw new HttpException(404, PRODUCT_NOT_FOUND);
    const updatedProduct = await this.model.update(obj);
    logger.info('Product updated');
    return updatedProduct;
  }

  public async destroy(id: string): Promise<void> {
    const product = await this.model.listById(id);
    if (!product) throw new HttpException(404, PRODUCT_NOT_FOUND);
    await this.model.destroy(id);
    logger.info('Product deleted');
  }
}
