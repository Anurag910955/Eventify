import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Hardcoded admin credentials
const ADMIN_EMAIL = 'sen207580@gmail.com';
const ADMIN_PASSWORD = '@Success910'; 

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token, message: 'Admin login successful' });
  }

  return res.status(401).json({ message: 'Invalid email or password' });
});

export default router;
