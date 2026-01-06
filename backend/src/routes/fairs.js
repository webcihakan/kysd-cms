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
    const uploadPath = path.join(__dirname, '../../uploads/fairs')
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

// Tum fuarlari getir (public)
router.get('/', async (req, res) => {
  try {
    const { featured, kysdOrganized, upcoming } = req.query

    const where = { isActive: true }
    if (featured === 'true') where.isFeatured = true
    if (kysdOrganized === 'true') where.isKysdOrganized = true
    if (upcoming === 'true') {
      where.startDate = { gte: new Date() }
    }

    const fairs = await prisma.fair.findMany({
      where,
      orderBy: [{ order: 'asc' }, { startDate: 'asc' }]
    })
    res.json(fairs)
  } catch (error) {
    console.error('Fuarlar getirilemedi:', error)
    res.status(500).json({ error: 'Fuarlar getirilemedi' })
  }
})

// Admin - tum fuarlar
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const fairs = await prisma.fair.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(fairs)
  } catch (error) {
    res.status(500).json({ error: 'Fuarlar getirilemedi' })
  }
})

// Tek fuar getir (slug ile)
router.get('/slug/:slug', async (req, res) => {
  try {
    const fair = await prisma.fair.findUnique({
      where: { slug: req.params.slug }
    })
    if (!fair || !fair.isActive) {
      return res.status(404).json({ error: 'Fuar bulunamadi' })
    }
    res.json(fair)
  } catch (error) {
    res.status(500).json({ error: 'Fuar getirilemedi' })
  }
})

// Tek fuar getir (ID ile - admin)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const fair = await prisma.fair.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (!fair) {
      return res.status(404).json({ error: 'Fuar bulunamadi' })
    }
    res.json(fair)
  } catch (error) {
    res.status(500).json({ error: 'Fuar getirilemedi' })
  }
})

// Fuar olustur
router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const {
      title, description, location, country, startDate, endDate,
      deadline, organizer, website, boothInfo, discount,
      isFeatured, isKysdOrganized, isActive, order
    } = req.body

    let slug = createSlug(title)
    const existingSlug = await prisma.fair.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const fair = await prisma.fair.create({
      data: {
        title,
        slug,
        description,
        location,
        country,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        organizer,
        website,
        boothInfo,
        discount,
        image: req.file ? `/uploads/fairs/${req.file.filename}` : null,
        isFeatured: isFeatured === 'true',
        isKysdOrganized: isKysdOrganized === 'true',
        isActive: isActive !== 'false',
        order: order ? parseInt(order) : 0
      }
    })
    res.status(201).json(fair)
  } catch (error) {
    console.error('Fuar olusturulamadi:', error)
    res.status(500).json({ error: 'Fuar olusturulamadi' })
  }
})

// Fuar guncelle
router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const {
      title, description, location, country, startDate, endDate,
      deadline, organizer, website, boothInfo, discount,
      isFeatured, isKysdOrganized, isActive, order
    } = req.body

    const existing = await prisma.fair.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'Fuar bulunamadi' })
    }

    // Eski resmi sil
    if (req.file && existing.image) {
      const oldPath = path.join(__dirname, '../..', existing.image)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    const fair = await prisma.fair.update({
      where: { id },
      data: {
        title,
        description,
        location,
        country,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        organizer,
        website,
        boothInfo,
        discount,
        image: req.file ? `/uploads/fairs/${req.file.filename}` : existing.image,
        isFeatured: isFeatured === 'true',
        isKysdOrganized: isKysdOrganized === 'true',
        isActive: isActive !== 'false',
        order: order ? parseInt(order) : 0
      }
    })
    res.json(fair)
  } catch (error) {
    console.error('Fuar guncellenemedi:', error)
    res.status(500).json({ error: 'Fuar guncellenemedi' })
  }
})

// Fuar sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const fair = await prisma.fair.findUnique({ where: { id } })

    if (!fair) {
      return res.status(404).json({ error: 'Fuar bulunamadi' })
    }

    // Resmi sil
    if (fair.image) {
      const imagePath = path.join(__dirname, '../..', fair.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await prisma.fair.delete({ where: { id } })
    res.json({ message: 'Fuar silindi' })
  } catch (error) {
    res.status(500).json({ error: 'Fuar silinemedi' })
  }
})

module.exports = router
