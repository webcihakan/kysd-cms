const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();

// Auth middleware
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

// CV Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/cvs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Sadece PDF ve Word dosyaları yüklenebilir'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ============================================
// PUBLIC ENDPOINTS
// ============================================

// Create job application (public)
router.post('/', upload.single('cvFile'), [
  body('jobPostingId').isInt().withMessage('İlan ID gerekli'),
  body('firstName').notEmpty().withMessage('Ad gerekli'),
  body('lastName').notEmpty().withMessage('Soyad gerekli'),
  body('email').isEmail().withMessage('Geçerli e-posta gerekli'),
  body('phone').notEmpty().withMessage('Telefon gerekli'),
  body('city').notEmpty().withMessage('Şehir gerekli'),
  body('educationLevel').notEmpty().withMessage('Eğitim seviyesi gerekli'),
  body('experienceYears').notEmpty().withMessage('Deneyim süresi gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      jobPostingId, firstName, lastName, email, phone, city, district,
      birthDate, gender, educationLevel, university, department, graduationYear,
      experienceYears, currentCompany, currentPosition, previousCompanies,
      skills, languages, coverLetter, linkedinUrl, portfolioUrl,
      expectedSalary, availableDate, militaryStatus, drivingLicense,
      canRelocate, hasDisability
    } = req.body;

    // İlan kontrolü
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: parseInt(jobPostingId) }
    });

    if (!jobPosting) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }

    if (jobPosting.status !== 'ACTIVE') {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Bu ilan aktif değil' });
    }

    // Çift başvuru kontrolü
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobPostingId: parseInt(jobPostingId),
        email
      }
    });

    if (existingApplication) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Bu ilana daha önce başvuru yaptınız'
      });
    }

    const cvFile = req.file ? `/uploads/cvs/${req.file.filename}` : null;

    const application = await prisma.jobApplication.create({
      data: {
        jobPostingId: parseInt(jobPostingId),
        userId: req.user?.id || null,
        firstName,
        lastName,
        email,
        phone,
        city,
        district,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        educationLevel,
        university,
        department,
        graduationYear,
        experienceYears,
        currentCompany,
        currentPosition,
        previousCompanies,
        skills,
        languages,
        cvFile,
        coverLetter,
        linkedinUrl,
        portfolioUrl,
        expectedSalary: expectedSalary ? parseFloat(expectedSalary) : null,
        availableDate: availableDate ? new Date(availableDate) : null,
        militaryStatus,
        drivingLicense,
        canRelocate: canRelocate === 'true' || canRelocate === true,
        hasDisability: hasDisability === 'true' || hasDisability === true,
        status: 'PENDING'
      }
    });

    // Başvuru sayısını artır
    await prisma.jobPosting.update({
      where: { id: parseInt(jobPostingId) },
      data: { applicationCount: { increment: 1 } }
    });

    res.status(201).json({
      message: 'Başvurunuz alındı',
      applicationId: application.id
    });
  } catch (error) {
    console.error(error);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Dosya silinirken hata:', err);
      }
    }
    res.status(500).json({ error: 'Başvuru gönderilemedi' });
  }
});

// ============================================
// MEMBER ENDPOINTS
// ============================================

// Get applications for company's job postings
router.get('/member/applications', authenticateToken, async (req, res) => {
  try {
    const { jobPostingId, status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

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

    const companyJobs = await prisma.jobPosting.findMany({
      where: { companyId: companyProfile.id },
      select: { id: true }
    });

    const jobIds = companyJobs.map(j => j.id);

    const where = {
      jobPostingId: { in: jobIds }
    };

    if (jobPostingId) {
      where.jobPostingId = parseInt(jobPostingId);
    }

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          jobPosting: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.jobApplication.count({ where })
    ]);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvurular getirilemedi' });
  }
});

// Get single application (member)
router.get('/member/:id', authenticateToken, async (req, res) => {
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

    const application = await prisma.jobApplication.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        jobPosting: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    if (application.jobPosting.companyId !== companyProfile.id) {
      return res.status(403).json({ error: 'Bu başvuruya erişim yetkiniz yok' });
    }

    // İlk görüntüleme
    if (!application.viewedAt) {
      await prisma.jobApplication.update({
        where: { id: parseInt(req.params.id) },
        data: { viewedAt: new Date() }
      });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvuru getirilemedi' });
  }
});

// Get member application stats
router.get('/member/stats/summary', authenticateToken, async (req, res) => {
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

    const companyJobs = await prisma.jobPosting.findMany({
      where: { companyId: companyProfile.id },
      select: { id: true }
    });

    const jobIds = companyJobs.map(j => j.id);

    const [total, pending, reviewed, interview] = await Promise.all([
      prisma.jobApplication.count({
        where: { jobPostingId: { in: jobIds } }
      }),
      prisma.jobApplication.count({
        where: { jobPostingId: { in: jobIds }, status: 'PENDING' }
      }),
      prisma.jobApplication.count({
        where: { jobPostingId: { in: jobIds }, status: 'REVIEWED' }
      }),
      prisma.jobApplication.count({
        where: { jobPostingId: { in: jobIds }, status: 'INTERVIEW' }
      })
    ]);

    res.json({ total, pending, reviewed, interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İstatistikler getirilemedi' });
  }
});

// Update application status (member)
router.put('/member/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, companyNotes, interviewDate, offerAmount, rejectionReason } = req.body;

    const validStatuses = [
      'PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW',
      'OFFER', 'HIRED', 'REJECTED'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum' });
    }

    const companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    });

    const application = await prisma.jobApplication.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { jobPosting: true }
    });

    if (!application || application.jobPosting.companyId !== companyProfile.id) {
      return res.status(403).json({ error: 'Yetkisiz erişim' });
    }

    const updated = await prisma.jobApplication.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        companyNotes,
        interviewDate: interviewDate ? new Date(interviewDate) : undefined,
        offerAmount: offerAmount ? parseFloat(offerAmount) : undefined,
        rejectionReason
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Durum güncellenemedi' });
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get all applications (admin)
router.get('/admin/all', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { status, jobPostingId, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (jobPostingId) where.jobPostingId = parseInt(jobPostingId);

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          jobPosting: {
            select: {
              id: true,
              title: true,
              companyName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.jobApplication.count({ where })
    ]);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvurular getirilemedi' });
  }
});

// Delete application (admin)
router.delete('/admin/:id', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    // CV dosyasını sil
    if (application.cvFile) {
      const filePath = path.join(__dirname, '../../', application.cvFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.jobApplication.delete({
      where: { id: parseInt(req.params.id) }
    });

    // Başvuru sayısını azalt
    await prisma.jobPosting.update({
      where: { id: application.jobPostingId },
      data: { applicationCount: { decrement: 1 } }
    });

    res.json({ message: 'Başvuru silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvuru silinemedi' });
  }
});

// Send application to all members (admin)
router.post('/admin/:id/send-to-members', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        jobPosting: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    // Ayarları al
    const settings = await prisma.setting.findMany();
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.key] = s.value });

    // Mail gönder
    const { sendJobApplicationToMembers } = require('../utils/mailer');
    const result = await sendJobApplicationToMembers(application, application.jobPosting, settingsObj);

    if (result.success) {
      res.json({
        message: 'Başvuru tüm üyelere gönderildi',
        sent: result.sent,
        failed: result.failed,
        totalMembers: result.totalMembers,
        errors: result.errors
      });
    } else {
      res.status(500).json({ error: result.error || 'Mail gönderilemedi' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İşlem başarısız' });
  }
});

// Get admin application stats
router.get('/admin/stats/dashboard', authenticateToken, authorize(['ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const [total, pending, reviewed, shortlisted, interview] = await Promise.all([
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: 'PENDING' } }),
      prisma.jobApplication.count({ where: { status: 'REVIEWED' } }),
      prisma.jobApplication.count({ where: { status: 'SHORTLISTED' } }),
      prisma.jobApplication.count({ where: { status: 'INTERVIEW' } })
    ]);

    res.json({ total, pending, reviewed, shortlisted, interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İstatistikler getirilemedi' });
  }
});

module.exports = router;
