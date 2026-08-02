import { BaseController } from './baseController';
import { IProduct } from '../models/Product';
import { productService } from '../services/productService';

class ProductController extends BaseController<IProduct> {
  constructor() {
    super(productService);
  }
}

export const productController = new ProductController();
