const cron = require('node-cron')
const { PrismaClient } = require('@prisma/client')
const mevzuatScraper = require('./scrapers/mevzuatScraper')
const tesvikScraper = require('./scrapers/tesvikScraper')
const raporScraper = require('./scrapers/raporScraper')
const egitimScraper = require('./scrapers/egitimScraper')
const fuarScraper = require('./scrapers/fuarScraper')
const projeScraper = require('./scrapers/projeScraper')
const haberScraper = require('./scrapers/haberScraper')
const currencyScraper = require('./scrapers/currencyScraper')
const notificationService = require('./notificationService')

const prisma = require('../lib/prisma')

// Scraper durumlarini takip et
let scraperStatus = {
  haber: { lastRun: null, status: 'idle', count: 0 },
  mevzuat: { lastRun: null, status: 'idle', count: 0 },
  tesvik: { lastRun: null, status: 'idle', count: 0 },
  rapor: { lastRun: null, status: 'idle', count: 0 },
  egitim: { lastRun: null, status: 'idle', count: 0 },
  fuar: { lastRun: null, status: 'idle', count: 0 },
  proje: { lastRun: null, status: 'idle', count: 0 },
  currency: { lastRun: null, status: 'idle', count: 0 }
}

// Tum scraper'lari calistir
async function runAllScrapers() {
  console.log('[ScraperService] Tum scraper\'lar baslatiliyor...')

  const results = {
    haber: await runScraper('haber', haberScraper.scrape),
    mevzuat: await runScraper('mevzuat', mevzuatScraper.scrape),
    tesvik: await runScraper('tesvik', tesvikScraper.scrape),
    rapor: await runScraper('rapor', raporScraper.scrape),
    egitim: await runScraper('egitim', egitimScraper.scrape),
    fuar: await runScraper('fuar', fuarScraper.scrape),
    proje: await runScraper('proje', projeScraper.scrape)
  }

  console.log('[ScraperService] Tum scraper\'lar tamamlandi')
  return results
}

// Tek bir scraper calistir
async function runScraper(name, scraperFn) {
  try {
    scraperStatus[name].status = 'running'
    console.log(`[ScraperService] ${name} scraper baslatiliyor...`)

    const result = await scraperFn(prisma)

    scraperStatus[name] = {
      lastRun: new Date(),
      status: 'success',
      count: result.count || 0,
      message: result.message || 'Basarili'
    }

    console.log(`[ScraperService] ${name} scraper tamamlandi: ${result.count} kayit`)
    return { success: true, ...result }
  } catch (error) {
    console.error(`[ScraperService] ${name} scraper hatasi:`, error.message)

    scraperStatus[name] = {
      lastRun: new Date(),
      status: 'error',
      count: 0,
      message: error.message
    }

    return { success: false, error: error.message }
  }
}

// Belirli bir scraper'i calistir
async function runSpecificScraper(scraperName) {
  const scrapers = {
    haber: haberScraper.scrape,
    mevzuat: mevzuatScraper.scrape,
    tesvik: tesvikScraper.scrape,
    rapor: raporScraper.scrape,
    egitim: egitimScraper.scrape,
    fuar: fuarScraper.scrape,
    proje: projeScraper.scrape,
    currency: currencyScraper.scrape
  }

  if (!scrapers[scraperName]) {
    throw new Error(`Gecersiz scraper: ${scraperName}`)
  }

  return await runScraper(scraperName, scrapers[scraperName])
}

// Scraper durumlarini getir
function getStatus() {
  return scraperStatus
}

// Cron job'lari baslat
function startCronJobs() {
  // Her gun saat 06:00'da calistir
  cron.schedule('0 6 * * *', async () => {
    console.log('[Cron] Gunluk veri guncelleme basliyor...')
    await runAllScrapers()
  }, {
    timezone: 'Europe/Istanbul'
  })

  // Her Pazartesi saat 09:00'da tam guncelleme
  cron.schedule('0 9 * * 1', async () => {
    console.log('[Cron] Haftalik tam guncelleme basliyor...')
    await runAllScrapers()
  }, {
    timezone: 'Europe/Istanbul'
  })

  // Her gün saat 09:00'da 7 gün sonraki etkinlikler için bildirim gönder
  cron.schedule('0 9 * * *', async () => {
    console.log('[Cron] Günlük etkinlik bildirimleri gönderiliyor...')
    await notificationService.checkUpcomingEvents()
  }, {
    timezone: 'Europe/Istanbul'
  })

  // Her gün saat 08:00'da kur bilgileri güncelle
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Günlük kur bilgileri güncelleniyor...')
    await runScraper('currency', currencyScraper.scrape)
  }, {
    timezone: 'Europe/Istanbul'
  })

  console.log('[ScraperService] Cron job\'lar aktif edildi')
}

module.exports = {
  runAllScrapers,
  runSpecificScraper,
  getStatus,
  startCronJobs
}
