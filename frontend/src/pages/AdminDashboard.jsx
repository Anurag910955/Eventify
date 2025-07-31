import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    image: '',
  });
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('https://mini-project-college.onrender.com/api/admin/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showMessage('Failed to fetch events.', 'error');
    }
  };

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `https://mini-project-college.onrender.com/api/admin/events/${editingId}`
      : 'https://mini-project-college.onrender.com/api/admin/events';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save event');

      const msg = editingId ? 'Event updated successfully!' : 'Event created successfully!';
      showMessage(msg, 'success');

      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        price: '',
        image: '',
      });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      showMessage('Something went wrong. Try again.', 'error');
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date?.slice(0, 10),
      time: event.time,
      location: event.location,
      price: event.price,
      image: event.image,
    });
    setEditingId(event._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://mini-project-college.onrender.com/api/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete event');

      showMessage('Event deleted successfully!', 'success');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      showMessage('Failed to delete event.', 'error');
    }
  };

  return (
    <div className="w-screen min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-700 drop-shadow-lg tracking-tight">
        Admin Dashboard
      </h1>

      {message && (
        <div
          className={`max-w-3xl mx-auto mb-6 text-center p-4 rounded-xl font-medium transition-all duration-300 ${
            messageType === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message}
        </div>
      )}

      {/* Event Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-blue-200 max-w-4xl mx-auto grid gap-8 transition-all duration-500"
      >
        <h2 className="text-3xl font-semibold text-blue-900">
          {editingId ? 'Update Event' : 'Create Event'}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="p-4 border rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-blue-300"
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          className="p-4 border rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-blue-300"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border text-gray-800 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-2">Event Time</label>
            <input
              type="text"
              name="time"
              placeholder="e.g., 10:00 AM to 12:00 PM"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 border text-gray-800 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-blue-300"
              required
            />
          </div>
        </div>

        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={formData.location}
          onChange={handleChange}
          className="p-4 border rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-blue-300"
          required
        />

        <input
          type="text"
          name="price"
          placeholder="Ticket Price"
          value={formData.price}
          onChange={handleChange}
          className="p-4 border rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-blue-300"
          required
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="p-4 border rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-blue-300"
          required
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition duration-300"
        >
          {editingId ? 'Update Event' : 'Create Event'}
        </button>
      </form>

      {/* Events Table */}
      <div className="bg-white/90 backdrop-blur-md p-10 mt-16 shadow-2xl max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">All Events</h2>
        <div className="overflow-x-auto shadow-sm">
          <table className="min-w-full border text-left bg-white rounded-xl overflow-hidden">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-4 border">Title</th>
                <th className="p-4 border">Date</th>
                <th className="p-4 border">Location</th>
                <th className="p-4 border">Tickets Sold</th>
                <th className="p-4 border">Total Collected</th>
                <th className="p-4 border">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-700">
              {events.map(event => (
                <tr key={event._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border">{event.title}</td>
                  <td className="p-4 border">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="p-4 border">{event.location}</td>
                  <td className="p-4 border">{event.ticketsSold || 0}</td>
                  <td className="p-4 border">₹{event.totalAmount || 0}</td>
                  <td className="p-4 border flex gap-3">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-yellow-200 hover:bg-yellow-300 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-yellow-200 hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-xl mt-10">
  <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Tickets Sold per Event</h3>
  <ResponsiveContainer width="100%" height={400}>
  <BarChart
    data={events.map(e => ({
      name: e.title.length > 15 ? e.title.slice(0, 15) + '…' : e.title,
      ticketsSold: e.ticketsSold || 0,
      totalAmount: e.totalAmount || 0
    }))}
    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" angle={-40} textAnchor="end" interval={0} />
    <YAxis yAxisId="left" label={{ value: 'Tickets Sold', angle: -90, position: 'insideLeft' }} />
    <YAxis yAxisId="right" orientation="right" label={{ value: 'Total Amount (₹)', angle: 90, position: 'insideRight' }} />
    <Tooltip />
    <Legend />
    <Bar yAxisId="left" dataKey="ticketsSold" fill="#8884d8" name="Tickets Sold" />
    <Bar yAxisId="right" dataKey="totalAmount" fill="#82ca9d" name="Total Amount" />
  </BarChart>
</ResponsiveContainer>
</div>
    </div>
  );
};

export default AdminDashboard;
