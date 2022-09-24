import 'dotenv/config';
import { RedisOptions } from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASS = process.env.REDIS_PASS || '';

type CacheConfig = {
  driver: string;
  cache: RedisOptions;
};

export default {
  driver: 'redis',
  cache: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASS,
  },
} as CacheConfig;
