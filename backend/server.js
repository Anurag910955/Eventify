import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import otpRoutes from './routes/otp.js';
import { errorHandler } from './middleware/errorHandler.js';
import paymentRoutes from "./routes/payment.js";
import contactRoutes from "./routes/contact.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'https://eventifyevents.vercel.app', // production frontend
  'http://localhost:5173',            // local frontend for testing
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Contact route
app.use("/api/contact", contactRoutes);

// Payment route
app.use("/api/payment", paymentRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Event and Booking routes
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);

// OTP/Email verification route
app.use('/api/verify-email', otpRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
