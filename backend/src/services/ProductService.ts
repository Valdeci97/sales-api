import { Product } from '@prisma/client';
import Service from '.';
import CacheHandler from '../cache/CacheHandler';
import logger from '../logger';
import ProductModel from '../models/ProductModel';
import HttpException from '../utils/exceptions/HttpException';

const PRODUCT_NOT_FOUND = 'Product not found!';

export default class ProductService extends Service<Product> {
  private model: ProductModel;

  private cacheClient: CacheHandler;

  private CACHE_KEY = 'sales-api-products-list';

  private CACHE = {
    INVALIDATING: 'Invalidating cache...',
    INVALIDATED: 'Cache invalidated',
  };

  constructor(model: ProductModel = new ProductModel()) {
    super();
    this.model = model;
    this.cacheClient = new CacheHandler();
  }

  private async invalidateCache(): Promise<void> {
    logger.info(this.CACHE.INVALIDATING);
    await this.cacheClient.invalidateCache(this.CACHE_KEY);
    logger.info(this.CACHE.INVALIDATED);
  }

  public async create(obj: Product): Promise<Product> {
    await this.invalidateCache();
    const product = await this.model.create(obj);
    logger.info('Product created');
    return product;
  }

  public async list(): Promise<Product[]> {
    let products = await this.cacheClient.getValues<Product[]>(this.CACHE_KEY);
    if (!products) {
      products = await this.model.list();
      await this.cacheClient.save(this.CACHE_KEY, products);
    }
    return products;
  }

  public async listById(id: string): Promise<Product> {
    const product = await this.model.listById(id);
    if (!product) throw new HttpException(404, 'Product not found!');
    return product;
  }

  public async update(obj: Product): Promise<Product> {
    const product = this.model.listById(obj.id);
    if (!product) throw new HttpException(404, PRODUCT_NOT_FOUND);
    await this.invalidateCache();
    const updatedProduct = await this.model.update(obj);
    logger.info('Product updated');
    return updatedProduct;
  }

  public async destroy(id: string): Promise<void> {
    const product = await this.model.listById(id);
    if (!product) throw new HttpException(404, PRODUCT_NOT_FOUND);
    await this.invalidateCache();
    await this.model.destroy(id);
    logger.info('Product deleted');
  }
}
