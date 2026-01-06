const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const fairCount = await prisma.fair.count()
  const virtualFairCount = await prisma.virtualFair.count()

  console.log('Fiziksel Fuar sayisi:', fairCount)
  console.log('Sanal Fuar sayisi:', virtualFairCount)

  if (fairCount > 0) {
    const fairs = await prisma.fair.findMany({ take: 3 })
    console.log('\nOrnek Fiziksel Fuarlar:')
    fairs.forEach(f => console.log(`- ${f.title}`))
  }

  if (virtualFairCount > 0) {
    const vfairs = await prisma.virtualFair.findMany({ take: 3 })
    console.log('\nOrnek Sanal Fuarlar:')
    vfairs.forEach(f => console.log(`- ${f.title}`))
  }
}

main()
  .finally(() => prisma.$disconnect())
