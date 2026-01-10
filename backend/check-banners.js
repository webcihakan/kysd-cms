const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkBanners() {
  try {
    const banners = await prisma.advertisement.findMany({
      where: {
        position: { in: ['homepage-banner-left', 'homepage-banner-right'] }
      },
      select: {
        id: true,
        name: true,
        position: true,
        imageDesktop: true,
        imageMobile: true,
        isActive: true,
        status: true
      }
    })

    console.log('📢 Banner Reklamları:\n')
    console.log(JSON.stringify(banners, null, 2))

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBanners()
