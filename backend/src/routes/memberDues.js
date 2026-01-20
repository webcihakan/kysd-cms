const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth, adminOnly } = require('../middleware/auth')
const { sendBulkDueNotifications } = require('../utils/mailer')

const prisma = require('../lib/prisma')

// Tüm aidatları getir (Admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { year, status, memberId } = req.query

    const where = {}
    if (year) where.year = parseInt(year)
    if (status) where.status = status
    if (memberId) where.memberId = parseInt(memberId)

    const dues = await prisma.memberDue.findMany({
      where,
      include: {
        member: {
          select: {
            id: true,
            companyName: true,
            phone: true,
            email: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    res.json(dues)
  } catch (error) {
    console.error('Aidatlar getirilemedi:', error)
    res.status(500).json({ error: 'Aidatlar getirilemedi' })
  }
})

// Özet istatistikler
router.get('/summary', auth, adminOnly, async (req, res) => {
  try {
    const { year } = req.query
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    const dues = await prisma.memberDue.findMany({
      where: { year: targetYear }
    })

    const summary = {
      year: targetYear,
      totalDues: dues.length,
      totalAmount: dues.reduce((sum, d) => sum + parseFloat(d.amount), 0),
      paidCount: dues.filter(d => d.status === 'PAID').length,
      paidAmount: dues.filter(d => d.status === 'PAID').reduce((sum, d) => sum + parseFloat(d.paidAmount || 0), 0),
      pendingCount: dues.filter(d => d.status === 'PENDING').length,
      pendingAmount: dues.filter(d => d.status === 'PENDING').reduce((sum, d) => sum + parseFloat(d.amount), 0),
      overdueCount: dues.filter(d => d.status === 'OVERDUE').length,
      overdueAmount: dues.filter(d => d.status === 'OVERDUE').reduce((sum, d) => sum + parseFloat(d.amount), 0)
    }

    res.json(summary)
  } catch (error) {
    console.error('Özet getirilemedi:', error)
    res.status(500).json({ error: 'Özet getirilemedi' })
  }
})

// Tek aidat getir
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const due = await prisma.memberDue.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        member: true
      }
    })

    if (!due) {
      return res.status(404).json({ error: 'Aidat bulunamadı' })
    }

    res.json(due)
  } catch (error) {
    console.error('Aidat getirilemedi:', error)
    res.status(500).json({ error: 'Aidat getirilemedi' })
  }
})

// Yeni aidat oluştur
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { memberId, year, month, amount, status, dueDate, notes } = req.body

    const due = await prisma.memberDue.create({
      data: {
        memberId: parseInt(memberId),
        year: parseInt(year),
        month: month ? parseInt(month) : null,
        amount: parseFloat(amount),
        status: status || 'PENDING',
        dueDate: new Date(dueDate),
        notes
      },
      include: {
        member: true
      }
    })

    res.status(201).json(due)
  } catch (error) {
    console.error('Aidat oluşturulamadı:', error)
    res.status(500).json({ error: 'Aidat oluşturulamadı' })
  }
})

// Toplu aidat oluştur (tüm üyeler için)
router.post('/bulk', auth, adminOnly, async (req, res) => {
  try {
    const { year, amount, dueDate, sendEmail } = req.body

    const members = await prisma.industryMember.findMany({
      where: { isActive: true }
    })

    let created = 0
    let skipped = 0
    const createdDues = []

    for (const member of members) {
      // Zaten varsa atla
      const existing = await prisma.memberDue.findUnique({
        where: {
          memberId_year_month: {
            memberId: member.id,
            year: parseInt(year),
            month: null
          }
        }
      })

      if (existing) {
        skipped++
        continue
      }

      const due = await prisma.memberDue.create({
        data: {
          memberId: member.id,
          year: parseInt(year),
          month: null,
          amount: parseFloat(amount),
          status: 'PENDING',
          dueDate: new Date(dueDate)
        },
        include: {
          member: true
        }
      })
      createdDues.push(due)
      created++
    }

    // Mail gönder
    let emailResult = null
    if (sendEmail && createdDues.length > 0) {
      emailResult = await sendBulkDueNotifications(createdDues)
    }

    res.json({
      message: `${created} aidat oluşturuldu, ${skipped} atlandı`,
      created,
      skipped,
      emailResult
    })
  } catch (error) {
    console.error('Toplu aidat oluşturulamadı:', error)
    res.status(500).json({ error: 'Toplu aidat oluşturulamadı' })
  }
})

// Aidat güncelle
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { status, paidDate, paidAmount, paymentMethod, receiptNo, notes } = req.body

    const updateData = {}
    if (status) updateData.status = status
    if (paidDate) updateData.paidDate = new Date(paidDate)
    if (paidAmount !== undefined) updateData.paidAmount = parseFloat(paidAmount)
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod
    if (receiptNo !== undefined) updateData.receiptNo = receiptNo
    if (notes !== undefined) updateData.notes = notes

    const due = await prisma.memberDue.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
      include: {
        member: true
      }
    })

    res.json(due)
  } catch (error) {
    console.error('Aidat güncellenemedi:', error)
    res.status(500).json({ error: 'Aidat güncellenemedi' })
  }
})

// Ödeme işaretle
router.patch('/:id/pay', auth, adminOnly, async (req, res) => {
  try {
    const { paidAmount, paymentMethod, receiptNo } = req.body

    const due = await prisma.memberDue.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!due) {
      return res.status(404).json({ error: 'Aidat bulunamadı' })
    }

    const updated = await prisma.memberDue.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status: 'PAID',
        paidDate: new Date(),
        paidAmount: paidAmount ? parseFloat(paidAmount) : due.amount,
        paymentMethod: paymentMethod || 'Belirtilmedi',
        receiptNo
      },
      include: {
        member: true
      }
    })

    res.json(updated)
  } catch (error) {
    console.error('Ödeme işlenemedi:', error)
    res.status(500).json({ error: 'Ödeme işlenemedi' })
  }
})

// Aidat sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.memberDue.delete({
      where: { id: parseInt(req.params.id) }
    })

    res.json({ message: 'Aidat silindi' })
  } catch (error) {
    console.error('Aidat silinemedi:', error)
    res.status(500).json({ error: 'Aidat silinemedi' })
  }
})

// ============================================
// MEMBER ENDPOINTS
// ============================================

// Üyenin kendi aidatlarını getir
router.get('/member/my-dues', auth, async (req, res) => {
  try {
    if (req.user.role !== 'MEMBER') {
      return res.status(403).json({ error: 'Yetkisiz erişim' })
    }

    const companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!companyProfile || !companyProfile.memberId) {
      return res.status(404).json({ error: 'Üyelik bilgisi bulunamadı' })
    }

    const { year, status } = req.query

    const where = { memberId: companyProfile.memberId }
    if (year) where.year = parseInt(year)
    if (status) where.status = status

    const dues = await prisma.memberDue.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })

    res.json(dues)
  } catch (error) {
    console.error('Aidatlar getirilemedi:', error)
    res.status(500).json({ error: 'Aidatlar getirilemedi' })
  }
})

// Üyenin son aidatlarını getir
router.get('/member/recent', auth, async (req, res) => {
  try {
    if (req.user.role !== 'MEMBER') {
      return res.status(403).json({ error: 'Yetkisiz erişim' })
    }

    const companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!companyProfile || !companyProfile.memberId) {
      return res.json([])
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : 5

    const dues = await prisma.memberDue.findMany({
      where: { memberId: companyProfile.memberId },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
      take: limit
    })

    res.json(dues)
  } catch (error) {
    console.error('Son aidatlar getirilemedi:', error)
    res.status(500).json({ error: 'Son aidatlar getirilemedi' })
  }
})

// Üyenin aidat istatistiklerini getir
router.get('/member/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'MEMBER') {
      return res.status(403).json({ error: 'Yetkisiz erişim' })
    }

    const companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!companyProfile || !companyProfile.memberId) {
      return res.json({ total: 0, paid: 0, unpaid: 0, overdue: 0, totalAmount: 0, paidAmount: 0 })
    }

    const dues = await prisma.memberDue.findMany({
      where: { memberId: companyProfile.memberId }
    })

    const stats = {
      total: dues.length,
      paid: dues.filter(d => d.status === 'PAID').length,
      unpaid: dues.filter(d => d.status === 'PENDING').length,
      overdue: dues.filter(d => d.status === 'OVERDUE').length,
      totalAmount: dues.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0),
      paidAmount: dues.filter(d => d.status === 'PAID').reduce((sum, d) => sum + parseFloat(d.paidAmount || d.amount || 0), 0)
    }

    res.json(stats)
  } catch (error) {
    console.error('İstatistikler getirilemedi:', error)
    res.status(500).json({ error: 'İstatistikler getirilemedi' })
  }
})

module.exports = router
