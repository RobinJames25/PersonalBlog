const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // --- CHANGE THIS LINE ---
  summary: {
    type: DataTypes.TEXT, // Changed from STRING to TEXT (allows unlimited length)
  },
  // ------------------------
  coverImage: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: true
});

module.exports = Post;