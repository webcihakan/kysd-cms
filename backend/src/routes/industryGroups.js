const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all industry groups (public)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? {} : { isActive: true };

    const groups = await prisma.industryGroup.findMany({
      where,
      orderBy: { name: 'asc' }, // A-Z sirala
      include: {
        members: {
          where: { isActive: true },
          orderBy: { companyName: 'asc' } // Uyeleri A-Z sirala
        },
        _count: { select: { members: true } }
      }
    });

    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sanayi grupları getirilemedi' });
  }
});

// Get group by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const group = await prisma.industryGroup.findUnique({
      where: { slug: req.params.slug },
      include: {
        members: {
          where: { isActive: true },
          orderBy: { companyName: 'asc' } // Uyeleri A-Z sirala
        }
      }
    });

    if (!group || !group.isActive) {
      return res.status(404).json({ error: 'Sanayi grubu bulunamadı' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sanayi grubu getirilemedi' });
  }
});

// Get single group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await prisma.industryGroup.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { members: { orderBy: { order: 'asc' } } }
    });

    if (!group) {
      return res.status(404).json({ error: 'Sanayi grubu bulunamadı' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sanayi grubu getirilemedi' });
  }
});

// Create industry group
router.post('/', auth, editorOrAdmin, [
  body('name').notEmpty().withMessage('İsim gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, image, order, isActive } = req.body;
    let slug = slugify(name, { lower: true, strict: true });

    const existing = await prisma.industryGroup.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const group = await prisma.industryGroup.create({
      data: { name, slug, description, image, order, isActive }
    });

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sanayi grubu oluşturulamadı' });
  }
});

// Update industry group
router.put('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const { name, description, image, order, isActive } = req.body;

    const group = await prisma.industryGroup.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, image, order, isActive }
    });

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sanayi grubu güncellenemedi' });
  }
});

// Delete industry group
router.delete('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.industryGroup.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Sanayi grubu silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sanayi grubu silinemedi' });
  }
});

// --- MEMBERS ---

// Add member to group
router.post('/:id/members', auth, editorOrAdmin, [
  body('companyName').notEmpty().withMessage('Şirket adı gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyName, contactPerson, phone, email, website, address, logo, description, order, isActive } = req.body;

    const member = await prisma.industryMember.create({
      data: {
        companyName, contactPerson, phone, email, website, address, logo, description, order, isActive,
        groupId: parseInt(req.params.id)
      }
    });

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üye oluşturulamadı' });
  }
});

// Update member
router.put('/members/:memberId', auth, editorOrAdmin, async (req, res) => {
  try {
    const { companyName, contactPerson, phone, email, website, address, logo, description, order, isActive } = req.body;

    const member = await prisma.industryMember.update({
      where: { id: parseInt(req.params.memberId) },
      data: { companyName, contactPerson, phone, email, website, address, logo, description, order, isActive }
    });

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üye güncellenemedi' });
  }
});

// Delete member
router.delete('/members/:memberId', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.industryMember.delete({ where: { id: parseInt(req.params.memberId) } });
    res.json({ message: 'Üye silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üye silinemedi' });
  }
});

module.exports = router;
