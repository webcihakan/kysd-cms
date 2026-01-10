const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const prisma = new PrismaClient()

async function exportData() {
  try {
    console.log('📊 Veri export ediliyor...')

    // Ekonomik göstergeleri çek
    const economicIndicators = await prisma.economicIndicator.findMany()
    console.log(`✅ ${economicIndicators.length} ekonomik gösterge bulundu`)

    // Tatilleri çek
    const holidays = await prisma.holiday.findMany()
    console.log(`✅ ${holidays.length} tatil bulundu`)

    // Katalog paketlerini çek
    const catalogPackages = await prisma.catalogPackage.findMany()
    console.log(`✅ ${catalogPackages.length} katalog paketi bulundu`)

    // Dergileri çek
    const magazines = await prisma.magazine.findMany()
    console.log(`✅ ${magazines.length} dergi bulundu`)

    // Menüleri çek
    const menus = await prisma.menu.findMany({
      include: {
        children: {
          include: {
            children: true
          }
        }
      }
    })
    console.log(`✅ ${menus.length} menü öğesi bulundu`)

    // JSON dosyalarına yaz
    fs.writeFileSync('export-economic-indicators.json', JSON.stringify(economicIndicators, null, 2))
    fs.writeFileSync('export-holidays.json', JSON.stringify(holidays, null, 2))
    fs.writeFileSync('export-catalog-packages.json', JSON.stringify(catalogPackages, null, 2))
    fs.writeFileSync('export-magazines.json', JSON.stringify(magazines, null, 2))
    fs.writeFileSync('export-menus.json', JSON.stringify(menus, null, 2))

    console.log('\n✅ Tüm veriler export edildi!')
    console.log('📁 Dosyalar:')
    console.log('  - export-economic-indicators.json')
    console.log('  - export-holidays.json')
    console.log('  - export-catalog-packages.json')
    console.log('  - export-magazines.json')
    console.log('  - export-menus.json')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
