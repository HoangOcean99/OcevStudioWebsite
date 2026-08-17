import { Router } from 'express';
import { getReviewsByProduct, createReview, likeReview, updateReview, deleteReview } from '../controllers/review.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Lấy danh sách đánh giá của 1 sản phẩm
router.get('/product/:productId', getReviewsByProduct);

// Thêm đánh giá mới (bắt buộc đăng nhập)
router.post('/', protect, createReview);

// Sửa đánh giá
router.put('/:id', protect, updateReview);

// Xóa đánh giá
router.delete('/:id', protect, deleteReview);

// Like 1 đánh giá
router.put('/:id/like', likeReview);

export default router;
