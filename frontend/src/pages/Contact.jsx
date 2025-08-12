import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://mini-project-college.onrender.com/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to send message");

    setSuccessMessage("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSuccessMessage(""), 5000);
  } catch (error) {
    setSuccessMessage("Something went wrong. Please try again later.");
    setTimeout(() => setSuccessMessage(""), 5000);
  }
};

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-50 px-4 py-12">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 space-y-10">
        
        {/* Title Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-600 mb-4">
            Get in Touch
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            We'd love to hear from you! Whether you have a question, suggestion, or just want to say hello.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-800 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-800 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>

          <div className="relative">
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-800 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            ></textarea>
            <i className="fas fa-comment-dots absolute left-4 top-4 text-gray-400"></i>
          </div>

          {/* Inline Success Message */}
          {successMessage && (
            <div className="text-green-600 font-medium text-center bg-green-50 border border-green-300 rounded-lg p-3">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
          >
          ✉️ Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="text-center text-gray-700">
          <h2 className="text-xl font-semibold mb-2">📍 Our Office</h2>
          <p>123 Innovation Street, Tech City, Indore, India</p>
          <p>📞 +91 9109554428</p>
          <p>✉️ eventifyprivatelimited13@gmail.com</p>
        </div>

        {/* Map Embed */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235527.49544102792!2d75.69868923793446!3d22.723887932681695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1744207123114!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
