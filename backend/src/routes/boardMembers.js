const express = require('express');

const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

// Get all board members (public)
router.get('/', async (req, res) => {
  try {
    const members = await prisma.boardMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Yönetim kurulu üyeleri getirilemedi' });
  }
});

// Get single board member
router.get('/:id', async (req, res) => {
  try {
    const member = await prisma.boardMember.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!member) {
      return res.status(404).json({ error: 'Üye bulunamadı' });
    }
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üye getirilemedi' });
  }
});

// Create board member (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, title, companyName, address, phone, email, photo, order } = req.body;
    const member = await prisma.boardMember.create({
      data: { name, title, companyName, address, phone, email, photo, order: order || 0 }
    });
    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üye eklenemedi' });
  }
});

// Update board member (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, title, companyName, address, phone, email, photo, order, isActive } = req.body;
    const member = await prisma.boardMember.update({
      where: { id: parseInt(req.params.id) },
      data: { name, title, companyName, address, phone, email, photo, order, isActive }
    });
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üye güncellenemedi' });
  }
});

// Delete board member (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.boardMember.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Üye silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üye silinemedi' });
  }
});

module.exports = router;
