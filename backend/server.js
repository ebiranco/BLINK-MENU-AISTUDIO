// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const restaurantRoutes = require('./routes/restaurants');
const customerRoutes = require('./routes/customers');
const mediaRoutes = require('./routes/media');

const app = express();

// Middleware
app.use(cors()); // Allow requests from the frontend
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies, increase limit for base64 images

// Serve static files (AI-generated images/videos) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/media', mediaRoutes);


// Basic root route
app.get('/', (req, res) => {
  res.send('BLINK Backend is running.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
