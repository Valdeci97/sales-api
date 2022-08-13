import { ServiceResponse } from '../types/ServiceResponse';
import { UserToken } from '../types/UserToken';

export interface Model<T> {
  create(obj: T): Promise<ServiceResponse<T>>;
  list(): Promise<Array<T | Partial<T>>>;
  listById(id: string): Promise<Partial<T> | null>;
  update(obj: T): Promise<ServiceResponse<T>>;
  destroy(id: string): Promise<ServiceResponse<T>>;
}
