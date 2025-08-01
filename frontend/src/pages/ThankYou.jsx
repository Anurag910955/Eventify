import React from "react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center border-t-8 border-green-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 m-4 text-4xl sm:text-5xl animate-bounce">🎉</div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-600 mb-3">
          Thank You for Booking! 🤩
        </h1>
        <p className="text-gray-700 text-base sm:text-lg mb-6">
          We’ve successfully received your booking. <br />
          A confirmation email has been sent to you.
        </p>

        <div className="flex justify-center items-center mb-6">
          <img
            src="https://th.bing.com/th/id/OIP.jAUFo-KBHCnnQoBs6eMFnQHaHa?rs=1&pid=ImgDetMain"
            alt="Ticket Confirmed"
            className="w-20 h-20 sm:w-24 sm:h-24"
          />
        </div>

        <p className="text-blue-800 font-medium text-sm sm:text-base mb-8">
          We look forward to seeing you at the event! 🎫 <br />
          Don’t forget to bring your confirmation.
        </p>

        <Link
          to="/"
          className="inline-block bg-green-500 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-green-600 transition duration-300 shadow-md"
        >
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
