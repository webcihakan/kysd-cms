const express = require('express');

const { auth, editorOrAdmin, adminOnly } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

// Helper: Slug oluştur
function createSlug(text) {
  const trMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// =====================
// PUBLIC ROUTES
// =====================

// Dergi listesi (public, aktif dergiler)
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, limit = 12, page = 1 } = req.query;

    const where = {
      isActive: true,
      pdfFile: {
        not: null
      }
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { publisher: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [magazines, total] = await Promise.all([
      prisma.magazine.findMany({
        where,
        skip,
        take,
        orderBy: [
          { order: 'asc' },
          { publishDate: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.magazine.count({ where })
    ]);

    res.json({
      magazines,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Dergi listesi hatası:', error);
    res.status(500).json({ error: 'Dergiler yüklenirken hata oluştu' });
  }
});

// Tek dergi getir (slug veya ID)
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isId = !isNaN(identifier);

    const magazine = await prisma.magazine.findFirst({
      where: isId
        ? { id: parseInt(identifier), isActive: true }
        : { slug: identifier, isActive: true }
    });

    if (!magazine) {
      return res.status(404).json({ error: 'Dergi bulunamadı' });
    }

    // Görüntülenme sayısını artır
    await prisma.magazine.update({
      where: { id: magazine.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json(magazine);
  } catch (error) {
    console.error('Dergi detay hatası:', error);
    res.status(500).json({ error: 'Dergi yüklenirken hata oluştu' });
  }
});

// İndirme sayısını artır
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.magazine.update({
      where: { id: parseInt(id) },
      data: { downloadCount: { increment: 1 } }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('İndirme sayacı hatası:', error);
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// Kategorilere göre dergi sayıları
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await prisma.magazine.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: true
    });

    res.json(stats);
  } catch (error) {
    console.error('İstatistik hatası:', error);
    res.status(500).json({ error: 'İstatistikler yüklenirken hata oluştu' });
  }
});

// =====================
// ADMIN ROUTES
// =====================

// Admin: Tüm dergileri listele
router.get('/admin/all', auth, editorOrAdmin, async (req, res) => {
  try {
    const { category, search } = req.query;

    const where = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { publisher: { contains: search } }
      ];
    }

    const magazines = await prisma.magazine.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(magazines);
  } catch (error) {
    console.error('Admin dergi listesi hatası:', error);
    res.status(500).json({ error: 'Dergiler yüklenirken hata oluştu' });
  }
});

// Admin: Yeni dergi ekle
router.post('/', auth, editorOrAdmin, async (req, res) => {
  try {
    const data = req.body;

    // Slug oluştur
    if (!data.slug && data.title) {
      data.slug = createSlug(data.title);
    }

    // Slug benzersizliğini kontrol et
    const existing = await prisma.magazine.findUnique({
      where: { slug: data.slug }
    });

    if (existing) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    // Tarih alanlarını dönüştür
    if (data.publishDate) {
      data.publishDate = new Date(data.publishDate);
    }

    // Sayısal alanları dönüştür
    if (data.pageCount) {
      data.pageCount = parseInt(data.pageCount);
    }
    if (data.order !== undefined) {
      data.order = parseInt(data.order);
    }

    const magazine = await prisma.magazine.create({
      data
    });

    res.status(201).json(magazine);
  } catch (error) {
    console.error('Dergi ekleme hatası:', error);
    res.status(500).json({ error: 'Dergi eklenirken hata oluştu' });
  }
});

// Admin: Dergi güncelle
router.put('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Slug güncelleniyorsa benzersizliği kontrol et
    if (data.slug) {
      const existing = await prisma.magazine.findFirst({
        where: {
          slug: data.slug,
          NOT: { id: parseInt(id) }
        }
      });

      if (existing) {
        return res.status(400).json({ error: 'Bu slug zaten kullanılıyor' });
      }
    }

    // Tarih alanlarını dönüştür
    if (data.publishDate) {
      data.publishDate = new Date(data.publishDate);
    }

    // Sayısal alanları dönüştür
    if (data.pageCount) {
      data.pageCount = parseInt(data.pageCount);
    }
    if (data.order !== undefined) {
      data.order = parseInt(data.order);
    }

    const magazine = await prisma.magazine.update({
      where: { id: parseInt(id) },
      data
    });

    res.json(magazine);
  } catch (error) {
    console.error('Dergi güncelleme hatası:', error);
    res.status(500).json({ error: 'Dergi güncellenirken hata oluştu' });
  }
});

// Admin: Ödeme bilgilerini güncelle
router.put('/:id/payment', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paidAmount, paidDate, paymentMethod, invoiceNo, paymentNotes, isPaid } = req.body;

    const magazine = await prisma.magazine.findUnique({
      where: { id: parseInt(id) }
    });

    if (!magazine) {
      return res.status(404).json({ error: 'Dergi bulunamadı' });
    }

    const updateData = {};

    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (isPaid !== undefined) updateData.isPaid = isPaid;
    if (paidAmount !== undefined) {
      updateData.paidAmount = paidAmount ? parseFloat(paidAmount) : null;
    }
    if (paidDate !== undefined) {
      updateData.paidDate = paidDate ? new Date(paidDate) : null;
    }
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (invoiceNo !== undefined) updateData.invoiceNo = invoiceNo;
    if (paymentNotes !== undefined) updateData.paymentNotes = paymentNotes;

    const updatedMagazine = await prisma.magazine.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(updatedMagazine);
  } catch (error) {
    console.error('Ödeme bilgileri güncellenemedi:', error);
    res.status(500).json({ error: 'Ödeme bilgileri güncellenemedi' });
  }
});

// Admin: Dergi sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.magazine.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Dergi silindi' });
  } catch (error) {
    console.error('Dergi silme hatası:', error);
    res.status(500).json({ error: 'Dergi silinirken hata oluştu' });
  }
});

module.exports = router;
 
