import { Product } from '@prisma/client';
import ProductModel from '../models/ProductModel';
import HttpException from '../utils/exceptions/HttpException';

export default class OrderProductsHandler {
  private model: ProductModel;

  constructor(model: ProductModel = new ProductModel()) {
    this.model = model;
  }

  private async getOrderProducts(products: Product[]): Promise<Product[]> {
    const orderProductsIds = products.map((product) => product.id);
    const orderProducts = await this.model.listAllByIds(orderProductsIds);
    return orderProducts;
  }

  private async existsProducts(products: Product[]): Promise<Product[]> {
    const existsOrderProducts = await this.getOrderProducts(products);
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
      (product, index) => product.quantity <= orderProductsQuantities[index]
    );
    return availableQuantity;
  }

  private async setCreateOrderProductsQuantity(
    products: Product[]
  ): Promise<Product[]> {
    const orderProducts = await this.getOrderProducts(products);
    const filteredOrderProducts = products.map(
      ({ id, name, price, quantity }, index) => {
        const orderProduct = { id, name, price, quantity };
        if (id === orderProducts[index].id) {
          orderProduct.quantity = orderProducts[index].quantity - quantity;
        }
        return orderProduct;
      }
    );
    return filteredOrderProducts;
  }

  private async setDeleteOrderProductsQuantity(
    products: Product[]
  ): Promise<Product[]> {
    const orderProducts = await this.getOrderProducts(products);
    const filteredOrderProducts = products.map(
      ({ id, name, price, quantity }, index) => {
        const orderProduct = { id, name, price, quantity };
        if (id === orderProducts[index].id) {
          orderProduct.quantity = orderProducts[index].quantity + quantity;
        }
        return orderProduct;
      }
    );
    return filteredOrderProducts;
  }

  public async decreaseOrderProductsQuantity(
    products: Product[]
  ): Promise<void> {
    const orderProductsQuantities = await this.setCreateOrderProductsQuantity(
      products
    );
    await Promise.all(
      orderProductsQuantities.map(async (product) => {
        await this.model.update(product);
      })
    );
  }

  public async increaseOrderProductsQuantity(
    products: Product[]
  ): Promise<void> {
    const orderProductsQuantities = await this.setDeleteOrderProductsQuantity(
      products
    );
    await Promise.all(
      orderProductsQuantities.map(async (product) => {
        await this.model.update(product);
      })
    );
  }
}
