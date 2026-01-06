const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addGalleryMenu() {
  try {
    // Mevcut galeri menusu var mi kontrol et
    const existingGalleryMenu = await prisma.menu.findFirst({
      where: {
        OR: [
          { url: '/galeri' },
          { title: 'Galeri' }
        ]
      }
    })

    if (existingGalleryMenu) {
      console.log('Galeri menusu zaten mevcut:', existingGalleryMenu)

      // URL'yi guncelle
      await prisma.menu.update({
        where: { id: existingGalleryMenu.id },
        data: {
          url: '/galeri',
          isActive: true
        }
      })
      console.log('Galeri menusu guncellendi')
    } else {
      // Medya menusunun altina ekle veya ana menu olarak ekle
      const medyaMenu = await prisma.menu.findFirst({
        where: {
          title: { contains: 'Medya' }
        }
      })

      if (medyaMenu) {
        // Medya altina ekle
        await prisma.menu.create({
          data: {
            title: 'Galeri',
            url: '/galeri',
            parentId: medyaMenu.id,
            order: 10,
            isActive: true
          }
        })
        console.log('Galeri menusu Medya altina eklendi')
      } else {
        // Bagimsiz menu olarak ekle
        const maxOrder = await prisma.menu.aggregate({
          where: { parentId: null },
          _max: { order: true }
        })

        await prisma.menu.create({
          data: {
            title: 'Galeri',
            url: '/galeri',
            order: (maxOrder._max.order || 0) + 1,
            isActive: true
          }
        })
        console.log('Galeri menusu ana menu olarak eklendi')
      }
    }

    // Tum menuleri listele
    const allMenus = await prisma.menu.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { order: 'asc' }
    })

    console.log('\nMevcut menu yapisi:')
    allMenus.forEach(menu => {
      console.log(`- ${menu.title} (${menu.url})`)
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach(child => {
          console.log(`  -- ${child.title} (${child.url})`)
        })
      }
    })

  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addGalleryMenu()
