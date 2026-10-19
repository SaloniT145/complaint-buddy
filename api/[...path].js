const mongoose = require('mongoose');
const app = require('../backend/app');

let connection;

module.exports = async function handler(req, res) {
  const isDatabaseHealthCheck =
    req.method === 'GET' && req.url?.split('?')[0] === '/api/health/database';
  const requiredVariables = isDatabaseHealthCheck ? ['MONGO_URI'] : ['MONGO_URI', 'JWT_SECRET'];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);
  if (missingVariables.length) {
    if (isDatabaseHealthCheck) {
      return res.status(503).json({ status: 'error', database: 'disconnected' });
    }

    return res.status(500).json({
      message: `Missing required environment variables: ${missingVariables.join(', ')}`,
    });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      connection ||= mongoose.connect(process.env.MONGO_URI).catch((error) => {
        connection = undefined;
        throw error;
      });
      await connection;
    }

    return app(req, res);
  } catch (error) {
    console.error('API initialization failed:', error.message);
    if (isDatabaseHealthCheck) {
      return res.status(503).json({ status: 'error', database: 'disconnected' });
    }

    return res.status(500).json({ message: 'API initialization failed' });
  }
};
