const Redis = require('ioredis');

const redisUrl = "rediss://default:gQAAAAAAATFGAAIgcDI2ZjA4YjNiZGU1NzE0OGFjOTRkOTdiNjBkNmJiYjgzMQ@moral-bee-78150.upstash.io:6379";
const redis = new Redis(redisUrl);

async function run() {
  try {
    const keys = await redis.keys("ocevstudio:cache:*");
    console.log("Keys found:", keys);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log("Deleted keys");
    }
  } catch (err) {
    console.error(err);
  } finally {
    redis.disconnect();
  }
}
run();
