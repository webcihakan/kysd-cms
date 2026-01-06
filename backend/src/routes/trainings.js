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
    const uploadPath = path.join(__dirname, '../../uploads/trainings')
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

// Tum egitimleri getir (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query

    const where = { isActive: true }
    if (category) where.category = category
    if (featured === 'true') where.isFeatured = true

    const trainings = await prisma.training.findMany({
      where,
      orderBy: [{ order: 'asc' }, { eventDate: 'asc' }]
    })
    res.json(trainings)
  } catch (error) {
    console.error('Egitimler getirilemedi:', error)
    res.status(500).json({ error: 'Egitimler getirilemedi' })
  }
})

// Admin - tum egitimler
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const trainings = await prisma.training.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(trainings)
  } catch (error) {
    res.status(500).json({ error: 'Egitimler getirilemedi' })
  }
})

// Tek egitim getir (slug ile)
router.get('/slug/:slug', async (req, res) => {
  try {
    const training = await prisma.training.findUnique({
      where: { slug: req.params.slug }
    })
    if (!training || !training.isActive) {
      return res.status(404).json({ error: 'Egitim bulunamadi' })
    }
    res.json(training)
  } catch (error) {
    res.status(500).json({ error: 'Egitim getirilemedi' })
  }
})

// Tek egitim getir (ID ile - admin)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const training = await prisma.training.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (!training) {
      return res.status(404).json({ error: 'Egitim bulunamadi' })
    }
    res.json(training)
  } catch (error) {
    res.status(500).json({ error: 'Egitim getirilemedi' })
  }
})

// Egitim olustur
router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const {
      title, description, category, instructor, duration, quota,
      price, location, eventDate, eventTime, syllabus, requirements,
      isFeatured, isActive, order
    } = req.body

    let slug = createSlug(title)
    const existingSlug = await prisma.training.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const training = await prisma.training.create({
      data: {
        title,
        slug,
        description,
        category: category || 'seminar',
        instructor,
        duration,
        quota: quota ? parseInt(quota) : null,
        price,
        location,
        eventDate: eventDate ? new Date(eventDate) : null,
        eventTime,
        syllabus,
        requirements,
        image: req.file ? `/uploads/trainings/${req.file.filename}` : null,
        isFeatured: isFeatured === 'true',
        isActive: isActive !== 'false',
        order: order ? parseInt(order) : 0
      }
    })
    res.status(201).json(training)
  } catch (error) {
    console.error('Egitim olusturulamadi:', error)
    res.status(500).json({ error: 'Egitim olusturulamadi' })
  }
})

// Egitim guncelle
router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const {
      title, description, category, instructor, duration, quota,
      price, location, eventDate, eventTime, syllabus, requirements,
      isFeatured, isActive, order
    } = req.body

    const existing = await prisma.training.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'Egitim bulunamadi' })
    }

    // Eski resmi sil
    if (req.file && existing.image) {
      const oldPath = path.join(__dirname, '../..', existing.image)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    const training = await prisma.training.update({
      where: { id },
      data: {
        title,
        description,
        category,
        instructor,
        duration,
        quota: quota ? parseInt(quota) : null,
        price,
        location,
        eventDate: eventDate ? new Date(eventDate) : null,
        eventTime,
        syllabus,
        requirements,
        image: req.file ? `/uploads/trainings/${req.file.filename}` : existing.image,
        isFeatured: isFeatured === 'true',
        isActive: isActive !== 'false',
        order: order ? parseInt(order) : 0
      }
    })
    res.json(training)
  } catch (error) {
    console.error('Egitim guncellenemedi:', error)
    res.status(500).json({ error: 'Egitim guncellenemedi' })
  }
})

// Egitim sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const training = await prisma.training.findUnique({ where: { id } })

    if (!training) {
      return res.status(404).json({ error: 'Egitim bulunamadi' })
    }

    // Resmi sil
    if (training.image) {
      const imagePath = path.join(__dirname, '../..', training.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await prisma.training.delete({ where: { id } })
    res.json({ message: 'Egitim silindi' })
  } catch (error) {
    res.status(500).json({ error: 'Egitim silinemedi' })
  }
})

module.exports = router
