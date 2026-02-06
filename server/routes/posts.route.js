const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts.controller');
// const auth = require('../middleware/auth'); // You will add this later

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

// This route should eventually be protected by middleware (e.g., router.post('/', auth, ...))
router.post('/', postController.createPost); 

router.put('/:id', postController.updatePost);    // PUT is for updates
router.delete('/:id', postController.deletePost); // DELETE is for deletions



module.exports = router;