const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addMagazinesMenu() {
  console.log('📋 Medya menüsü kontrol ediliyor...')

  // Medya menüsünü bul
  const mediaMenu = await prisma.menu.findFirst({
    where: {
      title: 'Medya'
    }
  })

  if (!mediaMenu) {
    console.log('⚠️  Medya menüsü bulunamadı!')
    console.log('💡 Önce Medya menüsünü oluşturun')
    return
  }

  console.log(`✅ Medya menüsü bulundu (ID: ${mediaMenu.id})`)

  // Sektörel Dergiler zaten var mı?
  const existing = await prisma.menu.findFirst({
    where: {
      url: '/dergiler'
    }
  })

  if (existing) {
    console.log('⚠️  Sektörel Dergiler menüsü zaten mevcut!')
    return
  }

  // Medya altındaki en yüksek order'ı bul
  const maxOrder = await prisma.menu.findFirst({
    where: {
      parentId: mediaMenu.id
    },
    orderBy: {
      order: 'desc'
    }
  })

  const newOrder = maxOrder ? maxOrder.order + 1 : 1

  // Yeni menü ekle
  const newMenu = await prisma.menu.create({
    data: {
      title: 'Sektörel Dergiler',
      url: '/dergiler',
      parentId: mediaMenu.id,
      order: newOrder,
      isActive: true
    }
  })

  console.log(`✅ "Sektörel Dergiler" menüsü eklendi (Order: ${newOrder})`)

  console.log('\n📋 Medya menüsü altındaki öğeler:')
  const mediaItems = await prisma.menu.findMany({
    where: {
      parentId: mediaMenu.id
    },
    orderBy: {
      order: 'asc'
    }
  })

  mediaItems.forEach(item => {
    console.log(`  └─ ${item.title} → ${item.url} (Order: ${item.order})`)
  })
}

addMagazinesMenu()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
