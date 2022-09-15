import { Product } from '@prisma/client';
import ProductModel from '../models/ProductModel';
import HttpException from '../utils/exceptions/HttpException';

export default class OrderProductsValidator {
  private model: ProductModel;

  constructor(model: ProductModel = new ProductModel()) {
    this.model = model;
  }

  private async existsProducts(products: Product[]): Promise<Product[]> {
    const orderProductsIds = products.map((product) => product.id);
    const existsOrderProducts = await this.model.listAllByIds(orderProductsIds);
    if (existsOrderProducts.length <= 0) {
      throw new HttpException(404, 'At least one product given does not exist');
    }
    return existsOrderProducts;
  }

  private async checkOrderProductsIds(products: Product[]): Promise<Product[]> {
    const orderProducts = await this.existsProducts(products);
    const orderProductsIds = orderProducts.map((product) => product.id);
    const filteredOrderProducts = products.filter(
      (product) => !orderProductsIds.includes(product.id)
    );
    if (filteredOrderProducts.length > 0) {
      throw new HttpException(404, 'At least one product given does not exist');
    }
    return orderProducts;
  }

  private async matchOrderProductsIds(products: Product[]): Promise<Product[]> {
    const orderProducts = await this.checkOrderProductsIds(products);
    const orderProductsIds = orderProducts.map((product) => product.id);
    const areSameIds = products.every(
      (product, index) => product.id === orderProductsIds[index]
    );
    if (!areSameIds) {
      throw new HttpException(400, 'Unmatched product id detected');
    }
    return orderProducts;
  }

  public async isAvailableQuantity(products: Product[]): Promise<boolean> {
    const orderProducts = await this.matchOrderProductsIds(products);
    const orderProductsQuantities = orderProducts.map(
      (product) => product.quantity
    );
    const availableQuantity = products.every(
      (product, index) => product.quantity < orderProductsQuantities[index]
    );
    return availableQuantity;
  }
}
