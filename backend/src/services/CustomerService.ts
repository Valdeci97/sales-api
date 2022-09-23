import { Customer } from '@prisma/client';
import CustomerModel from '../models/CustomerModel';
import HttpException from '../utils/exceptions/HttpException';
import logger from '../logger';

const CUSTOMER_NOT_FOUND = 'Customer not found';

export default class CustomerService {
  private model: CustomerModel;

  constructor(model: CustomerModel = new CustomerModel()) {
    this.model = model;
  }

  public async create(obj: Customer): Promise<Customer> {
    const customer = await this.model.findByEmail(obj.email);
    if (customer) throw new HttpException(409, 'Email already in use');
    const createdCustomer = await this.model.create(obj);
    logger.info('Customer created');
    return createdCustomer;
  }

  public async list(): Promise<Customer[]> {
    const customers = await this.model.list();
    return customers;
  }

  public async listById(id: string): Promise<Customer> {
    const customer = await this.model.listById(id);
    if (!customer) throw new HttpException(404, CUSTOMER_NOT_FOUND);
    return customer;
  }

  public async update(obj: Customer): Promise<Customer> {
    const customer = await this.model.listById(obj.id);
    if (!customer) throw new HttpException(404, CUSTOMER_NOT_FOUND);
    const updatedCustomer = await this.model.update(obj);
    logger.info('Customer updated');
    return updatedCustomer;
  }

  public async destroy(id: string): Promise<void> {
    const customer = await this.model.listById(id);
    if (!customer) throw new HttpException(404, CUSTOMER_NOT_FOUND);
    await this.model.destroy(id);
    logger.info('Customer deleted');
  }
}
