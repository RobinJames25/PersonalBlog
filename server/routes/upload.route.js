const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <--- CRITICAL: You must have this line!

// 1. Define the path to the uploads folder
// This points to "server/uploads"
const uploadDir = path.join(__dirname, '../uploads'); 

// 2. Auto-create the folder if it doesn't exist
if (!fs.existsSync(uploadDir)){
    console.log("Uploads folder not found, creating it now...");
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to the folder we ensured exists
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 4. The Upload Route
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Construct the public URL
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    console.log("File uploaded successfully:", imageUrl); // Log success
    res.json({ url: imageUrl });

  } catch (error) {
    // This will print the ACTUAL error to your VS Code terminal
    console.error("SERVER ERROR DURING UPLOAD:", error); 
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;