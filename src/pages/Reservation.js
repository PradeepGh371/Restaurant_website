import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { formatNepaliCurrency } from '../utils/nepaliFormat';
import { useAuth } from '../context/AuthContext'; // Add this import

const API = 'http://localhost:5000/api';

const Reservation = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedRoomNo, setSelectedRoomNo] = useState('');
  const [rooms, setRooms] = useState([]);
  const { user } = useAuth(); // Add this line to get the authenticated user
  const isAdmin = user && user.role === 'admin';
  
  // Fetch rooms from the API instead of hardcoding them
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API}/rooms`);
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    
    fetchRooms();
  }, []);
  
  const onSubmit = async (data) => {
    try {
      // Get the selected room's number
      const selectedRoom = rooms.find(r => r.type === selectedRoomType && r.number === selectedRoomNo);
      if (!selectedRoom) {
        alert('Please select a valid room');
        return;
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Use axios to post to the MySQL API with the token in headers
      await axios.post(`${API}/reservations`, {
        ...data,
        roomType: selectedRoomType,
        roomNo: selectedRoomNo
        // Remove the default check-out date line since we now have a real check-out field
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setIsSubmitted(true);
    } catch (error) {
      alert('There was an error submitting your reservation. Please try again.');
      console.error('API error:', error);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Book Your Stay" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 
            className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Book Your <span className="text-gold">Stay</span>
          </h1>
          <p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Reserve your perfect room and enjoy a luxurious experience at GrandVista Hotel
          </p>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          {isAdmin ? (
            <div className="text-center py-12">
              <div className="text-5xl text-gold mb-6">⚠️</div>
              <h2 className="text-3xl font-playfair font-bold text-navy mb-4">Admins cannot book rooms</h2>
              <p className="text-xl text-gray-700 mb-8">Room booking is only available for customers. Please log in as a customer to make a reservation.</p>
            </div>
          ) : isSubmitted ? (
            <div className="text-center py-12" data-aos="fade-up">
              <div className="text-5xl text-gold mb-6">✓</div>
              <h2 className="text-3xl font-playfair font-bold text-navy mb-4">Reservation Confirmed!</h2>
              <p className="text-xl text-gray-700 mb-8">Thank you for choosing GrandVista Hotel. Your reservation has been received.</p>
              <p className="text-gray-700 mb-8">A confirmation email has been sent to your email address with all the details of your reservation.</p>
              <button 
                onClick={() => setIsSubmitted(false)} 
                className="btn btn-primary"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Room Selection */}
              <div className="lg:w-1/2" data-aos="fade-right">
                <h2 className="section-title text-left">Select Your Room</h2>
                <p className="text-gray-700 mb-8">
                  Choose from our selection of elegantly designed rooms and suites, each offering comfort and luxury.
                </p>
                
                <div className="space-y-6">
                  {rooms.map((room) => (
                    <div 
                      key={room.id}
                      className={`border rounded-lg overflow-hidden transition-all duration-300 ${selectedRoomType === room.type ? 'border-gold shadow-md' : 'border-gray-200 hover:border-gold'}`}
                      onClick={() => setSelectedRoomType(room.type)}
                    >
                      <div className="md:w-full p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-navy">{room.type}</h3>
                          <div className="text-gold font-bold">{formatNepaliCurrency(room.price)}</div>
                        </div>
                        <p className="text-gray-700 mb-4">{room.description}</p>
                        <div className="flex items-center text-gray-600 text-sm">
                          <span className="mr-4">Max Guests: {room.capacity}</span>
                          <span>Free WiFi</span>
                        </div>
                        <div className="mt-4">
                          <button 
                            className={`px-4 py-2 rounded-md transition-colors ${selectedRoomType === room.type ? 'bg-gold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {selectedRoomType === room.type ? 'Selected' : 'Select Room'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reservation Form */}
              <div className="lg:w-1/2" data-aos="fade-left">
                <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-playfair font-bold text-navy mb-6">Complete Your Reservation</h3>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="checkIn" className="block text-gray-700 mb-2">Check-in Date</label>
                        <input 
                          type="date" 
                          id="checkIn"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.checkIn ? 'border-red-500' : 'border-gray-300'}`}
                          {...register('checkIn', { required: 'Check-in date is required' })}
                        />
                        {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="checkOut" className="block text-gray-700 mb-2">Check-out Date</label>
                        <input 
                          type="date" 
                          id="checkOut"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.checkOut ? 'border-red-500' : 'border-gray-300'}`}
                          {...register('checkOut', { required: 'Check-out date is required' })}
                        />
                        {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut.message}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="adults" className="block text-gray-700 mb-2">Adults</label>
                        <select 
                          id="adults"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.adults ? 'border-red-500' : 'border-gray-300'}`}
                          {...register('adults', { required: 'Number of adults is required' })}
                        >
                          <option value="">Select</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                        {errors.adults && <p className="text-red-500 text-sm mt-1">{errors.adults.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="children" className="block text-gray-700 mb-2">Children</label>
                        <select 
                          id="children"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                          {...register('children')}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Room type selection */}
                    <div className="mb-4">
                      <label htmlFor="roomType" className="block text-gray-700 mb-2">Room Type</label>
                      <select
                        id="roomType"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.roomType ? 'border-red-500' : 'border-gray-300'}`}
                        value={selectedRoomType}
                        onChange={e => { setSelectedRoomType(e.target.value); setSelectedRoomNo(''); }}
                        required
                      >
                        <option value="">Select Room Type</option>
                        {[...new Set(rooms.map(r => r.type))].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType.message}</p>}
                    </div>
                    {/* Room number selection (filtered by type) */}
                    {selectedRoomType && (
                      <div className="mb-4">
                        <label htmlFor="roomNo" className="block text-gray-700 mb-2">Room Number</label>
                        <select
                          id="roomNo"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.roomNo ? 'border-red-500' : 'border-gray-300'}`}
                          value={selectedRoomNo}
                          onChange={e => setSelectedRoomNo(e.target.value)}
                          required
                        >
                          <option value="">Select Room Number</option>
                          {rooms.filter(r => r.type === selectedRoomType).map(room => (
                            <option key={room.id} value={room.number}>{room.number}</option>
                          ))}
                        </select>
                        {errors.roomNo && <p className="text-red-500 text-sm mt-1">{errors.roomNo.message}</p>}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
                        <input 
                          type="text" 
                          id="firstName"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                          {...register('firstName', { required: 'First name is required' })}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                          {...register('lastName', { required: 'Last name is required' })}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        {...register('phone', { required: 'Phone number is required' })}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="specialRequests" className="block text-gray-700 mb-2">Special Requests (Optional)</label>
                      <textarea 
                        id="specialRequests"
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                        placeholder="Any special requests or preferences..."
                        {...register('specialRequests')}
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary w-full"
                      disabled={!selectedRoomType || !selectedRoomNo}
                    >
                      Complete Reservation
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Reservation;