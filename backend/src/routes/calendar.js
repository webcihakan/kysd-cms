const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Takvim için tüm etkinlikleri getir
router.get('/events', async (req, res) => {
  try {
    const { year, month } = req.query

    // Tarih aralığını belirle
    let startDate, endDate
    if (year && month) {
      const y = parseInt(year)
      const m = parseInt(month)
      startDate = new Date(y, m - 1, 1)
      endDate = new Date(y, m, 0, 23, 59, 59, 999)
    } else if (year) {
      const y = parseInt(year)
      startDate = new Date(y, 0, 1)
      endDate = new Date(y, 11, 31, 23, 59, 59, 999)
    } else {
      // Varsayılan: son 1 ay + gelecek 6 ay
      startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 6)
      endDate.setHours(23, 59, 59, 999)
    }

    // Fuarları getir
    const fairs = await prisma.fair.findMany({
      where: {
        isActive: true,
        startDate: { gte: startDate, lte: endDate }
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        deadline: true,
        location: true,
        country: true,
        isKysdOrganized: true,
        description: true
      }
    })

    // Eğitimleri getir
    const trainings = await prisma.training.findMany({
      where: {
        isActive: true,
        eventDate: { gte: startDate, lte: endDate }
      },
      select: {
        id: true,
        title: true,
        eventDate: true,
        eventTime: true,
        location: true,
        category: true,
        description: true
      }
    })

    // Projeleri getir
    const projects = await prisma.project.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: { gte: startDate, lte: endDate } },
          { endDate: { gte: startDate, lte: endDate } }
        ]
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        status: true,
        category: true,
        description: true
      }
    })

    // Tatilleri getir
    const holidays = await prisma.holiday.findMany({
      where: {
        isActive: true,
        date: { gte: startDate, lte: endDate }
      },
      select: {
        id: true,
        title: true,
        date: true,
        endDate: true,
        type: true,
        description: true
      }
    })

    // Tüm etkinlikleri birleştir ve tiplerini işaretle
    const events = [
      ...fairs.map(f => ({
        ...f,
        type: 'fair',
        date: f.startDate
      })),
      ...trainings.map(t => ({
        ...t,
        type: 'training',
        date: t.eventDate
      })),
      ...projects.map(p => ({
        ...p,
        type: 'project',
        date: p.startDate
      })),
      ...holidays.map(h => ({
        ...h,
        type: 'holiday'
      }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date))

    res.json({
      events,
      summary: {
        total: events.length,
        fairs: fairs.length,
        trainings: trainings.length,
        projects: projects.length,
        holidays: holidays.length
      }
    })
  } catch (error) {
    console.error('Takvim etkinlikleri getirilemedi:', error)
    res.status(500).json({ error: 'Takvim etkinlikleri getirilemedi' })
  }
})

module.exports = router
