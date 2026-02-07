const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');

// --- SAFETY SWITCH: Only load .env if we are NOT in production ---
// This prevents the "localhost" error on Render
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// --- IMPORTS ---
const postRoutes = require('./routes/posts.route'); 
const authRoutes = require('./routes/user.route');
const uploadRoutes = require('./routes/upload.route'); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_FRONTEND_URL, 
      process.env.ADMIN_FRONTEND_URL,
      'http://localhost:5173', 
      'http://localhost:5174'
    ].filter(Boolean); // Remove any undefined values

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/api/posts', postRoutes);
app.use('/api/users', authRoutes);
app.use('/api/upload', uploadRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- DATABASE CONNECTION & SERVER START ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully.');

    // Sync models (alter: false is safer for production to avoid data loss)
    await sequelize.sync({ alter: false }); 
    console.log('✅ Models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();