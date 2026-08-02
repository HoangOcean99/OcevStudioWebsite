import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import dns from 'dns';

// Fix for MongoDB Atlas DNS resolution issues on certain ISPs
dns.setServers(['8.8.8.8', '8.8.4.4']);

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

// Parse .env manually from parent directory if needed
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

app.use(express.json());
// app.use(mongoSanitize()); // Removed because it's incompatible with Express 5 req.query getter

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

if (process.env.ENABLE_MONGO === 'true' && process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 }).then(() => {
    console.log("[server] Connected to MongoDB");
  }).catch((err) => {
    console.log("[server] MongoDB offline:", err.message);
  });
}

app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/seed', async (req, res) => {
  try {
    const Product = require('./models/Product').default;
    const { PRODUCTS_DATA } = require('../../frontend/src/data/productsData');
    
    await Product.deleteMany({});
    
    // Map products to match schema if necessary
    const mappedProducts = PRODUCTS_DATA.map((p: any) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      imageUrl: p.imageUrl,
      secondaryImageUrl: p.secondaryImageUrl,
      description: p.description,
      badge: p.badge,
      sizes: p.sizes,
      colors: p.colors,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      isAvailable: p.isAvailable,
      bundleItems: p.bundleItems
    }));

    const created = await Product.insertMany(mappedProducts);
    
    const mapping = created.map((p: any, i: number) => ({
      oldId: `prod-${i + 1}`,
      newId: p._id.toString()
    }));
    
    fs.writeFileSync('seeded_products.json', JSON.stringify(mapping, null, 2));
    res.json({ message: 'Seeded successfully', count: created.length, mapping });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8000;
const serviceName = 'OcevStudio Monolith Server';

app.get('/', (req, res) => {
  res.send(`${serviceName} is running`);
});

app.listen(port, () => {
  console.log(`🚀 ${serviceName} running at http://localhost:${port}`);
});
