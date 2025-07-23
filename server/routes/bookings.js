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
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
}

// Customer: Book a room
router.post('/', authenticateToken, async (req, res) => {
  const { room_id, check_in, check_out, guests_count = 1, special_requests = '' } = req.body;
  if (!room_id || !check_in || !check_out) return res.status(400).json({ message: 'All fields required.' });
  try {
    // Get room price
    const [roomRows] = await pool.query('SELECT price FROM rooms WHERE id = ?', [room_id]);
    if (roomRows.length === 0) return res.status(404).json({ message: 'Room not found.' });
    const total_price = roomRows[0].price;
    
    await pool.query('INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, guests_count, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [req.user.id, room_id, check_in, check_out, total_price, guests_count, special_requests]);
    res.status(201).json({ message: 'Booking requested.' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Customer: View own bookings
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT b.*, r.number AS room_number, r.type AS room_type FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.user_id = ? ORDER BY b.created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Admin: View all bookings
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT b.*, u.name AS user_name, u.email, r.number AS room_number, r.type AS room_type FROM bookings b JOIN users u ON b.user_id = u.id JOIN rooms r ON b.room_id = r.id ORDER BY b.created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Admin: Accept/Reject booking
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['confirmed', 'cancelled'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
  try {
    await pool.query('UPDATE bookings SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: 'Booking updated.' });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 