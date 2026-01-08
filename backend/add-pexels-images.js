const { PrismaClient } = require("@prisma/client")
const https = require("https")
const fs = require("fs")
const path = require("path")

const prisma = new PrismaClient()

// Pexels'ten elle seçilmiş yüksek kaliteli resimler
const pexelsImages = {
  7: [  // Rijksmuseum
    "https://images.pexels.com/photos/8892/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800", // Museum interior
    "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800", // Art museum
    "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800" // Museum gallery
  ],
  8: [  // British Museum
    "https://images.pexels.com/photos/8828659/pexels-photo-8828659.jpeg?auto=compress&cs=tinysrgb&w=800", // Museum artifacts
    "https://images.pexels.com/photos/5644954/pexels-photo-5644954.jpeg?auto=compress&cs=tinysrgb&w=800", // Historical museum
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800" // Museum interior
  ],
  10: [ // Kolezyum - 1 daha
    "https://images.pexels.com/photos/2731666/pexels-photo-2731666.jpeg?auto=compress&cs=tinysrgb&w=800" // Colosseum
  ]
}

const downloadImage = (imageUrl, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)

    https.get(imageUrl, {
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
  for (const [guideId, imageUrls] of Object.entries(pexelsImages)) {
    const guide = await prisma.travelGuide.findUnique({
      where: { id: parseInt(guideId) },
      include: { images: true }
    })

    if (!guide) continue

    console.log(`\n📍 ${guide.name}`)

    const currentOrder = guide.images.length

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i]
      const filename = `guide-${guideId}-pexels-${currentOrder + i + 1}-${Date.now()}.jpg`
      const filepath = path.join(__dirname, 'uploads/travel-guides', filename)

      try {
        await downloadImage(imageUrl, filepath)
        console.log(`  ✓ İndirildi: ${filename}`)

        await prisma.travelGuideImage.create({
          data: {
            guideId: parseInt(guideId),
            image: `/uploads/travel-guides/${filename}`,
            title: `${guide.name} - Fotoğraf ${currentOrder + i + 1}`,
            order: currentOrder + i
          }
        })
        console.log(`  ✓ Veritabanına eklendi`)

        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`  ✗ Hata: ${error.message}`)
      }
    }
  }

  await prisma.$disconnect()
  console.log("\n✅ Tamamlandı!")
}

main()
