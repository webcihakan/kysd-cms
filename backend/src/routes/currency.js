const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml2js = require('xml2js');

// TCMB döviz ve altın kurları
router.get('/', async (req, res) => {
  try {
    // TCMB'den güncel kurları çek
    const response = await axios.get('https://www.tcmb.gov.tr/kurlar/today.xml', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    // XML'i parse et
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const currencies = result.Tarih_Date.Currency;

    // Döviz ve altın bilgilerini bul
    const data = {
      usd: null,
      eur: null,
      gold: null,
      silver: null,
      lastUpdate: result.Tarih_Date.$.Tarih
    };

    currencies.forEach(currency => {
      const code = currency.$.CurrencyCode || currency.$.Kod;

      // USD - Dolar
      if (code === 'USD') {
        data.usd = {
          buying: parseFloat(currency.ForexBuying || 0),
          selling: parseFloat(currency.ForexSelling || 0)
        };
      }

      // EUR - Euro
      if (code === 'EUR') {
        data.eur = {
          buying: parseFloat(currency.ForexBuying || 0),
          selling: parseFloat(currency.ForexSelling || 0)
        };
      }

      // XAU - Gram Altın
      if (code === 'XAU') {
        data.gold = {
          buying: parseFloat(currency.ForexBuying || 0),
          selling: parseFloat(currency.ForexSelling || 0)
        };
      }

      // XAG - Gram Gümüş
      if (code === 'XAG') {
        data.silver = {
          buying: parseFloat(currency.ForexBuying || 0),
          selling: parseFloat(currency.ForexSelling || 0)
        };
      }
    });

    // Cache için 5 dakika header ekle
    res.set('Cache-Control', 'public, max-age=300');
    res.json(data);

  } catch (error) {
    console.error('TCMB API hatası:', error.message);

    // Hata durumunda varsayılan değerler döndür
    res.status(500).json({
      error: 'Döviz kurları alınamadı',
      usd: { buying: 0, selling: 0 },
      eur: { buying: 0, selling: 0 },
      gold: { buying: 0, selling: 0 },
      silver: { buying: 0, selling: 0 },
      lastUpdate: new Date().toISOString()
    });
  }
});

module.exports = router;
