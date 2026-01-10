const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addCalendarMenu() {
  console.log('📋 Menü yapısı kontrol ediliyor...')

  // Faaliyetler menüsünü bul
  const faaliyetlerMenu = await prisma.menu.findFirst({
    where: {
      OR: [
        { title: { contains: 'Faaliyetler' } },
        { title: { contains: 'Etkinlikler' } },
        { title: { contains: 'Hizmetler' } }
      ]
    }
  })

  if (faaliyetlerMenu) {
    console.log(`✅ Üst menü bulundu: "${faaliyetlerMenu.title}" (ID: ${faaliyetlerMenu.id})`)

    // Etkinlik Takvimi menüsü zaten var mı kontrol et
    const existingCalendar = await prisma.menu.findFirst({
      where: {
        url: '/takvim'
      }
    })

    if (existingCalendar) {
      console.log('⚠️  Takvim menüsü zaten mevcut!')
      return
    }

    // En yüksek order değerini bul
    const maxOrder = await prisma.menu.findFirst({
      where: {
        parentId: faaliyetlerMenu.id
      },
      orderBy: {
        order: 'desc'
      }
    })

    const newOrder = maxOrder ? maxOrder.order + 1 : 1

    // Yeni menü ekle
    const newMenu = await prisma.menu.create({
      data: {
        title: 'Etkinlik Takvimi',
        url: '/takvim',
        parentId: faaliyetlerMenu.id,
        order: newOrder,
        isActive: true
      }
    })

    console.log(`✅ Menü eklendi: "${newMenu.title}" (Order: ${newMenu.order})`)
  } else {
    // Üst menü yoksa ana menü olarak ekle
    console.log('⚠️  Faaliyetler menüsü bulunamadı, ana menü olarak eklenecek...')

    const maxOrder = await prisma.menu.findFirst({
      where: {
        parentId: null
      },
      orderBy: {
        order: 'desc'
      }
    })

    const newOrder = maxOrder ? maxOrder.order + 1 : 10

    const newMenu = await prisma.menu.create({
      data: {
        title: 'Etkinlik Takvimi',
        url: '/takvim',
        order: newOrder,
        isActive: true
      }
    })

    console.log(`✅ Ana menü olarak eklendi: "${newMenu.title}" (Order: ${newOrder})`)
  }

  console.log('\n📋 Güncel menü yapısı:')
  const allMenus = await prisma.menu.findMany({
    orderBy: [
      { order: 'asc' }
    ]
  })

  allMenus.forEach(menu => {
    const prefix = menu.parentId ? '  └─ ' : '● '
    const status = menu.isActive ? '✓' : '✗'
    console.log(`${prefix}[${status}] ${menu.title} → ${menu.url || '(dropdown)'} (Order: ${menu.order})`)
  })
}

addCalendarMenu()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
