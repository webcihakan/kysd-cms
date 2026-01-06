const { PrismaClient } = require('@prisma/client')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const prisma = new PrismaClient()

// URL'den veri cek
function fetchUrl(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }

    const protocol = url.startsWith('https') ? https : http

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8'
      },
      timeout
    }

    const req = protocol.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location
        if (!redirectUrl.startsWith('http')) {
          const urlObj = new URL(url)
          redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`
        }
        fetchUrl(redirectUrl, timeout).then(resolve).catch(reject)
        return
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }

      let data = ''
      res.setEncoding('utf8')
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ html: data, finalUrl: url }))
    })

    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Timeout'))
    })
  })
}

// Resmi indir
function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    if (!imageUrl) {
      resolve(null)
      return
    }

    if (!imageUrl.startsWith('http')) {
      imageUrl = 'https:' + (imageUrl.startsWith('//') ? '' : '//') + imageUrl
    }

    const uploadDir = path.join(__dirname, 'uploads/logos')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, filename)
    const file = fs.createWriteStream(filePath)

    const protocol = imageUrl.startsWith('https') ? https : http

    protocol.get(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close()
        fs.unlinkSync(filePath)
        downloadImage(response.headers.location, filename).then(resolve).catch(reject)
        return
      }

      if (response.statusCode !== 200) {
        file.close()
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        resolve(null)
        return
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        // Dosya boyutunu kontrol et (cok kucukse gecersiz)
        const stats = fs.statSync(filePath)
        if (stats.size < 500) {
          fs.unlinkSync(filePath)
          resolve(null)
          return
        }
        resolve(`/uploads/logos/${filename}`)
      })
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      resolve(null)
    })
  })
}

// Siteden logo URL'ini bul
function findLogoUrl(html, baseUrl) {
  const $ = cheerio.load(html)
  let logoUrl = null

  // 1. Header'daki logo
  const logoSelectors = [
    'header img[src*="logo"]',
    'header img[alt*="logo"]',
    '.header img',
    '.logo img',
    '#logo img',
    'a.logo img',
    '.navbar-brand img',
    '.site-logo img',
    'img.logo',
    'img[class*="logo"]',
    'img[id*="logo"]',
    'header a img',
    'nav img'
  ]

  for (const selector of logoSelectors) {
    const img = $(selector).first()
    if (img.length) {
      logoUrl = img.attr('src') || img.attr('data-src')
      if (logoUrl) break
    }
  }

  // 2. Open Graph image
  if (!logoUrl) {
    logoUrl = $('meta[property="og:image"]').attr('content')
  }

  // 3. Favicon (son care)
  if (!logoUrl) {
    const favicon = $('link[rel="icon"]').attr('href') ||
                    $('link[rel="shortcut icon"]').attr('href') ||
                    $('link[rel="apple-touch-icon"]').attr('href')
    if (favicon) logoUrl = favicon
  }

  // URL'i tam hale getir
  if (logoUrl && !logoUrl.startsWith('http')) {
    try {
      const urlObj = new URL(baseUrl)
      if (logoUrl.startsWith('//')) {
        logoUrl = urlObj.protocol + logoUrl
      } else if (logoUrl.startsWith('/')) {
        logoUrl = `${urlObj.protocol}//${urlObj.host}${logoUrl}`
      } else {
        logoUrl = `${urlObj.protocol}//${urlObj.host}/${logoUrl}`
      }
    } catch (e) {}
  }

  return logoUrl
}

// Ana fonksiyon
async function fetchLogos() {
  console.log('Logo cekme islemi basliyor...\n')

  // Website olan ve logosu olmayan uyeleri getir
  const members = await prisma.industryMember.findMany({
    where: {
      website: { not: null },
      OR: [
        { logo: null },
        { logo: '' }
      ]
    }
  })

  console.log(`${members.length} uye icin logo cekilecek\n`)

  let successCount = 0
  let failCount = 0

  for (const member of members) {
    try {
      let website = member.website.trim()

      // URL'i duzelt
      if (!website.startsWith('http')) {
        website = 'https://' + website
      }

      // Sondaki noktayi kaldir
      if (website.endsWith('.')) {
        website = website.slice(0, -1)
      }

      console.log(`[${member.id}] ${member.companyName.substring(0, 30)}...`)
      console.log(`    Website: ${website}`)

      // Sayfayi cek
      const { html, finalUrl } = await fetchUrl(website)

      // Logo URL'ini bul
      const logoUrl = findLogoUrl(html, finalUrl)

      if (logoUrl) {
        console.log(`    Logo bulundu: ${logoUrl.substring(0, 50)}...`)

        // Logoyu indir
        const ext = logoUrl.includes('.png') ? 'png' : logoUrl.includes('.svg') ? 'svg' : 'jpg'
        const filename = `logo-${member.id}-${Date.now()}.${ext}`
        const savedPath = await downloadImage(logoUrl, filename)

        if (savedPath) {
          // Veritabanini guncelle
          await prisma.industryMember.update({
            where: { id: member.id },
            data: { logo: savedPath }
          })
          console.log(`    ✓ Logo kaydedildi: ${savedPath}`)
          successCount++
        } else {
          console.log(`    ✗ Logo indirilemedi`)
          failCount++
        }
      } else {
        console.log(`    ✗ Logo bulunamadi`)
        failCount++
      }

    } catch (error) {
      console.log(`    ✗ Hata: ${error.message}`)
      failCount++
    }

    console.log('')

    // Rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n=== SONUC ===')
  console.log(`Basarili: ${successCount}`)
  console.log(`Basarisiz: ${failCount}`)

  await prisma.$disconnect()
}

fetchLogos().catch(console.error)
