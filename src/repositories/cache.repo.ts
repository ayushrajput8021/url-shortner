import { serverConfig } from '../config';
import { redisClient } from '../config/redis';

export class CacheRepository {
	async getNextId(): Promise<number> {
		const key = serverConfig.REDIS_SHORTNER_KEY;
		if (!redisClient.isOpen) {
			await redisClient.connect();
		}
		const nextId = await redisClient.incr(key);
		return nextId;
	}

	async setUrlMapping(shortUrl: string, originalUrl: string): Promise<void> {
		const key = `url:${shortUrl}`;
		if (!redisClient.isOpen) {
			await redisClient.connect();
		}
		await redisClient.set(key, originalUrl, {
			EX: 60 * 60 * 24 * 7, // Set expiration time to 7 days
		});
	}

	async getUrlMapping(shortUrl: string): Promise<string | null> {
		if (!redisClient.isOpen) {
			await redisClient.connect();
		}
		const cachedUrl = await redisClient.get(`url:${shortUrl}`);
		return cachedUrl;
	}
  async deleteUrlMapping(shortUrl: string): Promise<void> {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    await redisClient.del(`url:${shortUrl}`);
  }
}
