import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: 'Shirt' | 'Pants' | 'Accessory' | 'Outerwear';
  color: string;
  images: string[]; // Cloudinary URLs
  sizes: {
    chineseSize: 'M' | 'L' | 'XL' | '2XL' | '3XL';
    vnEquivalent: 'S' | 'M' | 'L' | 'XL' | '2XL';
    stock: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      enum: ['Shirt', 'Pants', 'Accessory', 'Outerwear'], 
      required: true 
    },
    color: { type: String, required: true },
    images: [{ type: String, required: true }],
    sizes: [
      {
        chineseSize: { type: String, enum: ['M', 'L', 'XL', '2XL', '3XL'], required: true },
        vnEquivalent: { type: String, enum: ['S', 'M', 'L', 'XL', '2XL'], required: true },
        stock: { type: Number, default: 0 },
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
