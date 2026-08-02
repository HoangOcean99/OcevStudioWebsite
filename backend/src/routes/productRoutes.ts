import express from 'express';
import { productController } from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';

import { validate } from '../middleware/validateMiddleware';
import { productSchema } from '../schemas/productSchema';
import { cache, clearCache } from '../middleware/cacheMiddleware';

const router = express.Router();

router.route('/')
  .get(cache(300), productController.getAll) // Cache for 5 minutes
  .post(protect, admin, validate(productSchema), clearCache('/api/products'), productController.create);

router.route('/:id')
  .get(cache(300), productController.getById)
  .put(protect, admin, validate(productSchema), clearCache('/api/products'), productController.update)
  .delete(protect, admin, clearCache('/api/products'), productController.delete);

export default router;
