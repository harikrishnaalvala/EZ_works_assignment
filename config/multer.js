const multer = require('multer');
const path = require('path');

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving file to uploads directory...');
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    console.log('Saving file with name:', file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('file');

console.log('Multer initialized with single file upload');
module.exports = upload;
