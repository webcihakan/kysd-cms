const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, editorOrAdmin, adminOnly } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// =====================
// PUBLIC ROUTES
// =====================

// Aktif katalogları listele
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    const where = {
      isActive: true,
      status: 'APPROVED'
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { companyName: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [catalogs, total] = await Promise.all([
      prisma.catalog.findMany({
        where,
        skip,
        take,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          package: {
            select: {
              name: true,
              duration: true
            }
          }
        }
      }),
      prisma.catalog.count({ where })
    ]);

    res.json({
      catalogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Katalog listesi hatası:', error);
    res.status(500).json({ error: 'Kataloglar yüklenirken hata oluştu' });
  }
});

// Tek katalog getir (slug)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const catalog = await prisma.catalog.findFirst({
      where: { slug, isActive: true, status: 'APPROVED' },
      include: {
        package: true,
        company: {
          select: {
            companyName: true,
            logo: true
          }
        }
      }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    // Görüntülenme sayısını artır
    await prisma.catalog.update({
      where: { id: catalog.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json(catalog);
  } catch (error) {
    console.error('Katalog detay hatası:', error);
    res.status(500).json({ error: 'Katalog yüklenirken hata oluştu' });
  }
});

// İndirme sayısını artır
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.catalog.update({
      where: { id: parseInt(id) },
      data: { downloadCount: { increment: 1 } }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('İndirme sayacı hatası:', error);
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// Kategorileri listele
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = [
      { value: 'genel', label: 'Genel' },
      { value: 'tekstil', label: 'Tekstil Ürünleri' },
      { value: 'aksesuar', label: 'Aksesuar' },
      { value: 'makine', label: 'Makine & Ekipman' },
      { value: 'hammadde', label: 'Hammadde' },
      { value: 'diger', label: 'Diğer' }
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// =====================
// MEMBER ROUTES (Auth Required)
// =====================

// Üyenin kendi kataloglarını listele
router.get('/member/my-catalogs', auth, async (req, res) => {
  try {
    // User'ın company profile'ını bul
    const userProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Firma profili bulunamadı' });
    }

    const catalogs = await prisma.catalog.findMany({
      where: { companyId: userProfile.id },
      include: {
        package: true,
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(catalogs);
  } catch (error) {
    console.error('Katalog listesi hatası:', error);
    res.status(500).json({ error: 'Kataloglar yüklenirken hata oluştu' });
  }
});

// Yeni katalog oluştur
router.post('/member/create', auth, async (req, res) => {
  try {
    const data = req.body;

    // User'ın company profile'ını bul
    const userProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Firma profili bulunamadı' });
    }

    // Paketi kontrol et
    const package = await prisma.catalogPackage.findUnique({
      where: { id: parseInt(data.packageId) }
    });

    if (!package) {
      return res.status(404).json({ error: 'Paket bulunamadı' });
    }

    // Slug oluştur
    const slugBase = createSlug(`${userProfile.companyName} ${data.title}`);
    const timestamp = Date.now();
    const slug = `${slugBase}-${timestamp}`;

    // Katalog oluştur
    const catalog = await prisma.catalog.create({
      data: {
        companyId: userProfile.id,
        companyName: userProfile.companyName,
        contactPerson: data.contactPerson || req.user.name,
        phone: data.phone || userProfile.phone,
        email: data.email || req.user.email,
        website: data.website || userProfile.website,
        title: data.title,
        slug,
        description: data.description,
        category: data.category || 'genel',
        tags: data.tags,
        coverImage: data.coverImage,
        pdfFile: data.pdfFile,
        pageCount: data.pageCount ? parseInt(data.pageCount) : null,
        fileSize: data.fileSize,
        packageId: package.id,
        price: package.price,
        status: 'PENDING'
      }
    });

    res.status(201).json(catalog);
  } catch (error) {
    console.error('Katalog oluşturma hatası:', error);
    res.status(500).json({ error: 'Katalog oluşturulurken hata oluştu' });
  }
});

// Kendi kataloğunu güncelle (Sadece PENDING veya REJECTED)
router.put('/member/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
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
        id: parseInt(id),
        companyId: userProfile.id
      }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    // Sadece PENDING veya REJECTED durumunda güncelleme yapılabilir
    if (!['PENDING', 'REJECTED'].includes(catalog.status)) {
      return res.status(400).json({ error: 'Bu katalog güncellenemez' });
    }

    const updated = await prisma.catalog.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
        coverImage: data.coverImage,
        pdfFile: data.pdfFile,
        pageCount: data.pageCount ? parseInt(data.pageCount) : null,
        fileSize: data.fileSize,
        contactPerson: data.contactPerson,
        phone: data.phone,
        email: data.email,
        website: data.website
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Katalog güncelleme hatası:', error);
    res.status(500).json({ error: 'Katalog güncellenirken hata oluştu' });
  }
});

// Kendi kataloğunu sil (Sadece PENDING)
router.delete('/member/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

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
        id: parseInt(id),
        companyId: userProfile.id
      }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    // Sadece PENDING durumunda silinebilir
    if (catalog.status !== 'PENDING') {
      return res.status(400).json({ error: 'Bu katalog silinemez' });
    }

    await prisma.catalog.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Katalog silindi' });
  } catch (error) {
    console.error('Katalog silme hatası:', error);
    res.status(500).json({ error: 'Katalog silinirken hata oluştu' });
  }
});

// Kendi kataloğunu detaylı görüntüle (düzenleme için)
router.get('/member/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // User'ın company profile'ını bul
    const userProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Firma profili bulunamadı' });
    }

    const catalog = await prisma.catalog.findFirst({
      where: {
        id: parseInt(id),
        companyId: userProfile.id
      },
      include: {
        package: true,
        payment: true
      }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    res.json(catalog);
  } catch (error) {
    console.error('Katalog görüntüleme hatası:', error);
    res.status(500).json({ error: 'Katalog görüntülenemedi' });
  }
});

// Katalog durumunu sorgula
router.get('/member/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // User'ın company profile'ını bul
    const userProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Firma profili bulunamadı' });
    }

    const catalog = await prisma.catalog.findFirst({
      where: {
        id: parseInt(id),
        companyId: userProfile.id
      },
      include: {
        payment: true,
        package: true
      }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    res.json(catalog);
  } catch (error) {
    console.error('Katalog durum hatası:', error);
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// =====================
// ADMIN ROUTES
// =====================

// Tüm katalogları listele (Admin)
router.get('/admin/all', auth, editorOrAdmin, async (req, res) => {
  try {
    const { status, category, search } = req.query;

    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { companyName: { contains: search } }
      ];
    }

    const catalogs = await prisma.catalog.findMany({
      where,
      include: {
        package: true,
        payment: true,
        company: {
          select: {
            companyName: true,
            userId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(catalogs);
  } catch (error) {
    console.error('Admin katalog listesi hatası:', error);
    res.status(500).json({ error: 'Kataloglar yüklenirken hata oluştu' });
  }
});

// Katalog detayı (Admin)
router.get('/admin/:id/detail', auth, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const catalog = await prisma.catalog.findUnique({
      where: { id: parseInt(id) },
      include: {
        package: true,
        payment: true,
        company: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    res.json(catalog);
  } catch (error) {
    console.error('Admin katalog detay hatası:', error);
    res.status(500).json({ error: 'Katalog yüklenirken hata oluştu' });
  }
});

// Katalogu onayla (Admin)
router.put('/admin/:id/approve', auth, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, adminNotes } = req.body;

    const catalog = await prisma.catalog.findUnique({
      where: { id: parseInt(id) }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    // PAID durumunda olmalı
    if (catalog.status !== 'PAID') {
      return res.status(400).json({ error: 'Katalog PAID durumunda değil' });
    }

    const updated = await prisma.catalog.update({
      where: { id: parseInt(id) },
      data: {
        status: 'APPROVED',
        isActive: true,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user.id
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Katalog onaylama hatası:', error);
    res.status(500).json({ error: 'Katalog onaylanırken hata oluştu' });
  }
});

// Katalogu reddet (Admin)
router.put('/admin/:id/reject', auth, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const catalog = await prisma.catalog.findUnique({
      where: { id: parseInt(id) }
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Katalog bulunamadı' });
    }

    const updated = await prisma.catalog.update({
      where: { id: parseInt(id) },
      data: {
        status: 'REJECTED',
        isActive: false,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user.id
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Katalog reddetme hatası:', error);
    res.status(500).json({ error: 'Katalog reddedilirken hata oluştu' });
  }
});

// Katalogu sil (Admin)
router.delete('/admin/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.catalog.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Katalog silindi' });
  } catch (error) {
    console.error('Katalog silme hatası:', error);
    res.status(500).json({ error: 'Katalog silinirken hata oluştu' });
  }
});

// İstatistikler (Admin)
router.get('/admin/stats', auth, editorOrAdmin, async (req, res) => {
  try {
    const [
      totalCount,
      pendingCount,
      approvedCount,
      rejectedCount,
      expiredCount
    ] = await Promise.all([
      prisma.catalog.count(),
      prisma.catalog.count({ where: { status: 'PENDING' } }),
      prisma.catalog.count({ where: { status: 'APPROVED' } }),
      prisma.catalog.count({ where: { status: 'REJECTED' } }),
      prisma.catalog.count({ where: { status: 'EXPIRED' } })
    ]);

    // Bu ay kazanılan gelir (APPROVED kataloglar)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await prisma.catalog.aggregate({
      where: {
        status: 'APPROVED',
        reviewedAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        price: true
      }
    });

    // En popüler kategoriler
    const categoryStats = await prisma.catalog.groupBy({
      by: ['category'],
      where: { status: 'APPROVED' },
      _count: true
    });

    res.json({
      totalCount,
      pendingCount,
      approvedCount,
      rejectedCount,
      expiredCount,
      monthlyRevenue: monthlyRevenue._sum.price || 0,
      categoryStats
    });
  } catch (error) {
    console.error('İstatistik hatası:', error);
    res.status(500).json({ error: 'İstatistikler yüklenirken hata oluştu' });
  }
});

module.exports = router;
