const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = require('../lib/prisma')
const { auth } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/virtual-fairs'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      cb(null, true)
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir'), false)
    }
  }
})

// Slug oluştur
const createSlug = (text) => {
  const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }
  return text.toLowerCase()
    .replace(/[çğıöşü]/g, c => trMap[c] || c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ==================
// PUBLIC ENDPOINTS
// ==================

// Aktif fuarları listele
router.get('/', async (req, res) => {
  try {
    const fairs = await prisma.virtualFair.findMany({
      where: { isActive: true },
      include: {
        boothTypes: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { booths: true, applications: true }
        }
      },
      orderBy: { startDate: 'desc' }
    })
    res.json(fairs)
  } catch (error) {
    console.error('Sanal fuarlar alınamadı:', error)
    res.status(500).json({ error: 'Sanal fuarlar alınamadı' })
  }
})

// Slug ile fuar detayı (stantlarla birlikte)
router.get('/slug/:slug', async (req, res) => {
  try {
    const fair = await prisma.virtualFair.findUnique({
      where: { slug: req.params.slug },
      include: {
        boothTypes: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        booths: {
          where: { isActive: true },
          include: {
            boothType: true,
            products: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!fair) {
      return res.status(404).json({ error: 'Fuar bulunamadı' })
    }

    res.json(fair)
  } catch (error) {
    console.error('Fuar detayı alınamadı:', error)
    res.status(500).json({ error: 'Fuar detayı alınamadı' })
  }
})

// ==================
// ADMIN ENDPOINTS
// ==================

// Tüm fuarları listele (Admin)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const fairs = await prisma.virtualFair.findMany({
      include: {
        boothTypes: true,
        _count: {
          select: { booths: true, applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(fairs)
  } catch (error) {
    console.error('Fuarlar alınamadı:', error)
    res.status(500).json({ error: 'Fuarlar alınamadı' })
  }
})

// ID ile fuar detayı (Admin)
router.get('/admin/:id', auth, async (req, res) => {
  try {
    const fair = await prisma.virtualFair.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        boothTypes: {
          orderBy: { order: 'asc' }
        },
        booths: {
          include: {
            boothType: true,
            application: true
          }
        },
        applications: {
          include: { boothType: true }
        }
      }
    })

    if (!fair) {
      return res.status(404).json({ error: 'Fuar bulunamadı' })
    }

    res.json(fair)
  } catch (error) {
    console.error('Fuar detayı alınamadı:', error)
    res.status(500).json({ error: 'Fuar detayı alınamadı' })
  }
})

// Yeni fuar oluştur
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, startDate, endDate, isActive } = req.body

    let slug = createSlug(title)

    // Benzersiz slug kontrolü
    const existing = await prisma.virtualFair.findUnique({ where: { slug } })
    if (existing) {
      slug = slug + '-' + Date.now()
    }

    const fair = await prisma.virtualFair.create({
      data: {
        title,
        slug,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverImage: req.file ? `/uploads/virtual-fairs/${req.file.filename}` : null,
        isActive: isActive === 'true' || isActive === true
      }
    })

    res.status(201).json(fair)
  } catch (error) {
    console.error('Fuar oluşturulamadı:', error)
    res.status(500).json({ error: 'Fuar oluşturulamadı' })
  }
})

// Fuar güncelle
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, startDate, endDate, isActive } = req.body
    const id = parseInt(req.params.id)

    const existingFair = await prisma.virtualFair.findUnique({ where: { id } })
    if (!existingFair) {
      return res.status(404).json({ error: 'Fuar bulunamadı' })
    }

    const updateData = {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive === 'true' || isActive === true
    }

    // Yeni resim yüklendiyse
    if (req.file) {
      updateData.coverImage = `/uploads/virtual-fairs/${req.file.filename}`

      // Eski resmi sil
      if (existingFair.coverImage) {
        const oldPath = path.join(__dirname, '../../', existingFair.coverImage)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
    }

    const fair = await prisma.virtualFair.update({
      where: { id },
      data: updateData
    })

    res.json(fair)
  } catch (error) {
    console.error('Fuar güncellenemedi:', error)
    res.status(500).json({ error: 'Fuar güncellenemedi' })
  }
})

// Fuar sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const fair = await prisma.virtualFair.findUnique({ where: { id } })
    if (!fair) {
      return res.status(404).json({ error: 'Fuar bulunamadı' })
    }

    // Kapak resmini sil
    if (fair.coverImage) {
      const imagePath = path.join(__dirname, '../../', fair.coverImage)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await prisma.virtualFair.delete({ where: { id } })

    res.json({ message: 'Fuar silindi' })
  } catch (error) {
    console.error('Fuar silinemedi:', error)
    res.status(500).json({ error: 'Fuar silinemedi' })
  }
})

module.exports = router
