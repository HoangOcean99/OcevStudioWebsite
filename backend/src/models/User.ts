import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  googleId?: string;
  role: 'admin' | 'staff' | 'user';
  isBanned?: boolean;
  avatar?: string;
  phone?: string;
  address?: string;
  age?: number;
  shirtSize?: string;
  pantsSize?: string;
  shoeSize?: string;
  savedOutfits: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String },
    role: { type: String, enum: ['admin', 'staff', 'user'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    avatar: { type: String, default: '/default-avatar.svg' },
    phone: { type: String },
    address: { type: String },
    age: { type: Number },
    shirtSize: { type: String },
    pantsSize: { type: String },
    shoeSize: { type: String },
    savedOutfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
