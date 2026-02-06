const express = require('express');
const { body, validationResult } = require('express-validator');

const { auth, adminOnly } = require('../middleware/auth');
const { sendMembershipApplicationNotification } = require('../utils/mailer');

const router = express.Router();
const prisma = require('../lib/prisma');

// Submit membership application (public)
router.post('/', [
  body('companyName').notEmpty().withMessage('Firma adı gerekli'),
  body('address').notEmpty().withMessage('Adres gerekli'),
  body('city').notEmpty().withMessage('Şehir gerekli'),
  body('phone').notEmpty().withMessage('Telefon gerekli'),
  body('email').isEmail().withMessage('Geçerli bir e-posta adresi girin'),
  body('contactName').notEmpty().withMessage('Yetkili adı gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      companyName, companyType, taxNumber, taxOffice, tradeRegistry,
      address, city, district, postalCode, phone, fax, email, website,
      contactName, contactTitle, contactPhone, contactEmail,
      industryGroupId, activityArea, employeeCount, foundedYear
    } = req.body;

    const application = await prisma.membershipApplication.create({
      data: {
        companyName,
        companyType,
        taxNumber,
        taxOffice,
        tradeRegistry,
        address,
        city,
        district,
        postalCode,
        phone,
        fax,
        email,
        website,
        contactName,
        contactTitle,
        contactPhone,
        contactEmail,
        industryGroupId: industryGroupId ? parseInt(industryGroupId) : null,
        activityArea,
        employeeCount,
        foundedYear,
        status: 'PENDING'
      }
    });

    // Email bildirimi gönder (arka planda, hata olsa da kullanıcıya etki etmesin)
    try {
      await sendMembershipApplicationNotification({
        company_name: companyName,
        authorized_person: contactName,
        email,
        phone,
        sector: activityArea,
        address: `${address}, ${city}${district ? ', ' + district : ''}`,
        created_at: new Date()
      });
    } catch (emailError) {
      console.error('Email gönderilemedi:', emailError);
      // Email hatası başvuruyu etkilemez, devam et
    }

    res.status(201).json({
      message: 'Üyelik başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
      applicationId: application.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvuru gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
  }
});

// Get all applications (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Status'u büyük harfe dönüştür (enum uyumu için)
    const normalizedStatus = status ? status.toUpperCase() : null;
    const where = normalizedStatus ? { status: normalizedStatus } : {};

    const [applications, total] = await Promise.all([
      prisma.membershipApplication.findMany({
        where,
        include: {
          industryGroup: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.membershipApplication.count({ where })
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

// Get application stats (admin only)
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      prisma.membershipApplication.count({ where: { status: 'PENDING' } }),
      prisma.membershipApplication.count({ where: { status: 'APPROVED' } }),
      prisma.membershipApplication.count({ where: { status: 'REJECTED' } }),
      prisma.membershipApplication.count()
    ]);

    res.json({ pending, approved, rejected, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İstatistikler getirilemedi' });
  }
});

// Get single application (admin only)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const application = await prisma.membershipApplication.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        industryGroup: { select: { name: true, slug: true } }
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvuru getirilemedi' });
  }
});

// Update application status (admin only)
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum' });
    }

    const application = await prisma.membershipApplication.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        notes,
        reviewedAt: new Date(),
        reviewedBy: req.user.id
      }
    });

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvuru güncellenemedi' });
  }
});

// Delete application (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.membershipApplication.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Başvuru silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvuru silinemedi' });
  }
});

module.exports = router;
