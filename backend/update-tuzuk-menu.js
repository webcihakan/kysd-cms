const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateTuzukMenu() {
  try {
    // Tüzük menü linkini güncelle
    const result = await prisma.menu.updateMany({
      where: {
        url: '/sayfa/tuzuk'
      },
      data: {
        url: '/tuzuk'
      }
    })

    console.log(`${result.count} menü öğesi güncellendi`)
    console.log('Tüzük linki /tuzuk olarak değiştirildi')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateTuzukMenu()
