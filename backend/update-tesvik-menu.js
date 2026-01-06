const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateTesvikMenu() {
  try {
    // Teşvik ve Destekler menü linkini güncelle
    const result = await prisma.menu.updateMany({
      where: {
        url: '/sayfa/tesvik-destekler'
      },
      data: {
        url: '/tesvik-ve-destekler'
      }
    })

    console.log(`${result.count} menü öğesi güncellendi`)
    console.log('Teşvik ve Destekler linki /tesvik-ve-destekler olarak değiştirildi')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateTesvikMenu()
