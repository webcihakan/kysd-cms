const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Sanal Fuar seed başlıyor...')

  // Örnek Sanal Fuar oluştur
  const fair = await prisma.virtualFair.create({
    data: {
      title: 'KYSD Dijital Tekstil Fuarı 2025',
      slug: 'kysd-dijital-tekstil-fuari-2025',
      description: 'Türkiye\'nin ilk ve en büyük online tekstil fuarı. Düğme, fermuar, aksesuar ve tekstil yan sanayi firmalarının buluşma noktası. Sanal standlarınızla 7/24 erişilebilir olun, ürünlerinizi dünya genelinde sergileyin.',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-03-31'),
      isActive: true,
      boothTypes: {
        create: [
          {
            name: 'Premium Stand',
            description: 'En geniş alan, sınırsız ürün, özel tasarım, video ve katalog desteği. Ana sayfada öne çıkarılma.',
            price: 15000,
            maxProducts: 50,
            features: JSON.stringify(['Sınırsız Ürün', 'Video Galeri', 'Katalog İndirme', 'Öne Çıkarma', 'Canlı Destek Badge']),
            order: 1,
            isActive: true
          },
          {
            name: 'Standart Stand',
            description: 'Orta ölçekli firmalar için ideal. 25 ürün, video ve katalog desteği.',
            price: 8000,
            maxProducts: 25,
            features: JSON.stringify(['25 Ürün', 'Video Galeri', 'Katalog İndirme']),
            order: 2,
            isActive: true
          },
          {
            name: 'Başlangıç Stand',
            description: 'Küçük firmalar ve yeni girişimciler için ekonomik seçenek.',
            price: 3500,
            maxProducts: 10,
            features: JSON.stringify(['10 Ürün', 'Firma Logosu', 'İletişim Bilgileri']),
            order: 3,
            isActive: true
          }
        ]
      }
    },
    include: {
      boothTypes: true
    }
  })

  console.log('Sanal Fuar oluşturuldu:', fair.title)
  console.log('Stant türleri:', fair.boothTypes.map(bt => `${bt.name} - ${bt.price} TL`))

  // İkinci bir fuar ekleyelim
  const fair2 = await prisma.virtualFair.create({
    data: {
      title: 'Aksesuar & Yan Sanayi Online Showcase',
      slug: 'aksesuar-yan-sanayi-online-showcase',
      description: 'Moda aksesuarları ve tekstil yan sanayi ürünlerinin sergilendiği özel online platform. Alıcılar ve üreticiler arasında köprü kurun.',
      startDate: new Date('2025-04-15'),
      endDate: new Date('2025-06-15'),
      isActive: true,
      boothTypes: {
        create: [
          {
            name: 'Gold Stand',
            description: 'Maksimum görünürlük ve tüm özellikler dahil.',
            price: 12000,
            maxProducts: 40,
            features: JSON.stringify(['40 Ürün', 'Video', 'Katalog', 'Öne Çıkarma']),
            order: 1,
            isActive: true
          },
          {
            name: 'Silver Stand',
            description: 'Orta seviye firmalar için ideal paket.',
            price: 6000,
            maxProducts: 20,
            features: JSON.stringify(['20 Ürün', 'Video', 'Katalog']),
            order: 2,
            isActive: true
          },
          {
            name: 'Bronze Stand',
            description: 'Başlangıç seviyesi için uygun fiyatlı seçenek.',
            price: 2500,
            maxProducts: 8,
            features: JSON.stringify(['8 Ürün', 'Firma Bilgileri']),
            order: 3,
            isActive: true
          }
        ]
      }
    }
  })

  console.log('İkinci Sanal Fuar oluşturuldu:', fair2.title)

  console.log('\nTüm sanal fuarlar başarıyla oluşturuldu!')
}

main()
  .catch(e => {
    console.error('Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
