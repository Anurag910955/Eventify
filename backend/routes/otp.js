// routes/otp.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();
const otpStore = new Map(); 

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);
  setTimeout(() => otpStore.delete(email), 5 * 60 * 1000); // OTP expires in 5 mins

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP for Eventify Booking",
      text: `Your OTP is ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

router.post("/confirm-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore.get(email) === otp) {
    otpStore.delete(email);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }
});

export default router;
