import CustomerModel from '../models/CustomerModel';
import OrderProductsModel from '../models/OrderProducts';
import OrderModel from '../models/Orders';
import { OrderRequest } from '../types/Order';
import HttpException from '../utils/exceptions/HttpException';

export default class OrderService {
  private customerModel: CustomerModel;

  private orderModel: OrderModel;

  private orderProductsModel: OrderProductsModel;

  constructor(
    customerModel: CustomerModel = new CustomerModel(),
    orderModel: OrderModel = new OrderModel(),
    orderProductsModel: OrderProductsModel = new OrderProductsModel()
  ) {
    this.customerModel = customerModel;
    this.orderModel = orderModel;
    this.orderProductsModel = orderProductsModel;
  }

  public async create({ customerId, products }: OrderRequest) {
    const customer = await this.customerModel.listById(customerId);
    if (!customer) throw new HttpException(404, 'Customer not found');
    const order = await this.orderModel.create(customer.id);
    await Promise.all(
      products.map(async (product) => {
        const orderRelation = {
          orderId: order.id,
          product,
        };
        await this.orderProductsModel.create(orderRelation);
      })
    );
  }
}
