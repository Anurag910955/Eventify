// controllers/bookingController.js
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import os from 'os';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import nodemailer from 'nodemailer';

// Vercel-safe temporary directory
const TICKET_DIR = path.join(os.tmpdir(), 'tickets');
if (!fs.existsSync(TICKET_DIR)) {
  fs.mkdirSync(TICKET_DIR, { recursive: true });
}

// POST /api/bookings — Create a booking and send PDF ticket via email
export const bookEvent = async (req, res) => {
  try {
    const { eventId, name, email, tickets, totalPayment, razorpayPaymentId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // create booking
    const booking = new Booking({
      event: eventId,
      name,
      email,
      tickets,
      totalPayment,
      razorpayPaymentId,
      user: req.user ? req.user._id : null
    });

    const createdBooking = await booking.save();

    // Update event stats
    const paidAmount = typeof totalPayment === 'number' && !Number.isNaN(totalPayment)
      ? totalPayment
      : (Number(tickets) || 0) * (Number(event.price) || 0);

    event.ticketsSold = (event.ticketsSold || 0) + (Number(tickets) || 0);
    event.totalAmount = (event.totalAmount || 0) + paidAmount;
    await event.save();

    // --- PDF/QRCode generation ---
    const qrData = `Booking ID: ${createdBooking._id}\nName: ${name}\nEvent: ${event.title}`;
    const qrImagePath = path.join(TICKET_DIR, `qr-${createdBooking._id}.png`);
    await QRCode.toFile(qrImagePath, qrData);

    const pdfPath = path.join(TICKET_DIR, `ticket-${createdBooking._id}.pdf`);
    const doc = new PDFDocument({ size: 'A6', margin: 30 });
    doc.pipe(fs.createWriteStream(pdfPath));

    // PDF content
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#4a4a4a').text('Eventify', { align: 'center' });
    doc.fontSize(10).text('Your Ticket to an Amazing Event', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#2d2d2d').text(event.title, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Date: ${new Date(event.date).toLocaleDateString()}`, { align: 'center' });
    doc.text(`Time: ${event.time}`, { align: 'center' });
    doc.moveDown(1);
    doc.text(`Location: ${event.location}`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(10).fillColor('#6b6b6b').text('Booking Details', { underline: true });
    doc.moveDown(0.5);
    doc.text(`Booking ID: ${createdBooking._id}`);
    doc.text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Tickets: ${tickets}`);
    doc.text(`Total Paid: INR ${paidAmount}`);
    doc.text(`Payment ID: ${razorpayPaymentId || 'N/A'}`);
    doc.moveDown(1);

    const qrWidth = 100;
    const qrX = (doc.page.width - qrWidth) / 2;
    doc.text('Scan at entry:', qrX, doc.y, { width: qrWidth, align: 'center' });
    doc.image(qrImagePath, qrX, doc.y + 5, { fit: [qrWidth, qrWidth] });
    doc.end();

    // --- Send email ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>🎉 Your Ticket for ${event.title}</h2>
        <p>Hi ${name},</p>
        <p>Thank you for booking. Please find your ticket attached as PDF.</p>
        <p><strong>Booking ID:</strong> ${createdBooking._id}</p>
        <p><strong>Tickets:</strong> ${tickets}</p>
        <p><strong>Total Paid:</strong> INR ${paidAmount}</p>
        <p>See you at the event!</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'eventifyprivatelimited13@gmail.com',
      to: email,
      subject: `🎟 Your Ticket for ${event.title}`,
      html: emailHtml,
      attachments: [{ filename: `ticket-${createdBooking._id}.pdf`, path: pdfPath }]
    });

    // Clean up temp files
    fs.unlink(pdfPath, () => {});
    fs.unlink(qrImagePath, () => {});

    return res.status(201).json({ message: 'Booking successful! Ticket sent via email.', createdBooking });
  } catch (error) {
    console.error("Booking failed:", error);
    return res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

// GET /api/bookings/my-bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("event");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};
