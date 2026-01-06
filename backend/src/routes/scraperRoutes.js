const express = require('express')
const router = express.Router()
const scraperService = require('../services/scraperService')

// Middleware - Admin yetkisi kontrolu
const adminAuth = (req, res, next) => {
  // Bu middleware auth.js'den import edilebilir
  // Simdilik basit kontrol
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Yetkiniz yok' })
  }
  next()
}

// Tum scraper'larin durumunu getir
router.get('/status', async (req, res) => {
  try {
    const status = scraperService.getStatus()
    res.json(status)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Tum scraper'lari calistir
router.post('/run-all', async (req, res) => {
  try {
    console.log('[API] Tum scraper\'lar baslatiliyor...')

    // Async olarak calistir, hemen yanit don
    res.json({
      message: 'Veri guncelleme basladi. Bu islem birkaç dakika surebilir.',
      status: 'started'
    })

    // Arka planda calistir
    scraperService.runAllScrapers().then(results => {
      console.log('[API] Tum scraper\'lar tamamlandi:', results)
    }).catch(err => {
      console.error('[API] Scraper hatasi:', err)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Belirli bir scraper'i calistir
router.post('/run/:scraperName', async (req, res) => {
  try {
    const { scraperName } = req.params
    const validScrapers = ['haber', 'mevzuat', 'tesvik', 'rapor', 'egitim', 'fuar', 'proje']

    if (!validScrapers.includes(scraperName)) {
      return res.status(400).json({
        error: 'Gecersiz scraper',
        validOptions: validScrapers
      })
    }

    console.log(`[API] ${scraperName} scraper baslatiliyor...`)

    // Async olarak calistir
    res.json({
      message: `${scraperName} guncelleme basladi`,
      status: 'started'
    })

    scraperService.runSpecificScraper(scraperName).then(result => {
      console.log(`[API] ${scraperName} scraper tamamlandi:`, result)
    }).catch(err => {
      console.error(`[API] ${scraperName} scraper hatasi:`, err)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Scraper'lari senkron calistir (sonucu bekle)
router.post('/run-sync/:scraperName', async (req, res) => {
  try {
    const { scraperName } = req.params
    const validScrapers = ['haber', 'mevzuat', 'tesvik', 'rapor', 'egitim', 'fuar', 'proje', 'all']

    if (!validScrapers.includes(scraperName)) {
      return res.status(400).json({
        error: 'Gecersiz scraper',
        validOptions: validScrapers
      })
    }

    console.log(`[API] ${scraperName} scraper (senkron) baslatiliyor...`)

    let result
    if (scraperName === 'all') {
      result = await scraperService.runAllScrapers()
    } else {
      result = await scraperService.runSpecificScraper(scraperName)
    }

    res.json({
      message: 'Guncelleme tamamlandi',
      result
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
