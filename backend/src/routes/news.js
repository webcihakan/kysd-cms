const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all news (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, featured, all } = req.query;
    const skip = (page - 1) * limit;

    const where = all === 'true' ? {} : { isActive: true };
    if (featured === 'true') where.isFeatured = true;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.news.count({ where })
    ]);

    res.json({ news, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haberler getirilemedi' });
  }
});

// Get news by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const news = await prisma.news.findUnique({ where: { slug: req.params.slug } });

    if (!news || !news.isActive) {
      return res.status(404).json({ error: 'Haber bulunamadı' });
    }

    await prisma.news.update({
      where: { id: news.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber getirilemedi' });
  }
});

// Get single news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await prisma.news.findUnique({ where: { id: parseInt(req.params.id) } });

    if (!news) {
      return res.status(404).json({ error: 'Haber bulunamadı' });
    }

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber getirilemedi' });
  }
});

// Create news
router.post('/', auth, editorOrAdmin, [
  body('title').notEmpty().withMessage('Başlık gerekli'),
  body('content').notEmpty().withMessage('İçerik gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, image, isActive, isFeatured } = req.body;
    let slug = slugify(title, { lower: true, strict: true });

    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const news = await prisma.news.create({
      data: { title, slug, content, excerpt, image, isActive, isFeatured }
    });

    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber oluşturulamadı' });
  }
});

// Update news
router.put('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, image, isActive, isFeatured } = req.body;

    const news = await prisma.news.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, excerpt, image, isActive, isFeatured }
    });

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber güncellenemedi' });
  }
});

// Delete news
router.delete('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Haber silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber silinemedi' });
  }
});

module.exports = router;
