const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all pages (public)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? {} : { isActive: true };

    const pages = await prisma.page.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { children: { where: { isActive: true }, orderBy: { order: 'asc' } } }
    });

    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sayfalar getirilemedi' });
  }
});

// Get page by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: req.params.slug },
      include: { children: { where: { isActive: true }, orderBy: { order: 'asc' } } }
    });

    if (!page || !page.isActive) {
      return res.status(404).json({ error: 'Sayfa bulunamadı' });
    }

    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sayfa getirilemedi' });
  }
});

// Get single page by ID
router.get('/:id', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { children: true, parent: true }
    });

    if (!page) {
      return res.status(404).json({ error: 'Sayfa bulunamadı' });
    }

    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sayfa getirilemedi' });
  }
});

// Create page
router.post('/', auth, editorOrAdmin, [
  body('title').notEmpty().withMessage('Başlık gerekli'),
  body('content').notEmpty().withMessage('İçerik gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, image, parentId, order, isActive, metaTitle, metaDesc } = req.body;
    let slug = slugify(title, { lower: true, strict: true });

    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const page = await prisma.page.create({
      data: { title, slug, content, excerpt, image, parentId, order, isActive, metaTitle, metaDesc }
    });

    res.status(201).json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sayfa oluşturulamadı' });
  }
});

// Update page
router.put('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, image, parentId, order, isActive, metaTitle, metaDesc } = req.body;

    const page = await prisma.page.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, excerpt, image, parentId, order, isActive, metaTitle, metaDesc }
    });

    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sayfa güncellenemedi' });
  }
});

// Delete page
router.delete('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.page.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Sayfa silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sayfa silinemedi' });
  }
});

module.exports = router;
