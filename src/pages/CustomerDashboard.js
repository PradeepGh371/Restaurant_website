import React, { useEffect, useState } from 'react';
import { 
  FaBed, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaMedal, 
  FaStar, FaCrown, FaGem, FaTrophy, FaUserCircle, FaEnvelope, 
  FaCalendarCheck, FaRegSmileBeam, FaHistory, FaHotel, FaConciergeBell,
  FaPercent, FaShieldAlt, FaCreditCard, FaMapMarkerAlt, FaPhoneAlt,
  FaBell, FaCog, FaSignOutAlt, FaChartLine, FaComments, FaEdit
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API = 'http://localhost:5000/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
    // Simulate loading for smoother animations
    setTimeout(() => setLoading(false), 800);
    // Simulate notifications
    setNotifications([
      { id: 1, message: 'Your booking has been confirmed!', date: '2023-10-15', read: false },
      { id: 2, message: 'Special 20% discount on your next booking', date: '2023-10-10', read: true },
      { id: 3, message: 'Welcome to our loyalty program!', date: '2023-10-05', read: true }
    ]);
  }, []);

  async function fetchBookings() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      setLoading(true);
      setError(null);
      
      // Fetch bookings first to ensure we have some data
      const bookingsPromise = axios.get(`${API}/bookings/my`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // First, just get the bookings in case the reservations endpoint fails
      const bookingsRes = await bookingsPromise;
      const bookingsData = bookingsRes.data.map(b => ({
        ...b,
        source: 'booking'
      }));
      
      // Set initial data with just bookings
      setBookings(bookingsData);
      
      try {
        // Now try to get reservations
        const reservationsRes = await axios.get(`${API}/reservations/my`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        // If successful, map and combine with bookings
        if (reservationsRes.data && Array.isArray(reservationsRes.data)) {
          const reservationsData = reservationsRes.data.map(r => ({
            id: r.id,
            room_id: r.room_id,
            room_number: r.room_no,
            room_type: r.room_type,
            check_in_date: r.check_in,
            check_out_date: r.check_out,
            total_price: r.room_price || 0, // Default to 0 if not provided
            status: r.status,
            created_at: r.created_at,
            source: 'reservation',
            special_requests: r.special_requests || ''
          }));
          
          // Combine both data sources
          setBookings([...bookingsData, ...reservationsData]);
        }
      } catch (reservationErr) {
        console.error('Error fetching reservations:', reservationErr);
        // We already have bookings data, so just log the error
        // but don't show it to the user unless there are no bookings
        if (bookingsData.length === 0) {
          setError('Failed to load your bookings and reservations. Please try again.');
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again.');
      setLoading(false);
    }
  }

  // Calculate stats
  const totalBookings = bookings.length;
  const accepted = bookings.filter(b => b.status === 'confirmed' || b.status === 'accepted').length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Tier system
  const tiers = [
    { name: 'Bronze', min: 0, max: 2, color: '#cd7f32', icon: <FaMedal style={{ color: '#cd7f32' }} /> },
    { name: 'Silver', min: 3, max: 5, color: '#bfc1c2', icon: <FaMedal style={{ color: '#bfc1c2' }} /> },
    { name: 'Gold', min: 6, max: 9, color: '#ffd700', icon: <FaStar style={{ color: '#ffd700' }} /> },
    { name: 'Platinum', min: 10, max: 14, color: '#e5e4e2', icon: <FaCrown style={{ color: '#e5e4e2' }} /> },
    { name: 'Diamond', min: 15, max: Infinity, color: '#b9f2ff', icon: <FaGem style={{ color: '#b9f2ff' }} /> },
  ];
  
  const currentTier = tiers.find(t => accepted >= t.min && accepted <= t.max) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progressToNext = nextTier ? Math.min(100, Math.round(((accepted - currentTier.min) / (nextTier.min - currentTier.min)) * 100)) : 100;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  // Tab content components
  const renderOverview = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Profile & Tier Overview */}
      <motion.section variants={itemVariants} className="mb-8">
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center gap-10 border-b-4 transition-all hover:shadow-3xl" 
          style={{ borderColor: currentTier.color, boxShadow: '0 8px 32px rgba(80,80,120,0.10)' }}
          whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(80,80,120,0.15)' }}
        >
          <motion.div 
            className="flex-shrink-0 w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-blue-100 flex items-center justify-center text-6xl font-bold relative shadow-lg"
            whileHover={{ scale: 1.05 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <FaUserCircle style={{ color: currentTier.color, fontSize: '4.5rem', position: 'absolute', top: 10, left: 10, opacity: 0.15 }} />
            {user?.name ? user.name[0].toUpperCase() : '?'}
            <motion.span 
              className="absolute -bottom-2 -right-2 text-4xl"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              {currentTier.icon}
            </motion.span>
          </motion.div>
          <div className="flex-1">
            <motion.h2 
              className="text-2xl font-bold text-navy mb-1 flex items-center gap-2 font-poppins"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user?.name} 
              <motion.span 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white font-semibold shadow"
                style={{ background: currentTier.color }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {currentTier.name} Tier
              </motion.span>
            </motion.h2>
            <motion.div 
              className="text-gray-600 mb-1 flex items-center gap-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FaEnvelope className="text-gold" />{user?.email}
            </motion.div>
            <motion.div 
              className="flex gap-4 mt-2 mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm font-semibold text-navy flex items-center gap-2">
                <FaCalendarCheck className="text-gold" />Total Bookings: {totalBookings}
              </div>
              <div className="bg-green-50 rounded-lg px-4 py-2 text-sm font-semibold text-green-700">
                Accepted: {accepted}
              </div>
              <div className="bg-yellow-50 rounded-lg px-4 py-2 text-sm font-semibold text-yellow-700">
                Pending: {pending}
              </div>
            </motion.div>
            {/* Tier Progress Bar */}
            {nextTier && (
              <motion.div 
                className="mt-2"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: currentTier.color }}>{currentTier.name}</span>
                  <span style={{ color: nextTier.color }}>{nextTier.name}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    style={{ 
                      width: `${progressToNext}%`, 
                      background: `linear-gradient(90deg, ${currentTier.color} 0%, ${nextTier.color} 100%)`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
                    }} 
                    className="h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {accepted - currentTier.min} / {nextTier.min - currentTier.min} bookings to {nextTier.name} tier
                </div>
              </motion.div>
            )}
            {!nextTier && (
              <motion.div 
                className="mt-2 text-xs text-blue-600 font-bold flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <FaTrophy /> You are at the highest tier!
              </motion.div>
            )}
          </div>
        </motion.div>
        {/* Tier Benefits */}
        <motion.div 
          className="mt-6 bg-gradient-to-r from-gold/10 to-blue-50 rounded-2xl p-8 shadow flex flex-col md:flex-row gap-8 items-center"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(80,80,120,0.15)' }}
        >
          <div className="flex-1">
            <h3 className="font-semibold text-navy mb-2 font-poppins">Tier Benefits</h3>
            <ul className="text-gray-700 text-sm space-y-1 font-poppins">
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <b>Bronze:</b> Basic booking access
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <b>Silver:</b> Early check-in (subject to availability)
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <b>Gold:</b> Free breakfast on every stay
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <b>Platinum:</b> Free room upgrade (if available)
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <b>Diamond:</b> VIP support & exclusive offers
              </motion.li>
            </ul>
          </div>
          <motion.div 
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
          >
            <span className="text-5xl">{currentTier.icon}</span>
            <span className="font-bold text-lg" style={{ color: currentTier.color }}>{currentTier.name}</span>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Cards */}
      <motion.section variants={itemVariants} className="mb-8">
        <h2 className="dashboard-section-title mb-4 font-poppins">Your Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4"
            whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(80,80,120,0.15)' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">
              <FaHotel />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Stays</div>
              <div className="text-2xl font-bold text-navy">{accepted}</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4"
            whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(80,80,120,0.15)' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">
              <FaPercent />
            </div>
            <div>
              <div className="text-sm text-gray-500">Loyalty Points</div>
              <div className="text-2xl font-bold text-navy">{accepted * 100}</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4"
            whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(80,80,120,0.15)' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl">
              <FaShieldAlt />
            </div>
            <div>
              <div className="text-sm text-gray-500">Member Since</div>
              <div className="text-2xl font-bold text-navy">2023</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Booked Rooms List */}
      <motion.section variants={itemVariants} className="mb-8">
        <h2 className="dashboard-section-title mb-4 font-poppins">Your Recent Bookings</h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div 
              className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : error ? (
          <motion.div 
            className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>{error}</div>
            <button 
              onClick={fetchBookings}
              className="px-4 py-2 bg-white rounded-lg text-red-600 font-medium shadow-sm hover:bg-red-50"
            >
              Retry
            </button>
          </motion.div>
        ) : bookings.length === 0 ? (
          <motion.div 
            className="bg-white rounded-xl shadow p-8 text-center text-gray-500 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FaBed className="text-5xl text-gray-300" />
            <p>You have not booked any rooms yet.</p>
            <button 
              onClick={() => navigate('/rooms')}
              className="px-6 py-2 bg-gold text-white rounded-lg font-medium shadow-md hover:bg-gold/90 transition-all"
            >
              Browse Rooms
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((b, index) => (
              <motion.div 
                key={b.id} 
                className="booking-card-pro bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4 p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: '0 12px 40px rgba(80,80,120,0.15)',
                  borderColor: currentTier.color 
                }}
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br from-gold/10 to-blue-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src={b.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'} 
                    alt={b.room_name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-navy mb-1 flex items-center gap-2 font-poppins">
                    <FaBed className="text-gold" />{b.room_name || `Room ${b.room_no}`}
                  </h3>
                  <div className="text-gray-600 mb-1 flex items-center gap-2">
                    <FaCalendarAlt className="text-gold" />
                    {b.check_in} to {b.check_out}
                  </div>
                  <div className="text-sm mb-2">
                    Status: 
                    {b.status === 'accepted' ? (
                      <span className="text-green-600 flex items-center gap-1 inline-block ml-1">
                        <FaCheckCircle />Accepted
                      </span>
                    ) : b.status === 'rejected' ? (
                      <span className="text-red-600 flex items-center gap-1 inline-block ml-1">
                        <FaTimesCircle />Rejected
                      </span>
                    ) : (
                      <span className="text-orange-600 inline-block ml-1">Pending</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-gold font-bold text-lg">
                    {b.total_price ? `NPR ${b.total_price}` : ''}
                  </div>
                  <div className="text-xs text-gray-400">
                    Booked on {b.created_at ? b.created_at.split('T')[0] : '-'}
                  </div>
                  <button 
                    className="px-4 py-1.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-gold transition-colors"
                    onClick={() => navigate(`/bookings/${b.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
            {bookings.length > 3 && (
              <motion.div 
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="px-6 py-2 bg-white border border-gold text-gold rounded-lg font-medium hover:bg-gold hover:text-white transition-all"
                >
                  View All Bookings
                </button>
              </motion.div>
            )}
          </div>
        )}
      </motion.section>

      {/* Support/Contact Info */}
      <motion.section variants={itemVariants} className="mb-8">
        <motion.div 
          className="bg-gradient-to-r from-navy to-blue-800 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 text-white"
          whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(80,80,120,0.25)' }}
        >
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2 font-poppins">Need Help?</h2>
            <div className="mb-4 opacity-90">Our concierge service is available 24/7 to assist with your bookings and inquiries.</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gold" />
                <span className="font-semibold">support@grandvista.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-gold" />
                <span className="font-semibold">+977-9800000000</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gold" />
                <span className="font-semibold">123 Luxury Lane, Kathmandu</span>
              </div>
            </div>
          </div>
          <motion.div 
            className="flex-shrink-0 w-32 h-32 rounded-full bg-white/10 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <FaConciergeBell className="text-6xl text-gold" />
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  );

  const renderBookings = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h2 className="dashboard-section-title font-poppins">All Your Bookings</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 flex items-center gap-2 hover:bg-gray-50">
            <FaHistory /> Filter
          </button>
          <button className="px-4 py-2 bg-gold text-white rounded-lg flex items-center gap-2 hover:bg-gold/90">
            <FaBed /> New Booking
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <motion.div 
            className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : error ? (
        <motion.div 
          className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl flex items-center justify-between"
          variants={itemVariants}
        >
          <div>{error}</div>
          <button 
            onClick={fetchBookings}
            className="px-4 py-2 bg-white rounded-lg text-red-600 font-medium shadow-sm hover:bg-red-50"
          >
            Retry
          </button>
        </motion.div>
      ) : bookings.length === 0 ? (
        <motion.div 
          className="bg-white rounded-xl shadow p-8 text-center text-gray-500 flex flex-col items-center gap-4"
          variants={itemVariants}
        >
          <FaBed className="text-5xl text-gray-300" />
          <p>You have not booked any rooms yet.</p>
          <button 
            onClick={() => navigate('/rooms')}
            className="px-6 py-2 bg-gold text-white rounded-lg font-medium shadow-md hover:bg-gold/90 transition-all"
          >
            Browse Rooms
          </button>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, idx) => (
                  <motion.tr 
                    key={booking.id || idx} 
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaBed className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.room_type} Room</div>
                          <div className="text-sm text-gray-500">Room {booking.room_number || booking.room_no}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(booking.check_in_date || booking.check_in).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(booking.check_out_date || booking.check_out).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Rs. {booking.total_price || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' || booking.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status === 'confirmed' || booking.status === 'accepted' ? 'Confirmed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.source === 'booking' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {booking.source === 'booking' ? 'Online Booking' : 'Reservation'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => navigate(`/booking/${booking.id}`)}
                        className="text-gold hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h2 className="dashboard-section-title font-poppins">Your Profile</h2>
        <button className="px-4 py-2 bg-gold text-white rounded-lg flex items-center gap-2 hover:bg-gold/90">
          <FaEdit /> Edit Profile
        </button>
      </motion.div>

      <motion.div 
        variants={itemVariants} 
        className="bg-white rounded-xl shadow-lg p-8"
        whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(80,80,120,0.15)' }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-blue-100 flex items-center justify-center text-6xl font-bold relative shadow-lg">
            {user?.name ? user.name[0].toUpperCase() : '?'}
            <span className="absolute -bottom-2 -right-2 text-4xl">{currentTier.icon}</span>
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <div className="mt-1 text-lg font-semibold text-navy">{user?.name || 'Guest User'}</div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
              <div className="mt-1 text-lg font-semibold text-navy">{user?.email || 'guest@example.com'}</div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Member Status</h3>
              <div className="mt-1 flex items-center gap-2">
                <span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-white font-semibold shadow"
                  style={{ background: currentTier.color }}
                >
                  {currentTier.name} Tier
                </span>
                <span className="text-gray-500 text-sm">({accepted} completed stays)</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Loyalty Points</h3>
              <div className="mt-1 text-lg font-semibold text-gold">{accepted * 100} points</div>
            </div>
          </div>
          
          <div className="md:border-l md:pl-8 space-y-4 flex flex-col items-center md:items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 text-center md:text-left">Account Actions</h3>
            </div>
            
            <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-navy flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <FaCreditCard className="text-gold" /> Payment Methods
            </button>
            
            <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-navy flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <FaCog className="text-gold" /> Account Settings
            </button>
            
            <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-navy flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <FaShieldAlt className="text-gold" /> Privacy & Security
            </button>
            
            <button className="w-full px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 flex items-center gap-2 hover:bg-red-100 transition-colors mt-4">
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="dashboard-bg min-h-screen py-10 px-4 mt-24 animate-fadeIn" style={{ fontFamily: 'Inter, Poppins, sans-serif', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* SVG Backgrounds */}
      <svg style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} width="100%" height="180" viewBox="0 0 1440 320"><path fill="#fbbf24" fillOpacity="0.08" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      <svg style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 0 }} width="100%" height="120" viewBox="0 0 1440 320"><path fill="#2563eb" fillOpacity="0.07" d="M0,288L60,272C120,256,240,224,360,197.3C480,171,600,149,720,154.7C840,160,960,192,1080,197.3C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
      
      {/* Dashboard Header */}
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white text-2xl shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <FaRegSmileBeam />
            </motion.div>
            <h1 className="text-3xl font-bold text-navy">
              Welcome, <span className="text-gold">{user?.name || 'Guest'}</span>!
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.div 
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button 
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-navy shadow-md hover:bg-gray-50 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-navy">Notifications</h3>
                      <button className="text-xs text-gold hover:underline">Mark all as read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No notifications</div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex gap-3 items-start">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notification.read ? 'bg-gold text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <FaBell className="text-sm" />
                              </div>
                              <div className="flex-1">
                                <div className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>{notification.message}</div>
                                <div className="text-xs text-gray-500 mt-1">{notification.date}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 text-center">
                      <button className="text-sm text-navy hover:text-gold">View All</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-navy shadow-md hover:bg-gray-50">
                <FaCog />
              </button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Navigation Tabs */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg mb-8 p-2 flex justify-between overflow-x-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[
            { id: 'overview', label: 'Overview', icon: FaChartLine },
            { id: 'bookings', label: 'My Bookings', icon: FaCalendarAlt },
            { id: 'profile', label: 'Profile', icon: FaUserCircle },
            { id: 'support', label: 'Support', icon: FaComments },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-gold text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={fadeInVariants.hidden}
            animate={fadeInVariants.visible}
            exit={fadeInVariants.hidden}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'support' && (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
                  <FaComments className="text-6xl text-gold" />
                  <h2 className="text-2xl font-bold text-navy">Support Center</h2>
                  <p className="text-gray-600 max-w-lg mx-auto">Our support team is here to help you with any questions or issues you may have. Please fill out the form below and we'll get back to you as soon as possible.</p>
                  
                  <div className="w-full max-w-lg mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" placeholder="How can we help you?" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent h-32" placeholder="Please describe your issue in detail"></textarea>
                    </div>
                    
                    <button className="w-full px-6 py-3 bg-gold text-white rounded-lg font-medium shadow-md hover:bg-gold/90 transition-all flex items-center justify-center gap-2">
                      <FaComments /> Send Message
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerDashboard;