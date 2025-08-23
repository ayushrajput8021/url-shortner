import express, { Request, Response } from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import {
	appErrorHandler,
	genericErrorHandler,
} from './middlewares/error.middleware';
import logger from './config/logger.config';

import { connectDB } from './config/db';
import { initRedis } from './config/redis';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { trpcRouter } from './routers/trpc';
import { UrlService } from './services/url.service';
import { UrlRepository } from './repositories/url.repo';
import { CacheRepository } from './repositories/cache.repo';
const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(
	'/trpc',
	createExpressMiddleware({
		router: trpcRouter,
	})
);
app.get('/:shortUrl', async (req: Request, res: Response) => {
	const { shortUrl } = req.params;
	const urlService = new UrlService(new UrlRepository(), new CacheRepository());
	const url = await urlService.getOriginalUrl(shortUrl);
	if (!url) {
		return res.status(404).json({ message: 'URL not found' });
	}
	await urlService.incrementClicks(shortUrl);
	res.redirect(url)
});
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
	logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
	logger.info(`Press Ctrl+C to stop the server.`);
	await connectDB();
	await initRedis();
});
