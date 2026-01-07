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

    // Bigpara'dan altın fiyatlarını çek
    try {
      const goldResponse = await axios.get('https://bigpara.hurriyet.com.tr/altin/', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // JavaScript değişkeninden veri çek: var $altinData = [...]
      const altinDataMatch = goldResponse.data.match(/var\s+\$altinData\s*=\s*(\[.*?\]);/);

      if (altinDataMatch && altinDataMatch[1]) {
        try {
          const altinData = JSON.parse(altinDataMatch[1]);

          // Gram Altın (GLDGR)
          const gramAltin = altinData.find(item => item.sembolkisa === 'GLDGR');
          if (gramAltin && gramAltin.satis) {
            data.gold = parseFloat(gramAltin.satis.toFixed(2));
          }

        } catch (parseError) {
          console.error('[Currency API] Altın verisi parse hatası:', parseError.message);
        }
      }

      console.log('[Currency API] Altın:', data.gold);

    } catch (goldError) {
      console.error('[Currency API] Altın fiyatları alınamadı:', goldError.message);
    }

    // Bigpara'dan gümüş fiyatlarını çek
    try {
      const silverResponse = await axios.get('https://bigpara.hurriyet.com.tr/gumus/', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // JavaScript değişkeninden veri çek
      const gumusDataMatch = silverResponse.data.match(/var\s+\$gumusData\s*=\s*(\[.*?\]);/);

      if (gumusDataMatch && gumusDataMatch[1]) {
        try {
          const gumusData = JSON.parse(gumusDataMatch[1]);

          // Gram Gümüş (TL/GR)
          const gramGumus = gumusData.find(item =>
            item.aciklama && item.aciklama.includes('Gümüş (TL/GR)')
          );

          if (gramGumus && gramGumus.satis) {
            data.silver = parseFloat(gramGumus.satis.toFixed(2));
          }

        } catch (parseError) {
          console.error('[Currency API] Gümüş verisi parse hatası:', parseError.message);
        }
      }

      console.log('[Currency API] Gümüş:', data.silver);

    } catch (silverError) {
      console.error('[Currency API] Gümüş fiyatları alınamadı:', silverError.message);
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
