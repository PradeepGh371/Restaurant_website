const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/debug/db - Check DB connection and list tables/columns
router.get('/db', async (req, res) => {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    const schema = {};
    for (const table of tableNames) {
      const [cols] = await pool.query(`DESCRIBE \`${table}\``);
      schema[table] = cols;
    }
    res.json({ status: 'ok', tables: tableNames, schema });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router; 