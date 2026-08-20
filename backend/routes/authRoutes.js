import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (Customer & Admin)
router.get('/me', protect, getMe);

// Protected route (Admin Only)
router.get('/admin-test', protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the protected Admin API endpoint! Your role is verified.',
    user: req.user,
  });
});

export default router;
