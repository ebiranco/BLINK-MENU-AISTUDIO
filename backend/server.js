// backend/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Since we are using ES modules, __dirname is not available directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

// --- Environment Variable Check ---
if (!process.env.DATABASE_URL || !process.env.API_KEY) {
  console.error('\x1b[31m%s\x1b[0m', 'FATAL ERROR: DATABASE_URL and API_KEY must be defined in backend/.env');
  console.error('Please check your configuration and restart the server.');
  process.exit(1);
}

// Import routes after dotenv config
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import restaurantRoutes from './routes/restaurants.js';
import customerRoutes from './routes/customers.js';
import mediaRoutes from './routes/media.js';

const app = express();

// Middleware
app.use(cors()); // Allow requests from the frontend
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies, increase limit for base64 images

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/media', mediaRoutes);

// Basic root route for health check
app.get('/api', (req, res) => {
  res.send('BLINK Backend API is running.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
