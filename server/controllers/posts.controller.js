const { Post } = require('../models');

// 1. Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create a post (FIXED)
exports.createPost = async (req, res) => {
  try {
    // --- CHANGE 1: Extract 'slug' from the request ---
    const { title, slug, content, summary } = req.body;
    
    // Optional: Validation check
    if (!slug) {
        return res.status(400).json({ error: "Slug is required" });
    }

    // --- CHANGE 2: Include 'slug' in the creation ---
    const newPost = await Post.create({ title, slug, content, summary });
    
    res.json(newPost);
  } catch (err) {
    console.error("Create Post Error:", err); // Log the real error to terminal
    res.status(500).json({ error: err.message });
  }
};

// 3. Get single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.destroy({ where: { id } }); 
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Update Post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, summary, content } = req.body;
    
    await Post.update(
      { title, slug, summary, content },
      { where: { id } }
    );
    
    res.json({ message: "Post updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};