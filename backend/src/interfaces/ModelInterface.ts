export interface Model<T> {
  create(obj: T): Promise<T | null>;
  list(): Promise<T[]>;
}
