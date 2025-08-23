import mongoose from 'mongoose';
import logger from './logger.config';
import { serverConfig } from '.';

export async function connectDB() {
	try {
		await mongoose.connect(serverConfig.MONGO_URI);
		logger.info('Connected to MongoDB');
	} catch (error) {
		logger.error('Error connecting to MongoDB:', error);
		process.exit(1);
	}
}
