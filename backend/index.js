require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const articleRoutes = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your Next.js frontend to talk to this backend
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/articles', articleRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });