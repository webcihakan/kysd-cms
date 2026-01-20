const express = require('express');
const { body, validationResult } = require('express-validator');

const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

// Get all advertisements (public - sadece ödemesi yapılmış ve aktif olanlar)
router.get('/', async (req, res) => {
  try {
    const { position, all } = req.query;
    const now = new Date();

    // Admin için tüm reklamları göster
    const where = all === 'true' ? {} : {
      isActive: true,
      paymentStatus: 'PAID', // Sadece ödemesi yapılmış reklamlar
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } }
      ]
    };

    if (position) where.position = position;

    const ads = await prisma.advertisement.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Reklamlar getirilemedi' });
  }
});

// Get ads by position code (public)
router.get('/position/:code', async (req, res) => {
  try {
    const now = new Date();

    const ads = await prisma.advertisement.findMany({
      where: {
        position: req.params.code,
        isActive: true,
        paymentStatus: 'PAID',
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Reklamlar getirilemedi' });
  }
});

// Get single advertisement
router.get('/:id', async (req, res) => {
  try {
    const ad = await prisma.advertisement.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!ad) {
      return res.status(404).json({ error: 'Reklam bulunamadı' });
    }

    res.json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Reklam getirilemedi' });
  }
});

// Track click
router.post('/:id/click', async (req, res) => {
  try {
    await prisma.advertisement.update({
      where: { id: parseInt(req.params.id) },
      data: { clickCount: { increment: 1 } }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tıklama kaydedilemedi' });
  }
});

// Track view
router.post('/:id/view', async (req, res) => {
  try {
    await prisma.advertisement.update({
      where: { id: parseInt(req.params.id) },
      data: { viewCount: { increment: 1 } }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Görüntüleme kaydedilemedi' });
  }
});

// Create advertisement
router.post('/', auth, adminOnly, [
  body('name').notEmpty().withMessage('İsim gerekli'),
  body('position').notEmpty().withMessage('Pozisyon gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, position, imageDesktop, imageMobile, link, startDate, endDate, isActive,
      advertiser, advertiserContact, advertiserPhone, advertiserEmail,
      price, paymentStatus, paidAmount, paidDate, paymentMethod, invoiceNo, paymentNotes
    } = req.body;

    const ad = await prisma.advertisement.create({
      data: {
        name, position, imageDesktop, imageMobile, link, startDate, endDate, isActive,
        advertiser, advertiserContact, advertiserPhone, advertiserEmail,
        price: price ? parseFloat(price) : null,
        paymentStatus: paymentStatus || 'PENDING',
        paidAmount: paidAmount ? parseFloat(paidAmount) : null,
        paidDate: paidDate ? new Date(paidDate) : null,
        paymentMethod, invoiceNo, paymentNotes
      }
    });

    res.status(201).json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Reklam oluşturulamadı' });
  }
});

// Update advertisement
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const {
      name, position, imageDesktop, imageMobile, link, startDate, endDate, isActive,
      advertiser, advertiserContact, advertiserPhone, advertiserEmail,
      price, paymentStatus, paidAmount, paidDate, paymentMethod, invoiceNo, paymentNotes
    } = req.body;

    const ad = await prisma.advertisement.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name, position, imageDesktop, imageMobile, link, startDate, endDate, isActive,
        advertiser, advertiserContact, advertiserPhone, advertiserEmail,
        price: price !== undefined ? (price ? parseFloat(price) : null) : undefined,
        paymentStatus,
        paidAmount: paidAmount !== undefined ? (paidAmount ? parseFloat(paidAmount) : null) : undefined,
        paidDate: paidDate !== undefined ? (paidDate ? new Date(paidDate) : null) : undefined,
        paymentMethod, invoiceNo, paymentNotes
      }
    });

    res.json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Reklam güncellenemedi' });
  }
});

// Ödeme bilgilerini güncelle (yeni endpoint - admin)
router.put('/:id/payment', auth, adminOnly, async (req, res) => {
  try {
    const { paymentStatus, paidAmount, paidDate, paymentMethod, invoiceNo, paymentNotes } = req.body;

    const ad = await prisma.advertisement.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!ad) {
      return res.status(404).json({ error: 'Reklam bulunamadı' });
    }

    const updated = await prisma.advertisement.update({
      where: { id: parseInt(req.params.id) },
      data: {
        paymentStatus: paymentStatus || ad.paymentStatus,
        paidAmount: paidAmount !== undefined ? (paidAmount ? parseFloat(paidAmount) : null) : undefined,
        paidDate: paidDate !== undefined ? (paidDate ? new Date(paidDate) : null) : undefined,
        paymentMethod: paymentMethod || ad.paymentMethod,
        invoiceNo: invoiceNo !== undefined ? invoiceNo : undefined,
        paymentNotes: paymentNotes !== undefined ? paymentNotes : undefined
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ödeme bilgileri güncellenemedi' });
  }
});

// Ödeme işaretle (eski endpoint - hızlı ödeme için)
router.patch('/:id/pay', auth, adminOnly, async (req, res) => {
  try {
    const { paidAmount, paymentMethod, invoiceNo, paymentNotes } = req.body;

    const ad = await prisma.advertisement.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!ad) {
      return res.status(404).json({ error: 'Reklam bulunamadı' });
    }

    const updated = await prisma.advertisement.update({
      where: { id: parseInt(req.params.id) },
      data: {
        paymentStatus: 'PAID',
        paidDate: new Date(),
        paidAmount: paidAmount ? parseFloat(paidAmount) : ad.price,
        paymentMethod: paymentMethod || 'Havale',
        invoiceNo,
        paymentNotes
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ödeme işlenemedi' });
  }
});

// Ödeme özeti
router.get('/stats/payments', auth, adminOnly, async (req, res) => {
  try {
    const ads = await prisma.advertisement.findMany();

    const summary = {
      total: ads.length,
      paid: ads.filter(a => a.paymentStatus === 'PAID').length,
      pending: ads.filter(a => a.paymentStatus === 'PENDING').length,
      partial: ads.filter(a => a.paymentStatus === 'PARTIAL').length,
      totalRevenue: ads.filter(a => a.paymentStatus === 'PAID').reduce((sum, a) => sum + parseFloat(a.paidAmount || 0), 0),
      pendingRevenue: ads.filter(a => a.paymentStatus === 'PENDING').reduce((sum, a) => sum + parseFloat(a.price || 0), 0)
    };

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Özet getirilemedi' });
  }
});

// Delete advertisement
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.advertisement.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Reklam silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Reklam silinemedi' });
  }
});

module.exports = router;
