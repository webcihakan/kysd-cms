const express = require('express');

const { auth, editorOrAdmin, adminOnly } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

// =====================
// PUBLIC ROUTES
// =====================

// Aktif paketleri listele
router.get('/', async (req, res) => {
  try {
    const packages = await prisma.catalogPackage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    res.json(packages);
  } catch (error) {
    console.error('Paket listesi hatası:', error);
    res.status(500).json({ error: 'Paketler yüklenirken hata oluştu' });
  }
});

// Tek paket detayı
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const package = await prisma.catalogPackage.findUnique({
      where: { id: parseInt(id), isActive: true }
    });

    if (!package) {
      return res.status(404).json({ error: 'Paket bulunamadı' });
    }

    res.json(package);
  } catch (error) {
    console.error('Paket detay hatası:', error);
    res.status(500).json({ error: 'Paket yüklenirken hata oluştu' });
  }
});

// =====================
// ADMIN ROUTES
// =====================

// Tüm paketleri listele (Admin)
router.get('/admin/all', auth, editorOrAdmin, async (req, res) => {
  try {
    const packages = await prisma.catalogPackage.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { catalogs: true }
        }
      }
    });

    res.json(packages);
  } catch (error) {
    console.error('Admin paket listesi hatası:', error);
    res.status(500).json({ error: 'Paketler yüklenirken hata oluştu' });
  }
});

// Yeni paket ekle (Admin)
router.post('/admin', auth, editorOrAdmin, async (req, res) => {
  try {
    const data = req.body;

    const package = await prisma.catalogPackage.create({
      data: {
        name: data.name,
        duration: parseInt(data.duration),
        price: parseFloat(data.price),
        features: data.features,
        description: data.description,
        order: data.order ? parseInt(data.order) : 0,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });

    res.status(201).json(package);
  } catch (error) {
    console.error('Paket ekleme hatası:', error);
    res.status(500).json({ error: 'Paket eklenirken hata oluştu' });
  }
});

// Paket güncelle (Admin)
router.put('/admin/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const package = await prisma.catalogPackage.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        duration: parseInt(data.duration),
        price: parseFloat(data.price),
        features: data.features,
        description: data.description,
        order: data.order ? parseInt(data.order) : 0,
        isActive: data.isActive
      }
    });

    res.json(package);
  } catch (error) {
    console.error('Paket güncelleme hatası:', error);
    res.status(500).json({ error: 'Paket güncellenirken hata oluştu' });
  }
});

// Paket sil (Admin)
router.delete('/admin/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Bu paketi kullanan katalog var mı kontrol et
    const catalogCount = await prisma.catalog.count({
      where: { packageId: parseInt(id) }
    });

    if (catalogCount > 0) {
      return res.status(400).json({
        error: `Bu paket ${catalogCount} katalog tarafından kullanılıyor. Önce katalogları silin.`
      });
    }

    await prisma.catalogPackage.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Paket silindi' });
  } catch (error) {
    console.error('Paket silme hatası:', error);
    res.status(500).json({ error: 'Paket silinirken hata oluştu' });
  }
});

module.exports = router;
