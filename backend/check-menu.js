const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const menus = await prisma.menu.findMany({
    where: {
      OR: [
        { title: { contains: 'Faaliyetler' } },
        { title: { contains: 'Tur' } }
      ]
    },
    orderBy: { order: 'asc' }
  })

  console.log(JSON.stringify(menus, null, 2))
  await prisma.$disconnect()
}

main()
