import express from 'express';
import { register, login, googleLogin, getMe, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

import { validate } from '../middleware/validateMiddleware';
import { registerSchema, loginSchema } from '../schemas/authSchema';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google-login', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
