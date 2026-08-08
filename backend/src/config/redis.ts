import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

// If a full REDIS_URL is provided (e.g. from Upstash/Render), use it.
// Otherwise, use host and port (for local development)
export const redis = redisUrl 
  ? new Redis(redisUrl, { maxRetriesPerRequest: null, retryStrategy: (times) => times > 3 ? 10000 : Math.min(times * 50, 2000) })
  : new Redis({
      host: redisHost,
      port: redisPort,
      maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    if (times > 3) {
      console.warn('[Redis] Connection failed, caching will be bypassed.');
      // Return null to stop retrying, but we must handle potential unhandled rejections.
      // Actually, returning a number stops the exit. Let's just return a long delay.
      return 10000; // Retry every 10 seconds instead of stopping completely
    }
    return Math.min(times * 50, 2000);
  },
});

redis.on('error', (err) => {
  // Silent error to prevent console spam
});
