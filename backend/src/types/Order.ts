import { Customer, OrderProduct, Product } from '@prisma/client';

export type OrderProductRequest = {
  orderId: string;
  product: Product;
};

export type OrderRelations = {
  orderProduct: OrderProduct[];
  customer: Customer;
};
