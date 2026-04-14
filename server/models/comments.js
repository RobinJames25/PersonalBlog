const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  authorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authorEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Posts', 
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Comment;