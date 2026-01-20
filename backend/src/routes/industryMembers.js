const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth, adminOnly } = require('../middleware/auth')
const XLSX = require('xlsx')

const prisma = require('../lib/prisma')

// Tüm üyeleri listele (aidat bilgileriyle birlikte)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const { groupId, year, withDues } = req.query
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    const where = {}
    if (groupId) where.groupId = parseInt(groupId)

    const members = await prisma.industryMember.findMany({
      where,
      orderBy: { companyName: 'asc' },
      include: {
        group: true,
        dues: withDues === 'true' ? {
          orderBy: [
            { year: 'desc' },
            { month: 'desc' }
          ]
        } : false
      }
    })

    res.json(members)
  } catch (error) {
    console.error('Üyeler getirilemedi:', error)
    res.status(500).json({ error: 'Üyeler getirilemedi' })
  }
})

// Excel export
router.get('/export', auth, adminOnly, async (req, res) => {
  try {
    const { groupId, search, year } = req.query
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    const where = {}
    if (groupId) where.groupId = parseInt(groupId)
    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { contactPerson: { contains: search } },
        { email: { contains: search } }
      ]
    }

    const members = await prisma.industryMember.findMany({
      where,
      orderBy: { companyName: 'asc' },
      include: {
        group: true,
        dues: {
          orderBy: [
            { year: 'desc' },
            { month: 'desc' }
          ]
        }
      }
    })

    // Excel verisi oluştur
    const data = members.map((member, index) => {
      // Yıla göre aidat durumunu bul
      const yearDues = member.dues.filter(d => d.year === targetYear)
      const totalDues = yearDues.reduce((sum, d) => sum + parseFloat(d.amount), 0)
      const paidAmount = yearDues.filter(d => d.status === 'PAID').reduce((sum, d) => sum + parseFloat(d.amount), 0)
      const pendingAmount = yearDues.filter(d => d.status === 'PENDING').reduce((sum, d) => sum + parseFloat(d.amount), 0)
      const overdueAmount = yearDues.filter(d => d.status === 'OVERDUE').reduce((sum, d) => sum + parseFloat(d.amount), 0)

      let duesStatus = 'Kayıt Yok'
      if (yearDues.length > 0) {
        if (yearDues.some(d => d.status === 'OVERDUE')) duesStatus = 'Gecikmiş'
        else if (yearDues.some(d => d.status === 'PENDING')) duesStatus = 'Bekliyor'
        else if (yearDues.every(d => d.status === 'PAID')) duesStatus = 'Ödendi'
      }

      return {
        'Sıra': index + 1,
        'Firma Adı': member.companyName,
        'Yetkili': member.contactPerson || '',
        'Telefon': member.phone || '',
        'E-posta': member.email || '',
        'Web Sitesi': member.website || '',
        'Adres': member.address || '',
        'Sanayi Grubu': member.group?.name || '',
        [`${targetYear} Aidat Durumu`]: duesStatus,
        [`${targetYear} Toplam Aidat`]: totalDues,
        [`${targetYear} Ödenen`]: paidAmount,
        [`${targetYear} Bekleyen`]: pendingAmount,
        [`${targetYear} Gecikmiş`]: overdueAmount
      }
    })

    // Aidat özet sayfası oluştur
    const summaryData = []

    // Yıllara göre aidat özeti (2015-2024)
    for (let y = 2015; y <= targetYear; y++) {
      const yearStats = {
        'Yıl': y,
        'Toplam Üye': 0,
        'Ödemiş Üye': 0,
        'Bekleyen Üye': 0,
        'Gecikmiş Üye': 0,
        'Toplam Aidat': 0,
        'Ödenen Tutar': 0,
        'Bekleyen Tutar': 0,
        'Gecikmiş Tutar': 0
      }

      members.forEach(member => {
        const memberYearDues = member.dues.filter(d => d.year === y)
        if (memberYearDues.length > 0) {
          yearStats['Toplam Üye']++
          const total = memberYearDues.reduce((sum, d) => sum + parseFloat(d.amount), 0)
          const paid = memberYearDues.filter(d => d.status === 'PAID').reduce((sum, d) => sum + parseFloat(d.amount), 0)
          const pending = memberYearDues.filter(d => d.status === 'PENDING').reduce((sum, d) => sum + parseFloat(d.amount), 0)
          const overdue = memberYearDues.filter(d => d.status === 'OVERDUE').reduce((sum, d) => sum + parseFloat(d.amount), 0)

          yearStats['Toplam Aidat'] += total
          yearStats['Ödenen Tutar'] += paid
          yearStats['Bekleyen Tutar'] += pending
          yearStats['Gecikmiş Tutar'] += overdue

          if (memberYearDues.every(d => d.status === 'PAID')) yearStats['Ödemiş Üye']++
          else if (memberYearDues.some(d => d.status === 'OVERDUE')) yearStats['Gecikmiş Üye']++
          else if (memberYearDues.some(d => d.status === 'PENDING')) yearStats['Bekleyen Üye']++
        }
      })

      summaryData.push(yearStats)
    }

    // Excel workbook oluştur
    const wb = XLSX.utils.book_new()

    // Üye listesi sayfası
    const ws1 = XLSX.utils.json_to_sheet(data)

    // Sütun genişliklerini ayarla
    ws1['!cols'] = [
      { wch: 5 },   // Sıra
      { wch: 40 },  // Firma Adı
      { wch: 25 },  // Yetkili
      { wch: 20 },  // Telefon
      { wch: 35 },  // E-posta
      { wch: 30 },  // Web Sitesi
      { wch: 50 },  // Adres
      { wch: 30 },  // Sanayi Grubu
      { wch: 15 },  // Aidat Durumu
      { wch: 15 },  // Toplam Aidat
      { wch: 15 },  // Ödenen
      { wch: 15 },  // Bekleyen
      { wch: 15 }   // Gecikmiş
    ]

    XLSX.utils.book_append_sheet(wb, ws1, 'Üye Listesi')

    // Özet sayfası
    const ws2 = XLSX.utils.json_to_sheet(summaryData)
    ws2['!cols'] = [
      { wch: 8 },   // Yıl
      { wch: 12 },  // Toplam Üye
      { wch: 12 },  // Ödemiş Üye
      { wch: 12 },  // Bekleyen Üye
      { wch: 12 },  // Gecikmiş Üye
      { wch: 15 },  // Toplam Aidat
      { wch: 15 },  // Ödenen Tutar
      { wch: 15 },  // Bekleyen Tutar
      { wch: 15 }   // Gecikmiş Tutar
    ]
    XLSX.utils.book_append_sheet(wb, ws2, 'Yıllık Özet')

    // Buffer olarak export et
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    // Response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=uye-listesi-${targetYear}.xlsx`)
    res.send(buffer)

  } catch (error) {
    console.error('Export hatası:', error)
    res.status(500).json({ error: 'Excel oluşturulamadı' })
  }
})

// Yeni üye oluştur
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { companyName, contactPerson, phone, email, website, address, description, groupId, logo } = req.body

    if (!companyName || !groupId) {
      return res.status(400).json({ error: 'Firma adı ve sanayi grubu zorunludur' })
    }

    const member = await prisma.industryMember.create({
      data: {
        companyName,
        contactPerson,
        phone,
        email,
        website,
        address,
        description,
        logo,
        groupId: parseInt(groupId)
      },
      include: { group: true }
    })

    res.status(201).json(member)
  } catch (error) {
    console.error('Üye oluşturulamadı:', error)
    res.status(500).json({ error: 'Üye oluşturulamadı' })
  }
})

// Üye güncelle
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { companyName, contactPerson, phone, email, website, address, description, groupId, logo } = req.body

    const member = await prisma.industryMember.update({
      where: { id: parseInt(req.params.id) },
      data: {
        companyName,
        contactPerson,
        phone,
        email,
        website,
        address,
        description,
        logo,
        groupId: groupId ? parseInt(groupId) : undefined
      },
      include: { group: true }
    })

    res.json(member)
  } catch (error) {
    console.error('Üye güncellenemedi:', error)
    res.status(500).json({ error: 'Üye güncellenemedi' })
  }
})

// Üye sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.industryMember.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: 'Üye silindi' })
  } catch (error) {
    console.error('Üye silinemedi:', error)
    res.status(500).json({ error: 'Üye silinemedi' })
  }
})

// Tek üye getir (aidat bilgileriyle)
router.get('/:id', auth, async (req, res) => {
  try {
    const member = await prisma.industryMember.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        group: true,
        dues: {
          orderBy: [
            { year: 'desc' },
            { month: 'desc' }
          ]
        }
      }
    })

    if (!member) {
      return res.status(404).json({ error: 'Üye bulunamadı' })
    }

    res.json(member)
  } catch (error) {
    console.error('Üye getirilemedi:', error)
    res.status(500).json({ error: 'Üye getirilemedi' })
  }
})

module.exports = router
