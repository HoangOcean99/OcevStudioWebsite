import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: 'admin' | 'user';
  avatar?: string;
  phone?: string;
  address?: string;
  sizingPreferences?: {
    height: number;
    weight: number;
    bodyShape: 'Slim' | 'Athletic' | 'Average' | 'Heavy';
  };
  savedOutfits: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    avatar: { type: String, default: '/default-avatar.svg' },
    phone: { type: String },
    address: { type: String },
    sizingPreferences: {
      height: { type: Number }, // in cm
      weight: { type: Number }, // in kg
      bodyShape: { 
        type: String, 
        enum: ['Slim', 'Athletic', 'Average', 'Heavy'] 
      },
    },
    savedOutfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
