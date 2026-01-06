const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateNewsImages() {
  try {
    // Haber resimlerini güncelle
    const updates = [
      { id: 1, image: '/uploads/news/news-1-ihracat.jpg' },
      { id: 2, image: '/uploads/news/news-2-surdurulebilir.jpg' },
      { id: 3, image: '/uploads/news/news-3-dijital.jpg' },
      { id: 4, image: '/uploads/news/news-4-fermuar.jpg' },
      { id: 5, image: '/uploads/news/news-5-fuar.jpg' },
      { id: 6, image: '/uploads/news/news-6-nakis.jpg' },
      { id: 7, image: '/uploads/news/news-7-hammadde.jpg' },
      { id: 8, image: '/uploads/news/news-8-istihdam.jpg' }
    ]

    for (const update of updates) {
      await prisma.news.update({
        where: { id: update.id },
        data: { image: update.image }
      })
      console.log(`Haber ${update.id} resmi güncellendi`)
    }

    console.log('\nTüm haber resimleri başarıyla güncellendi!')

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateNewsImages()
