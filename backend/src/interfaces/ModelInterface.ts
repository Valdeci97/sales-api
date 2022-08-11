import { ProductResponse } from '../types/ProductResponse';

export interface Model<T> {
  create(obj: T): Promise<ProductResponse>;
  list(): Promise<T[]>;
  listById(id: string): Promise<T | null>;
  update(obj: T): Promise<ProductResponse>;
  destroy(id: string): Promise<ProductResponse>
}
