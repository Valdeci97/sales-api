import { Model } from '../interfaces/ModelInterface';

export default abstract class Service<T> implements Model<T> {
  abstract create(_obj: T): Promise<T>;

  abstract list(): Promise<Array<T | Partial<T>>>;

  abstract listById(_id: string): Promise<Partial<T>>;

  abstract update(_obj: T): Promise<T>;

  abstract destroy(_id: string): Promise<void>;
}
