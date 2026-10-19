const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/users');
const uploadDirectory = require('./utils/uploadDirectory');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const allowedOrigins = [
  ...(process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
];

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(uploadDirectory));
app.use('/api/uploads', express.static(uploadDirectory));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/health/database', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      throw new Error('MongoDB is not connected');
    }

    await mongoose.connection.db.admin().ping();
    return res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    return res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
