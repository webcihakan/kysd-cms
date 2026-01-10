const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const newPlaces = [
  // Türkiye - 4 yer daha
  {
    country: 'Turkiye', city: 'Istanbul', name: 'Ayasofya',
    slug: 'ayasofya-istanbul', description: 'UNESCO Dünya Mirası listesindeki tarihi yapı. MS 537 yılında inşa edilen Ayasofya, Bizans mimarisinin en önemli örneklerinden.',
    category: 'historical', latitude: 41.0086, longitude: 28.9802,
    address: 'Sultan Ahmet, Ayasofya Meydanı No:1, Fatih, Istanbul',
    phone: '+90 212 522 1750', openingHours: 'Her gün: 09:00-19:00', isActive: true, order: 0
  },
  {
    country: 'Turkiye', city: 'Istanbul', name: 'Sultanahmet Camii',
    slug: 'sultanahmet-camii', description: 'Osmanlı mimarisinin zirvesi olan Sultanahmet Camii, 1616 yılında Sultan I. Ahmet tarafından yaptırıldı. Altı minaresi ve mavi çinileriyle ünlü.',
    category: 'religious', latitude: 41.0054, longitude: 28.9768,
    address: 'Sultan Ahmet Mahallesi, At Meydanı Cd. No:7, Fatih, Istanbul',
    phone: '+90 212 458 0776', openingHours: 'Her gün açık (namaz saatleri hariç)', isActive: true, order: 0
  },
  {
    country: 'Turkiye', city: 'Istanbul', name: 'Topkapi Sarayi',
    slug: 'topkapi-sarayi', description: 'Osmanlı padişahlarının 400 yıl boyunca yaşadığı muhteşem saray. Kutsal emanetler, hazine ve harem bölümleriyle ziyaretçilerini büyülüyor.',
    category: 'historical', latitude: 41.0115, longitude: 28.9833,
    address: 'Cankurtaran Mahallesi, Topkapı Sarayı, Fatih, Istanbul',
    phone: '+90 212 512 0480', website: 'https://www.millisaraylar.gov.tr',
    openingHours: 'Salı-Pazar: 09:00-18:00\nPazartesi: Kapalı', isActive: true, order: 0
  },
  {
    country: 'Turkiye', city: 'Istanbul', name: 'Nusr-Et Steakhouse',
    slug: 'nusret-steakhouse-istanbul', description: 'Dünyaca ünlü Nusr-Et restoran zincirininin İstanbul şubesi. Kaliteli et yemekleri ve benzersiz servis anlayışı.',
    category: 'restaurant', latitude: 41.0805, longitude: 29.0129,
    address: 'Etiler, Nispetiye Cd. No:87, Beşiktaş, Istanbul',
    phone: '+90 212 358 2010', website: 'https://www.nusr-et.com.tr',
    openingHours: 'Her gün: 12:00-02:00', isActive: true, order: 0
  },

  // ABD - 4 yer daha
  {
    country: 'ABD', city: 'New York', name: 'Empire State Building',
    slug: 'empire-state-building', description: '443 metre yüksekliğindeki Art Deco gökdelen, 1931 yılında tamamlandı. 86. ve 102. kattan New York manzarası izlenebilir.',
    category: 'historical', latitude: 40.7484, longitude: -73.9857,
    address: '20 W 34th St, New York, NY 10001',
    phone: '+1 212-736-3100', website: 'https://www.esbnyc.com',
    openingHours: 'Her gün: 10:00-24:00', isActive: true, order: 0
  },
  {
    country: 'ABD', city: 'New York', name: 'Central Park',
    slug: 'central-park-new-york', description: 'Manhattan merkezinde 341 hektarlık yeşil alan. Göller, bahçeler ve açık hava konserleriyle New York\'un ciğerleri.',
    category: 'historical', latitude: 40.7829, longitude: -73.9654,
    address: 'Central Park, New York, NY',
    website: 'https://www.centralparknyc.org',
    openingHours: 'Her gün: 06:00-01:00', isActive: true, order: 0
  },
  {
    country: 'ABD', city: 'New York', name: 'Statue of Liberty',
    slug: 'statue-of-liberty', description: '1886 yılında Fransa\'dan hediye edilen özgürlük heykeli. Liberty Island\'da 93 metre yüksekliğinde.',
    category: 'historical', latitude: 40.6892, longitude: -74.0445,
    address: 'Liberty Island, New York, NY 10004',
    phone: '+1 212-363-3200', website: 'https://www.nps.gov/stli',
    openingHours: 'Her gün: 09:00-17:00', isActive: true, order: 0
  },
  {
    country: 'ABD', city: 'New York', name: 'Katz\'s Delicatessen',
    slug: 'katzs-delicatessen', description: '1888\'den beri açık olan efsanevi Yahudi lokantası. Ünlü pastrami sandviçleri ve geleneksel atmosferi.',
    category: 'restaurant', latitude: 40.7220, longitude: -73.9874,
    address: '205 E Houston St, New York, NY 10002',
    phone: '+1 212-254-2246', website: 'https://www.katzsdelicatessen.com',
    openingHours: 'Her gün: 08:00-22:45', isActive: true, order: 0
  },

  // Almanya - 4 yer daha
  {
    country: 'Almanya', city: 'Berlin', name: 'Reichstag Building',
    slug: 'reichstag-berlin', description: 'Alman parlamentosunun bulunduğu tarihi bina. 1894 yılında tamamlandı, modern cam kubbeyle yenilendi.',
    category: 'historical', latitude: 52.5186, longitude: 13.3761,
    address: 'Platz der Republik 1, 11011 Berlin',
    phone: '+49 30 227 32152', website: 'https://www.bundestag.de',
    openingHours: 'Her gün: 08:00-24:00 (Rezervasyon gerekli)', isActive: true, order: 0
  },
  {
    country: 'Almanya', city: 'Berlin', name: 'Berlin Wall Memorial',
    slug: 'berlin-wall-memorial', description: 'Berlin Duvarı\'nın kalıntılarını ve tarihini gösteren açık hava müzesi. Soğuk Savaş döneminin canlı hatırası.',
    category: 'historical', latitude: 52.5355, longitude: 13.3903,
    address: 'Bernauer Str. 111, 13355 Berlin',
    phone: '+49 30 467 98666', website: 'https://www.berliner-mauer-gedenkstaette.de',
    openingHours: 'Her gün açık', isActive: true, order: 0
  },
  {
    country: 'Almanya', city: 'Berlin', name: 'Pergamon Museum',
    slug: 'pergamon-museum', description: 'Antik çağ sanat eserleriyle dolu müze. Pergamon Sunağı, İshtar Kapısı ve Mshatta Sarayı cephesiyle ünlü.',
    category: 'historical', latitude: 52.5211, longitude: 13.3969,
    address: 'Bodestraße 1-3, 10178 Berlin',
    phone: '+49 30 266 424242', website: 'https://www.smb.museum',
    openingHours: 'Per-Paz: 10:00-18:00\nPaz: 10:00-20:00', isActive: true, order: 0
  },
  {
    country: 'Almanya', city: 'Berlin', name: 'Curry 36',
    slug: 'curry-36-berlin', description: 'Berlin\'in en ünlü currywurst standı. 1980\'den beri yerel lezzet sunuyor.',
    category: 'restaurant', latitude: 52.4939, longitude: 13.3888,
    address: 'Mehringdamm 36, 10961 Berlin',
    phone: '+49 30 251 7368', website: 'https://www.curry36.de',
    openingHours: 'Pzt-Cmt: 09:00-05:00\nPazar: 11:00-03:00', isActive: true, order: 0
  },

  // BAE - 4 yer daha
  {
    country: 'BAE', city: 'Dubai', name: 'Dubai Mall',
    slug: 'dubai-mall', description: 'Dünyanın en büyük alışveriş merkezlerinden biri. 1200+ mağaza, akvaryum, buz pateni pisti ve daha fazlası.',
    category: 'shopping', latitude: 25.1972, longitude: 55.2796,
    address: 'Financial Center Road, Dubai',
    phone: '+971 4 362 7500', website: 'https://www.thedubaimall.com',
    openingHours: 'Her gün: 10:00-24:00', isActive: true, order: 0
  },
  {
    country: 'BAE', city: 'Dubai', name: 'Palm Jumeirah',
    slug: 'palm-jumeirah', description: 'Palmiye ağacı şeklindeki yapay ada. Lüks oteller, villalar ve plajlarıyla ünlü.',
    category: 'historical', latitude: 25.1124, longitude: 55.1390,
    address: 'Palm Jumeirah, Dubai',
    website: 'https://www.palmjumeirah.ae',
    openingHours: 'Her gün açık', isActive: true, order: 0
  },
  {
    country: 'BAE', city: 'Dubai', name: 'Dubai Fountain',
    slug: 'dubai-fountain', description: 'Dünyanın en büyük koreografik fıskiye sistemi. Müzik eşliğinde su gösterileri.',
    category: 'historical', latitude: 25.1952, longitude: 55.2746,
    address: 'Burj Khalifa Lake, Dubai',
    website: 'https://www.thedubaimall.com/en/entertain/dubai-fountain',
    openingHours: 'Gösteriler: 13:00 ve 13:30, akşam 18:00-23:00 arası her 30 dakikada', isActive: true, order: 0
  },
  {
    country: 'BAE', city: 'Dubai', name: 'Zuma Dubai',
    slug: 'zuma-dubai', description: 'Modern Japon mutfağının Dubai\'deki şık temsilcisi. Sushi bar ve izakaya konsepti.',
    category: 'restaurant', latitude: 25.2048, longitude: 55.2708,
    address: 'Gate Village 06, DIFC, Dubai',
    phone: '+971 4 425 5660', website: 'https://www.zumarestaurant.com',
    openingHours: 'Her gün: 12:00-15:30, 18:00-23:30', isActive: true, order: 0
  }
]

async function main() {
  console.log(`${newPlaces.length} yeni yer ekleniyor...\n`)

  for (const place of newPlaces) {
    try {
      const existing = await prisma.travelGuide.findFirst({
        where: { slug: place.slug }
      })

      if (existing) {
        console.log(`⊘ Zaten var: ${place.name}`)
        continue
      }

      await prisma.travelGuide.create({ data: place })
      console.log(`✓ Eklendi: ${place.name} (${place.city}, ${place.country})`)
    } catch (error) {
      console.error(`✗ Hata (${place.name}):`, error.message)
    }
  }

  await prisma.$disconnect()
  console.log(`\n✅ Tamamlandı!`)
}

main()
