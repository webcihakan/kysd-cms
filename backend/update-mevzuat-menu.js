const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateMevzuatMenu() {
  try {
    // Mevzuat menü linkini güncelle
    const result = await prisma.menu.updateMany({
      where: {
        url: '/sayfa/mevzuat'
      },
      data: {
        url: '/mevzuat'
      }
    })

    console.log(`${result.count} menü öğesi güncellendi`)
    console.log('Mevzuat linki /mevzuat olarak değiştirildi')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateMevzuatMenu()
