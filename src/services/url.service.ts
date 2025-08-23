import { serverConfig } from '../config';
import { CacheRepository } from '../repositories/cache.repo';
import { UrlRepository } from '../repositories/url.repo';
import { toBase62 } from '../utils/base62';
import { NotFoundError } from '../utils/errors/app.error';

export class UrlService {
	constructor(
		private readonly cacheRepo: CacheRepository,
		private readonly urlRepository: UrlRepository
	) {}

	async createShortUrl(originalUrl: string) {
		const nextId = await this.cacheRepo.getNextId();
		const shortUrl = toBase62(nextId);
		const url = await this.urlRepository.create({ originalUrl, shortUrl });
		await this.cacheRepo.setUrlMapping(shortUrl, originalUrl);

		return {
			id: url._id?.toString(),
			fullUrl: serverConfig.BASE_URL + '/' + shortUrl,
			originalUrl: url.originalUrl,
			shortUrl: shortUrl,
			createdAt: url.createdAt,
			updatedAt: url.updatedAt,
		};
	}

	async getOriginalUrl(shortUrl: string): Promise<string | null> {
		// Check cache first
		const cachedUrl = await this.cacheRepo.getUrlMapping(shortUrl);
		if (cachedUrl) {
			// If found in cache, increment clicks in DB asynchronously
			this.urlRepository.incrementClicks(shortUrl).catch((err) => {
				console.error('Error incrementing clicks:', err);
			});
			return cachedUrl;
		}

		// If not found in cache, check database
		const urlDoc = await this.urlRepository.findByShortUrl(shortUrl);
		if (!urlDoc) {
			throw new NotFoundError('URL not found');
		}

		// If found in DB, increment clicks and update cache asynchronously
		this.urlRepository.incrementClicks(shortUrl).catch((err) => {
			console.error('Error incrementing clicks:', err);
		});
		this.cacheRepo.setUrlMapping(shortUrl, urlDoc.originalUrl).catch((err) => {
			console.error('Error setting cache:', err);
		});
		return urlDoc.originalUrl;
	}
}
