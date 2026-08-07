import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['inventory', 'marketing', 'shipping', 'other']
    },
    description: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
