const multer = require('multer');
const path = require('path');

// 1. Habaynta halka la dhigayo sawirka
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Hubi inaad samaysato folder-kan "uploads"
  },
  filename: function (req, file, cb) {
    // Magaca wuxuu noonayaa: fieldname-taariikh.ext (tusaale: image-1705622.jpg)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// 2. Hubinta nooca faylka (Kaliya sawiro)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Kaliya sawirada (jpg, png, jpeg) ayaa la oggol yahay!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB 
  fileFilter: fileFilter
});

module.exports = upload;