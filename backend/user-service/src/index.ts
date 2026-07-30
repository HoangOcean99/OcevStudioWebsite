import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
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
app.use(cors());
app.use(express.json());

if (process.env.ENABLE_MONGO === 'true' && process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 }).then(() => {
    console.log("[user-service] Connected to MongoDB");
  }).catch((err) => {
    console.log("[user-service] MongoDB offline:", err.message);
  });
}

const port = process.env.USER_PORT || 8001;
const serviceName = 'user-service';

app.get('/', (req, res) => {
  res.send(`${serviceName} is running`);
});

app.listen(port, () => {
  console.log(`🚀 ${serviceName} running at http://localhost:${port}`);
});

// Keep event loop active in dev mode
setInterval(() => {}, 3600000);
