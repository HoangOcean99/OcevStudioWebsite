import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  originalPrice?: number;
  imageUrl: string;
  secondaryImageUrl?: string;
  badge?: string;
  colors?: { name: string; hex: string }[];
  rating?: number;
  reviewsCount?: number;
  isAvailable?: boolean;
  bundleItems?: any[];
  sizes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    originalPrice: { type: Number },
    imageUrl: { type: String, required: true },
    secondaryImageUrl: { type: String },
    badge: { type: String },
    colors: [{ name: String, hex: String }],
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    bundleItems: [{ type: Schema.Types.Mixed }],
    sizes: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
