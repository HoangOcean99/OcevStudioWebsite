import { BaseService } from './baseService';
import PreOrder, { IPreOrder } from '../models/PreOrder';
import Product from '../models/Product';
import User from '../models/User';
import mongoose from 'mongoose';

export class OrderService extends BaseService<IPreOrder> {
  constructor() {
    super(PreOrder);
  }

  async findMyOrders(userId: string) {
    try {
      let orders = await this.model.find({ user: userId }).sort({ createdAt: -1 }).lean();
      
      for (const order of orders) {
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            if (item.product && mongoose.Types.ObjectId.isValid(item.product.toString())) {
              const prod = await Product.findById(item.product).lean();
              if (prod) {
                item.product = prod as any;
              }
            }
          }
        }
      }
      return orders;
    } catch (error) {
      console.error('Error in findMyOrders:', error);
      return [];
    }
  }

  async findAll(query: any = {}, page: number = 1, pageSize: number = 10) {
    const result = await super.findAll(query, page, pageSize);
    try {
      // Chuyển sang plain objects để gán thủ công
      let items = result.items.map(doc => {
        return (doc as any).toObject ? (doc as any).toObject() : doc;
      });
      
      for (const order of items) {
        // Populate User
        if (order.user && mongoose.Types.ObjectId.isValid(order.user.toString())) {
          const userObj = await User.findById(order.user).select('name email avatar phone').lean();
          if (userObj) {
            order.user = userObj;
          }
        }

        // Populate Products
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            if (item.product && mongoose.Types.ObjectId.isValid(item.product.toString())) {
              const prod = await Product.findById(item.product).lean();
              if (prod) {
                item.product = prod;
              }
            }
          }
        }
      }
      return { ...result, items };
    } catch (error) {
      console.error('Manual populate error:', error);
      return result;
    }
  }
}

export const orderService = new OrderService();
