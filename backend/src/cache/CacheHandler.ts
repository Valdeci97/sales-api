import Redis from 'ioredis';
import logger from '../logger';
import cacheConfig from './cacheConfig';

export default class CacheHandler {
  private client: Redis;

  constructor(client: Redis = new Redis(cacheConfig.cache)) {
    this.client = client;
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
    logger.info('Value saved on cache manager');
  }

  public async getValues<T>(key: string): Promise<T | null> {
    const values = await this.client.get(key);
    if (!values) return null;
    return JSON.parse(values);
  }

  public async invalidateCache(key: string): Promise<void> {
    await this.client.del(key);
    logger.info('Value deleted from cache manager');
  }
}
