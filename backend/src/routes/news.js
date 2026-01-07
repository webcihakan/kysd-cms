const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all news (public) - with filtering support
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, featured, all, category, days } = req.query;
    const skip = (page - 1) * limit;

    // Base where clause
    const where = { AND: [] };

    // Active filter
    if (all !== 'true') {
      where.AND.push({ isActive: true });
    }

    // Featured filter
    if (featured === 'true') {
      where.AND.push({ isFeatured: true });
    }

    // Kategori filtresi (title, excerpt ve content'te arama - MySQL için)
    if (category && category !== 'all') {
      where.AND.push({
        OR: [
          { title: { contains: category } },
          { excerpt: { contains: category } },
          { content: { contains: category } }
        ]
      });
    }

    // Tarih filtresi (son X gün)
    if (days && days !== 'all') {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      where.AND.push({ createdAt: { gte: daysAgo } });
    }

    // If no filters, remove AND
    const finalWhere = where.AND.length > 0 ? where : {};

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where: finalWhere,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.news.count({ where: finalWhere })
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
