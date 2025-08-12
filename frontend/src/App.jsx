// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation,matchPath } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import Booking from './pages/Booking';
import ThankYou from './pages/ThankYou';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './pages/AdminDashboard';
import Services from './pages/Services'; 
import AdminLogin from './pages/AdminLogin';
import ScrollToTop from './components/ScrollToTop.jsx'; 
import MyBookings from "./pages/MyBookings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from './pages/NotFound';

const Layout = () => {
  const location = useLocation();

 
  const noLayoutRoutes = [
    "/",
    "/register",
    "/forgot-password",
    "/reset-password/"
  ];

  const hideLayout =
    noLayoutRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password/") ||
    // Hide if NotFound page (no matching route)
    ![
      "/", "/register", "/forgot-password",
      "/reset-password/:token", "/home", "/event/:id",
      "/booking/:id", "/thank-you", "/admin-dashboard",
      "/my-bookings", "/about", "/contact", "/services",
      "/admin-login"
    ].some(path => matchPath(path, location.pathname));

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="content">
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </>
  );
};



function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
