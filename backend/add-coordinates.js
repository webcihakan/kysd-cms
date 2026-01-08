const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// Mevcut yerlerin GPS koordinatları
const coordinates = {
  1: { lat: 41.0108, lng: 28.9680 },  // Kapalıçarşı, Istanbul
  2: { lat: 40.7580, lng: -73.9855 }, // Times Square, New York
  3: { lat: 52.5163, lng: 13.3777 },  // Brandenburg Kapısı, Berlin
  4: { lat: 25.1972, lng: 55.2744 },  // Burj Khalifa, Dubai
  5: { lat: 39.9163, lng: 116.3972 }, // Yasak Şehir, Pekin
  6: { lat: 48.8584, lng: 2.2945 },   // Eyfel Kulesi, Paris
  7: { lat: 52.3600, lng: 4.8852 },   // Rijksmuseum, Amsterdam
  8: { lat: 51.5194, lng: -0.1270 },  // British Museum, Londra
  9: { lat: 41.4036, lng: 2.1744 },   // Sagrada Familia, Barcelona
  10: { lat: 41.8902, lng: 12.4922 }, // Kolezyum, Roma
  11: { lat: 55.7539, lng: 37.6208 }  // Kızıl Meydan, Moskova
}

async function main() {
  console.log('Koordinatlar ekleniyor...\n')

  for (const [id, coords] of Object.entries(coordinates)) {
    try {
      const guide = await prisma.travelGuide.findUnique({
        where: { id: parseInt(id) },
        select: { name: true }
      })

      if (!guide) {
        console.log(`✗ ID ${id} bulunamadı`)
        continue
      }

      await prisma.travelGuide.update({
        where: { id: parseInt(id) },
        data: {
          latitude: coords.lat,
          longitude: coords.lng
        }
      })

      console.log(`✓ ${guide.name}: ${coords.lat}, ${coords.lng}`)
    } catch (error) {
      console.error(`✗ ID ${id} güncellenemedi:`, error.message)
    }
  }

  await prisma.$disconnect()
  console.log('\n✅ Tamamlandı!')
}

main()
