const multer = require('multer');
const path = require('path');

// Use MemoryStorage so file buffer is available for ImageKit cloud upload
const storage = multer.memoryStorage();

// File type filter: accept images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and WebP image formats are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max size: 10MB
  fileFilter: fileFilter,
});

module.exports = upload;