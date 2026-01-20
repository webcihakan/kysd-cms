const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth, adminOnly } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const prisma = require('../lib/prisma')

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/projects')
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

// Tum projeleri getir (public)
router.get('/', async (req, res) => {
  try {
    const { category, status, featured } = req.query

    const where = { isActive: true }
    if (category) where.category = category
    if (status) where.status = status
    if (featured === 'true') where.isFeatured = true

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(projects)
  } catch (error) {
    console.error('Projeler getirilemedi:', error)
    res.status(500).json({ error: 'Projeler getirilemedi' })
  }
})

// Admin - tum projeler
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: 'Projeler getirilemedi' })
  }
})

// Tek proje getir (slug ile)
router.get('/slug/:slug', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug }
    })
    if (!project || !project.isActive) {
      return res.status(404).json({ error: 'Proje bulunamadi' })
    }
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: 'Proje getirilemedi' })
  }
})

// Tek proje getir (ID ile - admin)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (!project) {
      return res.status(404).json({ error: 'Proje bulunamadi' })
    }
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: 'Proje getirilemedi' })
  }
})

// Proje olustur
router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const {
      title, description, category, status, startDate, endDate,
      budget, funder, partners, location, beneficiaries, progress,
      objectives, outcomes, isFeatured, isActive, order
    } = req.body

    let slug = createSlug(title)
    const existingSlug = await prisma.project.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        category: category || 'national',
        status: status || 'ongoing',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget,
        funder,
        partners,
        location,
        beneficiaries: beneficiaries ? parseInt(beneficiaries) : null,
        progress: progress ? parseInt(progress) : 0,
        objectives,
        outcomes,
        image: req.file ? `/uploads/projects/${req.file.filename}` : null,
        isFeatured: isFeatured === 'true',
        isActive: isActive !== 'false',
        order: order ? parseInt(order) : 0
      }
    })
    res.status(201).json(project)
  } catch (error) {
    console.error('Proje olusturulamadi:', error)
    res.status(500).json({ error: 'Proje olusturulamadi' })
  }
})

// Proje guncelle
router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const {
      title, description, category, status, startDate, endDate,
      budget, funder, partners, location, beneficiaries, progress,
      objectives, outcomes, isFeatured, isActive, order
    } = req.body

    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'Proje bulunamadi' })
    }

    // Eski resmi sil
    if (req.file && existing.image) {
      const oldPath = path.join(__dirname, '../..', existing.image)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        category,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget,
        funder,
        partners,
        location,
        beneficiaries: beneficiaries ? parseInt(beneficiaries) : null,
        progress: progress ? parseInt(progress) : 0,
        objectives,
        outcomes,
        image: req.file ? `/uploads/projects/${req.file.filename}` : existing.image,
        isFeatured: isFeatured === 'true',
        isActive: isActive !== 'false',
        order: order ? parseInt(order) : 0
      }
    })
    res.json(project)
  } catch (error) {
    console.error('Proje guncellenemedi:', error)
    res.status(500).json({ error: 'Proje guncellenemedi' })
  }
})

// Proje sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const project = await prisma.project.findUnique({ where: { id } })

    if (!project) {
      return res.status(404).json({ error: 'Proje bulunamadi' })
    }

    // Resmi sil
    if (project.image) {
      const imagePath = path.join(__dirname, '../..', project.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await prisma.project.delete({ where: { id } })
    res.json({ message: 'Proje silindi' })
  } catch (error) {
    res.status(500).json({ error: 'Proje silinemedi' })
  }
})

module.exports = router
