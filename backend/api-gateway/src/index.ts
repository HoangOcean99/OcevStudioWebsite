import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  });
}

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use('/api/orders', createProxyMiddleware({ 
  target: process.env.ORDER_SERVICE_URL || 'http://localhost:8003', 
  changeOrigin: true 
}));

app.use('/api/users', createProxyMiddleware({ 
  target: process.env.USER_SERVICE_URL || 'http://localhost:8001', 
  changeOrigin: true 
}));

app.use('/api/products', createProxyMiddleware({ 
  target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:8002', 
  changeOrigin: true 
}));

app.use(express.json());
app.use(mongoSanitize());

if (process.env.ENABLE_REDIS === 'true') {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const redis = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 0,
    enableOfflineQueue: false,
    retryStrategy: () => null,
  });

  redis.on('error', () => {});
  redis.connect().then(() => {
    console.log('[api-gateway] Connected to Redis');
  }).catch(() => {
    console.log('[api-gateway] Redis offline (Stand-alone dev mode)');
  });
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

if (process.env.ENABLE_MONGO === 'true' && process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 }).then(() => {
    console.log("[api-gateway] Connected to MongoDB");
  }).catch((err) => {
    console.log("[api-gateway] MongoDB offline:", err.message);
  });
}

const port = process.env.GATEWAY_PORT || 8000;
const serviceName = 'api-gateway';

app.get('/', (req, res) => {
  res.send(`${serviceName} is running`);
});

app.listen(port, () => {
  console.log(`🚀 ${serviceName} running at http://localhost:${port}`);
});

// Keep event loop active in dev mode
setInterval(() => {}, 3600000);
