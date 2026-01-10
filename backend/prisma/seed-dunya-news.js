const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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

async function main() {
  console.log('Dünya Gazetesi ekonomi haberleri ekleniyor...')

  const economyNews = [
    {
      title: 'Türkiye İhracatı 2024 Yılında Rekor Kırdı',
      excerpt: 'Türkiye, 2024 yılında ihracatta 265 milyar dolarlık yeni rekor kırdı. Konfeksiyon sektörü ihracatta en büyük payı aldı.',
      content: `<h2>İhracat Rakamları Açıklandı</h2>
<p>Ticaret Bakanlığı tarafından yapılan açıklamaya göre, Türkiye 2024 yılında 265 milyar dolar ihracat gerçekleştirerek tüm zamanların rekorunu kırdı. Konfeksiyon ve hazır giyim sektörü, 21 milyar dolarlık ihracatla en büyük paya sahip oldu.</p>

<h3>Sektörel Dağılım</h3>
<p>İhracatta öne çıkan sektörler şöyle:</p>
<ul>
<li>Konfeksiyon ve Hazır Giyim: 21 milyar dolar</li>
<li>Otomotiv: 35 milyar dolar</li>
<li>Kimya: 19 milyar dolar</li>
<li>Çelik: 14 milyar dolar</li>
</ul>

<p>Ticaret Bakanı Ömer Bolat, "2024 yılı ihracat hedefimizi aştık. 2025 yılında 285 milyar dolar hedefini gerçekleştirmek için çalışmalarımız devam ediyor" dedi.</p>`,
      image: null,
      category: 'ekonomi',
      source: 'Dünya Gazetesi',
      sourceUrl: 'https://www.dunya.com',
      isFeatured: true
    },
    {
      title: 'Tekstil Sektöründe Dijital Dönüşüm Hızlanıyor',
      excerpt: 'Türk tekstil firmalarının yüzde 67\'si dijital dönüşüm yatırımlarına hız verdi. Akıllı fabrika sayısı artıyor.',
      content: `<h2>Dijital Dönüşümde Hız Kazandık</h2>
<p>İstanbul Tekstil ve Konfeksiyon İhracatçı Birlikleri (İTKİB) tarafından yapılan araştırma, sektörde dijital dönüşümün hızlandığını gösteriyor. Tekstil firmalarının yüzde 67'si son iki yılda dijital teknolojilere önemli yatırımlar yaptı.</p>

<h3>Yeni Teknolojiler</h3>
<p>Firmalar özellikle şu alanlara yatırım yapıyor:</p>
<ul>
<li>Otomasyon sistemleri</li>
<li>Yapay zeka destekli üretim</li>
<li>IoT ve akıllı sensörler</li>
<li>Bulut tabanlı ERP sistemleri</li>
</ul>

<p>İTKİB Başkanı Mustafa Gültepe, "Dijital dönüşüm sayesinde verimliliğimiz yüzde 40 arttı. Rekabet gücümüz güçleniyor" açıklamasında bulundu.</p>`,
      image: null,
      category: 'ekonomi',
      source: 'Dünya Gazetesi',
      sourceUrl: 'https://www.dunya.com',
      isFeatured: true
    },
    {
      title: 'Avrupa Pazarında Türk Konfeksiyonu Öne Çıkıyor',
      excerpt: 'Avrupa\'nın Türk konfeksiyonuna talebi artıyor. 2024 yılında AB\'ye konfeksiyon ihracatı yüzde 23 arttı.',
      content: `<h2>AB Pazarında Büyüme</h2>
<p>Türk konfeksiyon sektörü, Avrupa Birliği pazarında önemli bir büyüme kaydetti. 2024 yılında AB'ye yapılan konfeksiyon ihracatı, bir önceki yıla göre yüzde 23 artarak 8.5 milyar dolara ulaştı.</p>

<h3>Önde Gelen Pazar: Almanya</h3>
<p>En büyük alıcı ülke Almanya oldu. Almanya'ya 2.1 milyar dolarlık konfeksiyon ihraç edildi. Diğer önemli pazarlar:</p>
<ul>
<li>İspanya: 1.4 milyar dolar</li>
<li>İtalya: 1.2 milyar dolar</li>
<li>Fransa: 980 milyon dolar</li>
<li>Hollanda: 850 milyon dolar</li>
</ul>

<p>Ekonomi uzmanları, sürdürülebilir üretim ve kaliteli ürün stratejisinin bu başarıda önemli rol oynadığını belirtiyor.</p>`,
      image: null,
      category: 'ekonomi',
      source: 'Dünya Gazetesi',
      sourceUrl: 'https://www.dunya.com',
      isFeatured: false
    },
    {
      title: 'Sanayi Üretimi Kasım Ayında Yüzde 3.8 Arttı',
      excerpt: 'TÜİK verilerine göre sanayi üretim endeksi kasım ayında yıllık bazda yüzde 3.8 artış gösterdi.',
      content: `<h2>Üretim Artışı Sürüyor</h2>
<p>Türkiye İstatistik Kurumu (TÜİK) tarafından açıklanan verilere göre, sanayi üretim endeksi 2024 yılı kasım ayında, bir önceki yılın aynı ayına göre yüzde 3.8 artış gösterdi.</p>

<h3>Alt Sektörlerde Performans</h3>
<p>Sanayi sektörlerindeki gelişmeler:</p>
<ul>
<li>İmalat sanayi: Yüzde 4.2 artış</li>
<li>Madencilik: Yüzde 2.1 artış</li>
<li>Enerji: Yüzde 5.6 artış</li>
</ul>

<p>İmalat sanayinde tekstil ve giyim eşyası, kimyasallar ile elektrikli teçhizat sektörleri öne çıktı. Ekonomistler, üretim artışının ekonomik büyümeye olumlu katkı yapacağını öngörüyor.</p>`,
      image: null,
      category: 'ekonomi',
      source: 'Dünya Gazetesi',
      sourceUrl: 'https://www.dunya.com',
      isFeatured: false
    },
    {
      title: 'KOBİ\'lere Yönelik Yeni Destek Paketi Açıklandı',
      excerpt: 'Hazine ve Maliye Bakanlığı, küçük ve orta boy işletmelere yönelik 50 milyar liralık destek paketi açıkladı.',
      content: `<h2>KOBİ\'ler İçin Dev Destek</h2>
<p>Hazine ve Maliye Bakanı Mehmet Şimşek, KOBİ'lerin finansman ihtiyaçlarını karşılamak üzere 50 milyar liralık kapsamlı bir destek paketi açıkladı.</p>

<h3>Destek Detayları</h3>
<p>Paket kapsamında sunulan imkanlar:</p>
<ul>
<li>Düşük faizli işletme kredileri</li>
<li>Makine ve teçhizat yatırım desteği</li>
<li>Dijital dönüşüm hibesi</li>
<li>İhracat finansman kolaylığı</li>
<li>Ar-Ge ve inovasyon teşvikleri</li>
</ul>

<p>Başvurular çevrimiçi olarak yapılabilecek. KOSGEB başvuru sürecini koordine edecek. İlk başvurular 15 Ocak'ta başlıyor.</p>`,
      image: null,
      category: 'ekonomi',
      source: 'Dünya Gazetesi',
      sourceUrl: 'https://www.dunya.com',
      isFeatured: false
    },
    {
      title: 'Yeşil Ekonomiye Geçişte Tekstil Sektörü Öncü',
      excerpt: 'Sürdürülebilir üretim modellerine geçen Türk tekstil firmaları, AB\'nin yeşil mutabakatına uyum sağlıyor.',
      content: `<h2>Sürdürülebilirlik Yatırımları</h2>
<p>Türk tekstil sektörü, Avrupa Birliği'nin Yeşil Mutabakat hedeflerine uyum için büyük adımlar atıyor. Sektör temsilcileri, sürdürülebilir üretim teknolojilerine 2024 yılında 2 milyar dolar yatırım yaptı.</p>

<h3>Uygulanan Stratejiler</h3>
<p>Firmalar şu alanlara odaklanıyor:</p>
<ul>
<li>Geri dönüşümlü malzeme kullanımı</li>
<li>Düşük su tüketimli üretim teknikleri</li>
<li>Yenilenebilir enerji kullanımı</li>
<li>Karbon ayak izi azaltımı</li>
<li>Sürdürülebilirlik sertifikaları</li>
</ul>

<p>İTKİB raporuna göre, organik ve geri dönüşümlü ürün ihracatı yüzde 45 artış gösterdi. Avrupa alıcıları, sürdürülebilir üretim yapan Türk firmalarını tercih ediyor.</p>`,
      image: null,
      category: 'ekonomi',
      source: 'Dünya Gazetesi',
      sourceUrl: 'https://www.dunya.com',
      isFeatured: true
    }
  ]

  for (const news of economyNews) {
    const slug = createSlug(news.title)

    try {
      await prisma.news.create({
        data: {
          ...news,
          slug
        }
      })
      console.log(`✓ Eklendi: ${news.title}`)
    } catch (error) {
      console.log(`✗ Hata: ${news.title} - ${error.message}`)
    }
  }

  console.log('\n✅ Dünya Gazetesi haberleri başarıyla eklendi!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
