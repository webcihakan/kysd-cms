const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = require('../lib/prisma')
const { auth } = require('../middleware/auth')

// ==================
// PUBLIC ENDPOINTS
// ==================

// Fuar stant türlerini listele
router.get('/fair/:fairId', async (req, res) => {
  try {
    const fairId = parseInt(req.params.fairId)

    const boothTypes = await prisma.virtualBoothType.findMany({
      where: {
        fairId,
        isActive: true
      },
      include: {
        _count: {
          select: { booths: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    res.json(boothTypes)
  } catch (error) {
    console.error('Stant türleri alınamadı:', error)
    res.status(500).json({ error: 'Stant türleri alınamadı' })
  }
})

// ==================
// ADMIN ENDPOINTS
// ==================

// Tüm stant türlerini listele (Admin)
router.get('/admin/fair/:fairId', auth, async (req, res) => {
  try {
    const fairId = parseInt(req.params.fairId)

    const boothTypes = await prisma.virtualBoothType.findMany({
      where: { fairId },
      include: {
        _count: {
          select: { booths: true, applications: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    res.json(boothTypes)
  } catch (error) {
    console.error('Stant türleri alınamadı:', error)
    res.status(500).json({ error: 'Stant türleri alınamadı' })
  }
})

// Tek stant türü detayı
router.get('/:id', auth, async (req, res) => {
  try {
    const boothType = await prisma.virtualBoothType.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        fair: true,
        _count: {
          select: { booths: true, applications: true }
        }
      }
    })

    if (!boothType) {
      return res.status(404).json({ error: 'Stant türü bulunamadı' })
    }

    res.json(boothType)
  } catch (error) {
    console.error('Stant türü alınamadı:', error)
    res.status(500).json({ error: 'Stant türü alınamadı' })
  }
})

// Yeni stant türü oluştur
router.post('/', auth, async (req, res) => {
  try {
    const { fairId, name, description, price, features, maxProducts, order, isActive } = req.body

    // Fuar kontrolü
    const fair = await prisma.virtualFair.findUnique({
      where: { id: parseInt(fairId) }
    })

    if (!fair) {
      return res.status(404).json({ error: 'Fuar bulunamadı' })
    }

    const boothType = await prisma.virtualBoothType.create({
      data: {
        fairId: parseInt(fairId),
        name,
        description,
        price: parseFloat(price),
        features: typeof features === 'string' ? features : JSON.stringify(features),
        maxProducts: parseInt(maxProducts) || 10,
        order: parseInt(order) || 0,
        isActive: isActive !== false
      }
    })

    res.status(201).json(boothType)
  } catch (error) {
    console.error('Stant türü oluşturulamadı:', error)
    res.status(500).json({ error: 'Stant türü oluşturulamadı' })
  }
})

// Stant türü güncelle
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { name, description, price, features, maxProducts, order, isActive } = req.body

    const existing = await prisma.virtualBoothType.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'Stant türü bulunamadı' })
    }

    const boothType = await prisma.virtualBoothType.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        features: typeof features === 'string' ? features : JSON.stringify(features),
        maxProducts: parseInt(maxProducts) || 10,
        order: parseInt(order) || 0,
        isActive: isActive !== false
      }
    })

    res.json(boothType)
  } catch (error) {
    console.error('Stant türü güncellenemedi:', error)
    res.status(500).json({ error: 'Stant türü güncellenemedi' })
  }
})

// Stant türü sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const boothType = await prisma.virtualBoothType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { booths: true, applications: true }
        }
      }
    })

    if (!boothType) {
      return res.status(404).json({ error: 'Stant türü bulunamadı' })
    }

    // Aktif stant veya başvuru varsa silme
    if (boothType._count.booths > 0) {
      return res.status(400).json({ error: 'Bu türde aktif stantlar var, silinemez' })
    }

    await prisma.virtualBoothType.delete({ where: { id } })

    res.json({ message: 'Stant türü silindi' })
  } catch (error) {
    console.error('Stant türü silinemedi:', error)
    res.status(500).json({ error: 'Stant türü silinemedi' })
  }
})

module.exports = router
