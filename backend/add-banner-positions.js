const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addBannerPositions() {
  try {
    // Eski alanları pasif yap
    await prisma.advertisementPosition.updateMany({
      where: {
        code: { in: ['homepage-sidebar', 'sidebar-square'] }
      },
      data: {
        isActive: false
      }
    })
    console.log('✅ Eski reklam alanları pasif yapıldı')

    // Yeni banner alanlarını ekle
    const positions = [
      {
        name: 'Ana Sayfa Sol Banner',
        code: 'homepage-banner-left',
        description: 'Ana sayfada yer alan sol dikdörtgen banner alanı (728x90 veya 600x200)',
        width: 600,
        height: 200,
        isActive: true
      },
      {
        name: 'Ana Sayfa Sağ Banner',
        code: 'homepage-banner-right',
        description: 'Ana sayfada yer alan sağ dikdörtgen banner alanı (728x90 veya 600x200)',
        width: 600,
        height: 200,
        isActive: true
      }
    ]

    for (const pos of positions) {
      const existing = await prisma.advertisementPosition.findUnique({
        where: { code: pos.code }
      })

      if (existing) {
        await prisma.advertisementPosition.update({
          where: { code: pos.code },
          data: pos
        })
        console.log(`✅ Güncellendi: ${pos.name}`)
      } else {
        await prisma.advertisementPosition.create({
          data: pos
        })
        console.log(`✅ Eklendi: ${pos.name}`)
      }
    }

    // Örnek banner reklamları ekle
    console.log('\n📢 Örnek banner reklamları ekleniyor...')

    // Sol banner için position ID'sini bul
    const leftPosition = await prisma.advertisementPosition.findUnique({
      where: { code: 'homepage-banner-left' }
    })

    // Sağ banner için position ID'sini bul
    const rightPosition = await prisma.advertisementPosition.findUnique({
      where: { code: 'homepage-banner-right' }
    })

    const banners = [
      {
        name: 'Örnek Sol Banner',
        position: 'homepage-banner-left',
        positionId: leftPosition?.id,
        imageDesktop: 'https://via.placeholder.com/600x200/0052CC/FFFFFF?text=Sol+Banner+Reklam+Alan%C4%B1',
        link: '#',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 yıl
        isActive: true,
        status: 'APPROVED',
        paymentStatus: 'PAID'
      },
      {
        name: 'Örnek Sağ Banner',
        position: 'homepage-banner-right',
        positionId: rightPosition?.id,
        imageDesktop: 'https://via.placeholder.com/600x200/28A745/FFFFFF?text=Sa%C4%9F+Banner+Reklam+Alan%C4%B1',
        link: '#',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 yıl
        isActive: true,
        status: 'APPROVED',
        paymentStatus: 'PAID'
      }
    ]

    for (const banner of banners) {
      const existing = await prisma.advertisement.findFirst({
        where: {
          name: banner.name,
          position: banner.position
        }
      })

      if (!existing) {
        await prisma.advertisement.create({
          data: banner
        })
        console.log(`✅ Banner eklendi: ${banner.name}`)
      } else {
        console.log(`⏭️  Zaten mevcut: ${banner.name}`)
      }
    }

    console.log('\n✅ Tüm işlemler tamamlandı!')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addBannerPositions()
