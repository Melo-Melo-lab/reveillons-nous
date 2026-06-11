const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');

const IMAGE_TYPES = ['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml'];
const VIDEO_TYPES = ['video/mp4','video/webm','video/quicktime'];

function makeStorage(dest) {
  return multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads', dest),
    filename: (_req, file, cb) => {
      const ext  = path.extname(file.originalname);
      const name = crypto.randomBytes(12).toString('hex');
      cb(null, `${name}${ext}`);
    },
  });
}

const uploadImage = multer({
  storage: makeStorage('images'),
  limits: { fileSize: (parseInt(process.env.MAX_IMAGE_SIZE_MB) || 10) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    IMAGE_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Format d\'image non supporté'), false);
  },
});

const uploadVideo = multer({
  storage: makeStorage('videos'),
  limits: { fileSize: (parseInt(process.env.MAX_VIDEO_SIZE_MB) || 500) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    VIDEO_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Format vidéo non supporté'), false);
  },
});

module.exports = { uploadImage, uploadVideo };
