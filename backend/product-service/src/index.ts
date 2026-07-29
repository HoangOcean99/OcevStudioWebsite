import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI as string).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

const port = process.env.PORT || 8002;
const serviceName = 'product-service';

app.get('/', (req, res) => {
  res.send("${serviceName} is running");
});

app.listen(port, () => {
  console.log("${serviceName} listening on port ${port}");
});

