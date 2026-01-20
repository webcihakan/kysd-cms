const express = require('express');

const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

// =====================
// MEMBER ROUTES
// =====================

// Ödeme bilgisi gönder
router.post('/:catalogId', auth, async (req, res) => {
  try {
    const { catalogId } = req.params;
    const data = req.body;

    // User'ın company profile'ını bul
    const userProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Firma profili bulunamadı' });
    }

    // Katalogu kontrol et
    const catalog = await prisma.catalog.findFirst({
      where: {
        id: parseInt(catalogId),
        companyId: userProfile.id
      }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    // Sadece PENDING durumunda ödeme bildirimi yapılabilir
    if (catalog.status !== 'PENDING') {
      return res.status(400).json({ error: 'Bu katalog için ödeme bildirimi yapılamaz' });
    }

    // Ödeme kaydı oluştur veya güncelle
    const existingPayment = await prisma.catalogPayment.findUnique({
      where: { catalogId: parseInt(catalogId) }
    });

    let payment;

    if (existingPayment) {
      // Mevcut ödemeyi güncelle
      payment = await prisma.catalogPayment.update({
        where: { catalogId: parseInt(catalogId) },
        data: {
          amount: parseFloat(data.amount || catalog.price),
          paymentMethod: data.paymentMethod || 'havale',
          paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
          bankName: data.bankName,
          senderName: data.senderName,
          referenceNo: data.referenceNo,
          receiptUrl: data.receiptUrl,
          status: 'VERIFYING'
        }
      });
    } else {
      // Yeni ödeme kaydı oluştur
      payment = await prisma.catalogPayment.create({
        data: {
          catalogId: parseInt(catalogId),
          amount: parseFloat(data.amount || catalog.price),
          paymentMethod: data.paymentMethod || 'havale',
          paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
          bankName: data.bankName,
          senderName: data.senderName,
          referenceNo: data.referenceNo,
          receiptUrl: data.receiptUrl,
          status: 'VERIFYING'
        }
      });
    }

    // Katalog durumunu PAID yap
    await prisma.catalog.update({
      where: { id: parseInt(catalogId) },
      data: { status: 'PAID' }
    });

    res.json(payment);
  } catch (error) {
    console.error('Ödeme bildirimi hatası:', error);
    res.status(500).json({ error: 'Ödeme bildirimi gönderilirken hata oluştu' });
  }
});

// Ödeme durumunu sorgula
router.get('/:catalogId/status', auth, async (req, res) => {
  try {
    const { catalogId } = req.params;

    // User'ın company profile'ını bul
    const userProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Firma profili bulunamadı' });
    }

    // Katalogu kontrol et
    const catalog = await prisma.catalog.findFirst({
      where: {
        id: parseInt(catalogId),
        companyId: userProfile.id
      }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    const payment = await prisma.catalogPayment.findUnique({
      where: { catalogId: parseInt(catalogId) }
    });

    res.json(payment || { message: 'Ödeme bilgisi bulunamadı' });
  } catch (error) {
    console.error('Ödeme durum hatası:', error);
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// =====================
// ADMIN ROUTES
// =====================

// Ödemeyi doğrula/reddet (Admin)
router.put('/admin/:paymentId/verify', auth, editorOrAdmin, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { verified, notes } = req.body;

    const payment = await prisma.catalogPayment.findUnique({
      where: { id: parseInt(paymentId) },
      include: { catalog: true }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Ödeme bulunamadı' });
    }

    // Ödeme durumunu güncelle
    const updated = await prisma.catalogPayment.update({
      where: { id: parseInt(paymentId) },
      data: {
        status: verified ? 'VERIFIED' : 'REJECTED',
        verifiedBy: req.user.id,
        verifiedAt: new Date(),
        notes
      }
    });

    // Eğer reddedilmişse katalogu PENDING'e geri al
    if (!verified) {
      await prisma.catalog.update({
        where: { id: payment.catalogId },
        data: { status: 'PENDING' }
      });
    }

    res.json(updated);
  } catch (error) {
    console.error('Ödeme doğrulama hatası:', error);
    res.status(500).json({ error: 'Ödeme doğrulanırken hata oluştu' });
  }
});

// Tüm ödemeleri listele (Admin)
router.get('/admin/all', auth, editorOrAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    const payments = await prisma.catalogPayment.findMany({
      where,
      include: {
        catalog: {
          include: {
            company: {
              select: {
                companyName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payments);
  } catch (error) {
    console.error('Admin ödeme listesi hatası:', error);
    res.status(500).json({ error: 'Ödemeler yüklenirken hata oluştu' });
  }
});

module.exports = router;
