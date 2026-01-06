const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMenu() {
  try {
    // Teşvik ile ilgili menüleri bul
    const menus = await prisma.menu.findMany({
      where: {
        OR: [
          { title: { contains: 'Teşvik' } },
          { title: { contains: 'Destek' } },
          { url: { contains: 'tesvik' } },
          { url: { contains: 'destek' } }
        ]
      }
    })

    console.log('Bulunan menüler:')
    menus.forEach(m => {
      console.log(`- ${m.title}: ${m.url}`)
    })

    if (menus.length === 0) {
      console.log('Teşvik menüsü bulunamadı')
    }

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMenu()
