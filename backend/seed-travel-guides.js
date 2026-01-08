const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const travelGuides = [
  {
    country: 'Turkiye',
    city: 'Istanbul',
    name: 'Kapalicarsi (Grand Bazaar)',
    slug: 'kapalicarsi-grand-bazaar-' + Date.now(),
    description: 'Dünyanın en eski ve en büyük kapalı çarşılarından biri. 1461 yılında inşa edilen Kapalıçarşı, 61 sokak ve 4000 dükkânı ile alışveriş tutkunları için cennet.',
    category: 'shopping',
    address: 'Beyazit Mah., Kalpakcılar Cad., Fatih, Istanbul',
    phone: '+90 212 519 1248',
    website: 'https://kapalicarsi.com.tr',
    openingHours: 'Pazartesi-Cumartesi: 09:00-19:00\nPazar: Kapalı',
    priceRange: '$$',
    isActive: true,
    order: 0
  },
  {
    country: 'ABD',
    city: 'New York',
    name: 'Times Square',
    slug: 'times-square-new-york-' + Date.now(),
    description: 'New York\'un kalbinde yer alan dünyaca ünlü Times Square, parlak ışıkları, billboardları ve enerji dolu atmosferiyle tanınır. Alışveriş ve eğlence merkezi.',
    category: 'shopping',
    address: 'Manhattan, New York, NY 10036',
    phone: '+1 212-768-1560',
    website: 'https://www.timessquarenyc.org',
    openingHours: '7/24 Açık',
    priceRange: '$$$',
    isActive: true,
    order: 1
  },
  {
    country: 'Almanya',
    city: 'Berlin',
    name: 'Brandenburg Kapisi',
    slug: 'brandenburg-kapisi-berlin-' + Date.now(),
    description: 'Berlin\'in sembolü olan Brandenburg Kapısı, 1791 yılında tamamlanmış neoklasik bir anıttır. Almanya\'nın birleşmesinin simgesi.',
    category: 'historical',
    address: 'Pariser Platz, 10117 Berlin',
    phone: '+49 30 254860',
    website: 'https://www.berlin.de',
    openingHours: '7/24 Ziyaret Edilebilir',
    priceRange: '$',
    isActive: true,
    order: 2
  },
  {
    country: 'BAE',
    city: 'Dubai',
    name: 'Burj Khalifa',
    slug: 'burj-khalifa-dubai-' + Date.now(),
    description: '828 metre yüksekliğiyle dünyanın en yüksek binası. 148. katta yer alan gözlem terası muhteşem Dubai manzarası sunuyor.',
    category: 'historical',
    address: '1 Sheikh Mohammed bin Rashid Blvd, Dubai',
    phone: '+971 4 888 8888',
    website: 'https://www.burjkhalifa.ae',
    openingHours: 'Her gün: 08:00-00:00',
    priceRange: '$$$$',
    isActive: true,
    order: 3
  },
  {
    country: 'Cin',
    city: 'Pekin',
    name: 'Yasak Sehir',
    slug: 'yasak-sehir-pekin-' + Date.now(),
    description: 'Ming ve Qing hanedanlarının sarayı olan Yasak Şehir, 1420 yılında tamamlanmış. 980 bina ve 8707 odadan oluşan devasa kompleks.',
    category: 'historical',
    address: 'Dongcheng, Beijing',
    phone: '+86 10 8500 7421',
    website: 'https://www.dpm.org.cn',
    openingHours: 'Salı-Pazar: 08:30-17:00\nPazartesi: Kapalı',
    priceRange: '$$',
    isActive: true,
    order: 4
  },
  {
    country: 'Fransa',
    city: 'Paris',
    name: 'Eyfel Kulesi',
    slug: 'eyfel-kulesi-paris-' + Date.now(),
    description: '1889 yılında inşa edilen 330 metre yüksekliğindeki demir kule, Paris\'in sembolü. Üç katında farklı teraslar ve restoranlar bulunuyor.',
    category: 'historical',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
    phone: '+33 892 70 12 39',
    website: 'https://www.toureiffel.paris',
    openingHours: 'Her gün: 09:30-23:45',
    priceRange: '$$$',
    isActive: true,
    order: 5
  },
  {
    country: 'Hollanda',
    city: 'Amsterdam',
    name: 'Rijksmuseum',
    slug: 'rijksmuseum-amsterdam-' + Date.now(),
    description: 'Hollanda\'nın en büyük sanat müzesi. Rembrandt\'ın \'Gece Devriyesi\' tablosu da dahil 8000 eser sergiliyor.',
    category: 'historical',
    address: 'Museumstraat 1, 1071 XX Amsterdam',
    phone: '+31 20 674 7000',
    website: 'https://www.rijksmuseum.nl',
    openingHours: 'Her gün: 09:00-17:00',
    priceRange: '$$',
    isActive: true,
    order: 6
  },
  {
    country: 'Ingiltere',
    city: 'Londra',
    name: 'British Museum',
    slug: 'british-museum-london-' + Date.now(),
    description: 'Dünyanın en eski ve en kapsamlı müzelerinden biri. 8 milyon eser koleksiyonunda Mısır mumyaları, Yunan heykelleri ve daha fazlası.',
    category: 'historical',
    address: 'Great Russell St, London WC1B 3DG',
    phone: '+44 20 7323 8299',
    website: 'https://www.britishmuseum.org',
    openingHours: 'Her gün: 10:00-17:00\nCuma: 10:00-20:30',
    priceRange: '$',
    isActive: true,
    order: 7
  },
  {
    country: 'Ispanya',
    city: 'Barcelona',
    name: 'Sagrada Familia',
    slug: 'sagrada-familia-barcelona-' + Date.now(),
    description: 'Mimar Antoni Gaudí\'nin걸작ı olan bu bazilika 1882\'den beri inşa halinde. Muhteşem vitrayları ve modern gotik mimarisiyle ünlü.',
    category: 'religious',
    address: 'Carrer de Mallorca, 401, 08013 Barcelona',
    phone: '+34 932 08 04 14',
    website: 'https://sagradafamilia.org',
    openingHours: 'Pzt-Cmt: 09:00-20:00\nPazar: 10:30-20:00',
    priceRange: '$$',
    isActive: true,
    order: 8
  },
  {
    country: 'Italya',
    city: 'Roma',
    name: 'Kolezyum',
    slug: 'kolezyum-roma-' + Date.now(),
    description: 'MS 80 yılında tamamlanan antik Roma\'nın en büyük amfitiyatrosu. 50.000-80.000 seyirci kapasiteli gladyatör arenası.',
    category: 'historical',
    address: 'Piazza del Colosseo, 1, 00184 Roma',
    phone: '+39 06 3996 7700',
    website: 'https://www.colosseo.it',
    openingHours: 'Her gün: 09:00-19:00',
    priceRange: '$$$',
    isActive: true,
    order: 9
  },
  {
    country: 'Rusya',
    city: 'Moskova',
    name: 'Kizil Meydan',
    slug: 'kizil-meydan-moskova-' + Date.now(),
    description: 'Moskova\'nın tarihi merkezi olan Kızıl Meydan, Kremlin sarayı, Aziz Basil Katedrali ve Lenin Mozolesi ile çevrili.',
    category: 'historical',
    address: 'Red Square, Moscow, 109012',
    phone: '+7 495 692-40-19',
    website: 'https://www.kreml.ru',
    openingHours: '7/24 Açık (Katedraller için ayrı saatler)',
    priceRange: '$$',
    isActive: true,
    order: 10
  }
]

async function main() {
  console.log('Tur rehberleri ekleniyor...')

  for (const guide of travelGuides) {
    try {
      const existing = await prisma.travelGuide.findFirst({
        where: { name: guide.name, country: guide.country }
      })

      if (existing) {
        console.log(`✓ Zaten var: ${guide.name} (${guide.country})`)
        continue
      }

      await prisma.travelGuide.create({ data: guide })
      console.log(`✓ Eklendi: ${guide.name} (${guide.country})`)
    } catch (error) {
      console.error(`✗ Hata: ${guide.name} - ${error.message}`)
    }
  }

  console.log('\nTamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
