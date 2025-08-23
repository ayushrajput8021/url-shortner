import { createClient } from 'redis';
import logger from './logger.config';
import { serverConfig } from '.';

export const redisClient = createClient({
	url: serverConfig.REDIS_URL,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

redisClient.on('connect', () => {
	logger.info('Connected to Redis');
});

export async function initRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Error connecting to Redis:', error);
    process.exit(1);
  }
}
