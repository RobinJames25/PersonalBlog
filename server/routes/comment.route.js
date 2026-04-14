const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Adjust path if needed

// Public Routes
router.get('/post/:postId', commentController.getCommentsByPost);
router.post('/', commentController.createComment);

// Protected Route (Requires login to delete)
router.delete('/:id', authMiddleware.protect, commentController.deleteComment);

module.exports = router;