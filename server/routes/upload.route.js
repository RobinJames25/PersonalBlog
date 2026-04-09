const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure Multer to use Cloudinary as the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_blog_images', // This will create a folder in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'] // Restrict file types if you want
  },
});

const upload = multer({ storage: storage });

// 3. The Upload Route
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Cloudinary automatically attaches the live, permanent URL to req.file.path!
    const imageUrl = req.file.path; 
    
    console.log("File successfully uploaded to Cloudinary:", imageUrl);
    res.json({ url: imageUrl });

  } catch (error) {
    console.error("SERVER ERROR DURING CLOUDINARY UPLOAD:", error); 
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;