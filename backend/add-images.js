const { PrismaClient } = require("@prisma/client")
const https = require("https")
const http = require("http")
const fs = require("fs")
const path = require("path")

const prisma = new PrismaClient()

// Her rehber için kaç resim olacak
const IMAGES_PER_GUIDE = 3

// Resim indirme fonksiyonu (redirect desteği ile)
const downloadImage = (imageUrl, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    const protocol = imageUrl.startsWith('https') ? https : http

    protocol.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    }, (response) => {
      // Redirect kontrolü
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close()
        fs.unlinkSync(filepath)
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject)
        return
      }

      if (response.statusCode !== 200) {
        file.close()
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
        reject(new Error(`Status: ${response.statusCode}`))
        return
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
    console.log(`\nİşleniyor: ${guide.name}`)

    for (let i = 0; i < IMAGES_PER_GUIDE; i++) {
      const filename = `guide-${guide.id}-img-${i + 1}-${Date.now()}.jpg`
      const filepath = path.join(__dirname, "uploads/travel-guides", filename)
      const imageUrl = `https://picsum.photos/800/600?random=${guide.id * 10 + i}`

      try {
        await downloadImage(imageUrl, filepath)
        console.log(`  ✓ Resim indirildi: ${filename}`)

        await prisma.travelGuideImage.create({
          data: {
            guideId: guide.id,
            image: `/uploads/travel-guides/${filename}`,
            title: `${guide.name} - Görsel ${i + 1}`,
            order: i
          }
        })
        console.log(`  ✓ Veritabanına eklendi`)

        // Her resim arasında kısa bekleme
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`  ✗ Hata: ${error.message}`)
      }
    }
  }

  await prisma.$disconnect()
  console.log("\n✓ Tamamlandı!")
}

main()
