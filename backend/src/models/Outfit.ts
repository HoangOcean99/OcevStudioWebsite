import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfit extends Document {
  name: string;
  description?: string;
  creator: mongoose.Types.ObjectId; // User ID
  items: {
    product: mongoose.Types.ObjectId; // Product ID
    size: string; // the vnEquivalent size chosen
  }[];
  bundleDiscountPercentage: number;
  totalPrice: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OutfitSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: String, required: true },
      }
    ],
    bundleDiscountPercentage: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IOutfit>('Outfit', OutfitSchema);
