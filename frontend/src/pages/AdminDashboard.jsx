import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#378ADD', '#1D9E75', '#BA7517', '#E24B4A', '#7F77DD', '#D85A30'];

const truncate = (s, n = 18) => s && s.length > n ? s.slice(0, n) + '…' : s;

const Toast = ({ message, type }) => {
  if (!message) return null;
  const base = 'fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all duration-300';
  const color = type === 'success'
    ? 'bg-green-50 text-green-700 border border-green-200'
    : 'bg-red-50 text-red-700 border border-red-200';
  return <div className={`${base} ${color}`}>{message}</div>;
};

const MetricCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', time: '',
    location: '', price: '', image: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const formRef = useRef(null);

  const totalRevenue = events.reduce((sum, e) => sum + (e.totalAmount || 0), 0);
  const totalBookings = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;
  const repeatUsers = 40;
  const predictedSales = Math.round(totalBookings * 1.2);
  const predictedRevenue = Math.round(totalRevenue * 1.2);
  const topEvents = [...events].sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold || 0)).slice(0, 5);

  const pieData = events.map((e, i) => ({
    name: truncate(e.title, 15),
    value: e.ticketsSold || 0,
    color: COLORS[i % COLORS.length],
  }));

  const barData = events.map(e => ({
    name: truncate(e.title, 15),
    ticketsSold: e.ticketsSold || 0,
    totalAmount: e.totalAmount || 0,
  }));

  const predData = [
    { name: 'Tickets', current: totalBookings, predicted: predictedSales },
    { name: 'Revenue (÷10)', current: Math.round(totalRevenue / 10), predicted: Math.round(predictedRevenue / 10) },
  ];

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => { setMessage(''); setMessageType(''); }, 3000);
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('https://eventify-olive-seven.vercel.app/api/admin/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showMessage('Failed to fetch events.', 'error');
    }
  };

  useEffect(() => {
    fetchEvents();
    const intervalId = setInterval(fetchEvents, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `https://eventify-olive-seven.vercel.app/api/admin/events/${editingId}`
      : 'https://eventify-olive-seven.vercel.app/api/admin/events';
    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save event');
      showMessage(editingId ? 'Event updated successfully!' : 'Event created successfully!', 'success');
      setFormData({ title: '', description: '', date: '', time: '', location: '', price: '', image: '' });
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
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`https://eventify-olive-seven.vercel.app/api/admin/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      showMessage('Event deleted successfully!', 'success');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      showMessage('Failed to delete event.', 'error');
    }
  };

  const cancelEdit = () => {
    setFormData({ title: '', description: '', date: '', time: '', location: '', price: '', image: '' });
    setEditingId(null);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50">
      <Toast message={message} type={messageType} />

      {/* Topbar */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="text-lg font-semibold text-gray-800">
            <span className="text-blue-600">Event</span>ify Admin
          </span>
          <p className="text-xs text-gray-400 mt-0.5">Live event management overview</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Live
          </span>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            + New event
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} sub="All time" color="text-green-600" />
          <MetricCard label="Total Bookings" value={totalBookings} sub="Tickets sold" color="text-blue-600" />
          <MetricCard label="Repeat Users" value={`${repeatUsers}%`} sub="Estimated" color="text-purple-600" />
          <MetricCard label="Upcoming Events" value={upcomingEvents} sub="Scheduled" color="text-amber-600" />
        </div>

        {/* Top events + Predictions row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Top events */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Top performing events</h2>
            <div className="flex flex-col gap-1">
              {topEvents.length === 0 && <p className="text-xs text-gray-400">No events yet.</p>}
              {topEvents.map((event, index) => (
                <div key={event._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-300 w-4">{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{event.title}</p>
                      <p className="text-xs text-gray-400">{event.location}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{event.ticketsSold || 0} tickets</span>
                </div>
              ))}
            </div>
          </div>

          {/* Predictions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Predictions (next cycle)</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-500 mb-1">Expected ticket sales</p>
                <p className="text-xl font-semibold text-blue-700">{predictedSales}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 mb-1">Expected revenue</p>
                <p className="text-xl font-semibold text-green-700">₹{predictedRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={predData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="current" fill="#378ADD" name="Current" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" fill="#1D9E75" name="Predicted" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart: tickets per event */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Tickets sold per event</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'Tickets', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: 'Amount (₹)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
              <Bar yAxisId="left" dataKey="ticketsSold" fill="#378ADD" name="Tickets Sold" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="totalAmount" fill="#1D9E75" name="Total Amount (₹)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart: event distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Event distribution (tickets sold)</h2>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="60%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: d.color }}></span>
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Form */}
        <div ref={formRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">{editingId ? 'Update event' : 'Create event'}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Title</label>
                <input
                  type="text" name="title" placeholder="Event title"
                  value={formData.title} onChange={handleChange}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Description</label>
                <textarea
                  name="description" placeholder="Event description"
                  value={formData.description} onChange={handleChange}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                  rows={3} required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Date</label>
                <input
                  type="date" name="date" value={formData.date} onChange={handleChange}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Time</label>
                <input
                  type="text" name="time" placeholder="e.g. 10:00 AM – 12:00 PM"
                  value={formData.time} onChange={handleChange}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Location</label>
                <input
                  type="text" name="location" placeholder="Venue"
                  value={formData.location} onChange={handleChange}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Ticket price (₹)</label>
                <input
                  type="text" name="price" placeholder="500"
                  value={formData.price} onChange={handleChange}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Image URL</label>
                <input
                  type="text" name="image" placeholder="https://..."
                  value={formData.image} onChange={handleChange}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition"
              >
                {editingId ? 'Update event' : 'Create event'}
              </button>
              <button
                type="button" onClick={cancelEdit}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Events table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">All events</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Title', 'Date', 'Location', 'Tickets sold', 'Total collected', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {events.map(event => (
                  <tr key={event._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 pr-4 font-medium text-gray-800">{event.title}</td>
                    <td className="py-3 pr-4 text-gray-500">{new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="py-3 pr-4 text-gray-500">{event.location}</td>
                    <td className="py-3 pr-4">{event.ticketsSold || 0}</td>
                    <td className="py-3 pr-4 text-green-600 font-medium">₹{(event.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">No events found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
