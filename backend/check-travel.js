const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  try {
    const count = await prisma.travelGuide.count()
    console.log('Travel Guides:', count)
    
    if (count > 0) {
      const guides = await prisma.travelGuide.findMany({
        take: 2,
        include: {
          images: true
        }
      })
      console.log('\nİlk 2 rehber:')
      guides.forEach(g => {
        console.log(`- ${g.name}: ${g.images.length} resim`)
      })
    }
  } catch (error) {
    console.log('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

check()
