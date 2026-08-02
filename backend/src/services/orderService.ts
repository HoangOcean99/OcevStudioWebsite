import { BaseService } from './baseService';
import PreOrder, { IPreOrder } from '../models/PreOrder';

export class OrderService extends BaseService<IPreOrder> {
  constructor() {
    super(PreOrder);
  }

  async findMyOrders(userId: string) {
    return await this.model.find({ user: userId });
  }
}

export const orderService = new OrderService();
