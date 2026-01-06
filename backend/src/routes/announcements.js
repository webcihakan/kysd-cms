const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all announcements (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, pinned, all } = req.query;
    const skip = (page - 1) * limit;

    const where = all === 'true' ? {} : { isActive: true };
    if (pinned === 'true') where.isPinned = true;

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }]
      }),
      prisma.announcement.count({ where })
    ]);

    res.json({ announcements, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Duyurular getirilemedi' });
  }
});

// Get announcement by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const announcement = await prisma.announcement.findUnique({ where: { slug: req.params.slug } });

    if (!announcement || !announcement.isActive) {
      return res.status(404).json({ error: 'Duyuru bulunamadı' });
    }

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Duyuru getirilemedi' });
  }
});

// Get single announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const announcement = await prisma.announcement.findUnique({ where: { id: parseInt(req.params.id) } });

    if (!announcement) {
      return res.status(404).json({ error: 'Duyuru bulunamadı' });
    }

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Duyuru getirilemedi' });
  }
});

// Create announcement
router.post('/', auth, editorOrAdmin, [
  body('title').notEmpty().withMessage('Başlık gerekli'),
  body('content').notEmpty().withMessage('İçerik gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, image, isActive, isPinned, startDate, endDate } = req.body;
    let slug = slugify(title, { lower: true, strict: true });

    const existing = await prisma.announcement.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const announcement = await prisma.announcement.create({
      data: { title, slug, content, excerpt, image, isActive, isPinned, startDate, endDate }
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Duyuru oluşturulamadı' });
  }
});

// Update announcement
router.put('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, image, isActive, isPinned, startDate, endDate } = req.body;

    const announcement = await prisma.announcement.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, excerpt, image, isActive, isPinned, startDate, endDate }
    });

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Duyuru güncellenemedi' });
  }
});

// Delete announcement
router.delete('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.announcement.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Duyuru silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Duyuru silinemedi' });
  }
});

module.exports = router;
