const express = require('express');
const cors = require('cors');
const path = require('path');

// --- 1. NEW WAY TO IMPORT SEQUELIZE ---
// Instead of importing from config/db, we import from the models folder.
// This forces Node to run models/index.js, load all models, and build relationships!
const { sequelize } = require('./models');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// --- IMPORTS ---
const postRoutes = require('./routes/posts.route'); 
const authRoutes = require('./routes/user.route');
const uploadRoutes = require('./routes/upload.route');
const commentRoutes = require('./routes/comment.route'); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_FRONTEND_URL, 
      process.env.ADMIN_FRONTEND_URL,
      'http://localhost:5173', 
      'http://localhost:5174'
    ].filter(Boolean); 

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---
app.use('/api/posts', postRoutes);
app.use('/api/users', authRoutes);
app.use('/api/upload', uploadRoutes);
// --- 3. MOUNT THE COMMENTS ROUTE ---
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- DATABASE CONNECTION & SERVER START ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully.');

    // --- 4. TEMPORARILY SET ALTER TO TRUE ---
    // This tells PostgreSQL to look at your models and add the missing Comments table.
    // Once it successfully deploys and works, you can change this back to `false`.
    await sequelize.sync({ alter: true }); 
    console.log('✅ Models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();