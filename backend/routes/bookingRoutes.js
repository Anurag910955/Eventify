import express from 'express';
import { bookEvent, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/bookings 
router.post('/', protect, bookEvent);

// GET /api/bookings/my-bookings 
router.get('/my-bookings', protect, getUserBookings);z

export default router;
