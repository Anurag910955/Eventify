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
app.use(cors({
  origin: 'https://mini-project-college-68xx.vercel.app', 
  credentials: true
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
 
app.use("/api/payment", paymentRoutes);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/verify-email', otpRoutes); 

// Error handling middleware
app.use(errorHandler);

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'frontend', 'dist'))); // for Vite
// app.use(express.static(path.join(__dirname, 'frontend', 'build'))); // for CRA

// Always return index.html for React Router routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
