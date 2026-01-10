const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateBannerSizes() {
  try {
    console.log('📏 Banner boyutları güncelleniyor...')

    // Banner pozisyonlarını 400x100 olarak güncelle
    await prisma.advertisementPosition.updateMany({
      where: {
        code: { in: ['homepage-banner-left', 'homepage-banner-right'] }
      },
      data: {
        width: 400,
        height: 100
      }
    })
    console.log('✅ Banner pozisyonları 400x100 olarak güncellendi')

    // Sol banner'ı güncelle
    const leftBanner = await prisma.advertisement.findFirst({
      where: {
        position: 'homepage-banner-left',
        name: 'Örnek Sol Banner'
      }
    })

    if (leftBanner) {
      await prisma.advertisement.update({
        where: { id: leftBanner.id },
        data: {
          imageDesktop: '/uploads/banners/left-banner.svg',
          imageMobile: '/uploads/banners/left-banner.svg'
        }
      })
      console.log('✅ Sol banner görseli güncellendi')
    }

    // Sağ banner'ı güncelle
    const rightBanner = await prisma.advertisement.findFirst({
      where: {
        position: 'homepage-banner-right',
        name: 'Örnek Sağ Banner'
      }
    })

    if (rightBanner) {
      await prisma.advertisement.update({
        where: { id: rightBanner.id },
        data: {
          imageDesktop: '/uploads/banners/right-banner.svg',
          imageMobile: '/uploads/banners/right-banner.svg'
        }
      })
      console.log('✅ Sağ banner görseli güncellendi')
    }

    console.log('\n✅ Tüm güncellemeler tamamlandı!')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateBannerSizes()
