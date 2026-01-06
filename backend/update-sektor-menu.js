const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateSektorMenu() {
  try {
    // Sektör Raporları menü linkini güncelle
    const result = await prisma.menu.updateMany({
      where: {
        url: '/sayfa/sektor-raporlari'
      },
      data: {
        url: '/sektor-raporlari'
      }
    })

    console.log(`${result.count} menü öğesi güncellendi`)
    console.log('Sektör Raporları linki /sektor-raporlari olarak değiştirildi')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateSektorMenu()
