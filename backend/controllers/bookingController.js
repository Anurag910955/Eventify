// controllers/bookingController.js
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import nodemailer from 'nodemailer';

// Ensure ticket folder exists
const TICKET_DIR = path.join(process.cwd(), 'tickets');
if (!fs.existsSync(TICKET_DIR)) {
  fs.mkdirSync(TICKET_DIR);
}

// POST /api/bookings — Create a booking and send PDF ticket via email
export const bookEvent = async (req, res) => {
  try {
    const { eventId, name, email, tickets, totalPayment, razorpayPaymentId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

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

    // Generate QR Code
    const qrData = `Booking ID: ${createdBooking._id}\nName: ${name}\nEvent: ${event.title}`;
    const qrImagePath = path.join(TICKET_DIR, `qr-${createdBooking._id}.png`);
    await QRCode.toFile(qrImagePath, qrData);

    // Generate PDF Ticket with improved design
    const pdfPath = path.join(TICKET_DIR, `ticket-${createdBooking._id}.pdf`);
    const doc = new PDFDocument({
      size: 'A6', // Smaller, more ticket-like size
      margin: 30
    });
    doc.pipe(fs.createWriteStream(pdfPath));

    // Header
    doc.fontSize(18)
      .font('Helvetica-Bold')
      .fillColor('#4a4a4a')
      .text('Eventify', { align: 'center' });
    doc.fontSize(10)
      .text('Your Ticket to an Amazing Event', { align: 'center' });
    doc.moveDown(2);

    // Event Details
    doc.fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#2d2d2d')
      .text(event.title, { align: 'center' });
    doc.moveDown(0.5);

    doc.fontSize(12)
      .font('Helvetica')
      .text(`Date: ${new Date(event.date).toLocaleDateString()}`, { align: 'center' });
    doc.text(`Time: ${event.time}`, { align: 'center' });
    doc.moveDown(1);
    doc.text(`Location: ${event.location}`, { align: 'center' });
    doc.moveDown(2);

    // Booking Details
    doc.fontSize(10)
      .fillColor('#6b6b6b')
      .text('Booking Details', { underline: true });
    doc.moveDown(0.5);

    doc.text(`Booking ID: ${createdBooking._id}`);
    doc.text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Tickets: ${tickets}`);
    doc.text(`Total Paid: INR ${totalPayment}`);
    doc.text(`Payment ID: ${razorpayPaymentId || 'N/A'}`);
    doc.moveDown(1);

    // QR Code Section
    const qrWidth = 100;
    const qrX = (doc.page.width - qrWidth) / 2;
    doc.text('Scan at entry:', qrX, doc.y, { width: qrWidth, align: 'center' });
    doc.image(qrImagePath, qrX, doc.y + 5, { fit: [qrWidth, qrWidth] });
    doc.end();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML email template
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #333;">Eventify</h1>
          <p style="color: #555;">Your Ticket for ${event.title}</p>
        </div>
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #007bff; font-weight: 500;">Booking Confirmed! 🎉</h2>
          <p style="font-size: 16px; color: #666;">Thank you for your purchase. Your ticket is attached to this email as a PDF. Please present it at the event entrance.</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-top: 1px solid #eee;">
          <h3 style="color: #444; border-bottom: 2px solid #007bff; padding-bottom: 5px; display: inline-block;">Event Details</h3>
          <p><strong>Event:</strong> ${event.title}</p>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <h3 style="color: #444; border-bottom: 2px solid #007bff; padding-bottom: 5px; display: inline-block;">Booking Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Tickets:</strong> ${tickets}</p>
          <p><strong>Total Paid:</strong> INR ${totalPayment}</p>
        </div>
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #aaa;">
          <p>This email was sent by Eventify.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'eventifyprivatelimited13@gmail.com',
      to: email,
      subject: `🎉 Your Ticket for ${event.title}`,
      html: emailHtml,
      attachments: [{
        filename: `ticket-${createdBooking._id}.pdf`,
        path: pdfPath,
      }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email failed:', error);
      } else {
        console.log('Email sent:', info.response);
      }

      // Clean up files
      fs.unlink(pdfPath, () => {});
      fs.unlink(qrImagePath, () => {});
    });

    res.status(201).json({ message: 'Booking successful!', createdBooking });

  } catch (error) {
    console.error("Booking failed:", error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
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