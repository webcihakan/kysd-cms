const { PrismaClient } = require('@prisma/client')
const { sendEventNotification } = require('../utils/mailer')

const prisma = require('../lib/prisma')

// 7 gün sonraki etkinlikleri kontrol et ve bildirim gönder
const checkUpcomingEvents = async () => {
  try {
    console.log('[NotificationService] 7 gün sonraki etkinlikler kontrol ediliyor...')

    // 7 gün sonrasını hesapla
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 7)
    targetDate.setHours(0, 0, 0, 0)

    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    // Ayarları getir
    const settings = await prisma.setting.findMany()
    const settingsObj = {}
    settings.forEach(s => { settingsObj[s.key] = s.value })

    // Aktif üyeleri getir
    const users = await prisma.user.findMany({
      where: { isActive: true }
    })

    if (users.length === 0) {
      console.log('[NotificationService] Aktif üye bulunamadı')
      return { success: true, totalSent: 0 }
    }

    let totalSent = 0

    // Fuarları kontrol et (startDate)
    const upcomingFairs = await prisma.fair.findMany({
      where: {
        isActive: true,
        startDate: { gte: targetDate, lt: nextDay }
      }
    })

    for (const fair of upcomingFairs) {
      const result = await sendEventNotification(
        {
          type: 'fair',
          title: fair.title,
          description: fair.description,
          date: fair.startDate,
          endDate: fair.endDate,
          location: fair.location ? `${fair.location}, ${fair.country}` : fair.country
        },
        users,
        settingsObj
      )
      if (result.success) {
        totalSent += result.results.filter(r => r.success).length
        console.log(`[NotificationService] Fuar bildirimi gönderildi: ${fair.title}`)
      }
    }

    // Eğitimleri kontrol et (eventDate)
    const upcomingTrainings = await prisma.training.findMany({
      where: {
        isActive: true,
        eventDate: { gte: targetDate, lt: nextDay }
      }
    })

    for (const training of upcomingTrainings) {
      const result = await sendEventNotification(
        {
          type: 'training',
          title: training.title,
          description: training.description,
          date: training.eventDate,
          eventTime: training.eventTime,
          location: training.location
        },
        users,
        settingsObj
      )
      if (result.success) {
        totalSent += result.results.filter(r => r.success).length
        console.log(`[NotificationService] Eğitim bildirimi gönderildi: ${training.title}`)
      }
    }

    // Projeleri kontrol et (startDate)
    const upcomingProjects = await prisma.project.findMany({
      where: {
        isActive: true,
        startDate: { gte: targetDate, lt: nextDay }
      }
    })

    for (const project of upcomingProjects) {
      const result = await sendEventNotification(
        {
          type: 'project',
          title: project.title,
          description: project.description,
          date: project.startDate,
          endDate: project.endDate
        },
        users,
        settingsObj
      )
      if (result.success) {
        totalSent += result.results.filter(r => r.success).length
        console.log(`[NotificationService] Proje bildirimi gönderildi: ${project.title}`)
      }
    }

    // Tatilleri kontrol et (date)
    const upcomingHolidays = await prisma.holiday.findMany({
      where: {
        isActive: true,
        date: { gte: targetDate, lt: nextDay }
      }
    })

    for (const holiday of upcomingHolidays) {
      const result = await sendEventNotification(
        {
          type: 'holiday',
          title: holiday.title,
          description: holiday.description,
          date: holiday.date,
          endDate: holiday.endDate
        },
        users,
        settingsObj
      )
      if (result.success) {
        totalSent += result.results.filter(r => r.success).length
        console.log(`[NotificationService] Tatil bildirimi gönderildi: ${holiday.title}`)
      }
    }

    console.log(`[NotificationService] Toplam ${totalSent} bildirim gönderildi`)
    return { success: true, totalSent }
  } catch (error) {
    console.error('[NotificationService] Hata:', error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  checkUpcomingEvents
}
