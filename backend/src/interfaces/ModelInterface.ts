export interface Model<T> {
  create(obj: T): Promise<T>;
  list(): Promise<Array<T | Partial<T>>>;
  listById(id: string): Promise<Partial<T>>;
  update(obj: T): Promise<T>;
  destroy(id: string): Promise<void>;
}
