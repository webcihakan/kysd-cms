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

async function seedMagazines() {
  console.log('📚 Örnek dergi verileri ekleniyor...')

  const magazines = [
    {
      title: 'Türkiye Sanayi Dergisi - Ocak 2025',
      slug: createSlug('Türkiye Sanayi Dergisi Ocak 2025'),
      description: 'Türkiye\'nin önde gelen sanayi ve üretim sektörü dergisi. Bu sayıda: Dijital dönüşüm, sürdürülebilir üretim ve sektörel analizler.',
      publisher: 'Sanayi Derneği Yayınları',
      issueNumber: 'Sayı 145 - Ocak 2025',
      publishDate: new Date('2025-01-01'),
      category: 'industry',
      coverImage: 'https://via.placeholder.com/400x600/1e40af/ffffff?text=Sanayi+Dergisi',
      pdfFile: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pageCount: 84,
      isActive: true,
      isFeatured: true,
      order: 1,
      tags: 'sanayi, üretim, teknoloji, dijital dönüşüm',
      viewCount: 245,
      downloadCount: 89
    },
    {
      title: 'Teknoloji ve İnovasyon - Aralık 2024',
      slug: createSlug('Teknoloji ve Inovasyon Aralik 2024'),
      description: 'Yapay zeka, robotik ve otomasyon teknolojilerindeki son gelişmeler. Sektöre yön veren inovasyon örnekleri ve girişimci hikayeleri.',
      publisher: 'Teknoloji Yayıncılık A.Ş.',
      issueNumber: 'Yıl 12, Sayı 144',
      publishDate: new Date('2024-12-01'),
      category: 'technology',
      coverImage: 'https://via.placeholder.com/400x600/7c3aed/ffffff?text=Teknoloji+Dergisi',
      pdfFile: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pageCount: 96,
      isActive: true,
      isFeatured: true,
      order: 2,
      tags: 'teknoloji, AI, robotik, otomasyon, inovasyon',
      viewCount: 312,
      downloadCount: 124
    },
    {
      title: 'Ekonomi ve İşletme - 2024/04',
      slug: createSlug('Ekonomi ve Isletme 2024 04'),
      description: 'Türkiye ve dünya ekonomisine dair güncel analizler, piyasa trendleri ve yatırım stratejileri. İhracat, ithalat ve dış ticaret verileri.',
      publisher: 'Ekonomi Medya Grubu',
      issueNumber: '2024/04',
      publishDate: new Date('2024-12-15'),
      category: 'economy',
      coverImage: 'https://via.placeholder.com/400x600/059669/ffffff?text=Ekonomi+Dergisi',
      pdfFile: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pageCount: 72,
      isActive: true,
      order: 3,
      tags: 'ekonomi, finans, yatırım, piyasa, ticaret',
      viewCount: 198,
      downloadCount: 67
    },
    {
      title: 'Sektörel Görünüm - Kasım 2024',
      slug: createSlug('Sektorel Gorunum Kasim 2024'),
      description: 'Otomotiv, tekstil, gıda ve inşaat sektörlerinde son durum. Sektör temsilcileriyle röportajlar ve gelecek öngörüleri.',
      publisher: 'KYSD Yayınları',
      issueNumber: 'Kasım 2024',
      publishDate: new Date('2024-11-01'),
      category: 'general',
      coverImage: 'https://via.placeholder.com/400x600/0284c7/ffffff?text=Sektörel+Dergi',
      pdfFile: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pageCount: 68,
      isActive: true,
      isFeatured: false,
      order: 4,
      tags: 'sektör, analiz, otomotiv, tekstil, gıda',
      viewCount: 156,
      downloadCount: 45
    },
    {
      title: 'Sürdürülebilir Üretim - Özel Sayı',
      slug: createSlug('Surdurulebilir Uretim Ozel Sayi'),
      description: 'Çevre dostu üretim teknikleri, yeşil enerji uygulamaları ve karbon nötr fabrikalar. Sürdürülebilirlik sertifikaları rehberi.',
      publisher: 'Çevre ve Sanayi Yayınları',
      issueNumber: 'Özel Sayı 2024',
      publishDate: new Date('2024-10-15'),
      category: 'industry',
      coverImage: 'https://via.placeholder.com/400x600/16a34a/ffffff?text=Surdurulebilir+Uretim',
      pdfFile: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pageCount: 112,
      isActive: true,
      isFeatured: true,
      order: 5,
      tags: 'sürdürülebilirlik, çevre, yeşil enerji, sertifikasyon',
      viewCount: 278,
      downloadCount: 102
    },
    {
      title: 'Dijital Dönüşüm Rehberi 2025',
      slug: createSlug('Dijital Donusum Rehberi 2025'),
      description: 'KOBİ\'ler için dijital dönüşüm adım adım kılavuzu. E-ticaret, bulut teknolojileri, veri analizi ve siber güvenlik.',
      publisher: 'Dijital Medya A.Ş.',
      issueNumber: '2025 Özel Sayısı',
      publishDate: new Date('2024-12-20'),
      category: 'technology',
      coverImage: 'https://via.placeholder.com/400x600/9333ea/ffffff?text=Dijital+Donusum',
      pdfFile: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pageCount: 128,
      isActive: true,
      isFeatured: false,
      order: 6,
      tags: 'dijital dönüşüm, e-ticaret, bulut, siber güvenlik',
      viewCount: 423,
      downloadCount: 187
    }
  ]

  let addedCount = 0

  for (const magazine of magazines) {
    try {
      // Aynı slug var mı kontrol et
      const existing = await prisma.magazine.findUnique({
        where: { slug: magazine.slug }
      })

      if (existing) {
        console.log(`⚠️  "${magazine.title}" zaten mevcut, atlanıyor...`)
        continue
      }

      await prisma.magazine.create({
        data: magazine
      })

      console.log(`✅ "${magazine.title}" eklendi`)
      addedCount++
    } catch (error) {
      console.error(`❌ "${magazine.title}" eklenirken hata:`, error.message)
    }
  }

  console.log(`\n🎉 ${addedCount} dergi başarıyla eklendi!`)

  // İstatistikler
  const total = await prisma.magazine.count()
  const byCategory = await prisma.magazine.groupBy({
    by: ['category'],
    _count: true,
    where: { isActive: true }
  })

  console.log(`\n📊 Toplam dergi sayısı: ${total}`)
  console.log('Kategorilere göre:')
  byCategory.forEach(cat => {
    const catNames = {
      general: 'Genel',
      industry: 'Sanayi',
      technology: 'Teknoloji',
      economy: 'Ekonomi'
    }
    console.log(`  - ${catNames[cat.category] || cat.category}: ${cat._count} dergi`)
  })
}

seedMagazines()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
