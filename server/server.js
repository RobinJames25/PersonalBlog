require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');

// --- IMPORTS ---
const postRoutes = require('./routes/posts.route'); 
const authRoutes = require('./routes/user.route');
const uploadRoutes = require('./routes/upload.route'); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: [
    process.env.CLIENT_FRONTEND_URL, 
    process.env.ADMIN_FRONTEND_URL,
    'http://localhost:5173', 
    'http://localhost:5174'
  ].filter(Boolean), 
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

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully.');

    await sequelize.sync({ alter: false }); 
    console.log('✅ Models synchronized.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();