import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: string; // Will be matched with Product.id string instead of ObjectId if using string IDs
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  images?: string[];
  productType?: string; // e.g. "Combo 2 món, S"
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    images: [{ type: String }],
    productType: { type: String },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
