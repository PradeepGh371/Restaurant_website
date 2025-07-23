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

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Add new user (admin only)
router.post('/users', authenticateToken, requireAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields required.' });
  }
  
  try {
    // Check if email already exists
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    
    // Hash password
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(password, 10);
    
    // Insert new user
    await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hash, role]);
    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Update user (admin only)
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { name, email, role } = req.body;
  const userId = req.params.id;
  
  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, email, and role are required.' });
  }
  
  try {
    // Check if email already exists for other users
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    
    // Update user
    await pool.query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, role, userId]);
    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const userId = req.params.id;
  
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get all customers (walk-in and online)
router.get('/users/customers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Walk-in customers
    const [walkin] = await pool.query(`
      SELECT id, first_name AS name, email, phone, check_in AS created_at, 'Walk-in' AS source
      FROM customers
    `);
    // Online customers (users who have at least one booking)
    const [online] = await pool.query(`
      SELECT u.id, u.name, u.email, NULL AS phone, MIN(b.created_at) AS created_at, 'Online' AS source
      FROM users u
      JOIN bookings b ON u.id = b.user_id
      GROUP BY u.id, u.name, u.email
    `);
    res.json([...walkin, ...online]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get all bookings (online and walk-in)
router.get('/all-bookings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Online bookings
    const [online] = await pool.query(`
      SELECT b.id, u.name AS guest, u.email, r.number AS room_no, r.type AS room_type, 
             b.check_in, b.check_out, b.total_price, b.status, b.created_at, 'Online' AS source
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
    `);
    
    // Walk-in bookings (reservations)
    const [walkin] = await pool.query(`
      SELECT res.id, CONCAT(c.first_name, ' ', c.last_name) AS guest, c.email, 
             res.room_no, res.room_type, res.check_in, res.check_out, NULL AS total_price, 
             res.status, res.created_at, 'Walk-in' AS source
      FROM reservations res
      JOIN customers c ON res.customer_id = c.id
    `);
    
    res.json([...online, ...walkin]);
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;