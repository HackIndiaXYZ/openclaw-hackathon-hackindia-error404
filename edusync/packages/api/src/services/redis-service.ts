import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = createClient({
  url: REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Auto-connect on module load (simplified for POC)
(async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log('✅ Nexus-Node-Cache: Redis connected.');
    }
  } catch (error) {
    console.error('❌ Redis Connection FAILURE', error);
  }
})();

export const redis = client;
