const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateFuarlarMenu() {
  try {
    // Fuarlar menü linkini güncelle
    const result = await prisma.menu.updateMany({
      where: {
        OR: [
          { url: '/sayfa/fuarlar' },
          { title: 'Fuarlar' }
        ]
      },
      data: {
        url: '/fuarlar'
      }
    })

    console.log(`${result.count} menü öğesi güncellendi`)
    console.log('Fuarlar linki /fuarlar olarak değiştirildi')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateFuarlarMenu()
