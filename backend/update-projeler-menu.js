const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateProjelerMenu() {
  try {
    // Projeler menü linkini güncelle
    const result = await prisma.menu.updateMany({
      where: {
        OR: [
          { url: '/sayfa/projeler' },
          { title: 'Projeler' }
        ]
      },
      data: {
        url: '/projeler'
      }
    })

    console.log(`${result.count} menü öğesi güncellendi`)
    console.log('Projeler linki /projeler olarak değiştirildi')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProjelerMenu()
