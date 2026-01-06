const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedFutureEvents() {
  console.log('Gelecek etkinlikler ekleniyor...');

  // ========== EĞİTİMLER 2026 ==========
  const trainings = [
    {
      title: 'Konfeksiyon Yan Sanayi Kalite Yönetimi Semineri',
      slug: 'konfeksiyon-yan-sanayi-kalite-yonetimi-semineri-2026',
      description: 'Konfeksiyon yan sanayinde kalite kontrol süreçleri, ISO standartları ve müşteri beklentilerinin yönetimi konularında kapsamlı eğitim programı.',
      category: 'seminar',
      instructor: 'Prof. Dr. Ahmet Yılmaz',
      location: 'İstanbul Sanayi Odası Konferans Salonu',
      eventDate: new Date('2026-02-15'),
      eventTime: '10:00 - 17:00',
      duration: '1 Gün',
      quota: 50,
      price: 'Ücretsiz',
      isFeatured: true,
      order: 1
    },
    {
      title: 'Sürdürülebilir Tekstil Üretimi Workshop',
      slug: 'surdurulebilir-tekstil-uretimi-workshop-2026',
      description: 'Çevre dostu üretim teknikleri, geri dönüşüm malzemeleri kullanımı ve karbon ayak izi azaltma stratejileri üzerine uygulamalı atölye çalışması.',
      category: 'workshop',
      instructor: 'Dr. Elif Demir',
      location: 'KYSD Eğitim Merkezi',
      eventDate: new Date('2026-03-10'),
      eventTime: '09:00 - 18:00',
      duration: '3 Gün',
      quota: 30,
      price: '1.500 TL',
      isFeatured: true,
      order: 2
    },
    {
      title: 'Dijital Dönüşüm ve Endüstri 4.0 Eğitimi',
      slug: 'dijital-donusum-endustri-40-egitimi-2026',
      description: 'Tekstil ve konfeksiyon sektöründe dijitalleşme, akıllı fabrika uygulamaları, IoT ve otomasyon sistemleri eğitimi.',
      category: 'certificate',
      instructor: 'Mühendis Mehmet Kaya',
      location: 'Online (Zoom)',
      eventDate: new Date('2026-04-05'),
      eventTime: '14:00 - 17:00',
      duration: '15 Gün (Haftada 3 Gün)',
      quota: 100,
      price: '2.000 TL',
      order: 3
    },
    {
      title: 'Fermuar ve Metal Aksesuar Teknik Eğitimi',
      slug: 'fermuar-metal-aksesuar-teknik-egitimi-2026',
      description: 'Fermuar çeşitleri, metal aksesuar üretim teknikleri, kalite testleri ve uluslararası standartlar hakkında teknik eğitim.',
      category: 'certificate',
      instructor: 'Uzman Ali Özkan',
      location: 'Bursa Tekstil OSB',
      eventDate: new Date('2026-05-08'),
      eventTime: '09:00 - 17:00',
      duration: '3 Gün',
      quota: 40,
      price: '1.200 TL',
      order: 4
    },
    {
      title: 'İhracat ve Dış Ticaret Mevzuatı Semineri',
      slug: 'ihracat-dis-ticaret-mevzuati-semineri-2026',
      description: 'Tekstil ve konfeksiyon sektörüne özel ihracat prosedürleri, gümrük işlemleri, teşvikler ve uluslararası ticaret mevzuatı.',
      category: 'seminar',
      instructor: 'Gümrük Müşaviri Fatma Şen',
      location: 'İTO Konferans Salonu',
      eventDate: new Date('2026-01-25'),
      eventTime: '10:00 - 16:00',
      duration: '1 Gün',
      quota: 80,
      price: 'Ücretsiz',
      order: 5
    },
    {
      title: 'Etiket Tasarımı ve Baskı Teknikleri',
      slug: 'etiket-tasarimi-baski-teknikleri-2026',
      description: 'Modern etiket tasarım trendleri, dijital ve ofset baskı teknikleri, RFID etiket uygulamaları üzerine uygulamalı eğitim.',
      category: 'workshop',
      instructor: 'Tasarımcı Zeynep Arslan',
      location: 'KYSD Eğitim Merkezi',
      eventDate: new Date('2026-06-15'),
      eventTime: '10:00 - 17:00',
      duration: '2 Gün',
      quota: 25,
      price: '800 TL',
      order: 6
    }
  ];

  for (const training of trainings) {
    await prisma.training.upsert({
      where: { slug: training.slug },
      update: training,
      create: training
    });
  }
  console.log('✓ Eğitimler eklendi:', trainings.length);

  // ========== FUARLAR 2026 ==========
  const fairs = [
    {
      title: 'Texworld Evolution Paris Şubat 2026',
      slug: 'texworld-evolution-paris-subat-2026',
      description: '130 ülkeden 29.000 alıcı ve 1.500 üreticinin katıldığı dünyanın en büyük tekstil fuarı. Giyim ve aksesuar üreticilerinin Avrupa\'daki en önemli buluşma noktası.',
      location: 'Paris Le Bourget',
      country: 'Fransa',
      startDate: new Date('2026-02-09'),
      endDate: new Date('2026-02-11'),
      deadline: new Date('2025-12-15'),
      organizer: 'Messe Frankfurt',
      website: 'https://texworld-paris.fr.messefrankfurt.com/',
      boothInfo: 'KYSD ortak stant alanı mevcut',
      discount: '%30 erken kayıt indirimi',
      isFeatured: true,
      isKysdOrganized: true,
      order: 1
    },
    {
      title: 'Milano Unica Şubat 2026',
      slug: 'milano-unica-subat-2026',
      description: 'İtalya\'nın prestijli tekstil, kumaş ve aksesuar fuarı. Premium segment üreticileri için ideal platform.',
      location: 'Fiera Milano (Rho)',
      country: 'İtalya',
      startDate: new Date('2026-02-03'),
      endDate: new Date('2026-02-05'),
      deadline: new Date('2025-12-01'),
      organizer: 'Milano Unica',
      website: 'https://www.milanounica.it/',
      boothInfo: 'Bireysel katılım',
      isFeatured: true,
      order: 2
    },
    {
      title: 'Première Vision Paris Şubat 2026',
      slug: 'premiere-vision-paris-subat-2026',
      description: 'Dünya moda endüstrisinin kalbi, yaratıcı tekstil ve malzemelerin buluşma noktası. Trend belirleme açısından kritik öneme sahip.',
      location: 'Paris Nord Villepinte',
      country: 'Fransa',
      startDate: new Date('2026-02-17'),
      endDate: new Date('2026-02-19'),
      organizer: 'Première Vision',
      website: 'https://www.premierevision.com/',
      isFeatured: true,
      order: 3
    },
    {
      title: 'GarmentTech İstanbul 2026',
      slug: 'garmenttech-istanbul-2026',
      description: 'Konfeksiyon ve hazır giyim üretiminde kullanılan tüm teknolojileri bir araya getiren Türkiye\'nin en kapsamlı yan sanayi fuarı. Etiket, düğme, fermuar gibi aksesuarlar sergilenecek.',
      location: 'İstanbul Fuar Merkezi (İFM)',
      country: 'Türkiye',
      startDate: new Date('2026-06-24'),
      endDate: new Date('2026-06-27'),
      deadline: new Date('2026-05-01'),
      organizer: 'İFM Fuarcılık',
      website: 'https://www.garmenttech.com.tr/',
      boothInfo: 'KYSD üyelerine özel stant alanı',
      discount: 'Üyelere %40 indirim',
      isFeatured: true,
      isKysdOrganized: true,
      order: 4
    },
    {
      title: 'Milano Unica Temmuz 2026',
      slug: 'milano-unica-temmuz-2026',
      description: 'Milano Unica\'nın yaz edisyonu. Moda, tekstil ve sürdürülebilirlik temalı özel etkinlikler.',
      location: 'Fiera Milano (Rho)',
      country: 'İtalya',
      startDate: new Date('2026-07-07'),
      endDate: new Date('2026-07-09'),
      deadline: new Date('2026-05-01'),
      organizer: 'Milano Unica',
      website: 'https://www.milanounica.it/',
      order: 5
    },
    {
      title: 'Texworld Evolution Paris Eylül 2026',
      slug: 'texworld-evolution-paris-eylul-2026',
      description: '130 ülkeden alıcı ve üreticilerin katıldığı dünyanın en büyük tekstil fuarının sonbahar edisyonu.',
      location: 'Paris Le Bourget',
      country: 'Fransa',
      startDate: new Date('2026-09-14'),
      endDate: new Date('2026-09-16'),
      deadline: new Date('2026-07-15'),
      organizer: 'Messe Frankfurt',
      website: 'https://texworld-paris.fr.messefrankfurt.com/',
      boothInfo: 'KYSD ortak stant alanı mevcut',
      discount: '%25 erken kayıt indirimi',
      isFeatured: true,
      isKysdOrganized: true,
      order: 6
    },
    {
      title: 'Première Vision Paris Eylül 2026',
      slug: 'premiere-vision-paris-eylul-2026',
      description: 'Dünya moda endüstrisinin sonbahar buluşması. Yeni sezon trendleri ve inovatif tekstil çözümleri.',
      location: 'Paris Nord Villepinte',
      country: 'Fransa',
      startDate: new Date('2026-09-15'),
      endDate: new Date('2026-09-17'),
      organizer: 'Première Vision',
      website: 'https://www.premierevision.com/',
      order: 7
    },
    {
      title: 'CISMA 2026 - Çin Uluslararası Konfeksiyon Fuarı',
      slug: 'cisma-2026-cin',
      description: 'Asya\'nın en büyük konfeksiyon, dikiş makineleri ve aksesuarları fuarı. Çin pazarına giriş için stratejik önem taşımaktadır.',
      location: 'Shanghai New International Expo Centre',
      country: 'Çin',
      startDate: new Date('2026-09-23'),
      endDate: new Date('2026-09-26'),
      deadline: new Date('2026-07-01'),
      organizer: 'CISMA',
      website: 'https://www.cismafair.com/',
      boothInfo: 'KYSD heyeti ile katılım imkanı',
      discount: '%25 grup indirimi',
      isFeatured: true,
      isKysdOrganized: true,
      order: 8
    },
    {
      title: 'Texhibition İstanbul 2026',
      slug: 'texhibition-istanbul-2026',
      description: 'Kumaş, denim, tekstil aksesuarları ve iplik fuarı. İTKİB tarafından düzenlenen sektörün önemli buluşması.',
      location: 'İstanbul Fuar Merkezi',
      country: 'Türkiye',
      startDate: new Date('2026-09-09'),
      endDate: new Date('2026-09-11'),
      deadline: new Date('2026-07-15'),
      organizer: 'İTKİB Fuarcılık',
      website: 'https://www.texhibition.com/',
      boothInfo: 'KYSD ortak katılım',
      isKysdOrganized: true,
      order: 9
    },
    {
      title: 'Fashion Prime İzmir 2026',
      slug: 'fashion-prime-izmir-2026',
      description: '9. Tekstil, Hazır Giyim Tedarikçileri ve Teknolojileri Fuarı. Ege Bölgesi\'nin en önemli tekstil etkinliği.',
      location: 'Fuar İzmir',
      country: 'Türkiye',
      startDate: new Date('2026-10-21'),
      endDate: new Date('2026-10-24'),
      organizer: 'İZFAŞ Fuarcılık',
      website: 'https://www.fashionprime.com.tr/',
      order: 10
    },
    {
      title: 'Bursa Tekstil Makineleri Fuarı BTM Expo 2026',
      slug: 'bursa-tekstil-makineleri-btm-expo-2026',
      description: 'Bursa\'da düzenlenen tekstil makineleri ve yan sanayi ürünleri fuarı. Askı, düğme, fermuar, etiket üreticileri için önemli platform.',
      location: 'Bursa Uluslararası Fuar ve Kongre Merkezi',
      country: 'Türkiye',
      startDate: new Date('2026-11-11'),
      endDate: new Date('2026-11-14'),
      organizer: 'BTM Expo',
      website: 'https://btmexpo.com/',
      boothInfo: 'KYSD üyelerine özel alan',
      discount: '%35 erken kayıt',
      isKysdOrganized: true,
      order: 11
    }
  ];

  for (const fair of fairs) {
    await prisma.fair.upsert({
      where: { slug: fair.slug },
      update: fair,
      create: fair
    });
  }
  console.log('✓ Fuarlar eklendi:', fairs.length);

  console.log('\n========================================');
  console.log('Gelecek etkinlikler başarıyla eklendi!');
  console.log('========================================');

  await prisma.$disconnect();
}

seedFutureEvents();
