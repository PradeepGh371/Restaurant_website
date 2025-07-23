import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Admin = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API}/reservations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(response.data);
      } catch (error) {
        alert('Failed to fetch reservations.');
        console.error(error);
      }
      setLoading(false);
    };
    fetchReservations();
  }, []);

  return (
    <section className="section bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="section-title mb-8">Admin Dashboard</h1>
        <h2 className="text-xl font-bold mb-4">Reservations</h2>
        {loading ? (
          <div>Loading...</div>
        ) : reservations.length === 0 ? (
          <div>No reservations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">Room</th>
                  <th className="py-2 px-4">Check-in</th>
                  <th className="py-2 px-4">Check-out</th>
                  <th className="py-2 px-4">Adults</th>
                  <th className="py-2 px-4">Children</th>
                  <th className="py-2 px-4">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{r.firstName} {r.lastName}</td>
                    <td className="py-2 px-4">{r.email}</td>
                    <td className="py-2 px-4">{r.phone}</td>
                    <td className="py-2 px-4">{r.roomType}</td>
                    <td className="py-2 px-4">{r.checkIn}</td>
                    <td className="py-2 px-4">{r.checkOut}</td>
                    <td className="py-2 px-4">{r.adults}</td>
                    <td className="py-2 px-4">{r.children}</td>
                    <td className="py-2 px-4">{r.timestamp && r.timestamp.toDate ? r.timestamp.toDate().toLocaleString() : (r.timestamp?.seconds ? new Date(r.timestamp.seconds * 1000).toLocaleString() : '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Admin;