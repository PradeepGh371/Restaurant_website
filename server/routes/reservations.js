const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
}

// Create a new reservation
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, checkIn, checkOut, adults, children, roomType, roomNo, specialRequests } = req.body;
  
  if (!firstName || !lastName || !email || !phone || !checkIn || !adults || !roomType || !roomNo) {
    return res.status(400).json({ message: 'Required fields missing.' });
  }
  
  try {
    // First, create or update the customer
    let customer_id;
    const [existingCustomers] = await pool.query('SELECT id FROM customers WHERE email = ? AND phone = ?', [email, phone]);
    
    if (existingCustomers.length > 0) {
      customer_id = existingCustomers[0].id;
      // Update existing customer
      await pool.query(
        'UPDATE customers SET first_name=?, last_name=?, check_in=?, room_type=?, room_no=?, adults=?, children=? WHERE id=?',
        [firstName, lastName, checkIn, roomType, roomNo, adults, children || 0, customer_id]
      );
    } else {
      // Create new customer
      const [result] = await pool.query(
        'INSERT INTO customers (first_name, last_name, email, phone, check_in, room_type, room_no, adults, children) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, phone, checkIn, roomType, roomNo, adults, children || 0]
      );
      customer_id = result.insertId;
    }
    
    // Get the room_id from the room type and number
    const [rooms] = await pool.query('SELECT id, price FROM rooms WHERE type = ? AND number = ? LIMIT 1', [roomType, roomNo]);
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found.' });
    }
    
    const room_id = rooms[0].id;
    const room_price = rooms[0].price;
    
    // Insert the reservation with customer_id and room details
    await pool.query(
      'INSERT INTO reservations (customer_id, check_in, check_out, adults, children, room_id, room_no, room_type, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_id, checkIn, checkOut || checkIn, adults, children || 0, room_id, roomNo, roomType, specialRequests || '', 'pending']
    );
    
    // Check if user is logged in (has token in request)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        // Verify token and get user_id
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (user && user.id) {
          // Also create a booking record for logged-in users
          await pool.query(
            'INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user.id, room_id, checkIn, checkOut || checkIn, room_price, 'pending']
          );
        }
      } catch (tokenErr) {
        console.error('Token verification error:', tokenErr);
        // Continue with reservation creation even if token verification fails
        // This ensures the reservation is still created even if the booking record isn't
      }
    }
    
    res.status(201).json({ message: 'Reservation created successfully.' });
  } catch (err) {
    console.error('Reservation creation error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Admin: Add customer as reservation
router.post('/admin-add', authenticateToken, requireAdmin, async (req, res) => {
  const { checkIn, adults, children, roomType, roomNo, firstName, lastName, email, phone, specialRequests } = req.body;
  if (!checkIn || !adults || !roomType || !roomNo || !firstName || !lastName || !email || !phone) {
    return res.status(400).json({ message: 'All fields required.' });
  }
  try {
    // Insert or update customer with all fields
    let [customers] = await pool.query('SELECT id FROM customers WHERE email = ? AND phone = ?', [email, phone]);
    let customer_id;
    if (customers.length > 0) {
      customer_id = customers[0].id;
      await pool.query('UPDATE customers SET first_name=?, last_name=?, check_in=?, room_type=?, room_no=?, adults=?, children=? WHERE id=?', [firstName, lastName, checkIn, roomType, roomNo, adults, children || 0, customer_id]);
    } else {
      const result = await pool.query('INSERT INTO customers (first_name, last_name, email, phone, check_in, room_type, room_no, adults, children) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, email, phone, checkIn, roomType, roomNo, adults, children || 0]);
      customer_id = result[0].insertId;
    }
    // Find the room_id for the given type and number
    const [rooms] = await pool.query('SELECT id FROM rooms WHERE type = ? AND number = ?', [roomType, roomNo]);
    if (rooms.length === 0) return res.status(404).json({ message: 'Room not found.' });
    const room_id = rooms[0].id;
    await pool.query(
      'INSERT INTO reservations (customer_id, check_in, check_out, adults, children, room_id, room_no, room_type, special_requests, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [customer_id, checkIn, checkIn, adults, children || 0, room_id, roomNo, roomType, specialRequests || '', 'pending']
    );
    res.status(201).json({ message: 'Customer added successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get all reservations (for admin)
router.get('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  
  try {
    const [rows] = await pool.query(
      'SELECT r.*, rm.name as room_name FROM reservations r JOIN rooms rm ON r.room_id = rm.id ORDER BY r.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Get reservations error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Admin: Get all reservations with customer and room info
router.get('/admin-all', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.id AS reservation_id,
        r.check_in,
        r.check_out,
        r.adults,
        r.children,
        r.room_no,
        r.room_type,
        r.status,
        c.first_name,
        c.last_name,
        c.email,
        c.phone
      FROM reservations r
      JOIN customers c ON r.customer_id = c.id
      ORDER BY r.check_in DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Admin: Get all customers
router.get('/all-customers', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PATCH endpoint to update reservation status
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  const reservationId = req.params.id;
  const { status } = req.body;
  if (!['pending', 'accepted'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }
  try {
    await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, reservationId]);
    res.json({ message: 'Reservation status updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get reservations for the logged-in customer
router.get('/my', authenticateToken, async (req, res) => {
  try {
    // Step 1: Get the user's email from the users table using JWT id
    const [users] = await pool.query('SELECT email FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const userEmail = users[0].email;

    // Step 2: Find the customer by email
    const [customers] = await pool.query('SELECT id FROM customers WHERE email = ?', [userEmail]);
    if (customers.length === 0) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    const customerId = customers[0].id;

    // Step 3: Get reservations for this customer
    const [reservations] = await pool.query(
      'SELECT * FROM reservations WHERE customer_id = ? ORDER BY created_at DESC',
      [customerId]
    );
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;