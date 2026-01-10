const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixCalendarMenu() {
  console.log('🔧 Menü düzeltiliyor...')

  // Önce takvim menüsünü bul
  const calendarMenu = await prisma.menu.findFirst({
    where: {
      url: '/takvim'
    }
  })

  if (!calendarMenu) {
    console.log('❌ Takvim menüsü bulunamadı!')
    return
  }

  // Faaliyetler menüsünü bul
  const faaliyetlerMenu = await prisma.menu.findFirst({
    where: {
      title: 'Faaliyetler'
    }
  })

  if (!faaliyetlerMenu) {
    console.log('❌ Faaliyetler menüsü bulunamadı!')
    return
  }

  console.log(`📍 Şu anki parent: ${calendarMenu.parentId}`)
  console.log(`🎯 Yeni parent: ${faaliyetlerMenu.id} (Faaliyetler)`)

  // Faaliyetler altındaki en yüksek order'ı bul
  const maxOrder = await prisma.menu.findFirst({
    where: {
      parentId: faaliyetlerMenu.id
    },
    orderBy: {
      order: 'desc'
    }
  })

  const newOrder = maxOrder ? maxOrder.order + 1 : 1

  // Takvim menüsünü güncelle
  await prisma.menu.update({
    where: {
      id: calendarMenu.id
    },
    data: {
      parentId: faaliyetlerMenu.id,
      order: newOrder
    }
  })

  console.log(`✅ Menü güncellendi! Yeni order: ${newOrder}`)

  console.log('\n📋 Faaliyetler menüsü altındaki öğeler:')
  const faaliyetlerItems = await prisma.menu.findMany({
    where: {
      parentId: faaliyetlerMenu.id
    },
    orderBy: {
      order: 'asc'
    }
  })

  faaliyetlerItems.forEach(item => {
    console.log(`  └─ ${item.title} → ${item.url} (Order: ${item.order})`)
  })
}

fixCalendarMenu()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
