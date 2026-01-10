const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const newPlaces = [
  // Çin - 4 yer daha
  {
    country: 'Cin', city: 'Pekin', name: 'Cin Seddi',
    slug: 'cin-seddi', description: 'Dünyanın en uzun yapısı. MS 7. yüzyılda inşa edilen 21.000 km uzunluğundaki savunma duvarı.',
    category: 'historical', latitude: 40.4319, longitude: 116.5704,
    address: 'Mutianyu, Huairou District, Beijing',
    phone: '+86 10 6162 6022', website: 'https://www.mutianyugreatwall.com',
    openingHours: 'Her gün: 07:30-18:00', isActive: true, order: 0
  },
  {
    country: 'Cin', city: 'Pekin', name: 'Cennet Tapinagi',
    slug: 'cennet-tapinagi-pekin', description: '1420 yılında inşa edilen Tao tapınağı. Ming ve Qing hanedanlıkları zamanında kullanılmış.',
    category: 'religious', latitude: 39.8823, longitude: 116.4066,
    address: 'Tiantan Road, Dongcheng District, Beijing',
    phone: '+86 10 6702 8866', openingHours: 'Her gün: 06:00-22:00', isActive: true, order: 0
  },
  {
    country: 'Cin', city: 'Pekin', name: 'Yaz Sarayi',
    slug: 'yaz-sarayi-pekin', description: 'Çin imparatorlarının yaz rezidansı. 290 hektarlık park, göl ve saray kompleksi.',
    category: 'historical', latitude: 39.9999, longitude: 116.2753,
    address: 'No.19 Xinjian Gongmen Road, Haidian District, Beijing',
    phone: '+86 10 6288 1144', openingHours: 'Her gün: 06:30-18:00', isActive: true, order: 0
  },
  {
    country: 'Cin', city: 'Pekin', name: 'Quanjude Roast Duck',
    slug: 'quanjude-duck', description: '1864\'ten beri Pekin ördeği sunan tarihi restoran. Geleneksel pişirme yöntemiyle ünlü.',
    category: 'restaurant', latitude: 39.9139, longitude: 116.4074,
    address: '32 Qianmen Street, Dongcheng District, Beijing',
    phone: '+86 10 6511 2418', website: 'https://www.quanjude.com.cn',
    openingHours: 'Her gün: 11:00-14:00, 17:00-21:00', isActive: true, order: 0
  },

  // Fransa - 4 yer daha
  {
    country: 'Fransa', city: 'Paris', name: 'Louvre Muzesi',
    slug: 'louvre-muzesi', description: 'Dünyanın en büyük sanat müzesi. Mona Lisa ve Venüs heykeli dahil 380.000 eser.',
    category: 'historical', latitude: 48.8606, longitude: 2.3376,
    address: 'Rue de Rivoli, 75001 Paris',
    phone: '+33 1 40 20 50 50', website: 'https://www.louvre.fr',
    openingHours: 'Salı-Pazar: 09:00-18:00\nPazartesi: Kapalı', isActive: true, order: 0
  },
  {
    country: 'Fransa', city: 'Paris', name: 'Notre-Dame Katedrali',
    slug: 'notre-dame-paris', description: '1345 yılında tamamlanan Gotik katedral. Restorasyon devam ediyor.',
    category: 'religious', latitude: 48.8530, longitude: 2.3499,
    address: '6 Parvis Notre-Dame, 75004 Paris',
    phone: '+33 1 42 34 56 10', openingHours: 'Restorasyon nedeniyle kapalı (2024)', isActive: true, order: 0
  },
  {
    country: 'Fransa', city: 'Paris', name: 'Champs-Elysees',
    slug: 'champs-elysees', description: 'Zafer Takı\'ndan Place de la Concorde\'a uzanan 1.9 km\'lik ünlü cadde. Lüks mağazalar ve kafeler.',
    category: 'shopping', latitude: 48.8698, longitude: 2.3078,
    address: 'Avenue des Champs-Élysées, 75008 Paris',
    openingHours: 'Her gün açık', isActive: true, order: 0
  },
  {
    country: 'Fransa', city: 'Paris', name: 'Le Jules Verne',
    slug: 'le-jules-verne', description: 'Eyfel Kulesi\'nin 2. katında Michelin yıldızlı restoran. Alain Ducasse mutfağı.',
    category: 'restaurant', latitude: 48.8584, longitude: 2.2945,
    address: 'Eiffel Tower, 2nd floor, 75007 Paris',
    phone: '+33 1 45 55 61 44', website: 'https://www.lejulesverne-paris.com',
    openingHours: 'Her gün: 12:00-13:30, 19:00-21:00', isActive: true, order: 0
  },

  // Hollanda - 4 yer daha
  {
    country: 'Hollanda', city: 'Amsterdam', name: 'Van Gogh Museum',
    slug: 'van-gogh-museum', description: 'Vincent van Gogh\'un en büyük koleksiyonu. 200\'den fazla tablo, 500 çizim.',
    category: 'historical', latitude: 52.3584, longitude: 4.8811,
    address: 'Museumplein 6, 1071 DJ Amsterdam',
    phone: '+31 20 570 5200', website: 'https://www.vangoghmuseum.nl',
    openingHours: 'Her gün: 09:00-18:00', isActive: true, order: 0
  },
  {
    country: 'Hollanda', city: 'Amsterdam', name: 'Anne Frank Evi',
    slug: 'anne-frank-evi', description: 'Anne Frank\'in 2. Dünya Savaşı sırasında saklandığı ev. Günlüğünün yazıldığı yer.',
    category: 'historical', latitude: 52.3752, longitude: 4.8840,
    address: 'Prinsengracht 263-267, 1016 GV Amsterdam',
    phone: '+31 20 556 7105', website: 'https://www.annefrank.org',
    openingHours: 'Her gün: 09:00-22:00', isActive: true, order: 0
  },
  {
    country: 'Hollanda', city: 'Amsterdam', name: 'Keukenhof Gardens',
    slug: 'keukenhof-gardens', description: 'Dünyanın en büyük çiçek bahçesi. 7 milyon lale soğanıyla bahar mevsimi görsel şöleni.',
    category: 'historical', latitude: 52.2698, longitude: 4.5457,
    address: 'Stationsweg 166A, 2161 AM Lisse',
    phone: '+31 252 465 555', website: 'https://www.keukenhof.nl',
    openingHours: 'Mart-Mayıs: 08:00-19:30', isActive: true, order: 0
  },
  {
    country: 'Hollanda', city: 'Amsterdam', name: 'The Pancake Bakery',
    slug: 'pancake-bakery-amsterdam', description: 'Geleneksel Hollanda pankekleri (pannenkoeken) sunan tarihi restoran.',
    category: 'restaurant', latitude: 52.3765, longitude: 4.8839,
    address: 'Prinsengracht 191, 1015 DS Amsterdam',
    phone: '+31 20 625 1333', website: 'https://www.pancake.nl',
    openingHours: 'Her gün: 09:00-21:30', isActive: true, order: 0
  },

  // İngiltere - 4 yer daha
  {
    country: 'Ingiltere', city: 'Londra', name: 'Tower of London',
    slug: 'tower-of-london', description: '1066 yılında inşa edilen tarihi kale. Kraliyet mücevherleri ve Beefeater muhafızlarıyla ünlü.',
    category: 'historical', latitude: 51.5081, longitude: -0.0759,
    address: 'St Katharine\'s & Wapping, London EC3N 4AB',
    phone: '+44 20 3166 6000', website: 'https://www.hrp.org.uk/tower-of-london',
    openingHours: 'Salı-Cmt: 09:00-17:30\nPazar-Pzt: 10:00-17:30', isActive: true, order: 0
  },
  {
    country: 'Ingiltere', city: 'Londra', name: 'Buckingham Palace',
    slug: 'buckingham-palace', description: 'İngiliz Kraliyet ailesinin Londra rezidansı. 775 oda ve State Rooms ile görkemli saray.',
    category: 'historical', latitude: 51.5014, longitude: -0.1419,
    address: 'Westminster, London SW1A 1AA',
    phone: '+44 30 3123 7300', website: 'https://www.rct.uk',
    openingHours: 'Yaz: 09:30-19:30 (Değişkenlik gösterir)', isActive: true, order: 0
  },
  {
    country: 'Ingiltere', city: 'Londra', name: 'Big Ben & Houses of Parliament',
    slug: 'big-ben-londra', description: '1859\'da tamamlanan ikonik saat kulesi ve İngiliz Parlamentosu binası.',
    category: 'historical', latitude: 51.5007, longitude: -0.1246,
    address: 'Westminster, London SW1A 0AA',
    website: 'https://www.parliament.uk', openingHours: 'Turlar için rezervasyon gerekli', isActive: true, order: 0
  },
  {
    country: 'Ingiltere', city: 'Londra', name: 'Dishoom',
    slug: 'dishoom-londra', description: 'Bombay tarzı cafe-restoran. Geleneksel Hint kahvaltısı ve street food.',
    category: 'restaurant', latitude: 51.5226, longitude: -0.1232,
    address: '5 Stable Street, Kings Cross, London N1C 4AB',
    phone: '+44 20 7420 9322', website: 'https://www.dishoom.com',
    openingHours: 'Her gün: 08:00-23:00', isActive: true, order: 0
  },

  // İspanya - 4 yer daha
  {
    country: 'Ispanya', city: 'Barcelona', name: 'Park Guell',
    slug: 'park-guell-barcelona', description: 'Antoni Gaudí tasarımı renkli mozaik parkı. 1914 yılında tamamlandı, UNESCO listesinde.',
    category: 'historical', latitude: 41.4145, longitude: 2.1527,
    address: 'Carrer d\'Olot, 08024 Barcelona',
    phone: '+34 934 09 18 31', website: 'https://www.parkguell.cat',
    openingHours: 'Her gün: 09:30-19:30', isActive: true, order: 0
  },
  {
    country: 'Ispanya', city: 'Barcelona', name: 'Casa Batllo',
    slug: 'casa-batllo', description: 'Gaudí\'nin 1906\'da yenilediği modernist bina. Ejderha sırtı çatı ve rengarenk cephesiyle ünlü.',
    category: 'historical', latitude: 41.3916, longitude: 2.1649,
    address: 'Passeig de Gràcia, 43, 08007 Barcelona',
    phone: '+34 932 16 03 06', website: 'https://www.casabatllo.es',
    openingHours: 'Her gün: 09:00-21:00', isActive: true, order: 0
  },
  {
    country: 'Ispanya', city: 'Barcelona', name: 'La Rambla',
    slug: 'la-rambla-barcelona', description: '1.2 km uzunluğunda yaya caddesi. Sokak sanatçıları, çiçek satıcıları ve La Boqueria pazarıyla canlı.',
    category: 'shopping', latitude: 41.3818, longitude: 2.1735,
    address: 'La Rambla, 08002 Barcelona',
    openingHours: 'Her gün açık', isActive: true, order: 0
  },
  {
    country: 'Ispanya', city: 'Barcelona', name: 'Cerveceria Catalana',
    slug: 'cerveceria-catalana', description: 'Geleneksel İspanyol tapas barı. Yerel şaraplar ve deniz ürünleriyle ünlü.',
    category: 'restaurant', latitude: 41.3975, longitude: 2.1608,
    address: 'Carrer de Mallorca, 236, 08008 Barcelona',
    phone: '+34 932 16 03 68', openingHours: 'Her gün: 08:00-01:30', isActive: true, order: 0
  },

  // İtalya - 4 yer daha
  {
    country: 'Italya', city: 'Roma', name: 'Vatikan Muzesi',
    slug: 'vatikan-muzesi', description: 'Sistina Şapeli dahil dünyanın en zengin sanat koleksiyonlarından biri. Michelangelo\'nun freskleri.',
    category: 'historical', latitude: 41.9065, longitude: 12.4536,
    address: 'Viale Vaticano, 00165 Roma',
    phone: '+39 06 6988 4676', website: 'https://www.museivaticani.va',
    openingHours: 'Pzt-Cmt: 09:00-18:00\nPazar: 09:00-14:00', isActive: true, order: 0
  },
  {
    country: 'Italya', city: 'Roma', name: 'Trevi Cesmesi',
    slug: 'trevi-cesmesi', description: '1762 yılında tamamlanan Barok çeşme. Bozuk para atma geleneğiyle ünlü.',
    category: 'historical', latitude: 41.9009, longitude: 12.4833,
    address: 'Piazza di Trevi, 00187 Roma',
    openingHours: 'Her gün açık', isActive: true, order: 0
  },
  {
    country: 'Italya', city: 'Roma', name: 'Pantheon',
    slug: 'pantheon-roma', description: 'MS 125 yılında tamamlanan Roma tapınağı. Dünyanın en büyük armirane kubbeli yapısı.',
    category: 'historical', latitude: 41.8986, longitude: 12.4768,
    address: 'Piazza della Rotonda, 00186 Roma',
    phone: '+39 06 6830 0230', openingHours: 'Her gün: 09:00-19:00', isActive: true, order: 0
  },
  {
    country: 'Italya', city: 'Roma', name: 'Roscioli',
    slug: 'roscioli-roma', description: 'Geleneksel İtalyan mutfağı ve zengin şarap mahzeni. Carbonara ve cacio e pepe ile ünlü.',
    category: 'restaurant', latitude: 41.8947, longitude: 12.4736,
    address: 'Via dei Giubbonari, 21, 00186 Roma',
    phone: '+39 06 687 5287', website: 'https://www.salumeriaroscioli.com',
    openingHours: 'Pzt-Cmt: 12:30-16:00, 19:00-24:00', isActive: true, order: 0
  },

  // Rusya - 4 yer daha
  {
    country: 'Rusya', city: 'Moskova', name: 'Kremlin Sarayi',
    slug: 'kremlin-sarayi', description: 'Rus devlet başkanının resmi konutu. 15-20. yüzyıl arası inşa edilen saray kompleksi.',
    category: 'historical', latitude: 55.7520, longitude: 37.6175,
    address: 'Kremlin, Moscow, 103073',
    phone: '+7 495 695 41 46', website: 'https://www.kreml.ru',
    openingHours: 'Cuma-Çarş: 10:00-17:00', isActive: true, order: 0
  },
  {
    country: 'Rusya', city: 'Moskova', name: 'Aziz Basil Katedrali',
    slug: 'aziz-basil-katedrali', description: '1561 yılında tamamlanan renkli soğan kubbeli katedral. Moskova\'nın sembolü.',
    category: 'religious', latitude: 55.7525, longitude: 37.6231,
    address: 'Red Square, Moscow, 109012',
    phone: '+7 495 698 33 04', openingHours: 'Her gün: 11:00-18:00', isActive: true, order: 0
  },
  {
    country: 'Rusya', city: 'Moskova', name: 'Bolshoi Tiyatrosu',
    slug: 'bolshoi-tiyatrosu', description: '1825 yılında açılan tarihi opera ve bale tiyatrosu. Dünya çapında ünlü bale topluluğu.',
    category: 'historical', latitude: 55.7603, longitude: 37.6186,
    address: 'Theatre Square, 1, Moscow, 125009',
    phone: '+7 495 455 55 55', website: 'https://www.bolshoi.ru',
    openingHours: 'Gösteri saatlerine göre değişir', isActive: true, order: 0
  },
  {
    country: 'Rusya', city: 'Moskova', name: 'Cafe Pushkin',
    slug: 'cafe-pushkin', description: '19. yüzyıl aristokrat konağı atmosferinde Rus mutfağı. Caviar ve borscht.',
    category: 'restaurant', latitude: 55.7645, longitude: 37.6078,
    address: 'Tverskoy Boulevard, 26A, Moscow, 125009',
    phone: '+7 495 739 00 33', website: 'https://www.cafe-pushkin.ru',
    openingHours: 'Her gün: 24 saat açık', isActive: true, order: 0
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

  const total = await prisma.travelGuide.count()
  console.log(`\n✅ Tamamlandı! Toplam yer sayısı: ${total}`)
}

main()
