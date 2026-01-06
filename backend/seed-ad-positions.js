const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const adPositions = [
  {
    name: 'Ana Sayfa Üst Banner',
    code: 'homepage-top',
    description: 'Ana sayfanın en üstünde, menünün hemen altında yer alan geniş banner alanı. En yüksek görünürlüğe sahip pozisyon.',
    width: 970,
    height: 250,
    priceMonthly: 2500,
    priceQuarterly: 6500,
    priceYearly: 22000,
    isActive: true,
    order: 1
  },
  {
    name: 'Ana Sayfa Sidebar',
    code: 'homepage-sidebar',
    description: 'Ana sayfa sağ kenar çubuğunda yer alan dikdörtgen reklam alanı.',
    width: 300,
    height: 250,
    priceMonthly: 1500,
    priceQuarterly: 4000,
    priceYearly: 14000,
    isActive: true,
    order: 2
  },
  {
    name: 'Haberler Arası Banner',
    code: 'news-inline',
    description: 'Haber listesinde haberler arasında görünen banner. İçerik ile bütünleşik görünüm.',
    width: 728,
    height: 90,
    priceMonthly: 1200,
    priceQuarterly: 3200,
    priceYearly: 11000,
    isActive: true,
    order: 3
  },
  {
    name: 'Sayfa İçi Geniş Banner',
    code: 'content-wide',
    description: 'Sayfa içeriklerinin altında yer alan tam genişlik banner.',
    width: 970,
    height: 90,
    priceMonthly: 1800,
    priceQuarterly: 4800,
    priceYearly: 17000,
    isActive: true,
    order: 4
  },
  {
    name: 'Footer Üstü Banner',
    code: 'above-footer',
    description: 'Footer bölümünün hemen üstünde tüm sayfalarda görünen banner.',
    width: 728,
    height: 90,
    priceMonthly: 800,
    priceQuarterly: 2100,
    priceYearly: 7500,
    isActive: true,
    order: 5
  },
  {
    name: 'Mobil Üst Banner',
    code: 'mobile-top',
    description: 'Mobil cihazlarda sayfanın üst kısmında görünen banner.',
    width: 320,
    height: 100,
    priceMonthly: 600,
    priceQuarterly: 1600,
    priceYearly: 5500,
    isActive: true,
    order: 6
  },
  {
    name: 'Sidebar Kare',
    code: 'sidebar-square',
    description: 'Sidebar da yer alan kare formatlı reklam alanı.',
    width: 300,
    height: 300,
    priceMonthly: 1000,
    priceQuarterly: 2700,
    priceYearly: 9500,
    isActive: true,
    order: 7
  },
  {
    name: 'Popup Reklam',
    code: 'popup',
    description: 'Sayfa yüklendiğinde açılan popup reklam alanı. Günde bir kez gösterilir.',
    width: 600,
    height: 400,
    priceMonthly: 3000,
    priceQuarterly: 8000,
    priceYearly: 28000,
    isActive: false,
    order: 8
  }
]

async function main() {
  console.log('Örnek reklam pozisyonları oluşturuluyor...')

  for (const position of adPositions) {
    // Önce var mı kontrol et
    const existing = await prisma.advertisementPosition.findUnique({
      where: { code: position.code }
    })

    if (existing) {
      console.log(`  ⏩ ${position.name} zaten mevcut`)
      continue
    }

    await prisma.advertisementPosition.create({
      data: position
    })
    console.log(`  ✅ ${position.name} oluşturuldu`)
  }

  console.log('\nTamamlandı!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
