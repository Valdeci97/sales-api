import { Model } from '../interfaces/ModelInterface';
import { ServiceResponse } from '../types/ServiceResponse';

export default abstract class Service<T> implements Model<T> {
  protected _data: T;

  constructor(data: T) {
    this._data = data;
  }

  protected createResponse(
    status: number,
    message: string = '',
    data: T = this._data
  ): ServiceResponse<T> {
    return [status, message, data];
  }

  abstract create(_obj: T): Promise<ServiceResponse<T>>;

  abstract list(): Promise<Array<T | Partial<T>>>;

  abstract listById(_id: string): Promise<Partial<T> | null>;

  abstract update(_obj: T): Promise<ServiceResponse<T>>;

  abstract destroy(_id: string): Promise<ServiceResponse<T>>;
}
