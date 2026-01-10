const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Katalog paketleri ekleniyor...')

  const packages = [
    {
      name: '1 Aylık Deneme',
      duration: 1,
      price: 500.00,
      features: JSON.stringify([
        'PDF Katalog Yükleme',
        'Kapak Görseli',
        'Firma İletişim Bilgileri',
        '1 Ay Yayın Süresi'
      ]),
      description: 'Sistemi denemek için ideal paket. İlk deneyiminizi yaşayın.',
      order: 1,
      isActive: true
    },
    {
      name: '3 Aylık Standart',
      duration: 3,
      price: 1200.00,
      features: JSON.stringify([
        'PDF Katalog Yükleme',
        'Kapak Görseli',
        'Firma İletişim Bilgileri',
        '3 Ay Yayın Süresi',
        'Öncelikli Destek',
        'Aylık 400 TL (indirimli)'
      ]),
      description: 'En popüler paket! Orta vadeli görünürlük için ideal.',
      order: 2,
      isActive: true
    },
    {
      name: '6 Aylık Premium',
      duration: 6,
      price: 2100.00,
      features: JSON.stringify([
        'PDF Katalog Yükleme',
        'Kapak Görseli',
        'Firma İletişim Bilgileri',
        '6 Ay Yayın Süresi',
        'Öncelikli Destek',
        'Ana Sayfada Öne Çıkarma',
        'Aylık 350 TL (en avantajlı)'
      ]),
      description: 'Uzun vadeli görünürlük ve maksimum fayda. En çok tercih edilen paket!',
      order: 3,
      isActive: true
    },
    {
      name: '12 Aylık Yıllık',
      duration: 12,
      price: 3600.00,
      features: JSON.stringify([
        'PDF Katalog Yükleme',
        'Kapak Görseli',
        'Firma İletişim Bilgileri',
        '12 Ay Yayın Süresi',
        'VIP Destek',
        'Ana Sayfada Öne Çıkarma',
        'Aylık İstatistik Raporu',
        'Aylık 300 TL (en ekonomik)'
      ]),
      description: 'Tam yıl kesintisiz görünürlük. İşletmeniz için en karlı seçim.',
      order: 4,
      isActive: true
    }
  ]

  for (const pkg of packages) {
    try {
      const existing = await prisma.catalogPackage.findFirst({
        where: { name: pkg.name }
      })

      if (existing) {
        console.log(`⚠ Zaten mevcut: ${pkg.name}`)
        continue
      }

      await prisma.catalogPackage.create({
        data: pkg
      })
      console.log(`✓ Eklendi: ${pkg.name} - ${pkg.price} TL (${pkg.duration} ay)`)
    } catch (error) {
      console.log(`✗ Hata: ${pkg.name} - ${error.message}`)
    }
  }

  console.log('\n✅ Katalog paketleri başarıyla eklendi!')

  // Paket listesini göster
  const allPackages = await prisma.catalogPackage.findMany({
    orderBy: { order: 'asc' }
  })

  console.log('\n📦 Mevcut Paketler:')
  console.log('─'.repeat(70))
  allPackages.forEach(pkg => {
    console.log(`${pkg.name.padEnd(20)} | ${pkg.duration} ay | ${pkg.price} TL | ${pkg.isActive ? '✓' : '✗'}`)
  })
  console.log('─'.repeat(70))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
