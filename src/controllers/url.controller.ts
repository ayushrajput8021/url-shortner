import z from 'zod';
import logger from '../config/logger.config';
import { Request, Response } from 'express';
import { publicProcedure } from '../routers/trpc/context';
import { InternalServerError, NotFoundError } from '../utils/errors/app.error';
import { CacheRepository } from '../repositories/cache.repo';
import { UrlRepository } from '../repositories/url.repo';
import { UrlService } from '../services/url.service';

const urlService = new UrlService(new UrlRepository(), new CacheRepository());

export const urlController = {
	create: publicProcedure
		.input(
			z.object({
				originalUrl: z.string().url('Invalid URL format'),
			})
		)
		.mutation(async ({ input }) => {
			try {
				const result = await urlService.createShortUrl(input.originalUrl);
				return result;
			} catch (error) {
				logger.error('Error creating short URL:', error);
				throw new InternalServerError('Failed to create short URL');
			}
		}),

	getOriginalUrl: publicProcedure
		.input(
			z.object({
				shortUrl: z.string(),
			})
		)
		.query(async ({ input }) => {
			try {
				const result = await urlService.getOriginalUrl(input.shortUrl);
				if (!result) {
					throw new NotFoundError('Short URL not found');
				}
				return result;
			} catch (error) {
				logger.error('Error retrieving original URL:', error);
				throw new InternalServerError('Failed to retrieve original URL');
			}
		}),
};

export async function redirectUrl(req: Request, res: Response): Promise<void> {
	try {
		const shortUrl = req.params.shortUrl;
		const originalUrl = await urlService.getOriginalUrl(shortUrl);
		if (!originalUrl) {
			throw new NotFoundError('Short URL not found');
		}
		res.redirect(originalUrl);
	} catch (error) {
		logger.error('Error during URL redirection:', error);
		throw error instanceof NotFoundError
			? error
			: new InternalServerError('Failed to redirect URL');
	}
}
