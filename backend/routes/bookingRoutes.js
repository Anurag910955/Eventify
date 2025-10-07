// routes/bookingRoutes.js
import express from 'express';
import { bookEvent, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking and send PDF ticket via email
// @access  Private
router.post('/', protect, bookEvent);

// @route   GET /api/bookings/my-bookings
// @desc    Get all bookings of the logged-in user
// @access  Private
router.get('/my-bookings', protect, getUserBookings);

export default router;
