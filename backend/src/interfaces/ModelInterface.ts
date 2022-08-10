import { ServiceResponse } from '../types/ServiceResponse';

export interface Model<T> {
  create(obj: T): Promise<T | null>;
  list(): Promise<T[]>;
  listById(obj: T): Promise<T | null>;
  update(obj: T): Promise<T | ServiceResponse>;
}
