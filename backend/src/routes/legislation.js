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

// Tüm mevzuatları getir (public)
router.get('/', async (req, res) => {
  try {
    const { category, important } = req.query;

    const where = { isActive: true };
    if (category) where.category = category;
    if (important === 'true') where.isImportant = true;

    const legislations = await prisma.legislation.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { date: 'desc' }
      ]
    });

    // Tags'ı JSON'dan parse et
    const parsed = legislations.map(leg => ({
      ...leg,
      tags: leg.tags ? JSON.parse(leg.tags) : []
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Mevzuatlar getirme hatası:', error);
    res.status(500).json({ error: 'Mevzuatlar alınamadı' });
  }
});

// Tüm mevzuatları getir (admin)
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const legislations = await prisma.legislation.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    const parsed = legislations.map(leg => ({
      ...leg,
      tags: leg.tags ? JSON.parse(leg.tags) : []
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Admin mevzuatlar getirme hatası:', error);
    res.status(500).json({ error: 'Mevzuatlar alınamadı' });
  }
});

// Tek mevzuat getir (slug ile)
router.get('/:slug', async (req, res) => {
  try {
    const legislation = await prisma.legislation.findUnique({
      where: { slug: req.params.slug }
    });

    if (!legislation) {
      return res.status(404).json({ error: 'Mevzuat bulunamadı' });
    }

    res.json({
      ...legislation,
      tags: legislation.tags ? JSON.parse(legislation.tags) : []
    });
  } catch (error) {
    console.error('Mevzuat getirme hatası:', error);
    res.status(500).json({ error: 'Mevzuat alınamadı' });
  }
});

// Yeni mevzuat ekle (admin)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, category, date, source, sourceUrl, tags, isImportant, isActive, order } = req.body;

    const slug = generateSlug(title);

    const legislation = await prisma.legislation.create({
      data: {
        title,
        slug,
        description,
        category: category || 'law',
        date: date ? new Date(date) : null,
        source,
        sourceUrl,
        tags: tags ? JSON.stringify(tags) : null,
        isImportant: isImportant || false,
        isActive: isActive !== false,
        order: order || 0
      }
    });

    res.status(201).json({
      ...legislation,
      tags: legislation.tags ? JSON.parse(legislation.tags) : []
    });
  } catch (error) {
    console.error('Mevzuat ekleme hatası:', error);
    res.status(500).json({ error: 'Mevzuat eklenemedi' });
  }
});

// Mevzuat güncelle (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, category, date, source, sourceUrl, tags, isImportant, isActive, order } = req.body;

    const updateData = {
      title,
      description,
      category,
      date: date ? new Date(date) : null,
      source,
      sourceUrl,
      tags: tags ? JSON.stringify(tags) : null,
      isImportant,
      isActive,
      order
    };

    // Title değiştiyse slug'ı güncelle
    if (title) {
      updateData.slug = generateSlug(title);
    }

    const legislation = await prisma.legislation.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json({
      ...legislation,
      tags: legislation.tags ? JSON.parse(legislation.tags) : []
    });
  } catch (error) {
    console.error('Mevzuat güncelleme hatası:', error);
    res.status(500).json({ error: 'Mevzuat güncellenemedi' });
  }
});

// Mevzuat sil (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.legislation.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Mevzuat silindi' });
  } catch (error) {
    console.error('Mevzuat silme hatası:', error);
    res.status(500).json({ error: 'Mevzuat silinemedi' });
  }
});

// Aktif/Pasif durumunu değiştir
router.patch('/:id/toggle-active', auth, adminOnly, async (req, res) => {
  try {
    const legislation = await prisma.legislation.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    const updated = await prisma.legislation.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: !legislation.isActive }
    });

    res.json({
      ...updated,
      tags: updated.tags ? JSON.parse(updated.tags) : []
    });
  } catch (error) {
    console.error('Durum değiştirme hatası:', error);
    res.status(500).json({ error: 'Durum değiştirilemedi' });
  }
});

// Önemli durumunu değiştir
router.patch('/:id/toggle-important', auth, adminOnly, async (req, res) => {
  try {
    const legislation = await prisma.legislation.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    const updated = await prisma.legislation.update({
      where: { id: parseInt(req.params.id) },
      data: { isImportant: !legislation.isImportant }
    });

    res.json({
      ...updated,
      tags: updated.tags ? JSON.parse(updated.tags) : []
    });
  } catch (error) {
    console.error('Önemli değiştirme hatası:', error);
    res.status(500).json({ error: 'Durum değiştirilemedi' });
  }
});

// Kategori istatistikleri
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await prisma.legislation.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { id: true }
    });

    const total = await prisma.legislation.count({
      where: { isActive: true }
    });

    res.json({
      total,
      categories: stats.map(s => ({
        category: s.category,
        count: s._count.id
      }))
    });
  } catch (error) {
    console.error('İstatistik hatası:', error);
    res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
});

module.exports = router;
