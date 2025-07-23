const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    // Check if the origin is allowed
    const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3004', 'http://localhost:3005'];
    if(allowedOrigins.indexOf(origin) === -1) {
      // If it's not allowed, you could still allow it if it's a localhost origin
      if(origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const roomsRoutes = require('./routes/rooms');
app.use('/api/rooms', roomsRoutes);

const bookingsRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingsRoutes);

const reservationsRoutes = require('./routes/reservations');
app.use('/api/reservations', reservationsRoutes);

const debugRoutes = require('./routes/debug');
app.use('/api/debug', debugRoutes);

// Export app for use in routes
module.exports = { app };

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});