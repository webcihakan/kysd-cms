const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const prisma = new PrismaClient()

async function importData() {
  try {
    console.log('📥 Veri import ediliyor...\n')

    // Ekonomik göstergeleri import et
    const economicIndicators = JSON.parse(fs.readFileSync('export-economic-indicators.json', 'utf8'))
    for (const item of economicIndicators) {
      const { id, createdAt, updatedAt, ...data } = item
      await prisma.economicIndicator.upsert({
        where: { id },
        create: { id, ...data },
        update: data
      })
    }
    console.log(`✅ ${economicIndicators.length} ekonomik gösterge import edildi`)

    // Tatilleri import et
    const holidays = JSON.parse(fs.readFileSync('export-holidays.json', 'utf8'))
    for (const item of holidays) {
      const { id, createdAt, updatedAt, ...data } = item
      // Date alanlarını Date nesnesine çevir
      if (data.date) data.date = new Date(data.date)
      if (data.endDate) data.endDate = new Date(data.endDate)
      
      await prisma.holiday.upsert({
        where: { id },
        create: { id, ...data },
        update: data
      })
    }
    console.log(`✅ ${holidays.length} tatil import edildi`)

    // Katalog paketlerini import et
    const catalogPackages = JSON.parse(fs.readFileSync('export-catalog-packages.json', 'utf8'))
    for (const item of catalogPackages) {
      const { id, createdAt, updatedAt, ...data } = item
      await prisma.catalogPackage.upsert({
        where: { id },
        create: { id, ...data },
        update: data
      })
    }
    console.log(`✅ ${catalogPackages.length} katalog paketi import edildi`)

    // Dergileri import et
    const magazines = JSON.parse(fs.readFileSync('export-magazines.json', 'utf8'))
    for (const item of magazines) {
      const { id, createdAt, updatedAt, ...data } = item
      if (data.publishDate) data.publishDate = new Date(data.publishDate)
      
      await prisma.magazine.upsert({
        where: { id },
        create: { id, ...data },
        update: data
      })
    }
    console.log(`✅ ${magazines.length} dergi import edildi`)

    // Menüleri import et
    const menus = JSON.parse(fs.readFileSync('export-menus.json', 'utf8'))
    
    // Önce parent menüleri ekle
    const parentMenus = menus.filter(m => !m.parentId)
    for (const item of parentMenus) {
      const { id, createdAt, updatedAt, children, ...data } = item
      await prisma.menu.upsert({
        where: { id },
        create: { id, ...data },
        update: data
      })
    }
    
    // Sonra child menüleri ekle
    const childMenus = menus.filter(m => m.parentId)
    for (const item of childMenus) {
      const { id, createdAt, updatedAt, children, ...data } = item
      await prisma.menu.upsert({
        where: { id },
        create: { id, ...data },
        update: data
      })
    }
    
    // En son grandchild menüleri ekle
    for (const parent of menus.filter(m => m.children && m.children.length > 0)) {
      for (const child of parent.children.filter(c => c.children && c.children.length > 0)) {
        for (const grandchild of child.children) {
          const { id, createdAt, updatedAt, ...data } = grandchild
          await prisma.menu.upsert({
            where: { id },
            create: { id, ...data },
            update: data
          })
        }
      }
    }
    console.log(`✅ ${menus.length} menü öğesi import edildi`)

    console.log('\n🎉 Tüm veriler başarıyla import edildi!')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importData()
