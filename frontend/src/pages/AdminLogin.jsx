import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://mini-project-college.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('adminToken', data.token);

      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-200 px-4">
  <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 animate-fade-in border border-white/30">
    <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-8">
      Admin Login
    </h2>
    
    {error && (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-center font-medium">
        {error}
      </div>
    )}

    <form onSubmit={handleLogin} className="space-y-6">
      <div className="relative">
        <label className="block text-gray-700 font-semibold mb-1">Email</label>
        <input
          type="email"
          placeholder="admin@example.com"
          className="w-full pl-12 pr-4 py-3 text-gray-700 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 shadow-sm placeholder-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <span className="absolute left-4 top-10 transform -translate-y-1/2 text-gray-400">
          📧
        </span>
      </div>

      <div className="relative">
        <label className="block text-gray-700 font-semibold mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full pl-12 pr-4 py-3 text-gray-700 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 shadow-sm placeholder-blue-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span className="absolute left-4 top-10 transform -translate-y-1/2 text-gray-400">
          🔒
        </span>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-lg transition-all duration-300"
      >
        Sign In
      </button>
    </form>

    <p className="text-center text-sm text-gray-500 mt-8 italic">
      Authorized access only. Admin privileges required.
    </p>
  </div>
</div>


  );
};

export default AdminLogin;