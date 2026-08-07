import express from 'express';
import { googleLogin, getMe, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/google-login', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
