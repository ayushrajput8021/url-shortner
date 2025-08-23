import Url, { IUrl } from '../models/Url';

export interface CreateUrl {
	originalUrl: string;
	shortUrl: string;
}

export interface FindAllResponse {
	id: string;
	originalUrl: string;
	shortUrl: string;
	clicks: number;
	createdAt: Date;
	updatedAt: Date;
}

export class UrlRepository {
	async create(data: CreateUrl): Promise<IUrl> {
		const url = new Url(data);
		return await url.save();
	}

	async findByShortUrl(shortUrl: string): Promise<IUrl | null> {
		return await Url.findOne({ shortUrl });
	}

	async incrementClicks(shortUrl: string): Promise<IUrl | null> {
		return await Url.findOneAndUpdate(
			{ shortUrl },
			{ $inc: { clicks: 1 }, updatedAt: new Date() },
			{ new: true }
		);
	}

	async findAll(): Promise<FindAllResponse[]> {
		const urls = await Url.find().sort({ createdAt: -1 });
		return urls.map((url) => ({
			id: url._id?.toString() || '',
			originalUrl: url.originalUrl,
			shortUrl: url.shortUrl,
			clicks: url.clicks,
			createdAt: url.createdAt,
			updatedAt: url.updatedAt,
		}));
	}
	async deleteByShortCode(shortUrl: string): Promise<IUrl | null> {
		return await Url.findOneAndDelete({ shortUrl });
	}
	async findStatsByShortUrl(shortUrl: string): Promise<IUrl | null> {
		return await Url.findOne(
			{ shortUrl },
			{ clicks: 1, createdAt: 1, updatedAt: 1, originalUrl: 1, shortUrl: 1 }
		);
	}
}
