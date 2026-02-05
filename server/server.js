require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db'); // Your Sequelize Connection File

// --- IMPORTS ---
// Make sure these files exist and are exporting 'router'
const postRoutes = require('./routes/posts.route'); 
const authRoutes = require('./routes/user.route');
const uploadRoutes = require('./routes/upload.route'); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors({
  // Allow both frontend ports
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/api/posts', postRoutes);
app.use('/api/users', authRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- SERVER START & DB SYNC ---
const startServer = async () => {
  try {
    // 1. Authenticate DB connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully.');

    // 2. Sync Models (Creates tables if they don't exist)
    // Use { alter: true } to update tables if you change models, but be careful in production
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized.');

    // 3. Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();