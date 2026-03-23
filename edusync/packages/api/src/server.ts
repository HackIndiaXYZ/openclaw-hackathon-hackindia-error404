import express from 'express';
import dotenv from 'dotenv';
import { nexusConnector } from '@edusync/db';
import router from './router.js';
import { createServer } from 'http';

// Security Middleware (Session 23)
import { secureCors } from './middleware/cors-secure.js';
import { securityHeaders, httpsRedirect } from './middleware/security-headers.js';
import { globalLimiter, ddosProtection } from './middleware/rate-limit-secure.js';
import { sanitizeInput } from './middleware/validation.js';
import { Server } from 'socket.io';
import { Worker } from 'bullmq';
import { initSocket } from './socket.js';
import { HIGH_RISK_KEYWORDS } from '@edusync/shared';
import { FlagModel, StudentModel } from '@edusync/db';

// Centralized Queues
import * as Queues from './lib/queues.js';

// Job Imports
import { EscrowWatchdogJob } from './jobs/escrow-watchdog.js';
import { LeaderboardRefreshJob } from './jobs/leaderboard-refresh.js';
import { ResourceScreenerJob } from './jobs/resource-screener.js';
import { ChatScreenerJob } from './jobs/chat-screener.js';
import { AnalyticsSnapshotJob } from './jobs/analytics-snapshot.js';
import { MouExpiryWatchdogJob } from './jobs/mou-expiry-watchdog.js';
import { MeilisearchIndexerJob } from './jobs/meilisearch-indexer.js';
import { ReportGeneratorJob } from './modules/analytics/export.service.js';

// Meilisearch Imports
import { initializeMeilisearch } from './lib/meilisearch.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);
const io = initSocket(httpServer);

// Security layers (order matters)
app.use(httpsRedirect);
app.use(securityHeaders);
app.use(secureCors);
app.use(ddosProtection);
app.use(globalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(sanitizeInput);

// Attach Nexus Router
app.use('/api/v1', router);

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
};

// Socket.io Peer Sync Handlers
io.on('connection', (socket) => {
  console.log(`🛡️ Nexus Node: Authenticated Peer [${socket.data.uid}] @ [${socket.data.campus}]`);
  
  socket.on('sync-message', async (data) => {
    const { content, roomId, swapId } = data;
    const senderUid = socket.data.uid;
    const campus = socket.data.campus;

    const contentLower = content.toLowerCase();
    const blockedKeyword = HIGH_RISK_KEYWORDS.find(kw => contentLower.includes(kw));

    if (blockedKeyword) {
      console.warn(`🛑 [Guardian-Sync] Blocked high-risk keyword "${blockedKeyword}" from ${senderUid}`);
      const flag = await FlagModel.create({
        flagType: 'chat_message',
        severity: 'critical',
        sourceEntityId: roomId,
        sourceEntityType: 'swap_room',
        involvedUids: [senderUid],
        campus,
        flaggedContent: content,
        flagCategories: ['inappropriate_content'],
        detectionMethod: 'keyword_sync',
        status: 'pending'
      });

      await StudentModel.findOneAndUpdate(
        { firebaseUid: senderUid },
        { $inc: { 'moderation.flags': 1 } }
      );

      socket.emit('message_blocked', { 
        reason: 'Policy Violation', 
        details: 'Institutional security protocols blocked this message due to high-risk content.' 
      });

      io.to(`admin:${campus}`).emit('guardian:flag_raised', {
        flagId: flag._id,
        severity: 'critical',
        detectionMethod: 'keyword_sync',
        senderUid
      });
      return;
    }

    io.to(roomId).emit('message', {
      ...data,
      senderUid,
      timestamp: new Date().toISOString()
    });

    await Queues.chatScreenerQueue.add(`${roomId}:${Date.now()}`, {
      content,
      roomId,
      swapId,
      senderUid,
      campus
    }, {
      removeOnComplete: true,
      attempts: 3
    });
  });

  socket.on('join-room', (roomId) => { socket.join(roomId); });
  socket.on('join-user-room', (uid: string) => { if (uid === socket.data.uid) socket.join(`user:${uid}`); });
  socket.on('join-admin-room', (campus: string) => {
    if (socket.data.roles?.includes('nexus_admin') && socket.data.campus === campus) {
      socket.join(`admin:${campus}`);
    }
  });
});

const PORT = process.env.PORT || 3001;

async function startNode() {
  try {
    await nexusConnector.connectNode();
    
    // --- Initialize Unified BullMQ Worker ---
    const worker = new Worker('bullmq-worker', async (job) => {
      try {
        switch (job.queueName) {
          case 'escrow-watchdog': return await EscrowWatchdogJob.handle(job);
          case 'leaderboard-refresh': return await LeaderboardRefreshJob.handle(job);
          case 'resource-screener': return await ResourceScreenerJob.handle(job);
          case 'analytics-snapshot': return await AnalyticsSnapshotJob.handle(job);
          case 'chat-screener': return await ChatScreenerJob.handle(job);
          case 'report-generator': return await ReportGeneratorJob.handle(job);
          case 'mou-expiry-watchdog': return await MouExpiryWatchdogJob.handle(job);
          case 'meilisearch-indexer': return await MeilisearchIndexerJob.handle(job);
          default: throw new Error(`Unknown queue: ${job.queueName}`);
        }
      } catch (err) {
        console.error(`❌ Job ${job.name} in queue ${job.queueName} failed:`, err);
        throw err;
      }
    }, { connection: REDIS_CONFIG, concurrency: 10 });

    worker.on('failed', (job, err) => {
      console.error(`❌ Worker Job ${job?.id} failed:`, err);
    });

    // --- Register Recurring Jobs ---
    await Queues.escrowQueue.add('daily-scan', {}, { repeat: { pattern: '0 0 * * *' } });
    await Queues.leaderboardQueue.add('periodic-recompute', {}, { repeat: { pattern: '*/5 * * * *' } });
    await Queues.analyticsQueue.add('daily-snapshot', {}, { repeat: { pattern: '0 0 * * *' } });
    await Queues.mouExpiryQueue.add('daily-mou-scan', {}, { repeat: { pattern: '0 9 * * *' } });

    console.log('✅ BullMQ Worker: Online (Unified handling for 8 queues)');

    // --- Initialize Meilisearch ---
    await initializeMeilisearch();

    httpServer.listen(PORT, () => {
      console.log(`🚀 EduSync Nexus API Node running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Fatal Node Start Error:', error);
    process.exit(1);
  }
}

startNode();
