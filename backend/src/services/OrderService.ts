/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import { Customer, Order, OrderProduct, Product } from '@prisma/client';
import OrderProductsHandler from '../facade/OrderProductsHandler';
import CustomerModel from '../models/CustomerModel';
import OrderProductsModel from '../models/OrderProducts';
import OrdersModel from '../models/OrdersModel';
import { OrderRelations, OrderRequest } from '../types/Order';
import HttpException from '../utils/exceptions/HttpException';

export default class OrderService {
  private customerModel: CustomerModel;

  private ordersModel: OrdersModel;

  private orderProductsModel: OrderProductsModel;

  private orderProductsHandler: OrderProductsHandler;

  constructor(
    customerModel: CustomerModel = new CustomerModel(),
    orderModel: OrdersModel = new OrdersModel(),
    orderProductsModel: OrderProductsModel = new OrderProductsModel(),
    orderProductsHandler: OrderProductsHandler = new OrderProductsHandler()
  ) {
    this.customerModel = customerModel;
    this.ordersModel = orderModel;
    this.orderProductsModel = orderProductsModel;
    this.orderProductsHandler = orderProductsHandler;
  }

  private async getCustomer(id: string): Promise<Customer> {
    const customer = await this.customerModel.listById(id);
    if (!customer) throw new HttpException(404, 'Customer not found');
    return customer;
  }

  public async create({
    customerId,
    products,
  }: OrderRequest): Promise<(Order & OrderRelations) | null> {
    const customer = await this.getCustomer(customerId);
    const isAvailableQuantity =
      await this.orderProductsHandler.isAvailableQuantity(products);
    if (!isAvailableQuantity) {
      throw new HttpException(
        400,
        'At least one product given does not have available quantity'
      );
    }
    const order = await this.ordersModel.create(customer.id);
    await this.createOrderRelation(products, order);
    await this.orderProductsHandler.decreaseOrderProductsQuantity(products);
    return this.ordersModel.listById(order.id);
  }

  private async createOrderRelation(
    products: Product[],
    order: Order
  ): Promise<void> {
    await Promise.all(
      products.map(async (product) => {
        const orderRelation = { orderId: order.id, product };
        await this.orderProductsModel.create(orderRelation);
      })
    );
  }

  public async list(customerId: string): Promise<(Order & OrderRelations)[]> {
    const orders = await this.ordersModel.list(customerId);
    return orders;
  }

  public async listById(id: string): Promise<Order & OrderRelations> {
    const order = await this.ordersModel.listById(id);
    if (!order) throw new HttpException(404, 'Order not found');
    return order;
  }

  private createProductsFromOrderProducts(
    orderProducts: OrderProduct[]
  ): Product[] {
    const products = orderProducts.map(
      ({ product_id, price, quantity, name }) => ({
        id: product_id,
        price,
        quantity,
        name,
      })
    );
    return products;
  }

  public async delete(customerId: string, orderId: string): Promise<void> {
    await this.getCustomer(customerId);
    const order = await this.listById(orderId);
    const products = this.createProductsFromOrderProducts(order.orderProduct);
    await this.orderProductsHandler.increaseOrderProductsQuantity(products);
    const orderProductsIds = order.orderProduct.map((product) => product.id);
    await this.orderProductsModel.delete(orderProductsIds);
    await this.ordersModel.destroy(order.id);
  }
}
