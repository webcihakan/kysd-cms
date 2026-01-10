const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Slug oluşturma fonksiyonu
function createSlug(text) {
  const trMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  }

  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function seedCalendar() {
  console.log('📅 Takvim verileri ekleniyor...')

  // 2025-2026 Türkiye Resmi Tatilleri
  const holidays = [
    // 2025
    {
      title: 'Yılbaşı',
      date: new Date('2025-01-01'),
      type: 'official',
      description: 'Resmi tatil - Yılbaşı',
      isActive: true
    },
    {
      title: 'Ulusal Egemenlik ve Çocuk Bayramı',
      date: new Date('2025-04-23'),
      type: 'national',
      description: 'Türkiye Büyük Millet Meclisinin kuruluş yıldönümü ve Çocuk Bayramı',
      isActive: true
    },
    {
      title: 'Emek ve Dayanışma Günü',
      date: new Date('2025-05-01'),
      type: 'official',
      description: 'İşçi Bayramı - Resmi Tatil',
      isActive: true
    },
    {
      title: 'Ramazan Bayramı 1. Gün',
      date: new Date('2025-03-30'),
      endDate: new Date('2025-04-01'),
      type: 'religious',
      description: 'Ramazan Bayramı resmi tatili (3 gün)',
      isActive: true
    },
    {
      title: 'Gençlik ve Spor Bayramı',
      date: new Date('2025-05-19'),
      type: 'national',
      description: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı',
      isActive: true
    },
    {
      title: 'Kurban Bayramı 1. Gün',
      date: new Date('2025-06-06'),
      endDate: new Date('2025-06-09'),
      type: 'religious',
      description: 'Kurban Bayramı resmi tatili (4 gün)',
      isActive: true
    },
    {
      title: 'Demokrasi ve Milli Birlik Günü',
      date: new Date('2025-07-15'),
      type: 'national',
      description: '15 Temmuz Demokrasi ve Milli Birlik Günü',
      isActive: true
    },
    {
      title: 'Zafer Bayramı',
      date: new Date('2025-08-30'),
      type: 'national',
      description: '30 Ağustos Zafer Bayramı',
      isActive: true
    },
    {
      title: 'Cumhuriyet Bayramı',
      date: new Date('2025-10-29'),
      type: 'national',
      description: 'Türkiye Cumhuriyeti\'nin ilan edilişinin yıldönümü',
      isActive: true
    },
    // 2026
    {
      title: 'Yılbaşı',
      date: new Date('2026-01-01'),
      type: 'official',
      description: 'Resmi tatil - Yılbaşı',
      isActive: true
    },
    {
      title: 'Ramazan Bayramı 1. Gün',
      date: new Date('2026-03-20'),
      endDate: new Date('2026-03-22'),
      type: 'religious',
      description: 'Ramazan Bayramı resmi tatili (3 gün)',
      isActive: true
    },
    {
      title: 'Ulusal Egemenlik ve Çocuk Bayramı',
      date: new Date('2026-04-23'),
      type: 'national',
      description: 'Türkiye Büyük Millet Meclisinin kuruluş yıldönümü ve Çocuk Bayramı',
      isActive: true
    },
    {
      title: 'Emek ve Dayanışma Günü',
      date: new Date('2026-05-01'),
      type: 'official',
      description: 'İşçi Bayramı - Resmi Tatil',
      isActive: true
    },
    {
      title: 'Gençlik ve Spor Bayramı',
      date: new Date('2026-05-19'),
      type: 'national',
      description: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı',
      isActive: true
    },
    {
      title: 'Kurban Bayramı 1. Gün',
      date: new Date('2026-05-27'),
      endDate: new Date('2026-05-30'),
      type: 'religious',
      description: 'Kurban Bayramı resmi tatili (4 gün)',
      isActive: true
    },
    {
      title: 'Demokrasi ve Milli Birlik Günü',
      date: new Date('2026-07-15'),
      type: 'national',
      description: '15 Temmuz Demokrasi ve Milli Birlik Günü',
      isActive: true
    },
    {
      title: 'Zafer Bayramı',
      date: new Date('2026-08-30'),
      type: 'national',
      description: '30 Ağustos Zafer Bayramı',
      isActive: true
    },
    {
      title: 'Cumhuriyet Bayramı',
      date: new Date('2026-10-29'),
      type: 'national',
      description: 'Türkiye Cumhuriyeti\'nin ilan edilişinin yıldönümü',
      isActive: true
    }
  ]

  // Tatilleri ekle
  for (const holiday of holidays) {
    await prisma.holiday.create({
      data: holiday
    })
  }
  console.log(`✅ ${holidays.length} tatil eklendi`)

  // Örnek Fuarlar
  const fairsData = [
    { title: 'İstanbul Mobilya Fuarı 2025', desc: 'Türkiye\'nin en büyük mobilya ve dekorasyon fuarı', start: '2025-02-15', end: '2025-02-20', deadline: '2025-01-20', location: 'Tüyap Fuar Merkezi, İstanbul' },
    { title: 'Ankara Teknoloji ve İnovasyon Fuarı', desc: 'Teknoloji, yazılım, robotik ve yenilikçi çözümler fuarı', start: '2025-03-10', end: '2025-03-14', deadline: '2025-02-15', location: 'ATO Congresium, Ankara' },
    { title: 'İzmir Gıda ve Tarım Fuarı', desc: 'Tarım makineleri, gıda teknolojileri ve organik ürünler', start: '2025-04-05', end: '2025-04-08', deadline: '2025-03-10', location: 'İzmir Fuar Alanı' },
    { title: 'Bursa Otomotiv Yan Sanayi Fuarı', desc: 'Otomotiv yan sanayi ve tedarikçiler fuarı', start: '2025-05-20', end: '2025-05-23', deadline: '2025-04-25', location: 'Bursa Uluslararası Fuar Merkezi' },
    { title: 'Antalya Turizm ve Konaklama Fuarı', desc: 'Turizm sektörü ve otel ekipmanları fuarı', start: '2025-09-12', end: '2025-09-15', deadline: '2025-08-15', location: 'Antalya ANFAŞ Fuar Merkezi' },
    { title: 'İstanbul Tekstil ve Moda Fuarı', desc: 'Tekstil ve hazır giyim sektörü fuarı', start: '2025-10-08', end: '2025-10-12', deadline: '2025-09-10', location: 'İstanbul Expo Center' }
  ]

  for (const f of fairsData) {
    await prisma.fair.create({
      data: {
        title: f.title,
        slug: createSlug(f.title),
        description: f.desc,
        startDate: new Date(f.start),
        endDate: new Date(f.end),
        deadline: new Date(f.deadline),
        location: f.location,
        isActive: true
      }
    })
  }
  console.log(`✅ ${fairsData.length} fuar eklendi`)

  // Örnek Eğitimler
  const trainingsData = [
    { title: 'Dijital Pazarlama ve E-ticaret Eğitimi', desc: 'SEO, SEM, sosyal medya pazarlama stratejileri', date: '2025-02-10', time: '09:00-17:00', loc: 'KYSD Eğitim Merkezi, Ankara' },
    { title: 'İhracat ve Dış Ticaret Mevzuatı Semineri', desc: 'İhracat süreçleri ve gümrük mevzuatı eğitimi', date: '2025-02-25', time: '10:00-16:00', loc: 'KYSD Konferans Salonu' },
    { title: 'Kurumsal İletişim ve Halkla İlişkiler Eğitimi', desc: 'Kurumsal iletişim stratejileri ve kriz yönetimi', date: '2025-03-15', time: '09:30-17:30', loc: 'Online (Zoom)' },
    { title: 'Proje Yönetimi ve Agile Metodolojiler', desc: 'Scrum, Kanban ve hibrid proje yönetimi', date: '2025-04-12', time: '09:00-18:00', loc: 'KYSD Eğitim Merkezi, İstanbul' },
    { title: 'Sürdürülebilirlik ve Çevre Yönetimi', desc: 'ISO 14001 ve sürdürülebilir üretim', date: '2025-05-08', time: '10:00-16:00', loc: 'Hybrid (Fiziksel + Online)' },
    { title: 'Veri Analizi ve İş Zekası Eğitimi', desc: 'Excel, Power BI ve veri görselleştirme', date: '2025-06-20', time: '09:00-17:00', loc: 'KYSD Eğitim Merkezi, Ankara' },
    { title: 'Liderlik ve Ekip Yönetimi Programı', desc: 'Liderlik becerileri ve performans yönetimi', date: '2025-07-10', time: '09:00-17:00', loc: 'KYSD Konferans Salonu' },
    { title: 'Finansal Analiz ve Bütçe Yönetimi', desc: 'Mali tablolar analizi ve maliyet kontrolü', date: '2025-08-15', time: '10:00-16:00', loc: 'Online (MS Teams)' },
    { title: 'Satış Teknikleri ve Müşteri İlişkileri', desc: 'Modern satış ve CRM sistemleri', date: '2025-09-05', time: '09:30-17:30', loc: 'KYSD Eğitim Merkezi, İzmir' },
    { title: 'İnovasyon ve Yaratıcı Düşünme Atölyesi', desc: 'Design thinking ve inovasyon yönetimi', date: '2025-10-18', time: '09:00-18:00', loc: 'KYSD Konferans Salonu' }
  ]

  for (const t of trainingsData) {
    await prisma.training.create({
      data: {
        title: t.title,
        slug: createSlug(t.title),
        description: t.desc,
        eventDate: new Date(t.date),
        eventTime: t.time,
        location: t.loc,
        isActive: true
      }
    })
  }
  console.log(`✅ ${trainingsData.length} eğitim eklendi`)

  // Örnek Projeler
  const projectsData = [
    { title: 'Dijital Dönüşüm Hızlandırma Programı', desc: 'KOBİ\'lerin dijital dönüşüm süreçlerini hızlandırma', start: '2025-01-15', end: '2025-12-31' },
    { title: 'İhracat Kapasitesi Geliştirme Projesi', desc: 'Uluslararası pazar araştırması ve B2B eşleştirme', start: '2025-03-01', end: '2025-11-30' },
    { title: 'Sürdürülebilir Üretim ve Yeşil Sertifikasyon', desc: 'Çevre dostu üretim ve sürdürülebilirlik sertifikaları', start: '2025-02-20', end: '2025-10-15' },
    { title: 'Genç Girişimci Destek Programı', desc: 'Mentorluk ve kuluçka merkezi projesi', start: '2025-04-01', end: '2026-03-31' },
    { title: 'Sanayi 4.0 Dönüşüm Merkezi', desc: 'IoT, otomasyon ve yapay zeka çözümleri', start: '2025-06-01', end: '2026-05-31' }
  ]

  for (const p of projectsData) {
    await prisma.project.create({
      data: {
        title: p.title,
        slug: createSlug(p.title),
        description: p.desc,
        startDate: new Date(p.start),
        endDate: new Date(p.end),
        isActive: true
      }
    })
  }
  console.log(`✅ ${projectsData.length} proje eklendi`)

  console.log('🎉 Takvim verileri başarıyla eklendi!')
}

seedCalendar()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
