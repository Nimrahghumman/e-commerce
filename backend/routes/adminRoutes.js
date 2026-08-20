import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin protected stats endpoint
router.get('/stats', protect, adminOnly, getAdminStats);

export default router;
