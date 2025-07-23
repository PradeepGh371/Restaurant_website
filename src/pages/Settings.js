import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaBell, FaSave, FaCog } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({ name: res.data.user.name, email: res.data.user.email });
      } catch (err) {
        // fallback to AuthContext user if fetch fails
        setProfile({ name: user?.name || '', email: user?.email || '' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-lg text-navy">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8 flex items-center gap-2">
          <FaCog className="text-gold" />
          Settings
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
            <FaUser className="text-gold" />
            Profile Info
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <FaUser className="text-lg text-gold" />
              <input type="text" className="input w-full" placeholder="Full Name" value={profile.name} readOnly />
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-lg text-gold" />
              <input type="email" className="input w-full" placeholder="Email" value={profile.email} readOnly />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
            <FaLock className="text-gold" />
            Change Password
          </h2>
          <form className="flex flex-col gap-4">
            <input type="password" className="input" placeholder="Current Password" />
            <input type="password" className="input" placeholder="New Password" />
            <input type="password" className="input" placeholder="Confirm New Password" />
            <button className="btn btn-primary mt-2 flex items-center gap-2 self-end">
              <FaSave />
              Save Changes
            </button>
          </form>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
            <FaBell className="text-gold" />
            Notifications
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-gold" defaultChecked />
              Email me about new bookings
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-gold" />
              Email me about system updates
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 