🎟️ Eventify — Full-Stack Event Booking Platform

Eventify is a modern, full-stack event booking web application where users can browse, book, and receive stylish PDF tickets for events. It includes an admin dashboard, payment integration, OTP verification, and email notifications — all in a production-ready MERN stack project.

🚀 Features

👤 User Features
- Browse and view all available events
- Secure booking with Razorpay payment gateway (test mode)
- OTP verification via email before booking
- PDF ticket generation with QR code
- Ticket sent via email after successful booking
- View "My Bookings" for past and upcoming events

🛠️ Admin Features
- Admin login with access control
- Create, update, or delete events
- View ticket booking statistics on a graph dashboard
- Email-based contact form to receive user messages


🧰 Tech Stack

# Frontend
- React.js + Tailwind CSS
- React Router
- Context API for Authentication

# Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Razorpay API for payments
- Nodemailer for emails
- PDFKit + qrcode for generating tickets

💳 Payment Flow (Test Mode)

- Razorpay test API is integrated
- Users make payments using test card details
- Payment ID is verified and saved with the booking
- Ticket is generated after payment confirmation

🚀 Deployment
Frontend: Deployed on Vercel
Backend: Deployed on Render

📧 Email & Ticketing Flow

- Nodemailer sends email from a Gmail service
- OTP verification before booking
- Ticket is sent as a stylish PDF attachment
- Ticket includes event details and a scannable QR code

 🔐 OTP System

- Email OTP is sent to users before booking
- OTP expires after 5 minutes
- Option to resend OTP after 2 minutes


⚙️ Setup Instructions

 🖥️ Backend Setup

cd backend
npm install
npm run dev

🌐 Frontend Setup

cd frontend
npm install
npm start

📄 License
This project is for educational and demonstration purposes. You can customize and reuse it with credit.

Screenshots


<img width="1866" height="869" alt="image" src="https://github.com/user-attachments/assets/d65458a2-089b-4855-afe3-8ea9bd819ce0" />


<img width="721" height="754" alt="image" src="https://github.com/user-attachments/assets/91ec2c07-c577-48d2-8d3c-5daa9d9a58ef" />


<img width="1729" height="808" alt="image" src="https://github.com/user-attachments/assets/b216cb4f-e50c-4a4f-9aed-784876c1e0fa" />


<img width="498" height="495" alt="image" src="https://github.com/user-attachments/assets/bb9f6737-5681-4e67-94ff-326e98f6b723" />


<img width="1081" height="827" alt="image" src="https://github.com/user-attachments/assets/18da0cf9-d83c-4650-9dd5-5cc1053b3dad" />


<img width="1869" height="698" alt="image" src="https://github.com/user-attachments/assets/958faa87-9236-42fa-9c2f-a27db7b00dac" />


<img width="1091" height="768" alt="image" src="https://github.com/user-attachments/assets/c8eb02b6-7634-40e6-bc29-0ae9e145ce94" />
