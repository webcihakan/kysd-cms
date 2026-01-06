const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all galleries (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, all } = req.query;
    const skip = (page - 1) * limit;

    const where = all === 'true' ? {} : { isActive: true };
    if (category && category !== 'all') where.category = category;

    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1
          },
          _count: {
            select: { images: true }
          }
        }
      }),
      prisma.gallery.count({ where })
    ]);

    res.json({ galleries, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeriler getirilemedi' });
  }
});

// Get gallery by slug with all images (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { slug: req.params.slug },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!gallery || !gallery.isActive) {
      return res.status(404).json({ error: 'Galeri bulunamadi' });
    }

    res.json(gallery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeri getirilemedi' });
  }
});

// Get single gallery by ID (admin)
router.get('/:id', async (req, res) => {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!gallery) {
      return res.status(404).json({ error: 'Galeri bulunamadi' });
    }

    res.json(gallery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeri getirilemedi' });
  }
});

// Create gallery
router.post('/', auth, editorOrAdmin, [
  body('title').notEmpty().withMessage('Baslik gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, coverImage, eventDate, isActive, order } = req.body;
    let slug = slugify(title, { lower: true, strict: true });

    const existing = await prisma.gallery.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        slug,
        description,
        category: category || 'events',
        coverImage,
        eventDate: eventDate ? new Date(eventDate) : null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      }
    });

    res.status(201).json(gallery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeri olusturulamadi' });
  }
});

// Update gallery
router.put('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const { title, description, category, coverImage, eventDate, isActive, order } = req.body;

    const gallery = await prisma.gallery.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        category,
        coverImage,
        eventDate: eventDate ? new Date(eventDate) : null,
        isActive,
        order
      }
    });

    res.json(gallery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeri guncellenemedi' });
  }
});

// Delete gallery
router.delete('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.gallery.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Galeri silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeri silinemedi' });
  }
});

// =====================
// Gallery Images Routes
// =====================

// Add image to gallery
router.post('/:id/images', auth, editorOrAdmin, async (req, res) => {
  try {
    const { image, title, description, order } = req.body;

    const galleryImage = await prisma.galleryImage.create({
      data: {
        galleryId: parseInt(req.params.id),
        image,
        title,
        description,
        order: order || 0
      }
    });

    res.status(201).json(galleryImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resim eklenemedi' });
  }
});

// Add multiple images to gallery
router.post('/:id/images/bulk', auth, editorOrAdmin, async (req, res) => {
  try {
    const { images } = req.body;
    const galleryId = parseInt(req.params.id);

    const createdImages = await Promise.all(
      images.map((img, index) =>
        prisma.galleryImage.create({
          data: {
            galleryId,
            image: img.image || img,
            title: img.title || null,
            description: img.description || null,
            order: img.order || index
          }
        })
      )
    );

    res.status(201).json(createdImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resimler eklenemedi' });
  }
});

// Update image
router.put('/images/:imageId', auth, editorOrAdmin, async (req, res) => {
  try {
    const { title, description, order } = req.body;

    const image = await prisma.galleryImage.update({
      where: { id: parseInt(req.params.imageId) },
      data: { title, description, order }
    });

    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resim guncellenemedi' });
  }
});

// Delete image
router.delete('/images/:imageId', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.galleryImage.delete({ where: { id: parseInt(req.params.imageId) } });
    res.json({ message: 'Resim silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resim silinemedi' });
  }
});

// Reorder images
router.put('/:id/images/reorder', auth, editorOrAdmin, async (req, res) => {
  try {
    const { imageOrders } = req.body; // [{id: 1, order: 0}, {id: 2, order: 1}]

    await Promise.all(
      imageOrders.map(item =>
        prisma.galleryImage.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    res.json({ message: 'Siralama guncellendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Siralama guncellenemedi' });
  }
});

module.exports = router;
