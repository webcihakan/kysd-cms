const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { auth } = require('../middleware/auth')

// ==================
// PUBLIC ENDPOINTS
// ==================

// Başvuru gönder
router.post('/', async (req, res) => {
  try {
    const {
      fairId,
      boothTypeId,
      companyName,
      contactName,
      email,
      phone,
      website,
      message
    } = req.body

    // Validasyon
    if (!fairId || !boothTypeId || !companyName || !contactName || !email || !phone) {
      return res.status(400).json({ error: 'Zorunlu alanları doldurun' })
    }

    // Fuar ve stant türü kontrolü
    const fair = await prisma.virtualFair.findUnique({
      where: { id: parseInt(fairId) }
    })
    if (!fair || !fair.isActive) {
      return res.status(400).json({ error: 'Fuar bulunamadı veya aktif değil' })
    }

    const boothType = await prisma.virtualBoothType.findUnique({
      where: { id: parseInt(boothTypeId) }
    })
    if (!boothType || !boothType.isActive) {
      return res.status(400).json({ error: 'Stant türü bulunamadı veya aktif değil' })
    }

    // Aynı firmadan aynı fuara başvuru kontrolü
    const existingApp = await prisma.virtualBoothApplication.findFirst({
      where: {
        fairId: parseInt(fairId),
        email: email,
        status: { not: 'REJECTED' }
      }
    })

    if (existingApp) {
      return res.status(400).json({ error: 'Bu e-posta ile zaten bir başvuru yapılmış' })
    }

    const application = await prisma.virtualBoothApplication.create({
      data: {
        fairId: parseInt(fairId),
        boothTypeId: parseInt(boothTypeId),
        companyName,
        contactName,
        email,
        phone,
        website,
        message,
        status: 'PENDING'
      },
      include: {
        fair: true,
        boothType: true
      }
    })

    res.status(201).json({
      message: 'Başvurunuz alındı',
      applicationId: application.id
    })
  } catch (error) {
    console.error('Başvuru oluşturulamadı:', error)
    res.status(500).json({ error: 'Başvuru oluşturulamadı' })
  }
})

// ==================
// ADMIN ENDPOINTS
// ==================

// İstatistikler
router.get('/stats', auth, async (req, res) => {
  try {
    const { fairId } = req.query

    const where = fairId ? { fairId: parseInt(fairId) } : {}

    const [pending, approved, rejected, total] = await Promise.all([
      prisma.virtualBoothApplication.count({ where: { ...where, status: 'PENDING' } }),
      prisma.virtualBoothApplication.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.virtualBoothApplication.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.virtualBoothApplication.count({ where })
    ])

    res.json({ pending, approved, rejected, total })
  } catch (error) {
    console.error('İstatistikler alınamadı:', error)
    res.status(500).json({ error: 'İstatistikler alınamadı' })
  }
})

// Tüm başvuruları listele
router.get('/', auth, async (req, res) => {
  try {
    const { status, fairId, page = 1, limit = 20 } = req.query

    const where = {}
    if (status) where.status = status
    if (fairId) where.fairId = parseInt(fairId)

    const [applications, total] = await Promise.all([
      prisma.virtualBoothApplication.findMany({
        where,
        include: {
          fair: { select: { id: true, title: true, slug: true } },
          boothType: { select: { id: true, name: true, price: true } },
          booth: { select: { id: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.virtualBoothApplication.count({ where })
    ])

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Başvurular alınamadı:', error)
    res.status(500).json({ error: 'Başvurular alınamadı' })
  }
})

// Tek başvuru detayı
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await prisma.virtualBoothApplication.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        fair: true,
        boothType: true,
        booth: true
      }
    })

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' })
    }

    res.json(application)
  } catch (error) {
    console.error('Başvuru alınamadı:', error)
    res.status(500).json({ error: 'Başvuru alınamadı' })
  }
})

// Başvuru durumu güncelle
router.put('/:id/status', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { status, adminNotes } = req.body

    if (!['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum' })
    }

    const application = await prisma.virtualBoothApplication.findUnique({
      where: { id },
      include: { booth: true }
    })

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' })
    }

    // Onay durumunda stant oluştur
    if (status === 'APPROVED' && !application.booth) {
      // Transaction ile başvuru güncelle ve stant oluştur
      const result = await prisma.$transaction(async (tx) => {
        // Başvuruyu güncelle
        const updatedApp = await tx.virtualBoothApplication.update({
          where: { id },
          data: {
            status,
            adminNotes,
            reviewedAt: new Date(),
            reviewedBy: req.user?.id
          }
        })

        // Stant oluştur
        const booth = await tx.virtualBooth.create({
          data: {
            fairId: application.fairId,
            boothTypeId: application.boothTypeId,
            applicationId: id,
            companyName: application.companyName,
            website: application.website,
            email: application.email,
            phone: application.phone,
            isActive: true
          }
        })

        return { application: updatedApp, booth }
      })

      return res.json(result)
    }

    // Diğer durumlar için sadece güncelle
    const updatedApp = await prisma.virtualBoothApplication.update({
      where: { id },
      data: {
        status,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user?.id
      },
      include: {
        fair: true,
        boothType: true,
        booth: true
      }
    })

    res.json(updatedApp)
  } catch (error) {
    console.error('Başvuru güncellenemedi:', error)
    res.status(500).json({ error: 'Başvuru güncellenemedi' })
  }
})

// Başvuru sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const application = await prisma.virtualBoothApplication.findUnique({
      where: { id },
      include: { booth: true }
    })

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' })
    }

    // Eğer stant oluşturulmuşsa önce onu sil
    if (application.booth) {
      await prisma.virtualBooth.delete({ where: { id: application.booth.id } })
    }

    await prisma.virtualBoothApplication.delete({ where: { id } })

    res.json({ message: 'Başvuru silindi' })
  } catch (error) {
    console.error('Başvuru silinemedi:', error)
    res.status(500).json({ error: 'Başvuru silinemedi' })
  }
})

module.exports = router
