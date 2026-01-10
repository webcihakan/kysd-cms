const { PrismaClient } = require("@prisma/client")
const https = require('https')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Pexels'ten uygun fotoğraflar
const imageUrls = {
  12: { // Ayasofya
    url: 'https://images.pexels.com/photos/14664050/pexels-photo-14664050.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Ayasofya'
  },
  13: { // Sultanahmet Camii
    url: 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Sultanahmet Camii - Mavi Cami'
  },
  14: { // Topkapı Sarayı
    url: 'https://images.pexels.com/photos/14664059/pexels-photo-14664059.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Topkapı Sarayı'
  },
  16: { // Empire State Building
    url: 'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Empire State Building'
  },
  17: { // Central Park
    url: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Central Park'
  },
  18: { // Statue of Liberty
    url: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Statue of Liberty'
  },
  20: { // Reichstag
    url: 'https://images.pexels.com/photos/109629/pexels-photo-109629.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Reichstag Building'
  },
  21: { // Berlin Wall
    url: 'https://images.pexels.com/photos/1331750/pexels-photo-1331750.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Berlin Wall Memorial'
  },
  22: { // Pergamon Museum
    url: 'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Pergamon Museum'
  },
  23: { // Curry 36
    url: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Curry 36 - Currywurst'
  },
  24: { // Dubai Mall
    url: 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Dubai Mall'
  },
  25: { // Palm Jumeirah
    url: 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Palm Jumeirah'
  },
  26: { // Dubai Fountain
    url: 'https://images.pexels.com/photos/2115367/pexels-photo-2115367.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Dubai Fountain'
  },
  28: { // Çin Seddi
    url: 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Çin Seddi'
  },
  29: { // Cennet Tapınağı
    url: 'https://images.pexels.com/photos/2412604/pexels-photo-2412604.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Cennet Tapınağı'
  },
  30: { // Yaz Sarayı
    url: 'https://images.pexels.com/photos/1574647/pexels-photo-1574647.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Yaz Sarayı Pekin'
  },
  32: { // Louvre
    url: 'https://images.pexels.com/photos/2675843/pexels-photo-2675843.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Louvre Müzesi'
  },
  33: { // Notre-Dame
    url: 'https://images.pexels.com/photos/460740/pexels-photo-460740.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Notre-Dame Katedrali'
  },
  34: { // Champs-Élysées
    url: 'https://images.pexels.com/photos/2859169/pexels-photo-2859169.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Champs-Élysées'
  },
  36: { // Van Gogh Museum
    url: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Van Gogh Museum'
  },
  37: { // Anne Frank Evi
    url: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Anne Frank Evi'
  },
  38: { // Keukenhof
    url: 'https://images.pexels.com/photos/1459451/pexels-photo-1459451.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Keukenhof Gardens'
  },
  40: { // Tower of London
    url: 'https://images.pexels.com/photos/77171/pexels-photo-77171.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Tower of London'
  },
  41: { // Buckingham Palace
    url: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Buckingham Palace'
  },
  42: { // Big Ben
    url: 'https://images.pexels.com/photos/77171/pexels-photo-77171.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Big Ben & Houses of Parliament'
  },
  44: { // Park Güell
    url: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Park Güell Barcelona'
  },
  45: { // Casa Batlló
    url: 'https://images.pexels.com/photos/3757144/pexels-photo-3757144.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Casa Batlló'
  },
  46: { // La Rambla
    url: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'La Rambla Barcelona'
  },
  48: { // Vatikan Müzesi
    url: 'https://images.pexels.com/photos/2265875/pexels-photo-2265875.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Vatikan Müzesi'
  },
  49: { // Trevi Çeşmesi
    url: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Trevi Çeşmesi'
  },
  50: { // Pantheon
    url: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Pantheon Roma'
  },
  52: { // Kremlin Sarayı
    url: 'https://images.pexels.com/photos/753339/pexels-photo-753339.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Kremlin Sarayı'
  },
  53: { // Aziz Basil Katedrali
    url: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Aziz Basil Katedrali'
  },
  54: { // Bolshoi Tiyatrosu
    url: 'https://images.pexels.com/photos/167259/pexels-photo-167259.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Bolshoi Tiyatrosu'
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

  console.log(`${Object.keys(imageUrls).length} yere fotoğraf ekleniyor...\n`)

  let successCount = 0
  let failCount = 0

  for (const [guideId, data] of Object.entries(imageUrls)) {
    try {
      const guide = await prisma.travelGuide.findUnique({
        where: { id: parseInt(guideId) },
        include: { images: true }
      })

      if (!guide) {
        console.log(`⊘ ID ${guideId} bulunamadı`)
        failCount++
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
      successCount++

      // Rate limiting için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`✗ ID ${guideId} başarısız:`, error.message)
      failCount++
    }
  }

  await prisma.$disconnect()
  console.log(`\n✅ Tamamlandı! ${successCount} başarılı, ${failCount} başarısız`)
}

main()
