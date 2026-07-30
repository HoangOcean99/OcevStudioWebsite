import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

// Security Middleware (Helmet)
app.use(helmet());

// Restrict CORS to specific origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// NoSQL Injection Protection
app.use(mongoSanitize());

// Redis Connection
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
redis.on('connect', () => {
  console.log('Connected to Redis');
});
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

mongoose.connect(process.env.MONGO_URI as string).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

const port = process.env.PORT || 8000;
const serviceName = 'api-gateway';

app.get('/', (req, res) => {
  res.send(`${serviceName} is running`);
});

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});
