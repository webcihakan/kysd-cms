const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAboutMenu() {
  try {
    // Hakkımızda menü linkini güncelle
    const result = await prisma.menu.updateMany({
      where: {
        url: '/sayfa/hakkimizda'
      },
      data: {
        url: '/hakkimizda'
      }
    })

    console.log(`${result.count} menü öğesi güncellendi`)
    console.log('Hakkımızda linki /hakkimizda olarak değiştirildi')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAboutMenu()
