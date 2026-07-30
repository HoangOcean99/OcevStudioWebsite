import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import PreOrder from './models/PreOrder';

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
app.use(cors());
app.use(express.json());

if (process.env.ENABLE_MONGO === 'true' && process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 }).then(() => {
    console.log("[order-service] Connected to MongoDB");
  }).catch((err) => {
    console.log("[order-service] MongoDB offline:", err.message);
  });
}

const port = process.env.ORDER_PORT || 8003;
const serviceName = 'order-service';

app.get('/', (req, res) => {
  res.send(`${serviceName} is running`);
});

// Create Order API
app.post('/api/orders/create', async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, shippingAddress } = req.body;
    
    const userId = new mongoose.Types.ObjectId(); 
    const vietQrTransactionId = paymentMethod === 'VietQR' ? `OVD-${Date.now()}` : undefined;

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

    const newOrder = new PreOrder({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      vietQrTransactionId,
      estimatedDeliveryDate,
    });

    const savedOrder = process.env.ENABLE_MONGO === 'true' ? await newOrder.save() : newOrder;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder,
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error });
  }
});

// Get User Orders
app.get('/api/orders/me', async (req, res) => {
  try {
    const orders = process.env.ENABLE_MONGO === 'true' ? await PreOrder.find().sort({ createdAt: -1 }).limit(10) : [];
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error });
  }
});

app.listen(port, () => {
  console.log(`🚀 ${serviceName} running at http://localhost:${port}`);
});

// Keep event loop active in dev mode
setInterval(() => {}, 3600000);
