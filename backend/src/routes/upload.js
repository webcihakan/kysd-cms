const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    const subDir = req.query.folder || 'general';
    const fullPath = path.join(uploadDir, subDir);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Desteklenmeyen dosya türü'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Single file upload
router.post('/single', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenemedi' });
    }

    const folder = req.query.folder || 'general';
    const url = `/uploads/${folder}/${req.file.filename}`;

    res.json({
      url,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Dosya yüklenemedi' });
  }
});

// Multiple file upload
router.post('/multiple', auth, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Dosyalar yüklenemedi' });
    }

    const folder = req.query.folder || 'general';
    const files = req.files.map(file => ({
      url: `/uploads/${folder}/${file.filename}`,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size
    }));

    res.json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Dosyalar yüklenemedi' });
  }
});

// Delete file
router.delete('/', auth, (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL gerekli' });
    }

    const filePath = path.join(__dirname, '../../', url);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Dosya silindi' });
    } else {
      res.status(404).json({ error: 'Dosya bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Dosya silinemedi' });
  }
});

// List files in folder
router.get('/list', auth, (req, res) => {
  try {
    const folder = req.query.folder || 'general';
    const uploadDir = path.join(__dirname, '../../uploads', folder);

    if (!fs.existsSync(uploadDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(uploadDir).map(filename => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);

      return {
        filename,
        url: `/uploads/${folder}/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime
      };
    });

    res.json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Dosyalar listelenemedi' });
  }
});

module.exports = router;
