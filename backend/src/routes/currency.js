const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');

// TCMB döviz kurları ve Bigpara altın/gümüş fiyatları
router.get('/', async (req, res) => {
  try {
    // TCMB'den güncel döviz kurlarını çek
    const tcmbResponse = await axios.get('https://www.tcmb.gov.tr/kurlar/today.xml', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    // XML'i parse et
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(tcmbResponse.data);
    const currencies = result.Tarih_Date.Currency;

    // Döviz ve altın bilgilerini sakla
    const data = {
      usd: null,
      eur: null,
      gold: null,
      silver: null,
      lastUpdate: result.Tarih_Date.$.Tarih
    };

    // Döviz kurlarını al
    currencies.forEach(currency => {
      const code = currency.$.CurrencyCode || currency.$.Kod;

      if (code === 'USD') {
        data.usd = {
          buying: parseFloat(currency.ForexBuying || 0),
          selling: parseFloat(currency.ForexSelling || 0)
        };
      }

      if (code === 'EUR') {
        data.eur = {
          buying: parseFloat(currency.ForexBuying || 0),
          selling: parseFloat(currency.ForexSelling || 0)
        };
      }
    });

    // Bigpara'dan altın ve gümüş fiyatlarını çek
    try {
      const goldResponse = await axios.get('https://bigpara.hurriyet.com.tr/altin/', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(goldResponse.data);

      // Gram Altın fiyatı - tablo içinden çek
      $('table tr').each((i, row) => {
        const rowText = $(row).text();

        // "Gram Altın" veya "ALTIN (TL/GR)" içeren satırı bul
        if (rowText.includes('Gram Altın') || rowText.includes('ALTIN (TL/GR)')) {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            // Alış ve satış fiyatlarını al
            const buyingText = cells.eq(1).text().trim().replace(/[^\d,]/g, '').replace(',', '.');
            const sellingText = cells.eq(2).text().trim().replace(/[^\d,]/g, '').replace(',', '.');

            const buying = parseFloat(buyingText);
            const selling = parseFloat(sellingText);

            if (!isNaN(buying) && !isNaN(selling) && buying > 0) {
              data.gold = parseFloat(selling.toFixed(2));
            }
          }
        }

        // Gram Gümüş fiyatı
        if (rowText.includes('Gümüş (TL/GR)') || rowText.includes('GÜMÜŞ (TL/GR)')) {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            const buyingText = cells.eq(1).text().trim().replace(/[^\d,]/g, '').replace(',', '.');
            const sellingText = cells.eq(2).text().trim().replace(/[^\d,]/g, '').replace(',', '.');

            const buying = parseFloat(buyingText);
            const selling = parseFloat(sellingText);

            if (!isNaN(buying) && !isNaN(selling) && buying > 0) {
              data.silver = parseFloat(selling.toFixed(2));
            }
          }
        }
      });

      console.log('[Currency API] Altın:', data.gold, 'Gümüş:', data.silver);

    } catch (goldError) {
      console.error('[Currency API] Altın/Gümüş fiyatları alınamadı:', goldError.message);
      // Altın/gümüş hatası varsa sadece döviz kurlarını dön
    }

    // Cache için 5 dakika header ekle
    res.set('Cache-Control', 'public, max-age=300');
    res.json(data);

  } catch (error) {
    console.error('[Currency API] Hata:', error.message);

    // Hata durumunda varsayılan değerler döndür
    res.status(500).json({
      error: 'Döviz kurları alınamadı',
      usd: null,
      eur: null,
      gold: null,
      silver: null,
      lastUpdate: new Date().toISOString()
    });
  }
});

module.exports = router;
