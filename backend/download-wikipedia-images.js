const { PrismaClient } = require("@prisma/client")
const https = require("https")
const http = require("http")
const fs = require("fs")
const path = require("path")

const prisma = new PrismaClient()

// Her rehber için Wikipedia sayfası ve resim sayısı
const guideWikipediaMap = {
  1: { page: "Grand_Bazaar,_Istanbul", images: 3 },
  2: { page: "Times_Square", images: 3 },
  3: { page: "Brandenburg_Gate", images: 3 },
  4: { page: "Burj_Khalifa", images: 3 },
  5: { page: "Forbidden_City", images: 3 },
  6: { page: "Eiffel_Tower", images: 3 },
  7: { page: "Rijksmuseum", images: 3 },
  8: { page: "British_Museum", images: 3 },
  9: { page: "Sagrada_Família", images: 3 },
  10: { page: "Colosseum", images: 3 },
  11: { page: "Red_Square", images: 3 }
}

// Wikipedia API'den sayfa resimlerini al
const getWikipediaImages = (pageTitle) => {
  return new Promise((resolve, reject) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=images&imlimit=20&format=json`

    https.get(url, {
      headers: { 'User-Agent': 'KYSD-CMS/1.0' }
    }, (response) => {
      let data = ''
      response.on('data', chunk => data += chunk)
      response.on('end', () => {
        try {
          const json = JSON.parse(data)
          const pages = json.query.pages
          const pageId = Object.keys(pages)[0]
          const images = pages[pageId].images || []
          // Sadece jpg, jpeg, png uzantılı resimleri al
          const imageFiles = images
            .map(img => img.title)
            .filter(title => /\.(jpg|jpeg|png)$/i.test(title))
          resolve(imageFiles)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

// Wikimedia Commons'dan resim URL'ini al
const getImageUrl = (imageTitle) => {
  return new Promise((resolve, reject) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imageTitle)}&prop=imageinfo&iiprop=url&format=json`

    https.get(url, {
      headers: { 'User-Agent': 'KYSD-CMS/1.0' }
    }, (response) => {
      let data = ''
      response.on('data', chunk => data += chunk)
      response.on('end', () => {
        try {
          const json = JSON.parse(data)
          const pages = json.query.pages
          const pageId = Object.keys(pages)[0]
          const imageUrl = pages[pageId].imageinfo?.[0]?.url
          resolve(imageUrl)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

// Resim indirme fonksiyonu
const downloadImage = (imageUrl, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    const protocol = imageUrl.startsWith('https') ? https : http

    protocol.get(imageUrl, {
      headers: { 'User-Agent': 'KYSD-CMS/1.0' },
      timeout: 30000
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close()
        fs.unlinkSync(filepath)
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject)
      }

      if (response.statusCode !== 200) {
        file.close()
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
        return reject(new Error(`Status: ${response.statusCode}`))
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
      reject(err)
    })
  })
}

async function main() {
  const guides = await prisma.travelGuide.findMany({
    select: { id: true, name: true }
  })

  for (const guide of guides) {
    const wikiInfo = guideWikipediaMap[guide.id]
    if (!wikiInfo) {
      console.log(`⊘ ${guide.name}: Wikipedia mapping bulunamadı`)
      continue
    }

    console.log(`\n📍 ${guide.name} (${wikiInfo.page})`)

    try {
      // Önce mevcut resimleri sil
      const existingImages = await prisma.travelGuideImage.findMany({
        where: { guideId: guide.id }
      })

      for (const img of existingImages) {
        const imgPath = path.join(__dirname, '../..', img.image)
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath)
          console.log(`  🗑️  Eski resim silindi: ${path.basename(img.image)}`)
        }
        await prisma.travelGuideImage.delete({ where: { id: img.id } })
      }

      // Wikipedia'dan resimleri al
      const imageFiles = await getWikipediaImages(wikiInfo.page)
      console.log(`  🔍 ${imageFiles.length} resim bulundu`)

      let downloadedCount = 0
      for (let i = 0; i < imageFiles.length && downloadedCount < wikiInfo.images; i++) {
        const imageTitle = imageFiles[i]

        try {
          const imageUrl = await getImageUrl(imageTitle)
          if (!imageUrl) continue

          const ext = path.extname(imageUrl).split('?')[0] || '.jpg'
          const filename = `guide-${guide.id}-wiki-${downloadedCount + 1}-${Date.now()}${ext}`
          const filepath = path.join(__dirname, 'uploads/travel-guides', filename)

          await downloadImage(imageUrl, filepath)
          console.log(`  ✓ İndirildi: ${filename}`)

          await prisma.travelGuideImage.create({
            data: {
              guideId: guide.id,
              image: `/uploads/travel-guides/${filename}`,
              title: `${guide.name} - Fotoğraf ${downloadedCount + 1}`,
              order: downloadedCount
            }
          })
          console.log(`  ✓ Veritabanına eklendi`)

          downloadedCount++
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          console.error(`  ✗ Hata (${imageTitle}): ${error.message}`)
        }
      }

      console.log(`  ✅ Toplam ${downloadedCount} resim eklendi`)
    } catch (error) {
      console.error(`  ✗ Genel hata: ${error.message}`)
    }
  }

  await prisma.$disconnect()
  console.log("\n✅ Tamamlandı!")
}

main()
