import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { registerValidation, loginValidation } from '../validators/auth';
import { handleValidation } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerValidation, handleValidation, register);
router.post('/login', loginValidation, handleValidation, login);

// Protected routes
router.get('/me', authenticate, getProfile);

export default router;
