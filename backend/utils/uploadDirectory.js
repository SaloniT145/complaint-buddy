const fs = require('fs');
const path = require('path');

const uploadDirectory =
  process.env.UPLOAD_DIR ||
  (process.env.VERCEL
    ? path.join('/tmp', 'complaint-buddy-uploads')
    : path.join(__dirname, '..', 'uploads'));

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

module.exports = uploadDirectory;
