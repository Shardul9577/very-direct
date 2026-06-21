const express = require('express');
const multer = require('multer');
const { requireAdmin } = require('../middleware/auth');
const { imageUpload, videoUpload } = require('../middleware/upload');
const { cloudinary, isConfigured, uploadBuffer } = require('../config/cloudinary');

const router = express.Router();

router.use(requireAdmin);

function ensureCloudinary(_req, res, next) {
  if (!isConfigured()) {
    return res.status(503).json({
      error: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env',
    });
  }
  next();
}

router.post('/image', ensureCloudinary, imageUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    const result = await uploadBuffer(req.file.buffer, {
      folder: 'verydirect/images',
      resource_type: 'image',
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

router.post('/video', ensureCloudinary, videoUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video file provided' });

    const result = await uploadBuffer(req.file.buffer, {
      folder: 'verydirect/videos',
      resource_type: 'video',
    });

    const thumbnail = cloudinary.url(result.public_id, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [{ start_offset: '0' }],
      secure: true,
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration ? Math.round(result.duration) : null,
      thumbnail,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Video upload failed' });
  }
});

router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message;
    return res.status(400).json({ error: message });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

module.exports = router;
