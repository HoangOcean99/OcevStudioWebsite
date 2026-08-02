import express from 'express';
import { orderController } from '../controllers/orderController';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(optionalAuth, orderController.create)
  .get(protect, admin, orderController.getAll);

router.route('/myorders').get(protect, orderController.getMyOrders);

router.route('/:id')
  .get(protect, orderController.getById)
  .delete(protect, admin, orderController.delete);

router.route('/:id/status')
  .put(protect, admin, orderController.updateOrderStatus);

export default router;
