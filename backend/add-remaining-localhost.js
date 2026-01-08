const { PrismaClient } = require("@prisma/client")
const https = require("https")
const fs = require("fs")
const path = require("path")

const prisma = new PrismaClient()

// Eksik resimler
const remaining = {
  5: 2,  // Yasak Şehir - 2 daha
  8: 1,  // British Museum - 1 daha
  9: 2,  // Sagrada Familia - 2 daha
  10: 1, // Kolezyum - 1 daha
  11: 2  // Kızıl Meydan - 2 daha
}

const pexelsUrls = {
  5: [
    "https://images.pexels.com/photos/2901138/pexels-photo-2901138.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2901133/pexels-photo-2901133.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  8: ["https://images.pexels.com/photos/356966/pexels-photo-356966.jpeg?auto=compress&cs=tinysrgb&w=800"],
  9: [
    "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1388029/pexels-photo-1388029.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  10: ["https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=800"],
  11: [
    "https://images.pexels.com/photos/2893685/pexels-photo-2893685.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=800"
  ]
}

const downloadImage = (imageUrl, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(imageUrl, {
      headers: { "User-Agent": "KYSD-CMS/1.0" },
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
        return reject(new Error("Status: " + response.statusCode))
      }
      response.pipe(file)
      file.on("finish", () => {
        file.close()
        resolve()
      })
    }).on("error", (err) => {
      file.close()
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
      reject(err)
    })
  })
}

async function main() {
  for (const [guideId, urls] of Object.entries(pexelsUrls)) {
    const guide = await prisma.travelGuide.findUnique({
      where: { id: parseInt(guideId) },
      include: { images: true }
    })

    if (!guide) continue

    console.log(`\n📍 ${guide.name}`)

    const currentOrder = guide.images.length

    for (let i = 0; i < urls.length; i++) {
      const filename = `guide-${guideId}-final-${currentOrder + i + 1}-${Date.now()}.jpg`
      const filepath = path.join(__dirname, "uploads/travel-guides", filename)

      try {
        await downloadImage(urls[i], filepath)
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
