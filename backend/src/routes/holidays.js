const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth, adminOnly } = require('../middleware/auth')

const prisma = require('../lib/prisma')

// Public - Tüm tatilleri getir
router.get('/', async (req, res) => {
  try {
    const { year } = req.query
    const where = { isActive: true }

    if (year) {
      const startOfYear = new Date(`${year}-01-01`)
      const endOfYear = new Date(`${year}-12-31T23:59:59`)
      where.date = { gte: startOfYear, lte: endOfYear }
    }

    const holidays = await prisma.holiday.findMany({
      where,
      orderBy: { date: 'asc' }
    })

    res.json(holidays)
  } catch (error) {
    console.error('Tatiller getirilemedi:', error)
    res.status(500).json({ error: 'Tatiller getirilemedi' })
  }
})

// Admin - Tüm tatiller
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const holidays = await prisma.holiday.findMany({
      orderBy: { date: 'desc' }
    })
    res.json(holidays)
  } catch (error) {
    console.error('Tatiller getirilemedi:', error)
    res.status(500).json({ error: 'Tatiller getirilemedi' })
  }
})

// Tek bir tatili getir
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const holiday = await prisma.holiday.findUnique({
      where: { id }
    })

    if (!holiday) {
      return res.status(404).json({ error: 'Tatil bulunamadı' })
    }

    res.json(holiday)
  } catch (error) {
    console.error('Tatil getirilemedi:', error)
    res.status(500).json({ error: 'Tatil getirilemedi' })
  }
})

// Tatil oluştur
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, date, endDate, type, description, isActive } = req.body

    if (!title || !date) {
      return res.status(400).json({ error: 'Tatil adı ve tarihi zorunludur' })
    }

    const holiday = await prisma.holiday.create({
      data: {
        title,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        type: type || 'national',
        description,
        isActive: isActive !== false
      }
    })

    res.status(201).json(holiday)
  } catch (error) {
    console.error('Tatil oluşturulamadı:', error)
    res.status(500).json({ error: 'Tatil oluşturulamadı' })
  }
})

// Tatil güncelle
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { title, date, endDate, type, description, isActive } = req.body

    if (!title || !date) {
      return res.status(400).json({ error: 'Tatil adı ve tarihi zorunludur' })
    }

    const holiday = await prisma.holiday.update({
      where: { id },
      data: {
        title,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        type,
        description,
        isActive: isActive !== false
      }
    })

    res.json(holiday)
  } catch (error) {
    console.error('Tatil güncellenemedi:', error)
    res.status(500).json({ error: 'Tatil güncellenemedi' })
  }
})

// Tatil sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    await prisma.holiday.delete({ where: { id } })
    res.json({ message: 'Tatil silindi' })
  } catch (error) {
    console.error('Tatil silinemedi:', error)
    res.status(500).json({ error: 'Tatil silinemedi' })
  }
})

module.exports = router
