const { Comment } = require('../models'); // Now importing from index.js

// --- 1. CREATE A COMMENT ---
exports.createComment = async (req, res) => {
  try {
    const { content, authorName, authorEmail, postId } = req.body;

    if (!content || !authorName || !postId) {
      return res.status(400).json({ message: 'Please provide content, author name, and post ID' });
    }

    const newComment = await Comment.create({
      content,
      authorName,
      authorEmail,
      postId
    });

    res.status(201).json({
      status: 'success',
      data: { comment: newComment }
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// --- 2. GET ALL COMMENTS FOR A SPECIFIC POST ---
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: { comments }
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// --- 3. DELETE A COMMENT ---
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();

    res.status(204).json({
      status: 'success',
      data: null
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};