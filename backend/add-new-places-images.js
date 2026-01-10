const { PrismaClient } = require("@prisma/client")
const https = require('https')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Her yer için Wikipedia Commons'tan fotoğraf URL'leri
const imageUrls = {
  12: { // Ayasofya
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/1200px-Hagia_Sophia_Mars_2013.jpg',
    title: 'Ayasofya'
  },
  13: { // Sultanahmet Camii
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Sultan_Ahmed_Mosque%2C_Istanbul%2C_Turkey.jpg/1200px-Sultan_Ahmed_Mosque%2C_Istanbul%2C_Turkey.jpg',
    title: 'Sultanahmet Camii'
  },
  14: { // Topkapı Sarayı
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Topkapi_2007_80.jpg/1200px-Topkapi_2007_80.jpg',
    title: 'Topkapı Sarayı'
  },
  15: { // Nusr-Et
    url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Nusr-Et Steakhouse'
  },
  16: { // Empire State Building
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/1200px-Empire_State_Building_%28aerial_view%29.jpg',
    title: 'Empire State Building'
  },
  17: { // Central Park
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Looking_towards_lower_Manhattan_from_Top_of_the_Rock.jpg/1200px-Looking_towards_lower_Manhattan_from_Top_of_the_Rock.jpg',
    title: 'Central Park'
  },
  18: { // Statue of Liberty
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/1200px-Statue_of_Liberty_7.jpg',
    title: 'Statue of Liberty'
  },
  19: { // Katz's Delicatessen
    url: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: "Katz's Delicatessen"
  },
  20: { // Reichstag
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Reichstag_building_Berlin_view_from_west_before_sunset.jpg/1200px-Reichstag_building_Berlin_view_from_west_before_sunset.jpg',
    title: 'Reichstag Building'
  },
  21: { // Berlin Wall Memorial
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Berlin_Wall_Memorial.jpg/1200px-Berlin_Wall_Memorial.jpg',
    title: 'Berlin Wall Memorial'
  },
  22: { // Pergamon Museum
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Pergamonmuseum_-_Ishtartor_01.jpg/1200px-Pergamonmuseum_-_Ishtartor_01.jpg',
    title: 'Pergamon Museum'
  },
  23: { // Curry 36
    url: 'https://images.pexels.com/photos/5175532/pexels-photo-5175532.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Curry 36'
  },
  24: { // Dubai Mall
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Dubai_Mall_Main_Entrance.jpg/1200px-Dubai_Mall_Main_Entrance.jpg',
    title: 'Dubai Mall'
  },
  25: { // Palm Jumeirah
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/The_Palm_Islands_Dubai.jpg/1200px-The_Palm_Islands_Dubai.jpg',
    title: 'Palm Jumeirah'
  },
  26: { // Dubai Fountain
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Dubai_Fountain_show_20171219.jpg/1200px-Dubai_Fountain_show_20171219.jpg',
    title: 'Dubai Fountain'
  },
  27: { // Zuma Dubai
    url: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Zuma Dubai'
  },
  28: { // Çin Seddi
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/1200px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
    title: 'Çin Seddi'
  },
  29: { // Cennet Tapınağı
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Temple_of_Heaven%2C_Beijing%2C_China.jpg/1200px-Temple_of_Heaven%2C_Beijing%2C_China.jpg',
    title: 'Cennet Tapınağı'
  },
  30: { // Yaz Sarayı
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Summer_Palace_-_Kunming_Lake_and_Longevity_Hill.jpg/1200px-Summer_Palace_-_Kunming_Lake_and_Longevity_Hill.jpg',
    title: 'Yaz Sarayı'
  },
  31: { // Quanjude Duck
    url: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Quanjude Roast Duck'
  },
  32: { // Louvre
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/1200px-Louvre_Museum_Wikimedia_Commons.jpg',
    title: 'Louvre Müzesi'
  },
  33: { // Notre-Dame
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Notre-Dame_de_Paris_2013-07-24.jpg/1200px-Notre-Dame_de_Paris_2013-07-24.jpg',
    title: 'Notre-Dame Katedrali'
  },
  34: { // Champs-Élysées
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Champs-%C3%89lys%C3%A9es%2C_Paris_France.jpg/1200px-Champs-%C3%89lys%C3%A9es%2C_Paris_France.jpg',
    title: 'Champs-Élysées'
  },
  35: { // Le Jules Verne
    url: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Le Jules Verne Restaurant'
  },
  36: { // Van Gogh Museum
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Van_Gogh_Museum_Amsterdam.jpg/1200px-Van_Gogh_Museum_Amsterdam.jpg',
    title: 'Van Gogh Museum'
  },
  37: { // Anne Frank Evi
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Anne_Frank_House_in_Amsterdam.jpg/1200px-Anne_Frank_House_in_Amsterdam.jpg',
    title: 'Anne Frank Evi'
  },
  38: { // Keukenhof
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Keukenhof_Gardens_Lisse_Netherlands.jpg/1200px-Keukenhof_Gardens_Lisse_Netherlands.jpg',
    title: 'Keukenhof Gardens'
  },
  39: { // Pancake Bakery
    url: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'The Pancake Bakery'
  },
  40: { // Tower of London
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Tower_of_London_viewed_from_the_River_Thames.jpg/1200px-Tower_of_London_viewed_from_the_River_Thames.jpg',
    title: 'Tower of London'
  },
  41: { // Buckingham Palace
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Buckingham_Palace%2C_London_-_April_2009.jpg/1200px-Buckingham_Palace%2C_London_-_April_2009.jpg',
    title: 'Buckingham Palace'
  },
  42: { // Big Ben
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_September_2006-2.jpg/1200px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_September_2006-2.jpg',
    title: 'Big Ben & Houses of Parliament'
  },
  43: { // Dishoom
    url: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Dishoom Restaurant'
  },
  44: { // Park Güell
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Park_G%C3%BCell_-_view_down_stairway.jpg/1200px-Park_G%C3%BCell_-_view_down_stairway.jpg',
    title: 'Park Güell'
  },
  45: { // Casa Batlló
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Casa_Batll%C3%B3_by_Gaudi.jpg/1200px-Casa_Batll%C3%B3_by_Gaudi.jpg',
    title: 'Casa Batlló'
  },
  46: { // La Rambla
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/La_Rambla_-_Barcelona%2C_Spain_-_Jan_2007.jpg/1200px-La_Rambla_-_Barcelona%2C_Spain_-_Jan_2007.jpg',
    title: 'La Rambla'
  },
  47: { // Cerveceria Catalana
    url: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Cerveceria Catalana'
  },
  48: { // Vatikan Müzesi
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Vatican_Museums_Spiral_Staircase_2012.jpg/1200px-Vatican_Museums_Spiral_Staircase_2012.jpg',
    title: 'Vatikan Müzesi'
  },
  49: { // Trevi Çeşmesi
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/1200px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg',
    title: 'Trevi Çeşmesi'
  },
  50: { // Pantheon
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/The_Pantheon_in_Rome.jpg/1200px-The_Pantheon_in_Rome.jpg',
    title: 'Pantheon'
  },
  51: { // Roscioli
    url: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Roscioli Restaurant'
  },
  52: { // Kremlin Sarayı
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Moscow_Kremlin_from_Kamenny_bridge.jpg/1200px-Moscow_Kremlin_from_Kamenny_bridge.jpg',
    title: 'Kremlin Sarayı'
  },
  53: { // Aziz Basil Katedrali
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Saint_Basil%27s_Cathedral_in_Moscow.jpg/1200px-Saint_Basil%27s_Cathedral_in_Moscow.jpg',
    title: 'Aziz Basil Katedrali'
  },
  54: { // Bolshoi Tiyatrosu
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Moscow_Bolshoi_Theatre_2011.jpg/1200px-Moscow_Bolshoi_Theatre_2011.jpg',
    title: 'Bolshoi Tiyatrosu'
  },
  55: { // Cafe Pushkin
    url: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Cafe Pushkin'
  }
}

// Resim indirme fonksiyonu
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    const request = (url.startsWith('https://images.pexels.com') ? https : https).get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      } else {
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    })
    request.on('error', (err) => {
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

  for (const [guideId, data] of Object.entries(imageUrls)) {
    try {
      const guide = await prisma.travelGuide.findUnique({
        where: { id: parseInt(guideId) }
      })

      if (!guide) {
        console.log(`⊘ ID ${guideId} bulunamadı`)
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
    } catch (error) {
      console.error(`✗ ID ${guideId} başarısız:`, error.message)
    }
  }

  await prisma.$disconnect()
  console.log(`\n✅ Tamamlandı!`)
}

main()
