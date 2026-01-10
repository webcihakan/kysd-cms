const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Katalog menüsü ekleniyor...')

  // Medya menüsünü bul
  const mediaMenu = await prisma.menu.findFirst({
    where: { title: 'Medya' }
  })

  if (!mediaMenu) {
    console.log('✗ Medya menüsü bulunamadı!')
    return
  }

  console.log(`✓ Medya menüsü bulundu: ID ${mediaMenu.id}`)

  // Katalog menüsü zaten var mı kontrol et
  const existing = await prisma.menu.findFirst({
    where: {
      title: 'Ürün Kataloğu',
      parentId: mediaMenu.id
    }
  })

  if (existing) {
    console.log('⚠ Ürün Kataloğu menüsü zaten mevcut!')
    return
  }

  // Yeni menü ekle
  await prisma.menu.create({
    data: {
      title: 'Ürün Kataloğu',
      url: '/katalog',
      parentId: mediaMenu.id,
      order: 5,
      isActive: true,
      target: '_self'
    }
  })

  console.log('✅ Ürün Kataloğu menüsü başarıyla eklendi!')

  // Menü yapısını göster
  const allMenus = await prisma.menu.findMany({
    where: { parentId: mediaMenu.id },
    orderBy: { order: 'asc' }
  })

  console.log('\n📋 Medya Alt Menüleri:')
  allMenus.forEach(menu => {
    console.log(`  ${menu.order}. ${menu.title} → ${menu.url}`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
