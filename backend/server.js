require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaintbuddy';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`ComplaintBuddy API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
