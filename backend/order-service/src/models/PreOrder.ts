import mongoose, { Schema, Document } from 'mongoose';

export interface IPreOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    size: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  totalAmount: number;
  status: 'Ordered' | 'In Transit' | 'QC' | 'Shipping' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentMethod: 'VietQR' | 'COD';
  vietQrTransactionId?: string;
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    ward: string;
  };
  estimatedDeliveryDate: Date;
  batchId?: string; // Optional batch dropping identifier
  createdAt: Date;
  updatedAt: Date;
}

const PreOrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        priceAtPurchase: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['Ordered', 'In Transit', 'QC', 'Shipping', 'Delivered', 'Cancelled'], 
      default: 'Ordered' 
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      enum: ['VietQR', 'COD'],
      required: true
    },
    vietQrTransactionId: { type: String },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
    },
    estimatedDeliveryDate: { type: Date, required: true }, // Should calculate +7 days buffer
    batchId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPreOrder>('PreOrder', PreOrderSchema);
