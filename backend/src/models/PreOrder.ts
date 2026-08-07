import mongoose, { Schema, Document } from 'mongoose';

export interface IPreOrder extends Document {
  user?: mongoose.Types.ObjectId;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    product: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'Ordered' | 'Confirmed' | 'Packing' | 'Shipping' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentMethod: 'VietQR' | 'COD';
  vietQrTransactionId?: string;
  shippingAddress: string;
  estimatedDeliveryDate: Date;
  batchId?: string; // Optional batch dropping identifier
  createdAt: Date;
  updatedAt: Date;
}

const PreOrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guestInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    items: [
      {
        product: { type: String, required: true, ref: 'Product' }, // Mongoose requires ref for populate
        size: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['Ordered', 'Confirmed', 'Packing', 'Shipping', 'Delivered', 'Cancelled'], 
      default: 'Ordered' 
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    paymentMethod: { type: String, required: true },
    vietQrTransactionId: { type: String },
    shippingAddress: { type: String, required: true },
    estimatedDeliveryDate: { type: Date, required: true }, // Should calculate +7 days buffer
    batchId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPreOrder>('PreOrder', PreOrderSchema);
