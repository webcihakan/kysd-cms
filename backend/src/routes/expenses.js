const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth, adminOnly } = require('../middleware/auth')
const XLSX = require('xlsx')

const prisma = require('../lib/prisma')

const categoryLabels = {
  RENT: 'Kira',
  UTILITIES: 'Faturalar',
  SALARY: 'Personel Maaşları',
  OFFICE: 'Ofis Giderleri',
  EVENTS: 'Etkinlik Giderleri',
  MARKETING: 'Pazarlama/Tanıtım',
  TRAVEL: 'Seyahat',
  LEGAL: 'Hukuk/Danışmanlık',
  TAX: 'Vergiler',
  INSURANCE: 'Sigorta',
  OTHER: 'Diğer'
}

// Tüm giderleri getir (Admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { year, month, category, isPaid } = req.query

    const where = {}
    if (year) where.year = parseInt(year)
    if (month) where.month = parseInt(month)
    if (category) where.category = category
    if (isPaid !== undefined) where.isPaid = isPaid === 'true'

    const expenses = await prisma.monthlyExpense.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    res.json(expenses)
  } catch (error) {
    console.error('Giderler getirilemedi:', error)
    res.status(500).json({ error: 'Giderler getirilemedi' })
  }
})

// Özet istatistikler
router.get('/summary', auth, adminOnly, async (req, res) => {
  try {
    const { year, month } = req.query
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    const where = { year: targetYear }
    if (month) where.month = parseInt(month)

    const expenses = await prisma.monthlyExpense.findMany({ where })

    // Kategorilere göre grupla
    const byCategory = {}
    expenses.forEach(exp => {
      if (!byCategory[exp.category]) {
        byCategory[exp.category] = { total: 0, paid: 0, pending: 0 }
      }
      byCategory[exp.category].total += parseFloat(exp.amount)
      if (exp.isPaid) {
        byCategory[exp.category].paid += parseFloat(exp.amount)
      } else {
        byCategory[exp.category].pending += parseFloat(exp.amount)
      }
    })

    // Aylara göre grupla
    const byMonth = {}
    expenses.forEach(exp => {
      if (!byMonth[exp.month]) {
        byMonth[exp.month] = { total: 0, paid: 0, pending: 0 }
      }
      byMonth[exp.month].total += parseFloat(exp.amount)
      if (exp.isPaid) {
        byMonth[exp.month].paid += parseFloat(exp.amount)
      } else {
        byMonth[exp.month].pending += parseFloat(exp.amount)
      }
    })

    const summary = {
      year: targetYear,
      totalExpenses: expenses.length,
      totalAmount: expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0),
      paidAmount: expenses.filter(e => e.isPaid).reduce((sum, e) => sum + parseFloat(e.amount), 0),
      pendingAmount: expenses.filter(e => !e.isPaid).reduce((sum, e) => sum + parseFloat(e.amount), 0),
      byCategory,
      byMonth
    }

    res.json(summary)
  } catch (error) {
    console.error('Özet getirilemedi:', error)
    res.status(500).json({ error: 'Özet getirilemedi' })
  }
})

// Excel export
router.get('/export', auth, adminOnly, async (req, res) => {
  try {
    const { year } = req.query
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    const expenses = await prisma.monthlyExpense.findMany({
      where: { year: targetYear },
      orderBy: [
        { month: 'asc' },
        { category: 'asc' }
      ]
    })

    const monthNames = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

    // Gider listesi verisi
    const data = expenses.map((exp, index) => ({
      'Sıra': index + 1,
      'Yıl': exp.year,
      'Ay': monthNames[exp.month],
      'Kategori': categoryLabels[exp.category] || exp.category,
      'Açıklama': exp.description,
      'Tutar': parseFloat(exp.amount),
      'Durum': exp.isPaid ? 'Ödendi' : 'Bekliyor',
      'Ödeme Tarihi': exp.paidDate ? new Date(exp.paidDate).toLocaleDateString('tr-TR') : '',
      'Son Ödeme Tarihi': exp.dueDate ? new Date(exp.dueDate).toLocaleDateString('tr-TR') : '',
      'Tedarikçi': exp.vendor || '',
      'Fatura No': exp.invoiceNo || '',
      'Notlar': exp.notes || ''
    }))

    // Aylık özet
    const monthlySummary = []
    for (let m = 1; m <= 12; m++) {
      const monthExpenses = expenses.filter(e => e.month === m)
      if (monthExpenses.length > 0) {
        monthlySummary.push({
          'Ay': monthNames[m],
          'Toplam Gider': monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0),
          'Ödenen': monthExpenses.filter(e => e.isPaid).reduce((sum, e) => sum + parseFloat(e.amount), 0),
          'Bekleyen': monthExpenses.filter(e => !e.isPaid).reduce((sum, e) => sum + parseFloat(e.amount), 0),
          'Gider Sayısı': monthExpenses.length
        })
      }
    }

    // Kategori özeti
    const categorySummary = []
    Object.keys(categoryLabels).forEach(cat => {
      const catExpenses = expenses.filter(e => e.category === cat)
      if (catExpenses.length > 0) {
        categorySummary.push({
          'Kategori': categoryLabels[cat],
          'Toplam': catExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0),
          'Ödenen': catExpenses.filter(e => e.isPaid).reduce((sum, e) => sum + parseFloat(e.amount), 0),
          'Bekleyen': catExpenses.filter(e => !e.isPaid).reduce((sum, e) => sum + parseFloat(e.amount), 0),
          'Adet': catExpenses.length
        })
      }
    })

    // Excel oluştur
    const wb = XLSX.utils.book_new()

    // Gider listesi
    const ws1 = XLSX.utils.json_to_sheet(data)
    ws1['!cols'] = [
      { wch: 5 }, { wch: 6 }, { wch: 10 }, { wch: 20 }, { wch: 40 },
      { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 25 },
      { wch: 15 }, { wch: 30 }
    ]
    XLSX.utils.book_append_sheet(wb, ws1, 'Gider Listesi')

    // Aylık özet
    const ws2 = XLSX.utils.json_to_sheet(monthlySummary)
    ws2['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(wb, ws2, 'Aylık Özet')

    // Kategori özeti
    const ws3 = XLSX.utils.json_to_sheet(categorySummary)
    ws3['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 8 }]
    XLSX.utils.book_append_sheet(wb, ws3, 'Kategori Özeti')

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=giderler-${targetYear}.xlsx`)
    res.send(buffer)

  } catch (error) {
    console.error('Export hatası:', error)
    res.status(500).json({ error: 'Excel oluşturulamadı' })
  }
})

// Tek gider getir
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const expense = await prisma.monthlyExpense.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!expense) {
      return res.status(404).json({ error: 'Gider bulunamadı' })
    }

    res.json(expense)
  } catch (error) {
    console.error('Gider getirilemedi:', error)
    res.status(500).json({ error: 'Gider getirilemedi' })
  }
})

// Yeni gider oluştur
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { year, month, category, description, amount, isPaid, paidDate, dueDate, vendor, invoiceNo, notes } = req.body

    const expense = await prisma.monthlyExpense.create({
      data: {
        year: parseInt(year),
        month: parseInt(month),
        category,
        description,
        amount: parseFloat(amount),
        isPaid: isPaid || false,
        paidDate: paidDate ? new Date(paidDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        vendor,
        invoiceNo,
        notes
      }
    })

    res.status(201).json(expense)
  } catch (error) {
    console.error('Gider oluşturulamadı:', error)
    res.status(500).json({ error: 'Gider oluşturulamadı' })
  }
})

// Gider güncelle
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { year, month, category, description, amount, isPaid, paidDate, dueDate, vendor, invoiceNo, notes } = req.body

    const expense = await prisma.monthlyExpense.update({
      where: { id: parseInt(req.params.id) },
      data: {
        year: year ? parseInt(year) : undefined,
        month: month ? parseInt(month) : undefined,
        category,
        description,
        amount: amount ? parseFloat(amount) : undefined,
        isPaid,
        paidDate: paidDate ? new Date(paidDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        vendor,
        invoiceNo,
        notes
      }
    })

    res.json(expense)
  } catch (error) {
    console.error('Gider güncellenemedi:', error)
    res.status(500).json({ error: 'Gider güncellenemedi' })
  }
})

// Ödendi olarak işaretle
router.patch('/:id/pay', auth, adminOnly, async (req, res) => {
  try {
    const expense = await prisma.monthlyExpense.update({
      where: { id: parseInt(req.params.id) },
      data: {
        isPaid: true,
        paidDate: new Date()
      }
    })

    res.json(expense)
  } catch (error) {
    console.error('Ödeme işlenemedi:', error)
    res.status(500).json({ error: 'Ödeme işlenemedi' })
  }
})

// Gider sil
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await prisma.monthlyExpense.delete({
      where: { id: parseInt(req.params.id) }
    })

    res.json({ message: 'Gider silindi' })
  } catch (error) {
    console.error('Gider silinemedi:', error)
    res.status(500).json({ error: 'Gider silinemedi' })
  }
})

module.exports = router
