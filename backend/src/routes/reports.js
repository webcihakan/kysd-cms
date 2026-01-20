const express = require('express');
const router = express.Router();

const { auth, adminOnly } = require('../middleware/auth');

const prisma = require('../lib/prisma');

// Slug oluşturma fonksiyonu
const generateSlug = (text) => {
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };

  return text
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Tüm raporları getir (public)
router.get('/', async (req, res) => {
  try {
    const { category, source, featured } = req.query;

    const where = { isActive: true };
    if (category) where.category = category;
    if (source) where.source = source;
    if (featured === 'true') where.isFeatured = true;

    const reports = await prisma.report.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { publishDate: 'desc' }
      ]
    });

    res.json(reports);
  } catch (error) {
    console.error('Raporlar getirme hatası:', error);
    res.status(500).json({ error: 'Raporlar alınamadı' });
  }
});

// Tüm raporları getir (admin)
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(reports);
  } catch (error) {
    console.error('Admin raporlar getirme hatası:', error);
    res.status(500).json({ error: 'Raporlar alınamadı' });
  }
});

// Tek rapor getir (slug ile)
router.get('/:slug', async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { slug: req.params.slug }
    });

    if (!report) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }

    res.json(report);
  } catch (error) {
    console.error('Rapor getirme hatası:', error);
    res.status(500).json({ error: 'Rapor alınamadı' });
  }
});

// Yeni rapor ekle (admin)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, source, sourceUrl, pdfUrl, category, publishDate, image, isFeatured, isActive, order } = req.body;

    const slug = generateSlug(title);

    const report = await prisma.report.create({
      data: {
        title,
        slug,
        description,
        source,
        sourceUrl,
        pdfUrl,
        category,
        publishDate: publishDate ? new Date(publishDate) : null,
        image,
        isFeatured: isFeatured || false,
        isActive: isActive !== false,
        order: order || 0
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Rapor ekleme hatası:', error);
    res.status(500).json({ error: 'Rapor eklenemedi' });
  }
});

// Rapor güncelle (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, source, sourceUrl, pdfUrl, category, publishDate, image, isFeatured, isActive, order } = req.body;

    const updateData = {
      title,
      description,
      source,
      sourceUrl,
      pdfUrl,
      category,
      publishDate: publishDate ? new Date(publishDate) : null,
      image,
      isFeatured,
      isActive,
      order
    };

    // Title değiştiyse slug'ı güncelle
    if (title) {
      updateData.slug = generateSlug(title);
    }

    const report = await prisma.report.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json(report);
  } catch (error) {
    console.error('Rapor güncelleme hatası:', error);
    res.status(500).json({ error: 'Rapor güncellenemedi' });
  }
});

// Rapor sil (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.report.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Rapor silindi' });
  } catch (error) {
    console.error('Rapor silme hatası:', error);
    res.status(500).json({ error: 'Rapor silinemedi' });
  }
});

// Aktif/Pasif durumunu değiştir
router.patch('/:id/toggle-active', auth, adminOnly, async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    const updated = await prisma.report.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: !report.isActive }
    });

    res.json(updated);
  } catch (error) {
    console.error('Durum değiştirme hatası:', error);
    res.status(500).json({ error: 'Durum değiştirilemedi' });
  }
});

// Öne çıkan durumunu değiştir
router.patch('/:id/toggle-featured', auth, adminOnly, async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    const updated = await prisma.report.update({
      where: { id: parseInt(req.params.id) },
      data: { isFeatured: !report.isFeatured }
    });

    res.json(updated);
  } catch (error) {
    console.error('Öne çıkan değiştirme hatası:', error);
    res.status(500).json({ error: 'Durum değiştirilemedi' });
  }
});

module.exports = router;
