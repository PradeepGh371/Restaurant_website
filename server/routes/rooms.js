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

// List all rooms
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add a room (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { number, type, description, price, facilities } = req.body;
  if (!number || !type || !price) return res.status(400).json({ message: 'Room number, type, and price required.' });
  try {
    await pool.query('INSERT INTO rooms (number, type, description, price, facilities) VALUES (?, ?, ?, ?, ?)', [number, type, description, price, facilities]);
    res.status(201).json({ message: 'Room added.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Edit a room (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { number, type, description, price, facilities } = req.body;
  try {
    await pool.query('UPDATE rooms SET number=?, type=?, description=?, price=?, facilities=? WHERE id=?', [number, type, description, price, facilities, req.params.id]);
    res.json({ message: 'Room updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a room (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM rooms WHERE id=?', [req.params.id]);
    res.json({ message: 'Room deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 