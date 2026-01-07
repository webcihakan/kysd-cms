const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth, adminOnly } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const prisma = new PrismaClient()

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/travel-guides')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      return cb(null, true)
    }
    cb(new Error('Sadece resim dosyalari yuklenebilir'))
  }
})

// Slug olusturma
const createSlug = (text) => {
  const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
                  'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' }
  return text
    .split('').map(char => trMap[char] || char).join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Ulke listesi (fuar ulkeleri)
router.get('/countries', async (req, res) => {
  try {
    // Fairs tablosundan benzersiz ulkeleri al
    const fairs = await prisma.fair.findMany({
      where: {
        country: { not: null },
        isActive: true
      },
      select: { country: true },
      distinct: ['country']
    })

    const countries = fairs.map(f => f.country).filter(Boolean).sort()
    res.json(countries)
  } catch (error) {
    console.error('Ulkeler getirilemedi:', error)
    res.status(500).json({ error: 'Ulkeler getirilemedi' })
  }
})

// Ulkeye gore rehberler (public)
router.get('/country/:country', async (req, res) => {
  try {
    const { category } = req.query
    const where = {
      country: req.params.country,
      isActive: true
    }

    if (category) {
      where.category = category
    }

    const guides = await prisma.travelGuide.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 3
        }
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(guides)
  } catch (error) {
    console.error('Rehberler getirilemedi:', error)
    res.status(500).json({ error: 'Rehberler getirilemedi' })
  }
})

// Tek rehber getir (slug ile - public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const guide = await prisma.travelGuide.findUnique({
      where: { slug: req.params.slug },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!guide || !guide.isActive) {
      return res.status(404).json({ error: 'Rehber bulunamadi' })
    }

    // Goruntulenme sayisini artir
    await prisma.travelGuide.update({
      where: { id: guide.id },
      data: { viewCount: { increment: 1 } }
    })

    res.json(guide)
  } catch (error) {
    console.error('Rehber getirilemedi:', error)
    res.status(500).json({ error: 'Rehber getirilemedi' })
  }
})

// Admin - tum rehberler
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const guides = await prisma.travelGuide.findMany({
      include: {
        images: true
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(guides)
  } catch (error) {
    console.error('Rehberler getirilemedi:', error)
    res.status(500).json({ error: 'Rehberler getirilemedi' })
  }
})

// Tek rehber getir (ID ile - admin)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const guide = await prisma.travelGuide.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!guide) {
      return res.status(404).json({ error: 'Rehber bulunamadi' })
    }

    res.json(guide)
  } catch (error) {
    console.error('Rehber getirilemedi:', error)
    res.status(500).json({ error: 'Rehber getirilemedi' })
  }
})

// Yeni rehber olustur
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      country, city, name, description, category,
      address, googleMapsEmbed, phone, website,
      openingHours, priceRange, isActive, order
    } = req.body

    let slug = createSlug(name)
    const existingSlug = await prisma.travelGuide.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const guide = await prisma.travelGuide.create({
      data: {
        country,
        city,
        name,
        slug,
        description,
        category,
        address,
        googleMapsEmbed,
        phone,
        website,
        openingHours,
        priceRange,
        isActive: isActive !== 'false',
        order: order ? parseInt(order) : 0
      }
    })

    res.status(201).json(guide)
  } catch (error) {
    console.error('Rehber olusturulamadi:', error)
    res.status(500).json({ error: 'Rehber olusturulamadi' })
  }
})

// Rehber guncelle
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const {
      country, city, name, description, category,
      address, googleMapsEmbed, phone, website,
      openingHours, priceRange, isActive, order
    } = req.body

    const existing = await prisma.travelGuide.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'Rehber bulunamadi' })
    }

    const guide = await prisma.travelGuide.update({
      where: { id },
      data: {
        country,
        city,
        name,
        description,
        category,
        address,
        googleMapsEmbed,
        phone,
        website,
        openingHours,
        priceRange,
        isActive: isActive !== 'false',
        order: order ? parseInt(order) : 0
      }
    })

    res.json(guide)
  } catch (error) {
    console.error('Rehber guncellenemedi:', error)
    res.status(500).json({ error: 'Rehber guncellenemedi' })
  }
})

// Rehber sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const guide = await prisma.travelGuide.findUnique({
      where: { id },
      include: { images: true }
    })

    if (!guide) {
      return res.status(404).json({ error: 'Rehber bulunamadi' })
    }

    // Tum resimleri sil
    for (const image of guide.images) {
      const imagePath = path.join(__dirname, '../..', image.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await prisma.travelGuide.delete({ where: { id } })
    res.json({ message: 'Rehber silindi' })
  } catch (error) {
    console.error('Rehber silinemedi:', error)
    res.status(500).json({ error: 'Rehber silinemedi' })
  }
})

// =====================
// RESIM İŞLEMLERİ
// =====================

// Rehbere resim ekle
router.post('/:id/images', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const guideId = parseInt(req.params.id)
    const { title, description, order } = req.body

    // Rehberin var oldugundan emin ol
    const guide = await prisma.travelGuide.findUnique({ where: { id: guideId } })
    if (!guide) {
      return res.status(404).json({ error: 'Rehber bulunamadi' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Resim dosyasi gerekli' })
    }

    const image = await prisma.travelGuideImage.create({
      data: {
        guideId,
        image: `/uploads/travel-guides/${req.file.filename}`,
        title: title || null,
        description: description || null,
        order: order ? parseInt(order) : 0
      }
    })

    res.status(201).json(image)
  } catch (error) {
    console.error('Resim eklenemedi:', error)
    res.status(500).json({ error: 'Resim eklenemedi' })
  }
})

// Resim guncelle
router.put('/images/:imageId', auth, adminOnly, async (req, res) => {
  try {
    const imageId = parseInt(req.params.imageId)
    const { title, description, order } = req.body

    const image = await prisma.travelGuideImage.update({
      where: { id: imageId },
      data: {
        title: title || null,
        description: description || null,
        order: order ? parseInt(order) : 0
      }
    })

    res.json(image)
  } catch (error) {
    console.error('Resim guncellenemedi:', error)
    res.status(500).json({ error: 'Resim guncellenemedi' })
  }
})

// Resim sil
router.delete('/images/:imageId', auth, adminOnly, async (req, res) => {
  try {
    const imageId = parseInt(req.params.imageId)
    const image = await prisma.travelGuideImage.findUnique({ where: { id: imageId } })

    if (!image) {
      return res.status(404).json({ error: 'Resim bulunamadi' })
    }

    // Dosyayi sil
    const imagePath = path.join(__dirname, '../..', image.image)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }

    await prisma.travelGuideImage.delete({ where: { id: imageId } })
    res.json({ message: 'Resim silindi' })
  } catch (error) {
    console.error('Resim silinemedi:', error)
    res.status(500).json({ error: 'Resim silinemedi' })
  }
})

module.exports = router
