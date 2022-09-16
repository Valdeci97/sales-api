import { Order, Product } from '@prisma/client';
import OrderProductsHandler from '../facade/OrderProductsHandler';
import CustomerModel from '../models/CustomerModel';
import OrderProductsModel from '../models/OrderProducts';
import OrderModel from '../models/Orders';
import { OrderRelations, OrderRequest } from '../types/Order';
import HttpException from '../utils/exceptions/HttpException';

export default class OrderService {
  private customerModel: CustomerModel;

  private orderModel: OrderModel;

  private orderProductsModel: OrderProductsModel;

  private orderProductsHandler: OrderProductsHandler;

  constructor(
    customerModel: CustomerModel = new CustomerModel(),
    orderModel: OrderModel = new OrderModel(),
    orderProductsModel: OrderProductsModel = new OrderProductsModel(),
    orderProductsHandler: OrderProductsHandler = new OrderProductsHandler()
  ) {
    this.customerModel = customerModel;
    this.orderModel = orderModel;
    this.orderProductsModel = orderProductsModel;
    this.orderProductsHandler = orderProductsHandler;
  }

  public async create({ customerId, products }: OrderRequest): Promise<void> {
    const customer = await this.customerModel.listById(customerId);
    if (!customer) throw new HttpException(404, 'Customer not found');
    const isAvailableQuantity =
      await this.orderProductsHandler.isAvailableQuantity(products);
    if (!isAvailableQuantity) {
      throw new HttpException(
        400,
        'At least onde product given does not have available quantity'
      );
    }
    const order = await this.orderModel.create(customer.id);
    await this.createOrderRelation(products, order);
    await this.orderProductsHandler.updateOrderProductsQuantity(products);
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

  public async list(id: string): Promise<(Order & OrderRelations) | null> {
    const order = await this.orderModel.list(id);
    return order;
  }
}
