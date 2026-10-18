const multer = require('multer');
const path = require('path');
const uploadDir = require('../utils/uploadDirectory');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'video/mp4'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Allowed: JPG, PNG, PDF, MP4'), false);
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

module.exports = upload;
