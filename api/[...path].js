const mongoose = require('mongoose');
const app = require('../backend/app');

let connection;

module.exports = async function handler(req, res) {
  const missingVariables = ['MONGO_URI', 'JWT_SECRET'].filter((name) => !process.env[name]);
  if (missingVariables.length) {
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
    return res.status(500).json({ message: 'API initialization failed' });
  }
};
