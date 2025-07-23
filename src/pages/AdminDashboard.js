import React, { useEffect, useState } from 'react';
import { 
  FaBed, FaUserShield, FaUser, FaEdit, FaTrash, FaCheckCircle, 
  FaTimesCircle, FaPlus, FaCalendarAlt, FaDollarSign, FaUsers, 
  FaCog, FaChartLine, FaClock, FaCheck, FaTimes, FaEye, FaEyeSlash,
  FaSignOutAlt, FaUserPlus, FaHotel
} from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  // Add loading and error states for customers and bookings
  const [customersLoading, setCustomersLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [customersError, setCustomersError] = useState(null);
  const [bookingsError, setBookingsError] = useState(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [editUser, setEditUser] = useState(null);
  // Remove 'name' from roomForm state
  const [roomForm, setRoomForm] = useState({
    number: '',
    type: '',
    price: '',
    facilities: [],
    description: ''
  });
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  // Add state for selected room type and room number in customerForm
  const [customerForm, setCustomerForm] = useState({
    checkIn: '',
    adults: '',
    children: '',
    roomType: '',
    roomNo: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [customers, setCustomers] = useState([]);
  // Add state for reservations
  const [reservations, setReservations] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchRooms();
    fetchUsers();
    fetchBookings();
  }, []);

  // Fetch reservations for bookings section with loading and error handling
  useEffect(() => {
    if (activeTab === 'bookings') {
      setBookingsLoading(true);
      setBookingsError(null);
      
      axios.get(`${API}/admin/all-bookings`, { headers })
        .then(res => {
          setBookings(res.data);
          setBookingsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching bookings:', err);
          setBookingsError('Failed to load booking data. Please try again.');
          setBookingsLoading(false);
        });
    }
  }, [activeTab]);

  // Fetch customers for customers section with loading and error handling
  useEffect(() => {
    if (activeTab === 'users') {
      setCustomersLoading(true);
      setCustomersError(null);
      
      axios.get(`${API}/admin/users/customers`, { headers })
        .then(res => {
          setCustomers(res.data);
          setCustomersLoading(false);
        })
        .catch(err => {
          console.error('Error fetching customers:', err);
          setCustomersError('Failed to load customer data. Please try again.');
          setCustomersLoading(false);
        });
    }
  }, [activeTab]);

  async function fetchRooms() {
    try {
    const res = await axios.get(`${API}/rooms`);
    setRooms(res.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }

  async function fetchUsers() {
    try {
    const res = await axios.get(`${API}/admin/users`, { headers });
    setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async function fetchBookings() {
    try {
    const res = await axios.get(`${API}/bookings`, { headers });
    setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }

  async function handleRoomSubmit(e) {
    e.preventDefault();
    const payload = {
      number: roomForm.number,
      type: roomForm.type,
      price: roomForm.price,
      facilities: Array.isArray(roomForm.facilities) ? roomForm.facilities.join(',') : '',
      description: roomForm.description
    };
    try {
    if (editRoom) {
      await axios.put(`${API}/rooms/${editRoom.id}`, payload, { headers });
        setMessage('Room updated successfully!');
    } else {
      await axios.post(`${API}/rooms`, payload, { headers });
        setMessage('Room added successfully!');
    }
    setShowRoomForm(false);
    setEditRoom(null);
      setRoomForm({ number: '', type: '', price: '', facilities: [], description: '' });
    fetchRooms();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  }

  async function handleUserSubmit(e) {
    e.preventDefault();
    try {
      if (editUser) {
        await axios.put(`${API}/admin/users/${editUser.id}`, userForm, { headers });
        setMessage('User updated successfully!');
      } else {
        await axios.post(`${API}/admin/users`, userForm, { headers });
        setMessage('User added successfully!');
      }
      setShowUserForm(false);
      setEditUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'customer' });
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  }

  async function handleRoomDelete(id) {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
    await axios.delete(`${API}/rooms/${id}`, { headers });
    fetchRooms();
        setMessage('Room deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting room');
      }
    }
  }

  async function handleBookingStatus(id, status) {
    try {
      await axios.put(`${API}/bookings/${id}`, { status }, { headers });
      fetchBookings();
      setMessage(`Booking ${status} successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating booking status');
    }
  }

  // Add this function to handle confirming walk-in bookings
  async function handleConfirmReservation(id) {
    try {
      await axios.patch(`${API}/reservations/${id}/status`, { status: 'accepted' }, { headers });
      // Refresh bookings
      if (activeTab === 'bookings') {
        setBookingsLoading(true);
        axios.get(`${API}/admin/all-bookings`, { headers })
          .then(res => {
            setBookings(res.data);
            setBookingsLoading(false);
          })
          .catch(err => {
            setBookingsError('Failed to load booking data. Please try again.');
            setBookingsLoading(false);
          });
      }
      setMessage('Reservation confirmed!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error confirming reservation');
    }
  }

  function startEditRoom(room) {
    setEditRoom(room);
    setRoomForm({
      number: room.number || '',
      type: room.type || '',
      price: room.price,
      facilities: room.facilities || [],
      description: room.description || ''
    });
    setShowRoomForm(true);
  }

  function startEditUser(user) {
    setEditUser(user);
    setUserForm({ name: user.name, email: user.email, password: '', role: user.role });
    setShowUserForm(true);
  }

  // Calculate dashboard statistics
  const totalEarnings = bookings
    .filter(b => (b.status === 'accepted' || b.status === 'confirmed'))
    .reduce((sum, b) => {
      if (b.total_price) {
        return sum + parseFloat(b.total_price || 0);
      } else if (b.source === 'Walk-in') {
        // Find the room by number and type
        const room = rooms.find(r => r.number === b.room_no && r.type === b.room_type);
        return sum + (room ? parseFloat(room.price) : 0);
      }
      return sum;
    }, 0);

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalRooms = rooms.length;
  const totalUsers = users.length;

  // --- Room Card SVGs and Icons ---
  const facilityIcons = {
    WiFi: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M2 8.82A16 16 0 0 1 12 5c3.5 0 6.8 1.1 9.5 3.13" stroke="#0a1f44" strokeWidth="1.5" strokeLinecap="round"/><path d="M5.5 12.5A11 11 0 0 1 12 10.5c2.3 0 4.5.7 6.5 2" stroke="#0a1f44" strokeWidth="1.5" strokeLinecap="round"/><path d="M8.5 16A6 6 0 0 1 12 15c1.2 0 2.3.3 3.5 1" stroke="#0a1f44" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="19" r="1.5" fill="#d4af37"/></svg>,
    Parking: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="3" stroke="#0a1f44" strokeWidth="1.5"/><circle cx="7.5" cy="17.5" r="1.5" fill="#d4af37"/><circle cx="16.5" cy="17.5" r="1.5" fill="#d4af37"/></svg>,
    Breakfast: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="4" stroke="#0a1f44" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="3" ry="1.5" fill="#d4af37"/></svg>,
    AC: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" stroke="#0a1f44" strokeWidth="1.5"/><path d="M8 17v2M12 17v2M16 17v2" stroke="#d4af37" strokeWidth="1.5"/></svg>,
    TV: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" stroke="#0a1f44" strokeWidth="1.5"/><path d="M8 20h8" stroke="#d4af37" strokeWidth="1.5"/></svg>,
    'Mini Bar': <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2" stroke="#0a1f44" strokeWidth="1.5"/><path d="M12 7v6" stroke="#d4af37" strokeWidth="1.5"/></svg>
  };
  const roomFallbackSVG = <svg width="100%" height="100%" viewBox="0 0 64 48" fill="none"><rect width="64" height="48" rx="8" fill="#f5e199"/><rect x="8" y="24" width="48" height="16" rx="4" fill="#fff"/><rect x="16" y="16" width="32" height="16" rx="4" fill="#d4af37"/></svg>;

  // --- Room Type SVGs ---
  const roomTypeSVGs = {
    Standard: <svg width="64" height="48" viewBox="0 0 64 48" fill="none"><rect width="64" height="48" rx="8" fill="#e0e7ff"/><rect x="10" y="28" width="44" height="10" rx="3" fill="#fff"/><rect x="18" y="18" width="28" height="14" rx="3" fill="#2563eb"/></svg>,
    Deluxe: <svg width="64" height="48" viewBox="0 0 64 48" fill="none"><rect width="64" height="48" rx="8" fill="#f5e199"/><rect x="8" y="26" width="48" height="12" rx="4" fill="#fff"/><rect x="16" y="16" width="32" height="16" rx="4" fill="#d4af37"/></svg>,
    Exclusive: <svg width="64" height="48" viewBox="0 0 64 48" fill="none"><rect width="64" height="48" rx="8" fill="#ede9fe"/><rect x="12" y="30" width="40" height="8" rx="3" fill="#fff"/><rect x="20" y="18" width="24" height="14" rx="3" fill="#a21caf"/></svg>,
    Presidential: <svg width="64" height="48" viewBox="0 0 64 48" fill="none"><rect width="64" height="48" rx="8" fill="#fff7ed"/><rect x="8" y="24" width="48" height="14" rx="4" fill="#fff"/><rect x="16" y="12" width="32" height="20" rx="4" fill="#ea580c"/></svg>
  };

  // --- Room Type Images ---
  const roomTypeImages = {
    Standard: 'https://miro.medium.com/v2/resize:fit:1400/1*X1K4Zi_mTg94imnWW-zfUw.jpeg',
    Deluxe: 'https://www.ohotelsindia.com/pune/images/afac6de5e93b1d2018cc56a76528cdd2.jpg',
    Exclusive: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    Presidential: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  };

  // Group rooms by type
  const roomsByType = rooms.reduce((acc, room) => {
    acc[room.type] = acc[room.type] || [];
    acc[room.type].push(room);
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div className="logo">
          <FaHotel className="icon" />
          Admin<span style={{ color: '#d4af37', marginLeft: 2 }}>Hotel</span>Dashboard
        </div>
        {/* Removed Settings button from actions */}
      </div>

      {/* Navigation Tabs */}
      <div className="admin-dashboard-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: FaChartLine },
          { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
          { id: 'rooms', label: 'Rooms', icon: FaBed },
          { id: 'users', label: 'Users', icon: FaUsers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'active' : ''}
          >
            <tab.icon />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Statistics Cards */}
            <div className="dashboard-cards">
              <div className="dashboard-card earnings-card-pro">
                <div className="icon" style={{ background: 'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(251,191,36,0.15)' }}>
                  <FaDollarSign />
                </div>
                <div className="info">
                  <div className="label" style={{ color: '#bfa13a', fontWeight: 700, fontSize: '1.1em' }}>Total Earnings</div>
                  <div className="value" style={{ fontWeight: 800, fontSize: '2em', color: '#f59e42', letterSpacing: '1px' }}>NPR {totalEarnings.toLocaleString()}</div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="icon" style={{ background: '#e0e7ff', color: '#2563eb' }}>
                  <FaCalendarAlt />
                </div>
                <div className="info">
                  <div className="label">Pending Bookings</div>
                  <div className="value">{pendingBookings}</div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="icon" style={{ background: '#ede9fe', color: '#a21caf' }}>
                  <FaBed />
                </div>
                <div className="info">
                  <div className="label">Total Rooms</div>
                  <div className="value">{totalRooms}</div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <FaUsers />
                  </div>
                <div className="info">
                  <div className="label">Total Users</div>
                  <div className="value">{totalUsers}</div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="dashboard-table-container">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Dates</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="font-medium">{booking.user_name}</div>
                          <div className="text-xs text-gray-500">{booking.email}</div>
                        </td>
                        <td>{booking.room_name}</td>
                        <td className="text-xs text-gray-600">
                          {booking.check_in_date} - {booking.check_out_date}
                        </td>
                        <td className="font-semibold">NPR {booking.total_price}</td>
                        <td>
                          <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                        </td>
                        <td>
                          {booking.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleBookingStatus(booking.id, 'confirmed')}
                                className="btn btn-sm"
                                style={{ background: '#22c55e', color: '#fff' }}
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleBookingStatus(booking.id, 'cancelled')}
                                className="btn btn-sm btn-outline"
                                style={{ color: '#dc2626', borderColor: '#dc2626' }}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Booking Requests</h2>
              <div className="flex space-x-4">
                <button className="btn btn-secondary">Export</button>
                <button className="btn btn-primary">Filter</button>
              </div>
            </div>

            {bookingsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
              </div>
            ) : bookingsError ? (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {bookingsError}
                <button 
                  className="ml-2 underline" 
                  onClick={() => {
                    setBookingsError(null);
                    if (activeTab === 'bookings') {
                      setBookingsLoading(true);
                      axios.get(`${API}/admin/all-bookings`, { headers })
                        .then(res => {
                          setBookings(res.data);
                          setBookingsLoading(false);
                        })
                        .catch(err => {
                          console.error('Error fetching bookings:', err);
                          setBookingsError('Failed to load booking data. Please try again.');
                          setBookingsLoading(false);
                        });
                    }
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking, idx) => (
                        <tr key={booking.id || idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{booking.guest}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.room_no} ({booking.room_type})</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.check_in}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.check_out}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.total_price ? `NPR ${booking.total_price}` : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge status-${booking.status}`}>{booking.status === 'pending' ? 'Pending' : booking.status === 'accepted' ? 'Accepted' : (booking.status || '-')}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.source}
                            {booking.status === 'pending' && booking.source === 'Walk-in' && (
                              <button
                                className="ml-2 confirm-btn-pro"
                                onClick={() => handleConfirmReservation(booking.id)}
                              >
                                <FaCheck style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                Confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Rooms</h2>
              <button 
                className="btn btn-primary flex items-center gap-2"
                onClick={() => { setShowRoomForm(true); setEditRoom(null); setRoomForm({ number: '', type: '', price: '', facilities: [], description: '' }); }}
              >
                <FaPlus />
                Add Room
              </button>
            </div>

            {/* Room Cards Grid */}
            {Object.entries(roomsByType).map(([type, typeRooms]) => (
              <div key={type} className="mb-8">
                <h3 className="text-lg font-bold text-gold mb-4">{type} Rooms</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {typeRooms.map(room => (
                    <div key={room.id} className="relative bg-white rounded-3xl shadow-lg border-t-4 border-gold flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl group overflow-hidden">
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold text-white text-xs font-bold shadow-md z-10">{room.type}</div>
                      <div className="px-6 pt-8 pb-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-block bg-gold/10 text-gold rounded-full p-2 shadow-sm">
                            <FaBed className="text-xl" />
                          </span>
                          <span className="text-lg font-bold text-navy tracking-wide">Room #{room.number}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaDollarSign className="text-gold" />
                          <span className="text-lg font-bold text-gold">NPR {room.price}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(Array.isArray(room.facilities) ? room.facilities : typeof room.facilities === 'string' ? room.facilities.split(',').map(f => f.trim()).filter(Boolean) : []).map(fac => (
                            <span key={fac} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gold/10 border border-gold/30 text-gold shadow-sm hover:bg-gold hover:text-white transition-all duration-150" title={fac}>
                              {facilityIcons[fac] || <FaCheckCircle className="text-gold" />}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm flex-1 mb-3 line-clamp-3 font-medium">{room.description}</p>
                        <div className="flex gap-2 mt-auto">
                          <button 
                            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-gold text-white font-semibold py-2 shadow hover:bg-[#bfa13a] transition-all duration-150"
                            title="Edit Room"
                            onClick={() => startEditRoom(room)}
                          >
                            <FaEdit className="text-lg" />
                            Edit
                          </button>
                          <button 
                            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-red-50 text-red-600 font-semibold py-2 border border-red-200 shadow hover:bg-red-100 transition-all duration-150"
                            title="Delete Room"
                            onClick={() => handleRoomDelete(room.id)}
                          >
                            <FaTrash className="text-lg" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add/Edit Room Modal */}
            {showRoomForm && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <FaBed className="text-3xl text-gold" />
                    <h3 className="text-2xl font-bold text-navy">{editRoom ? 'Edit Room' : 'Add New Room'}</h3>
                  </div>
                  <form onSubmit={handleRoomSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                      <input 
                        type="text" 
                        required 
                        value={roomForm.number}
                        onChange={e => setRoomForm(f => ({ ...f, number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                        placeholder="e.g. 101"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                      <select
                        required
                        value={roomForm.type}
                        onChange={e => setRoomForm(f => ({ ...f, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="">Select Type</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Exclusive">Exclusive</option>
                        <option value="Presidential">Presidential</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (NPR)</label>
                      <input 
                        type="number" 
                        required 
                        value={roomForm.price}
                        onChange={e => setRoomForm(f => ({ ...f, price: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                      <div className="flex flex-wrap gap-3">
                        {['WiFi', 'Parking', 'Breakfast', 'AC', 'TV', 'Mini Bar'].map(facility => (
                          <label key={facility} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full cursor-pointer">
                            <input
                              type="checkbox"
                              checked={roomForm.facilities.includes(facility)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setRoomForm(f => ({ ...f, facilities: [...f.facilities, facility] }));
                                } else {
                                  setRoomForm(f => ({ ...f, facilities: f.facilities.filter(fac => fac !== facility) }));
                                }
                              }}
                            />
                            {facilityIcons[facility] || <FaCheckCircle className="text-gold" />} <span>{facility}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        value={roomForm.description}
                        onChange={e => setRoomForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                        placeholder="Enter room description"
                        rows="3"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button type="submit" className="btn btn-primary flex-1">
                        {editRoom ? 'Update' : 'Add'} Room
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary flex-1"
                        onClick={() => setShowRoomForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
              <div className="flex gap-2">
                <button
                  className="btn btn-secondary flex items-center gap-2"
                  onClick={() => setShowCustomerForm(true)}
                >
                  <FaUserPlus />
                  Add Customer
                </button>
              </div>
            </div>
            {showCustomerForm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add Customer</h3>
                    <form className="space-y-4" onSubmit={async e => {
                      e.preventDefault();
                      try {
                        await axios.post('/api/reservations/admin-add', customerForm, { headers });
                        setShowCustomerForm(false);
                        setCustomerForm({
                          checkIn: '', adults: '', children: '', roomType: '', roomNo: '', firstName: '', lastName: '', email: '', phone: ''
                        });
                      } catch (err) {
                        alert('Failed to add customer: ' + (err.response?.data?.message || err.message));
                      }
                    }}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                        <input
                          type="date"
                          required
                          value={customerForm.checkIn}
                          onChange={e => setCustomerForm(f => ({ ...f, checkIn: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                          <select
                            required
                            value={customerForm.adults}
                            onChange={e => setCustomerForm(f => ({ ...f, adults: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                          >
                            <option value="">Select</option>
                            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                          <select
                            value={customerForm.children}
                            onChange={e => setCustomerForm(f => ({ ...f, children: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                          >
                            <option value="">Select</option>
                            {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                        <select
                          required
                          value={customerForm.roomType}
                          onChange={e => setCustomerForm(f => ({ ...f, roomType: e.target.value, roomNo: '' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                        >
                          <option value="">Select Room Type</option>
                          {[...new Set(rooms.map(r => r.type))].map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      {customerForm.roomType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                          <select
                            required
                            value={customerForm.roomNo}
                            onChange={e => setCustomerForm(f => ({ ...f, roomNo: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                          >
                            <option value="">Select Room Number</option>
                            {rooms.filter(r => r.type === customerForm.roomType).map(room => (
                              <option key={room.id} value={room.number}>{room.number}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            required
                            value={customerForm.firstName}
                            onChange={e => setCustomerForm(f => ({ ...f, firstName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            required
                            value={customerForm.lastName}
                            onChange={e => setCustomerForm(f => ({ ...f, lastName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={customerForm.email}
                          onChange={e => setCustomerForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={customerForm.phone}
                          onChange={e => setCustomerForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <button type="submit" className="btn btn-primary flex-1">
                          Add Customer
                        </button>
                        <button type="button" className="btn btn-secondary flex-1" onClick={() => setShowCustomerForm(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400">No customers found.</td>
                      </tr>
                    ) : (
                      customers.map((c, idx) => (
                        <tr key={c.id || idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{c.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{c.phone || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{c.created_at ? c.created_at.split('T')[0] : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{c.source}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{editUser ? 'Edit User' : 'Add New User'}</h3>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={userForm.name} 
                    onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={userForm.email} 
                    onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Enter email"
                  />
                </div>
                {!editUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      required 
                      value={userForm.password} 
                      onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Enter password"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                    value={userForm.role} 
                    onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editUser ? 'Update' : 'Add'} User
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary flex-1"
                    onClick={() => setShowUserForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;