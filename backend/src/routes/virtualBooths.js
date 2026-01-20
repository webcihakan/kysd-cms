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
    const dir = 'uploads/virtual-booths'
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
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Sadece resim ve PDF dosyaları yüklenebilir'), false)
    }
  }
})

// ==================
// PUBLIC ENDPOINTS
// ==================

// Fuar stantlarını listele
router.get('/fair/:fairId', async (req, res) => {
  try {
    const fairId = parseInt(req.params.fairId)

    const booths = await prisma.virtualBooth.findMany({
      where: {
        fairId,
        isActive: true
      },
      include: {
        boothType: {
          select: { id: true, name: true, price: true }
        },
        products: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          take: 6
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    res.json(booths)
  } catch (error) {
    console.error('Stantlar alınamadı:', error)
    res.status(500).json({ error: 'Stantlar alınamadı' })
  }
})

// Stant detayı (ve görüntülenme sayısını artır)
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const booth = await prisma.virtualBooth.findUnique({
      where: { id },
      include: {
        fair: {
          select: { id: true, title: true, slug: true }
        },
        boothType: true,
        products: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!booth) {
      return res.status(404).json({ error: 'Stant bulunamadı' })
    }

    // Görüntülenme sayısını artır
    await prisma.virtualBooth.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    })

    res.json(booth)
  } catch (error) {
    console.error('Stant alınamadı:', error)
    res.status(500).json({ error: 'Stant alınamadı' })
  }
})

// ==================
// ADMIN ENDPOINTS
// ==================

// Tüm stantları listele (Admin)
router.get('/admin/fair/:fairId', auth, async (req, res) => {
  try {
    const fairId = parseInt(req.params.fairId)

    const booths = await prisma.virtualBooth.findMany({
      where: { fairId },
      include: {
        boothType: true,
        application: {
          select: { id: true, contactName: true, email: true, phone: true }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    res.json(booths)
  } catch (error) {
    console.error('Stantlar alınamadı:', error)
    res.status(500).json({ error: 'Stantlar alınamadı' })
  }
})

// Admin stant detayı
router.get('/admin/:id', auth, async (req, res) => {
  try {
    const booth = await prisma.virtualBooth.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        fair: true,
        boothType: true,
        application: true,
        products: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!booth) {
      return res.status(404).json({ error: 'Stant bulunamadı' })
    }

    res.json(booth)
  } catch (error) {
    console.error('Stant alınamadı:', error)
    res.status(500).json({ error: 'Stant alınamadı' })
  }
})

// Stant güncelle
router.put('/:id', auth, upload.fields([
  { name: 'companyLogo', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
  { name: 'catalogFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const {
      companyName,
      description,
      website,
      email,
      phone,
      videoUrl,
      isActive,
      order
    } = req.body

    const existingBooth = await prisma.virtualBooth.findUnique({ where: { id } })
    if (!existingBooth) {
      return res.status(404).json({ error: 'Stant bulunamadı' })
    }

    const updateData = {
      companyName,
      description,
      website,
      email,
      phone,
      videoUrl,
      isActive: isActive === 'true' || isActive === true,
      order: parseInt(order) || 0
    }

    // Dosya yüklemeleri
    if (req.files) {
      if (req.files.companyLogo) {
        updateData.companyLogo = `/uploads/virtual-booths/${req.files.companyLogo[0].filename}`
        // Eski logoyu sil
        if (existingBooth.companyLogo) {
          const oldPath = path.join(__dirname, '../../', existingBooth.companyLogo)
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }
      }

      if (req.files.bannerImage) {
        updateData.bannerImage = `/uploads/virtual-booths/${req.files.bannerImage[0].filename}`
        if (existingBooth.bannerImage) {
          const oldPath = path.join(__dirname, '../../', existingBooth.bannerImage)
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }
      }

      if (req.files.catalogFile) {
        updateData.catalogUrl = `/uploads/virtual-booths/${req.files.catalogFile[0].filename}`
        if (existingBooth.catalogUrl) {
          const oldPath = path.join(__dirname, '../../', existingBooth.catalogUrl)
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }
      }
    }

    const booth = await prisma.virtualBooth.update({
      where: { id },
      data: updateData,
      include: {
        boothType: true,
        products: true
      }
    })

    res.json(booth)
  } catch (error) {
    console.error('Stant güncellenemedi:', error)
    res.status(500).json({ error: 'Stant güncellenemedi' })
  }
})

// Stant sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const booth = await prisma.virtualBooth.findUnique({ where: { id } })
    if (!booth) {
      return res.status(404).json({ error: 'Stant bulunamadı' })
    }

    // Dosyaları sil
    const filesToDelete = [booth.companyLogo, booth.bannerImage, booth.catalogUrl]
    filesToDelete.forEach(file => {
      if (file) {
        const filePath = path.join(__dirname, '../../', file)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      }
    })

    await prisma.virtualBooth.delete({ where: { id } })

    res.json({ message: 'Stant silindi' })
  } catch (error) {
    console.error('Stant silinemedi:', error)
    res.status(500).json({ error: 'Stant silinemedi' })
  }
})

// ==================
// ÜRÜN YÖNETİMİ
// ==================

// Ürün ekle
router.post('/:id/products', auth, upload.single('image'), async (req, res) => {
  try {
    const boothId = parseInt(req.params.id)
    const { name, description, price, order, isActive } = req.body

    const booth = await prisma.virtualBooth.findUnique({
      where: { id: boothId },
      include: { boothType: true }
    })

    if (!booth) {
      return res.status(404).json({ error: 'Stant bulunamadı' })
    }

    // Ürün sayısı kontrolü
    const productCount = await prisma.virtualBoothProduct.count({ where: { boothId } })
    if (productCount >= booth.boothType.maxProducts) {
      return res.status(400).json({
        error: `Bu stant türünde maksimum ${booth.boothType.maxProducts} ürün eklenebilir`
      })
    }

    const product = await prisma.virtualBoothProduct.create({
      data: {
        boothId,
        name,
        description,
        price,
        order: parseInt(order) || 0,
        isActive: isActive !== false,
        image: req.file ? `/uploads/virtual-booths/${req.file.filename}` : null
      }
    })

    res.status(201).json(product)
  } catch (error) {
    console.error('Ürün eklenemedi:', error)
    res.status(500).json({ error: 'Ürün eklenemedi' })
  }
})

// Ürün güncelle
router.put('/products/:productId', auth, upload.single('image'), async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const { name, description, price, order, isActive } = req.body

    const existingProduct = await prisma.virtualBoothProduct.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return res.status(404).json({ error: 'Ürün bulunamadı' })
    }

    const updateData = {
      name,
      description,
      price,
      order: parseInt(order) || 0,
      isActive: isActive === 'true' || isActive === true
    }

    if (req.file) {
      updateData.image = `/uploads/virtual-booths/${req.file.filename}`
      if (existingProduct.image) {
        const oldPath = path.join(__dirname, '../../', existingProduct.image)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
    }

    const product = await prisma.virtualBoothProduct.update({
      where: { id: productId },
      data: updateData
    })

    res.json(product)
  } catch (error) {
    console.error('Ürün güncellenemedi:', error)
    res.status(500).json({ error: 'Ürün güncellenemedi' })
  }
})

// Ürün sil
router.delete('/products/:productId', auth, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)

    const product = await prisma.virtualBoothProduct.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' })
    }

    if (product.image) {
      const imagePath = path.join(__dirname, '../../', product.image)
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
    }

    await prisma.virtualBoothProduct.delete({ where: { id: productId } })

    res.json({ message: 'Ürün silindi' })
  } catch (error) {
    console.error('Ürün silinemedi:', error)
    res.status(500).json({ error: 'Ürün silinemedi' })
  }
})

module.exports = router
