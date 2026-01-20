const express = require('express');
const { body, validationResult } = require('express-validator');

const slugify = require('slugify');

const router = express.Router();
const prisma = require('../lib/prisma');

// Auth middleware'leri import et (mevcut middleware'den)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token gerekli' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Geçersiz token' });
    req.user = user;
    next();
  });
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Yetkiniz yok' });
    }
    next();
  };
};

// ============================================
// PUBLIC ENDPOINTS
// ============================================

// Get all active job postings (public)
router.get('/', async (req, res) => {
  try {
    const {
      city,
      jobType,
      experienceLevel,
      search,
      page = 1,
      limit = 20,
      featured
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const now = new Date();

    const where = {
      status: 'ACTIVE',
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: now } }
      ]
    };

    if (city) where.city = city;
    if (jobType) where.jobType = jobType;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (featured === 'true') where.isFeatured = true;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { companyName: { contains: search } }
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        include: {
          company: {
            select: {
              companyName: true,
              logo: true,
              isVerified: true
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { publishedAt: 'desc' }
        ],
        skip,
        take: parseInt(limit)
      }),
      prisma.jobPosting.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İş ilanları getirilemedi' });
  }
});

// Get single job posting by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { slug: req.params.slug },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            website: true,
            description: true,
            isVerified: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }

    // View count artır
    await prisma.jobPosting.update({
      where: { id: job.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan getirilemedi' });
  }
});

// Get job posting filters
router.get('/filters', async (req, res) => {
  try {
    const cities = await prisma.jobPosting.findMany({
      where: { status: 'ACTIVE', isActive: true },
      select: { city: true },
      distinct: ['city']
    });

    res.json({
      cities: cities.map(c => c.city).sort(),
      jobTypes: ['FULL_TIME', 'PART_TIME', 'REMOTE', 'HYBRID', 'INTERNSHIP', 'CONTRACT'],
      experienceLevels: ['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Filtreler getirilemedi' });
  }
});

// Get job posting stats
router.get('/stats/public', async (req, res) => {
  try {
    const now = new Date();

    const total = await prisma.jobPosting.count({
      where: {
        status: 'ACTIVE',
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }]
      }
    });

    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İstatistikler getirilemedi' });
  }
});

// ============================================
// MEMBER ENDPOINTS
// ============================================

// Get company's own job postings
router.get('/member/my-jobs', authenticateToken, async (req, res) => {
  try {
    let companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    // Eğer profil yoksa, otomatik oluştur
    if (!companyProfile) {
      companyProfile = await prisma.userCompanyProfile.create({
        data: {
          userId: req.user.id,
          companyName: req.user.name || 'Firma Adı'
        }
      });
    }

    if (!companyProfile.memberId) {
      return res.status(403).json({
        error: 'Sadece KYSD üyesi firmalar iş ilanı yayınlayabilir'
      });
    }

    const jobs = await prisma.jobPosting.findMany({
      where: { companyId: companyProfile.id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlanlar getirilemedi' });
  }
});

// Get member stats
router.get('/member/stats', authenticateToken, async (req, res) => {
  try {
    let companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    // Eğer profil yoksa, otomatik oluştur
    if (!companyProfile) {
      companyProfile = await prisma.userCompanyProfile.create({
        data: {
          userId: req.user.id,
          companyName: req.user.name || 'Firma Adı'
        }
      });
    }

    if (!companyProfile.memberId) {
      return res.status(403).json({
        error: 'Sadece KYSD üyesi firmalar iş ilanı yayınlayabilir'
      });
    }

    const [total, active, pending, totalApplications] = await Promise.all([
      prisma.jobPosting.count({ where: { companyId: companyProfile.id } }),
      prisma.jobPosting.count({
        where: {
          companyId: companyProfile.id,
          status: 'ACTIVE',
          isActive: true
        }
      }),
      prisma.jobPosting.count({
        where: {
          companyId: companyProfile.id,
          status: 'PENDING'
        }
      }),
      prisma.jobApplication.count({
        where: {
          jobPosting: {
            companyId: companyProfile.id
          }
        }
      })
    ]);

    res.json({ total, active, pending, totalApplications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İstatistikler getirilemedi' });
  }
});

// Create job posting (member)
router.post('/member', authenticateToken, [
  body('title').notEmpty().withMessage('Pozisyon adı gerekli'),
  body('description').notEmpty().withMessage('İş tanımı gerekli'),
  body('jobType').isIn(['FULL_TIME', 'PART_TIME', 'REMOTE', 'HYBRID', 'INTERNSHIP', 'CONTRACT']),
  body('experienceLevel').isIn(['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  body('city').notEmpty().withMessage('Şehir gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        member: true,
        user: true
      }
    });

    // Eğer profil yoksa, otomatik oluştur
    if (!companyProfile) {
      companyProfile = await prisma.userCompanyProfile.create({
        data: {
          userId: req.user.id,
          companyName: req.user.name || 'Firma Adı'
        },
        include: {
          member: true,
          user: true
        }
      });
    }

    if (!companyProfile.memberId) {
      return res.status(403).json({
        error: 'Sadece KYSD üyesi firmalar iş ilanı yayınlayabilir'
      });
    }

    const {
      title, description, requirements, responsibilities, benefits,
      jobType, experienceLevel, city, district, isRemote,
      salaryMin, salaryMax, showSalary,
      applicationDeadline, positions, applicationEmail, applicationUrl
    } = req.body;

    // Slug oluştur
    const baseSlug = slugify(title, { lower: true, strict: true, locale: 'tr' });
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.jobPosting.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const job = await prisma.jobPosting.create({
      data: {
        title,
        slug,
        description,
        requirements,
        responsibilities,
        benefits,
        jobType,
        experienceLevel,
        city,
        district,
        isRemote: isRemote || false,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        showSalary: showSalary || false,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        positions: positions ? parseInt(positions) : 1,
        applicationEmail: applicationEmail || companyProfile.user.email,
        applicationUrl,
        companyId: companyProfile.id,
        companyName: companyProfile.companyName,
        companyLogo: companyProfile.logo,
        contactEmail: companyProfile.user.email,
        contactPhone: companyProfile.phone,
        status: 'PENDING',
        publishedAt: new Date()
      }
    });

    res.status(201).json({
      message: 'İlan oluşturuldu. Admin onayından sonra yayınlanacaktır.',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan oluşturulamadı' });
  }
});

// Update job posting (member)
router.put('/member/:id', authenticateToken, async (req, res) => {
  try {
    let companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    // Eğer profil yoksa, otomatik oluştur
    if (!companyProfile) {
      companyProfile = await prisma.userCompanyProfile.create({
        data: {
          userId: req.user.id,
          companyName: req.user.name || 'Firma Adı'
        }
      });
    }

    const existingJob = await prisma.jobPosting.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: companyProfile.id
      }
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }

    const {
      title, description, requirements, responsibilities, benefits,
      jobType, experienceLevel, city, district, isRemote,
      salaryMin, salaryMax, showSalary,
      applicationDeadline, positions, applicationEmail, applicationUrl,
      isActive
    } = req.body;

    // Slug güncelleme
    let slug = existingJob.slug;
    if (title && title !== existingJob.title) {
      const baseSlug = slugify(title, { lower: true, strict: true, locale: 'tr' });
      slug = baseSlug;
      let counter = 1;

      while (await prisma.jobPosting.findFirst({
        where: { slug, id: { not: parseInt(req.params.id) } }
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updated = await prisma.jobPosting.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: title || existingJob.title,
        slug,
        description: description || existingJob.description,
        requirements,
        responsibilities,
        benefits,
        jobType: jobType || existingJob.jobType,
        experienceLevel: experienceLevel || existingJob.experienceLevel,
        city: city || existingJob.city,
        district,
        isRemote: isRemote !== undefined ? isRemote : existingJob.isRemote,
        salaryMin: salaryMin !== undefined ? (salaryMin ? parseFloat(salaryMin) : null) : undefined,
        salaryMax: salaryMax !== undefined ? (salaryMax ? parseFloat(salaryMax) : null) : undefined,
        showSalary: showSalary !== undefined ? showSalary : existingJob.showSalary,
        applicationDeadline: applicationDeadline !== undefined
          ? (applicationDeadline ? new Date(applicationDeadline) : null)
          : undefined,
        positions: positions !== undefined ? parseInt(positions) : undefined,
        applicationEmail,
        applicationUrl,
        isActive: isActive !== undefined ? isActive : existingJob.isActive,
        status: 'PENDING'
      }
    });

    res.json({
      message: 'İlan güncellendi',
      job: updated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan güncellenemedi' });
  }
});

// Delete job posting (member)
router.delete('/member/:id', authenticateToken, async (req, res) => {
  try {
    let companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    // Eğer profil yoksa, otomatik oluştur
    if (!companyProfile) {
      companyProfile = await prisma.userCompanyProfile.create({
        data: {
          userId: req.user.id,
          companyName: req.user.name || 'Firma Adı'
        }
      });
    }

    const job = await prisma.jobPosting.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: companyProfile.id
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }

    await prisma.jobPosting.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'İlan silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan silinemedi' });
  }
});

// Toggle status
router.patch('/member/:id/toggle-status', authenticateToken, async (req, res) => {
  try {
    const companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    const job = await prisma.jobPosting.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: companyProfile.id
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }

    const newStatus = job.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

    const updated = await prisma.jobPosting.update({
      where: { id: parseInt(req.params.id) },
      data: { status: newStatus }
    });

    res.json({
      message: newStatus === 'ACTIVE' ? 'İlan yayına alındı' : 'İlan duraklatıldı',
      job: updated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Durum güncellenemedi' });
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get all job postings (admin)
router.get('/admin/all', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { companyName: { contains: search } }
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        include: {
          company: {
            select: {
              companyName: true,
              logo: true,
              member: true
            }
          },
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.jobPosting.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlanlar getirilemedi' });
  }
});

// Get dashboard stats (admin)
router.get('/admin/stats/dashboard', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const [total, pending, active, paused, featured, totalApplications] = await Promise.all([
      prisma.jobPosting.count(),
      prisma.jobPosting.count({ where: { status: 'PENDING' } }),
      prisma.jobPosting.count({ where: { status: 'ACTIVE', isActive: true } }),
      prisma.jobPosting.count({ where: { status: 'PAUSED' } }),
      prisma.jobPosting.count({ where: { isFeatured: true, isActive: true } }),
      prisma.jobApplication.count()
    ]);

    res.json({
      total,
      pending,
      active,
      paused,
      featured,
      totalApplications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İstatistikler getirilemedi' });
  }
});

// Approve/Reject job posting (admin)
router.put('/admin/:id/review', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['ACTIVE', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum' });
    }

    const job = await prisma.jobPosting.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user.id,
        publishedAt: status === 'ACTIVE' ? new Date() : undefined
      }
    });

    res.json({
      message: status === 'ACTIVE' ? 'İlan onaylandı' : 'İlan reddedildi',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan güncellenemedi' });
  }
});

// Create job posting (admin - full control)
router.post('/admin', authenticateToken, authorize(['ADMIN', 'EDITOR']), [
  body('title').notEmpty().withMessage('Pozisyon adı gerekli'),
  body('description').notEmpty().withMessage('İş tanımı gerekli'),
  body('jobType').isIn(['FULL_TIME', 'PART_TIME', 'REMOTE', 'HYBRID', 'INTERNSHIP', 'CONTRACT']),
  body('experienceLevel').isIn(['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  body('city').notEmpty().withMessage('Şehir gerekli'),
  body('companyName').notEmpty().withMessage('Firma adı gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title, description, requirements, responsibilities, benefits,
      jobType, experienceLevel, city, district, isRemote,
      salaryMin, salaryMax, showSalary, applicationDeadline, positions,
      companyId, companyName, companyLogo, status, isActive, isFeatured
    } = req.body;

    // Slug oluştur
    const baseSlug = title
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.jobPosting.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const job = await prisma.jobPosting.create({
      data: {
        title,
        slug,
        description,
        requirements,
        responsibilities,
        benefits,
        jobType,
        experienceLevel,
        city,
        district,
        isRemote: isRemote || false,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        showSalary: showSalary || false,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        positions: positions ? parseInt(positions) : 1,
        companyId: companyId ? parseInt(companyId) : null,
        companyName,
        companyLogo,
        status: status || 'ACTIVE',
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        publishedAt: (status === 'ACTIVE') ? new Date() : null,
        reviewedBy: req.user.id,
        reviewedAt: new Date()
      }
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan oluşturulamadı' });
  }
});

// Get single job posting (admin)
router.get('/admin/:id', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        company: true,
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan getirilemedi' });
  }
});

// Update job posting (admin - full control)
router.put('/admin/:id', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const {
      title, description, requirements, responsibilities, benefits,
      jobType, experienceLevel, city, district, isRemote,
      salaryMin, salaryMax, showSalary, applicationDeadline, positions,
      companyId, companyName, companyLogo, status, isActive, isFeatured
    } = req.body;

    const updateData = {
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      jobType,
      experienceLevel,
      city,
      district,
      isRemote,
      salaryMin: salaryMin ? parseFloat(salaryMin) : null,
      salaryMax: salaryMax ? parseFloat(salaryMax) : null,
      showSalary,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      positions: positions ? parseInt(positions) : undefined,
      companyId: companyId ? parseInt(companyId) : undefined,
      companyName,
      companyLogo,
      status,
      isActive,
      isFeatured
    };

    // Eğer status ACTIVE'e çekiliyorsa ve daha önce publishedAt yoksa, şimdi publish et
    const existing = await prisma.jobPosting.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (status === 'ACTIVE' && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const job = await prisma.jobPosting.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan güncellenemedi' });
  }
});

// Delete job posting (admin)
router.delete('/admin/:id', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    await prisma.jobPosting.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'İlan silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İlan silinemedi' });
  }
});

module.exports = router;
