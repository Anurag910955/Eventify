import React, { useEffect, useState } from 'react';

const Services = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      title: 'Event Booking',
      description: `Our platform offers a seamless event booking experience, allowing users to browse, filter, and book events with just a few clicks. Whether it's a tech seminar, cultural fest, or private celebration, users can view detailed event information, seat availability, and ticket pricing in real-time. Instant confirmations and digital receipts ensure transparency and convenience. We also allow group bookings and ticket sharing, making it easier for families and friends to attend events together.`,
    },
    {
      title: 'Event Management',
      description: `We provide robust tools for event organizers to manage every aspect of their event — from creation to completion. Organizers can add or update event details, set ticket pricing, manage capacities, and monitor bookings in real-time. They can also analyze booking trends, monitor total revenue collected, and update users on any changes. Whether you're hosting a single-day event or a week-long conference, our system ensures everything stays on track with minimal manual effort.`,
    },
    {
      title: 'Real-time Updates',
      description: `Stay connected with your audience by sending real-time updates about your event. From schedule changes and venue updates to speaker announcements and last-minute notices, our platform allows organizers to push updates instantly to all registered users. Users receive instant notifications and can access the latest event details at any time, ensuring a smooth and informed experience for everyone involved.`,
    },
    {
      title: 'Secure Payments',
      description: `Security is our top priority. All transactions are encrypted and processed through trusted payment gateways to ensure your data remains safe. Our system supports multiple payment options including credit/debit cards, UPI, net banking, and wallets. Upon successful payment, users receive instant confirmation, a detailed receipt, and assurance that their booking is secure. Refunds and cancellations are also handled with transparency and clarity.`,
    },
    {
      title: '24/7 Customer Support',
      description: `Our dedicated support team is available round-the-clock to assist users and organizers with any issues or queries. From troubleshooting login issues to handling ticket cancellations and refunds, our responsive support ensures quick resolutions. Users can reach us via email, in-app chat, or our contact form. We also maintain an extensive FAQ section and help center for self-service support.`,
    },
    {
      title: 'Virtual & Hybrid Event Hosting',
      description: `In the evolving landscape of event management, we offer powerful tools for hosting both fully virtual and hybrid events. Our platform supports seamless live streaming, interactive Q&A sessions, live polls, breakout rooms, and real-time chat functionalities — all integrated within a smooth and secure interface. Organizers can easily manage both on-site and remote attendees, ensuring a unified experience across channels.`,
    },
  ];

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {loading ? (
        <div className="text-center text-gray-500 text-xl animate-pulse">
          Loading services...
        </div>
      ) : (
        <div className="max-w-7xl w-full">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-blue-700 mb-10 sm:mb-12 drop-shadow-sm">
            Our Premium Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="relative bg-white/60 backdrop-blur-md border border-blue-100 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="absolute -top-6 left-6 bg-blue-100 text-blue-600 p-3 rounded-full shadow-md text-2xl group-hover:scale-105 transition-transform duration-300">
                  💼
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 mt-6 group-hover:text-blue-600 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify text-sm sm:text-base">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
