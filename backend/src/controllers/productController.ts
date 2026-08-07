import { BaseController } from './baseController';
import { IProduct } from '../models/Product';
import { productService } from '../services/productService';

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary';

class ProductController extends BaseController<IProduct> {
  constructor() {
    super(productService);
  }

  delete = asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    try {
      await this.service.delete(productId);
      
      // Delete cloudinary folder
      try {
        const folderPath = `OcevProduct/${productId}`;
        await cloudinary.api.delete_resources_by_prefix(folderPath);
        await cloudinary.api.delete_folder(folderPath);
      } catch (cloudErr) {
        console.error('Error deleting Cloudinary folder:', cloudErr);
      }
      
      res.json({ message: 'Removed successfully' });
    } catch (error: any) {
      if (error.message === 'Item not found') {
        res.status(404);
        throw new Error('Not found');
      }
      throw error;
    }
  });
}

export const productController = new ProductController();
