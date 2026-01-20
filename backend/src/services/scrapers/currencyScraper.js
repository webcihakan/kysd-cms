const axios = require('axios')
const xml2js = require('xml2js')

/**
 * TCMB'den günlük döviz kurlarını çeker ve EconomicIndicator tablosuna kaydeder
 */
async function scrape(prisma) {
  try {
    console.log('[CurrencyScraper] TCMB döviz kurları çekiliyor...')

    // TCMB günlük kur XML'i
    const response = await axios.get('https://www.tcmb.gov.tr/kurlar/today.xml', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    // XML'i parse et
    const parser = new xml2js.Parser()
    const result = await parser.parseStringPromise(response.data)

    if (!result.Tarih_Date || !result.Tarih_Date.Currency) {
      throw new Error('TCMB XML formatı beklenenden farklı')
    }

    const currencies = result.Tarih_Date.Currency
    const date = result.Tarih_Date.$.Date // Format: MM/DD/YYYY
    const [month, day, year] = date.split('/')

    let savedCount = 0

    // Önemli kurlar: USD, EUR, GBP
    const importantCurrencies = ['USD', 'EUR', 'GBP']

    for (const currency of currencies) {
      const code = currency.$.CurrencyCode

      // Sadece önemli kurları kaydet
      if (!importantCurrencies.includes(code)) {
        continue
      }

      const forexBuying = currency.ForexBuying?.[0] || null
      const forexSelling = currency.ForexSelling?.[0] || null

      if (!forexBuying || !forexSelling) {
        console.log(`[CurrencyScraper] ${code} için kur bilgisi eksik, atlanıyor`)
        continue
      }

      // Aynı gün için bu kur zaten var mı kontrol et
      const categoryName = `currency-${code}`
      const existing = await prisma.economicIndicator.findFirst({
        where: {
          category: categoryName,
          year: parseInt(year),
          month: parseInt(month)
        }
      })

      if (existing) {
        // Güncelle
        await prisma.economicIndicator.update({
          where: { id: existing.id },
          data: {
            value: parseFloat(forexBuying),
            description: `Alış: ${forexBuying} TL, Satış: ${forexSelling} TL`,
            updatedAt: new Date()
          }
        })
        console.log(`[CurrencyScraper] Güncellendi: ${code} - ${forexBuying} TL`)
      } else {
        // Yeni kayıt
        await prisma.economicIndicator.create({
          data: {
            category: categoryName,
            title: code,
            value: parseFloat(forexBuying),
            unit: 'TL',
            description: `Alış: ${forexBuying} TL, Satış: ${forexSelling} TL`,
            year: parseInt(year),
            month: parseInt(month),
            source: 'TCMB',
            sourceUrl: 'https://www.tcmb.gov.tr/kurlar/today.xml',
            isActive: true
          }
        })
        console.log(`[CurrencyScraper] Eklendi: ${code} - ${forexBuying} TL`)
        savedCount++
      }
    }

    return {
      success: true,
      count: savedCount,
      message: `${savedCount} yeni kur bilgisi eklendi`
    }
  } catch (error) {
    console.error('[CurrencyScraper] Hata:', error.message)
    return {
      success: false,
      count: 0,
      message: error.message
    }
  }
}

module.exports = { scrape }
