const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.virtualFair.updateMany({
    data: { coverImage: null }
  })
  console.log('Kapak gorselleri kaldirildi')
}

main()
  .finally(() => prisma.$disconnect())
