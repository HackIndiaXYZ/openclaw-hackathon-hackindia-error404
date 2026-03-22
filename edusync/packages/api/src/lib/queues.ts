import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
};

// --- BullMQ Queue Definitions ---
export const escrowQueue = new Queue('escrow-watchdog', { connection: REDIS_CONFIG });
export const leaderboardQueue = new Queue('leaderboard-refresh', { connection: REDIS_CONFIG });
export const resourceScreenerQueue = new Queue('resource-screener', { connection: REDIS_CONFIG });
export const analyticsQueue = new Queue('analytics-snapshot', { connection: REDIS_CONFIG });
export const chatScreenerQueue = new Queue('chat-screener', { connection: REDIS_CONFIG });
export const reportGeneratorQueue = new Queue('report-generator', { connection: REDIS_CONFIG });
export const mouExpiryQueue = new Queue('mou-expiry-watchdog', { connection: REDIS_CONFIG });
export const meilisearchIndexerQueue = new Queue('meilisearch-indexer', { 
  connection: REDIS_CONFIG,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true
  }
});
