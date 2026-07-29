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

const port = process.env.PORT || 8003;
const serviceName = 'order-service';

app.get('/', (req, res) => {
  res.send("${serviceName} is running");
});

app.listen(port, () => {
  console.log("${serviceName} listening on port ${port}");
});

