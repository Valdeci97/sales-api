import { ServiceResponse } from '../types/ServiceResponse';

export interface Model<T> {
  create(obj: T): Promise<ServiceResponse<T>>;
  list(): Promise<T[]>;
  listById(id: string): Promise<T | null>;
  update(obj: T): Promise<ServiceResponse<T>>;
  destroy(id: string): Promise<ServiceResponse<T>>
}
