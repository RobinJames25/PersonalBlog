const sequelize = require('../config/db');

// Import models (Adjust filenames if your setup uses different names like post.js instead of post.model.js)
const User = require('./user'); 
const Post = require('./posts'); 
const Comment = require('./comments');

// Define Associations
Post.hasMany(Comment, { 
  foreignKey: 'postId', 
  as: 'comments', 
  onDelete: 'CASCADE' 
});

Comment.belongsTo(Post, { 
  foreignKey: 'postId', 
  as: 'post' 
});

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Export everything centrally
module.exports = {
  sequelize,
  User,
  Post,
  Comment
};