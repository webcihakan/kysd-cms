const express = require('express');
const { body, validationResult } = require('express-validator');

const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

// Get all contacts (admin)
router.get('/', auth, editorOrAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, unread } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (unread === 'true') where.isRead = false;

    const [contacts, total, unreadCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.count({ where }),
      prisma.contact.count({ where: { isRead: false } })
    ]);

    res.json({ contacts, total, unreadCount, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Mesajlar getirilemedi' });
  }
});

// Get single contact
router.get('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!contact) {
      return res.status(404).json({ error: 'Mesaj bulunamadı' });
    }

    // Mark as read
    if (!contact.isRead) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: { isRead: true }
      });
    }

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Mesaj getirilemedi' });
  }
});

// Create contact (public)
router.post('/', [
  body('name').notEmpty().withMessage('İsim gerekli'),
  body('email').isEmail().withMessage('Geçerli bir email adresi girin'),
  body('message').notEmpty().withMessage('Mesaj gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;

    const contact = await prisma.contact.create({
      data: { name, email, phone, subject, message }
    });

    res.status(201).json({ message: 'Mesajınız başarıyla gönderildi', id: contact.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Mesaj gönderilemedi' });
  }
});

// Mark as read/unread
router.put('/:id/read', auth, editorOrAdmin, async (req, res) => {
  try {
    const { isRead } = req.body;

    await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead }
    });

    res.json({ message: 'Durum güncellendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Durum güncellenemedi' });
  }
});

// Delete contact
router.delete('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Mesaj silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Mesaj silinemedi' });
  }
});

module.exports = router;
