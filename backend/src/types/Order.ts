import { Customer, OrderProduct, Product } from '@prisma/client';

export type OrderRequest = {
  customerId: string;
  products: Product[];
};

export type OrderProductRequest = {
  orderId: string;
  product: Product;
};

export type OrderRelations = {
  orderProduct: OrderProduct[];
  customer: Customer;
};
