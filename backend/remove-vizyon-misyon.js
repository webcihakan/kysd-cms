const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeVizyonMisyon() {
  try {
    // Vizyon & Misyon menü öğesini sil
    const menuResult = await prisma.menu.deleteMany({
      where: {
        OR: [
          { title: 'Vizyon & Misyon' },
          { title: 'Vizyon ve Misyon' },
          { url: '/sayfa/vizyon-misyon' }
        ]
      }
    })
    console.log(`${menuResult.count} menü öğesi silindi`)

    // Vizyon & Misyon sayfasını da sil (eğer varsa)
    const pageResult = await prisma.page.deleteMany({
      where: {
        OR: [
          { slug: 'vizyon-misyon' },
          { slug: 'vizyon-ve-misyon' }
        ]
      }
    })
    console.log(`${pageResult.count} sayfa silindi`)

    console.log('Vizyon & Misyon kaldırıldı (Hakkımızda sayfasında mevcut)')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeVizyonMisyon()
