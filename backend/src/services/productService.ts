import { BaseService } from './baseService';
import Product, { IProduct } from '../models/Product';

export class ProductService extends BaseService<IProduct> {
  constructor() {
    super(Product);
  }
}

export const productService = new ProductService();
