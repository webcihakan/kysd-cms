const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth, adminOnly } = require('../middleware/auth')

const prisma = require('../lib/prisma')

// Public - Reklam pozisyonlarını getir (fiyatlandırma sayfası için)
router.get('/', async (req, res) => {
  try {
    const positions = await prisma.advertisementPosition.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    res.json(positions)
  } catch (error) {
    console.error('Reklam pozisyonları getirilemedi:', error)
    res.status(500).json({ error: 'Reklam pozisyonları getirilemedi' })
  }
})

// Public - Kod ile pozisyon getir
router.get('/code/:code', async (req, res) => {
  try {
    const position = await prisma.advertisementPosition.findUnique({
      where: { code: req.params.code }
    })

    if (!position) {
      return res.status(404).json({ error: 'Pozisyon bulunamadı' })
    }

    res.json(position)
  } catch (error) {
    console.error('Pozisyon getirilemedi:', error)
    res.status(500).json({ error: 'Pozisyon getirilemedi' })
  }
})

// Admin - Tüm pozisyonları getir
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const positions = await prisma.advertisementPosition.findMany({
      orderBy: { order: 'asc' }
    })

    res.json(positions)
  } catch (error) {
    console.error('Reklam pozisyonları getirilemedi:', error)
    res.status(500).json({ error: 'Reklam pozisyonları getirilemedi' })
  }
})

// Tek pozisyon getir
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const position = await prisma.advertisementPosition.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!position) {
      return res.status(404).json({ error: 'Pozisyon bulunamadı' })
    }

    res.json(position)
  } catch (error) {
    console.error('Pozisyon getirilemedi:', error)
    res.status(500).json({ error: 'Pozisyon getirilemedi' })
  }
})

// Yeni pozisyon oluştur
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, code, description, width, height, priceMonthly, priceQuarterly, priceYearly, isActive, order } = req.body

    const position = await prisma.advertisementPosition.create({
      data: {
        name,
        code,
        description,
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) : null,
        priceQuarterly: priceQuarterly ? parseFloat(priceQuarterly) : null,
        priceYearly: priceYearly ? parseFloat(priceYearly) : null,
        isActive: isActive !== false,
        order: order ? parseInt(order) : 0
      }
    })

    res.status(201).json(position)
  } catch (error) {
    console.error('Pozisyon oluşturulamadı:', error)
    res.status(500).json({ error: 'Pozisyon oluşturulamadı' })
  }
})

// Pozisyon güncelle
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, code, description, width, height, priceMonthly, priceQuarterly, priceYearly, isActive, order } = req.body

    const position = await prisma.advertisementPosition.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        code,
        description,
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) : null,
        priceQuarterly: priceQuarterly ? parseFloat(priceQuarterly) : null,
        priceYearly: priceYearly ? parseFloat(priceYearly) : null,
        isActive,
        order: order ? parseInt(order) : undefined
      }
    })

    res.json(position)
  } catch (error) {
    console.error('Pozisyon güncellenemedi:', error)
    res.status(500).json({ error: 'Pozisyon güncellenemedi' })
  }
})

// Aktif/Pasif değiştir
router.patch('/:id/toggle-active', auth, adminOnly, async (req, res) => {
  try {
    const position = await prisma.advertisementPosition.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!position) {
      return res.status(404).json({ error: 'Pozisyon bulunamadı' })
    }

    const updated = await prisma.advertisementPosition.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: !position.isActive }
    })

    res.json(updated)
  } catch (error) {
    console.error('Durum güncellenemedi:', error)
    res.status(500).json({ error: 'Durum güncellenemedi' })
  }
})

// Pozisyon sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.advertisementPosition.delete({
      where: { id: parseInt(req.params.id) }
    })

    res.json({ message: 'Pozisyon silindi' })
  } catch (error) {
    console.error('Pozisyon silinemedi:', error)
    res.status(500).json({ error: 'Pozisyon silinemedi' })
  }
})

module.exports = router
