const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads directory is relative to the project root
    cb(null, path.join(__dirname, '..', '..', 'uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;