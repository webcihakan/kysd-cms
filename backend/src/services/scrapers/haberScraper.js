const cheerio = require('cheerio')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

// URL'den veri cek
function fetchUrl(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive'
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
      res.on('end', () => resolve(data))
      res.on('error', reject)
    })

    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Timeout'))
    })
  })
}

// Resmi indir ve kaydet
async function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.log(`[HaberScraper] Gecersiz resim URL: ${imageUrl}`)
      resolve(null)
      return
    }

    const uploadDir = path.join(__dirname, '../../../uploads/news')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, filename)
    const file = fs.createWriteStream(filePath)

    const protocol = imageUrl.startsWith('https') ? https : http

    console.log(`[HaberScraper] Resim indiriliyor: ${imageUrl}`)

    protocol.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': imageUrl.split('/').slice(0, 3).join('/')
      },
      timeout: 15000
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close()
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        console.log(`[HaberScraper] Resim redirect: ${response.headers.location}`)
        downloadImage(response.headers.location, filename).then(resolve).catch(reject)
        return
      }

      if (response.statusCode !== 200) {
        file.close()
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        console.log(`[HaberScraper] Resim indirilemedi (HTTP ${response.statusCode}): ${imageUrl}`)
        resolve(null)
        return
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        console.log(`[HaberScraper] Resim indirildi: ${filename}`)
        resolve(`/uploads/news/${filename}`)
      })
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      console.log(`[HaberScraper] Resim indirme hatasi: ${err.message}`)
      resolve(null)
    }).on('timeout', () => {
      file.close()
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      console.log(`[HaberScraper] Resim indirme zaman asimi: ${imageUrl}`)
      resolve(null)
    })
  })
}

// Slug olustur
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[ığüşöçİĞÜŞÖÇ]/g, char => {
      const map = { 'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
                   'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c' }
      return map[char] || char
    })
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
}

// Haber kaynaklari
const newsSources = [
  {
    name: 'IHKIB',
    url: 'https://www.ihkib.org.tr/tr/haberler',
    baseUrl: 'https://www.ihkib.org.tr',
    selectors: {
      items: '.news-item, .haber-item, article, .card',
      title: 'h2, h3, .title, .baslik, a',
      link: 'a',
      image: 'img',
      excerpt: 'p, .excerpt, .ozet, .description'
    }
  },
  {
    name: 'TIM',
    url: 'https://tim.org.tr/tr/haberler',
    baseUrl: 'https://tim.org.tr',
    selectors: {
      items: '.news-card, .haber-item, article, .card, .news-item',
      title: 'h2, h3, h4, .title, a',
      link: 'a',
      image: 'img',
      excerpt: 'p, .excerpt, .text'
    }
  },
  {
    name: 'TGSD',
    url: 'https://www.tgsd.org.tr/haberler',
    baseUrl: 'https://www.tgsd.org.tr',
    selectors: {
      items: '.news-item, .haber, article, .post',
      title: 'h2, h3, .title, a',
      link: 'a',
      image: 'img',
      excerpt: 'p, .excerpt'
    }
  }
]

// RSS Feed kaynaklari - Turkiye Ekonomi Haberleri
const rssFeeds = [
  {
    name: 'TRT Haber Ekonomi',
    url: 'https://www.trthaber.com/ekonomi_articles.rss',
    keywords: ['tekstil', 'konfeksiyon', 'ihracat', 'sanayi', 'üretim', 'moda', 'giyim', 'ticaret', 'şirket', 'yatırım']
  },
  {
    name: 'AA Ekonomi',
    url: 'https://www.aa.com.tr/tr/rss/default?cat=ekonomi',
    keywords: ['tekstil', 'konfeksiyon', 'ihracat', 'sanayi', 'üretim', 'firma', 'yatırım']
  },
  {
    name: 'Dünya Gazetesi',
    url: 'https://www.dunya.com/rss',
    keywords: ['tekstil', 'konfeksiyon', 'ihracat', 'sanayi', 'üretim', 'moda', 'giyim', 'ticaret', 'firma', 'yatırım', 'şirket']
  }
]

// RSS Feed parser
async function parseRSS(url, keywords) {
  try {
    console.log(`[HaberScraper] RSS feed okunuyor: ${url}`)
    const xml = await fetchUrl(url, 20000)
    const $ = cheerio.load(xml, { xmlMode: true })
    const items = []

    $('item').each((i, item) => {
      if (i >= 20) return

      const $item = $(item)
      const title = $item.find('title').text().trim()
      const link = $item.find('link').text().trim()
      const description = $item.find('description').text().trim().replace(/<[^>]+>/g, '')

      // Resim URL'ini bul - cesitli kaynaklari dene
      let imageUrl = $item.find('enclosure').attr('url') ||
                     $item.find('media\\:content').attr('url') ||
                     $item.find('media\\:thumbnail').attr('url') ||
                     $item.find('media\\:content').first().attr('url')

      // Icerik veya aciklama icinde img tag var mi kontrol et
      if (!imageUrl) {
        const content = $item.find('content\\:encoded, description').html() || ''
        const imgMatch = content.match(/<img[^>]+src=["']([^"'>]+)["']/)
        if (imgMatch) imageUrl = imgMatch[1]
      }

      // TRT Haber icin ozel: thumbUrl kullan
      if (!imageUrl) {
        imageUrl = $item.find('thumbUrl').text().trim()
      }

      // AA Haber icin ozel: medya tag'larini kontrol et
      if (!imageUrl) {
        const mediaGroup = $item.find('media\\:group media\\:content')
        if (mediaGroup.length) {
          imageUrl = mediaGroup.first().attr('url')
        }
      }

      console.log(`[HaberScraper] RSS Haber: "${title.substring(0, 50)}" - Resim: ${imageUrl || 'YOK'}`)

      // Anahtar kelime filtresi - haberin konuyla alakali olup olmadigini kontrol et
      const fullText = (title + ' ' + description).toLowerCase()
      const hasKeyword = !keywords || keywords.length === 0 ||
        keywords.some(kw => fullText.includes(kw.toLowerCase()))

      if (hasKeyword && title && title.length > 10) {
        items.push({
          title,
          link,
          excerpt: description,
          imageUrl,
          source: 'RSS'
        })
      }
    })

    console.log(`[HaberScraper] RSS'den ${items.length} alakali haber bulundu`)
    return items
  } catch (err) {
    console.log(`[HaberScraper] RSS parse hatasi: ${err.message}`)
    return []
  }
}

// Bir haber kaynagindan haberleri cek
async function scrapeNewsSource(source) {
  const haberler = []

  try {
    console.log(`[HaberScraper] ${source.name} taraniyor...`)
    const html = await fetchUrl(source.url)
    const $ = cheerio.load(html)

    $(source.selectors.items).each((i, el) => {
      if (i >= 10) return // Max 10 haber

      try {
        const $el = $(el)

        // Baslik
        let title = $el.find(source.selectors.title).first().text().trim()
        if (!title || title.length < 10) return

        // Link
        let link = $el.find(source.selectors.link).first().attr('href')
        if (link && !link.startsWith('http')) {
          link = source.baseUrl + (link.startsWith('/') ? '' : '/') + link
        }

        // Resim
        let image = $el.find(source.selectors.image).first().attr('src') ||
                    $el.find(source.selectors.image).first().attr('data-src')
        if (image && !image.startsWith('http')) {
          image = source.baseUrl + (image.startsWith('/') ? '' : '/') + image
        }

        // Ozet
        let excerpt = $el.find(source.selectors.excerpt).first().text().trim()
        if (!excerpt) excerpt = title

        haberler.push({
          title: title.substring(0, 200),
          link,
          image,
          excerpt: excerpt.substring(0, 300),
          source: source.name
        })
      } catch (err) {
        // Hata durumunda devam et
      }
    })

    console.log(`[HaberScraper] ${source.name}: ${haberler.length} haber bulundu`)
  } catch (err) {
    console.log(`[HaberScraper] ${source.name} hatasi: ${err.message}`)
  }

  return haberler
}

// Haber detay sayfasindan icerik cek
async function scrapeNewsContent(url) {
  try {
    const html = await fetchUrl(url, 15000)
    const $ = cheerio.load(html)

    // Sayfa icerigini cek
    let content = ''

    // Cesitli icerik selektorleri dene
    const contentSelectors = [
      '.news-content', '.haber-icerik', '.content', '.post-content',
      'article .content', '.entry-content', '.article-body',
      '.news-detail-content', '.detail-content', 'main article'
    ]

    for (const selector of contentSelectors) {
      const found = $(selector).first()
      if (found.length) {
        // Gereksiz elementleri kaldir
        found.find('script, style, nav, header, footer, .social, .share, .related').remove()
        content = found.html()
        if (content && content.length > 100) break
      }
    }

    // Icerik bulunamadiysa paragraflardan olustur
    if (!content || content.length < 100) {
      const paragraphs = []
      $('article p, .content p, main p').each((i, el) => {
        const text = $(el).text().trim()
        if (text.length > 50) {
          paragraphs.push(`<p>${text}</p>`)
        }
      })
      content = paragraphs.slice(0, 10).join('\n')
    }

    return content || null
  } catch (err) {
    return null
  }
}

// Ana scrape fonksiyonu
async function scrape(prisma) {
  let newCount = 0
  const tumHaberler = []

  // RSS Feed kaynaklarindan haberleri topla (ONCE RSS!)
  for (const feed of rssFeeds) {
    try {
      console.log(`[HaberScraper] ${feed.name} RSS taraniyor...`)
      const items = await parseRSS(feed.url, feed.keywords)
      tumHaberler.push(...items.map(item => ({
        ...item,
        sourceName: feed.name
      })))
    } catch (err) {
      console.log(`[HaberScraper] ${feed.name} RSS hatasi: ${err.message}`)
    }
  }

  // Tum web kaynaklarindan haberleri topla (SONRA Web Scraping)
  for (const source of newsSources) {
    try {
      const haberler = await scrapeNewsSource(source)
      tumHaberler.push(...haberler.map(h => ({
        ...h,
        sourceName: h.source
      })))
    } catch (err) {
      console.log(`[HaberScraper] ${source.name} atlandi: ${err.message}`)
    }
  }

  console.log(`[HaberScraper] Toplam ${tumHaberler.length} haber bulundu, veritabanina kaydediliyor...`)

  // Haberleri veritabanina kaydet (max 15 haber)
  for (const haber of tumHaberler.slice(0, 15)) {
    try {
      // Ayni baslikta haber var mi kontrol et
      const existing = await prisma.news.findFirst({
        where: { title: haber.title }
      })

      if (existing) continue

      // Haber icerigi olustur
      let content = null
      const isRSSNews = haber.source === 'RSS'

      // RSS haberleri icin detay sayfadan cekilmez, ozet kullanilir
      if (!isRSSNews && haber.link) {
        content = await scrapeNewsContent(haber.link)
      }

      if (!content) {
        content = `<div class="ekonomi-haber">
          <p>${haber.excerpt}</p>
          ${haber.link ? `<p><a href="${haber.link}" target="_blank" rel="noopener" class="btn btn-primary">Haberin Devamı</a></p>` : ''}
          <p class="haber-kaynak"><strong>Kaynak:</strong> ${haber.sourceName}</p>
        </div>`
      }

      // Resmi indir (RSS'de imageUrl, web scrapingde image)
      let imagePath = null
      const imageUrl = haber.imageUrl || haber.image

      // SADECE resimli haberleri ekle
      if (!imageUrl) {
        console.log(`[HaberScraper] ATLANDI (resim yok): ${haber.title.substring(0, 60)}...`)
        continue
      }

      if (imageUrl) {
        const ext = imageUrl.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || 'jpg'
        const imageFilename = `ekonomi-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${ext}`
        imagePath = await downloadImage(imageUrl, imageFilename)

        // Resim indirilemezse haberi ekleme
        if (!imagePath) {
          console.log(`[HaberScraper] ATLANDI (resim indirilemedi): ${haber.title.substring(0, 60)}...`)
          continue
        }
      }

      // Slug olustur
      const slug = createSlug(haber.title) + '-' + Date.now()

      // Veritabanina kaydet
      await prisma.news.create({
        data: {
          title: haber.title,
          slug,
          excerpt: haber.excerpt,
          content,
          image: imagePath,
          isActive: true,
          isFeatured: false
        }
      })

      newCount++
      console.log(`[HaberScraper] Eklendi: ${haber.title.substring(0, 60)}... (Kaynak: ${haber.sourceName})`)

    } catch (err) {
      console.log(`[HaberScraper] Kayit hatasi: ${err.message}`)
    }
  }

  // Eger hic haber cekilemediyse bilgi ver
  if (newCount === 0 && tumHaberler.length === 0) {
    console.log('[HaberScraper] Kaynaklardan haber cekilemedi.')
  }

  return {
    count: newCount,
    message: `${newCount} yeni ekonomi haberi eklendi`
  }
}

// Ornek haberler (kaynaklardan cekilemezse)
async function addSampleNews(prisma) {
  const ornekHaberler = [
    {
      title: 'Turkiye Tekstil Ihracati Rekor Kirildi',
      excerpt: 'Turkiye tekstil ve hazir giyim sektoru 2024 yilinda 35 milyar dolar ihracat hedefine ulasti.',
      content: `
        <h2>Tekstil Sektorunde Buyuk Basari</h2>
        <p>Turkiye tekstil ve hazir giyim sektoru, 2024 yilinda tarihi bir basariya imza atarak 35 milyar dolar ihracat rakamina ulasti. Bu rakam, bir onceki yila gore %12'lik bir artisa karsilik geliyor.</p>

        <h3>Onemli Pazarlar</h3>
        <ul>
          <li>Avrupa Birligi ulkeleri en buyuk pazar olmaya devam ediyor</li>
          <li>ABD pazarinda %20 buyume kaydedildi</li>
          <li>Orta Dogu ve Korfez ulkelerinde ihracat artti</li>
        </ul>

        <h3>Sektor Temsilcilerinin Degerlendirmesi</h3>
        <p>Sektor temsilcileri, bu basarinin arkasinda kaliteli uretim, rekabetci fiyatlar ve hizli teslimat kapasitesinin yattigini vurguladi.</p>

        <p><strong>Kaynak:</strong> IHKIB</p>
      `,
      image: '/uploads/news/news-1-ihracat.jpg'
    },
    {
      title: 'Konfeksiyon Yan Sanayinde Dijital Donusum Hizlandi',
      excerpt: 'Dugme, fermuar ve aksesuar ureticileri Endustri 4.0 yatirimlarini artirdi.',
      content: `
        <h2>Dijital Fabrikalar Kuruluyor</h2>
        <p>Konfeksiyon yan sanayi sektoru, dijital donusum yatirimlarini hizlandirdi. Dugme, fermuar, etiket ve aksesuar ureticileri, akilli fabrika sistemlerine gecis yapiyor.</p>

        <h3>Yapilan Yatirimlar</h3>
        <ul>
          <li>Robotik otomasyon sistemleri</li>
          <li>IoT tabanli uretim takip sistemleri</li>
          <li>Yapay zeka destekli kalite kontrol</li>
          <li>ERP ve MRP entegrasyonlari</li>
        </ul>

        <p>KOSGEB ve TUBITAK destekleri ile firmalarin dijital donusum surecleri hizlandi.</p>

        <p><strong>Kaynak:</strong> KYSD</p>
      `,
      image: '/uploads/news/dijital-donusum.jpg'
    },
    {
      title: 'Surdurulebilir Tekstil Uretimine Yonetim Artiyor',
      excerpt: 'Cevre dostu uretim ve geri donusum teknolojileri sektorde on plana cikiyor.',
      content: `
        <h2>Yesil Uretim Trendi</h2>
        <p>Tekstil ve konfeksiyon sektoru, surdurulebilirlik konusunda onemli adimlar atiyor. Cevre dostu uretim yontemleri ve geri donusum teknolojileri yaygınlasiyor.</p>

        <h3>Surdurulebilirlik Calismalari</h3>
        <ul>
          <li>Organik pamuk kullanimi artiyor</li>
          <li>Su tasarrufu saglayan boyama teknikleri</li>
          <li>Geri donusturulmus polyester kullanimi</li>
          <li>Sifir atik hedefine yonelik projeler</li>
        </ul>

        <p>AB'nin yeni cevre duzenlemeleri de sektoru bu yonde tesvik ediyor.</p>

        <p><strong>Kaynak:</strong> TGSD</p>
      `,
      image: '/uploads/news/yesil-donusum.jpg'
    },
    {
      title: 'Tekstil Fuarlarina Yogun Katilim',
      excerpt: 'ITM ve Texworld fuarlarinda Turk firmalari buyuk ilgi gordu.',
      content: `
        <h2>Fuar Sezonunda Buyuk Basari</h2>
        <p>Turkiye tekstil ve konfeksiyon sektoru, uluslararasi fuarlarda guclu bir performans sergiledi. ITM Istanbul ve Texworld Paris fuarlarinda Turk firmalari buyuk ilgi gordu.</p>

        <h3>Fuar Sonuclari</h3>
        <ul>
          <li>500'den fazla Turk firmasi katildi</li>
          <li>50'den fazla ulkeden alici agirlandi</li>
          <li>Toplam 2 milyar dolarlik siparis aldi</li>
        </ul>

        <p>Bir sonraki fuar sezonu icin hazirliklar baslatildi.</p>

        <p><strong>Kaynak:</strong> TIM</p>
      `,
      image: '/uploads/news/news-5-fuar.jpg'
    },
    {
      title: 'Yeni Tesvik Paketi Aciklandi',
      excerpt: 'Tekstil ve konfeksiyon sektorune yonelik yeni tesvik ve destek programlari devreye girdi.',
      content: `
        <h2>Sektor Icin Yeni Destekler</h2>
        <p>Hukumet, tekstil ve konfeksiyon sektorune yonelik kapsamli bir tesvik paketi acikladi. Yeni destekler ozellikle ihracat, Ar-Ge ve istihdam alanlarini kapsıyor.</p>

        <h3>Tesvik Detaylari</h3>
        <ul>
          <li>Ihracat kredilerinde faiz destegi</li>
          <li>Ar-Ge projelerine %75'e varan hibe</li>
          <li>Yeni istihdam icin SGK prim destegi</li>
          <li>Makine yatirimlarinda KDV istisnasi</li>
        </ul>

        <p>Basvurular KOSGEB ve Ticaret Bakanligi uzerinden yapilabilir.</p>

        <p><strong>Kaynak:</strong> KOSGEB</p>
      `,
      image: '/uploads/news/tesvik-destek.jpg'
    }
  ]

  let count = 0
  for (const haber of ornekHaberler) {
    try {
      const existing = await prisma.news.findFirst({
        where: { title: haber.title }
      })

      if (!existing) {
        const slug = createSlug(haber.title) + '-' + Date.now()
        await prisma.news.create({
          data: {
            title: haber.title,
            slug,
            excerpt: haber.excerpt,
            content: haber.content,
            image: haber.image,
            isActive: true,
            isFeatured: true
          }
        })
        count++
      }
    } catch (err) {
      console.log(`[HaberScraper] Ornek haber hatasi: ${err.message}`)
    }
  }

  return count
}

module.exports = { scrape }
