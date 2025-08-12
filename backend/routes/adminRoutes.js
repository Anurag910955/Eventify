import express from 'express';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

const router = express.Router();

//  Get all events with stats
// routes/admin.js (or wherever admin events route is)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        // Query bookings using the 'event' field (matches your booking creation)
        const bookings = await Booking.find({ event: event._id });

        const ticketsSold = bookings.reduce((sum, b) => sum + (Number(b.tickets) || 0), 0);
        // Use stored event.totalAmount if you update event on booking (recommended)
        // But if you want to compute from bookings:
        // const totalAmount = bookings.reduce((sum, b) => sum + (Number(b.totalPayment) || (Number(b.tickets)||0) * event.price), 0);

        // Prefer returning the authoritative event totals from the Event doc:
        const totalAmount = (event.totalAmount !== undefined) ? event.totalAmount : ticketsSold * event.price;

        return {
          ...event.toObject(),
          ticketsSold,
          totalAmount,
        };
      })
    );

    res.json(eventsWithStats);
  } catch (err) {
    console.error('Failed to fetch admin events:', err);
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
});


//  Create a new event 
router.post('/events', async (req, res) => {
  const { title, description, date, time, location, price, image } = req.body;

  if (!title || !description || !date || !time || !location || !price || !image) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      price,
      image,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
});

// Update an existing event
router.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, price, image } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date, time, location, price, image },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
});
router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
});

export default router;
