const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Faaliyetler menüsünü bul
  const parent = await prisma.menu.findFirst({
    where: { title: 'Faaliyetler' }
  })

  if (!parent) {
    console.error('Faaliyetler menüsü bulunamadı')
    return
  }

  // Tur Rehberi menüsü var mı kontrol et
  const existing = await prisma.menu.findFirst({
    where: { title: 'Tur Rehberi' }
  })

  if (existing) {
    console.log('✓ Tur Rehberi menüsü zaten mevcut:', existing.id)
    return
  }

  // Faaliyetler altındaki alt menülerin sayısını bul
  const subMenus = await prisma.menu.findMany({
    where: { parentId: parent.id },
    orderBy: { order: 'desc' }
  })

  const nextOrder = subMenus.length > 0 ? subMenus[0].order + 1 : 0

  // Tur Rehberi menüsünü ekle
  const menu = await prisma.menu.create({
    data: {
      title: 'Tur Rehberi',
      url: '/tur-rehberi',
      parentId: parent.id,
      order: nextOrder,
      isActive: true,
      target: '_self'
    }
  })

  console.log('✓ Tur Rehberi menüsü eklendi:', menu.id)
  await prisma.$disconnect()
}

main()
