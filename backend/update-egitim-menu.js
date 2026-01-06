const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateEgitimMenu() {
  try {
    // Önce menüyü bul
    const menus = await prisma.menu.findMany({
      where: {
        OR: [
          { title: { contains: 'Eğitim' } },
          { title: { contains: 'Seminer' } },
          { url: { contains: 'egitim' } }
        ]
      }
    })

    console.log('Bulunan menüler:')
    menus.forEach(m => console.log(`- ${m.title}: ${m.url}`))

    // Eğitimler & Seminerler menü linkini güncelle
    const result = await prisma.menu.updateMany({
      where: {
        OR: [
          { url: '/sayfa/egitimler-seminerler' },
          { url: '/sayfa/egitim-seminerler' },
          { title: 'Eğitimler & Seminerler' }
        ]
      },
      data: {
        url: '/egitimler-seminerler'
      }
    })

    console.log(`\n${result.count} menü öğesi güncellendi`)

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateEgitimMenu()
