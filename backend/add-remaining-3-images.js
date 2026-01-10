const { PrismaClient } = require("@prisma/client")
const https = require('https')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Kalan 3 yer için fotoğraflar
const imageUrls = {
  12: { // Ayasofya
    url: 'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Ayasofya - İstanbul'
  },
  30: { // Yaz Sarayı
    url: 'https://images.pexels.com/photos/2412604/pexels-photo-2412604.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Yaz Sarayı - Pekin'
  },
  32: { // Louvre
    url: 'https://images.pexels.com/photos/2675843/pexels-photo-2675843.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Louvre Müzesi - Paris'
  }
}

// Resim indirme fonksiyonu
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      } else {
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

async function main() {
  const uploadDir = path.join(__dirname, 'uploads/travel-guides')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  console.log(`Kalan ${Object.keys(imageUrls).length} yere fotoğraf ekleniyor...\n`)

  for (const [guideId, data] of Object.entries(imageUrls)) {
    try {
      const guide = await prisma.travelGuide.findUnique({
        where: { id: parseInt(guideId) },
        include: { images: true }
      })

      if (!guide) {
        console.log(`⊘ ID ${guideId} bulunamadı`)
        continue
      }

      // Zaten resmi varsa atla
      if (guide.images.length > 0) {
        console.log(`⊘ ${guide.name} - zaten resmi var`)
        continue
      }

      // Resmi indir
      const filename = `${Date.now()}-${guideId}.jpg`
      const filepath = path.join(uploadDir, filename)

      await downloadImage(data.url, filepath)

      // Veritabanına ekle
      await prisma.travelGuideImage.create({
        data: {
          guideId: parseInt(guideId),
          image: `/uploads/travel-guides/${filename}`,
          title: data.title,
          order: 0
        }
      })

      console.log(`✓ ${guide.name}: ${data.title}`)

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`✗ ID ${guideId} başarısız:`, error.message)
    }
  }

  await prisma.$disconnect()
  console.log(`\n✅ Tamamlandı!`)
}

main()
