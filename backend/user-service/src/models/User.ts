import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  sizingPreferences: {
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
    phone: { type: String },
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
