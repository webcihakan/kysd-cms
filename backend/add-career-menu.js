const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCareerMenu() {
  try {
    console.log('🔍 Menüler kontrol ediliyor...');

    // "Kariyer" menüsü zaten var mı kontrol et
    const existingCareerMenu = await prisma.menu.findFirst({
      where: {
        title: 'Kariyer'
      }
    });

    if (existingCareerMenu) {
      console.log('✅ Kariyer menüsü zaten mevcut');
      console.log('🔗 URL:', existingCareerMenu.url);
      return;
    }

    // "Medya" içeren menüyü bul
    const mediaMenu = await prisma.menu.findFirst({
      where: {
        title: { contains: 'Medya' },
        parentId: null
      }
    });

    // Medya'dan sonra eklemek için order'ı ayarla
    let newOrder = 100; // Varsayılan
    if (mediaMenu) {
      newOrder = mediaMenu.order + 1;
      console.log(`📍 Kariyer menüsü "Medya" (order: ${mediaMenu.order}) sonrasına eklenecek`);

      // Medya'dan sonraki menülerin sırasını 1 artır
      await prisma.$executeRaw`
        UPDATE menus
        SET \`order\` = \`order\` + 1
        WHERE parentId IS NULL AND \`order\` >= ${newOrder}
      `;
      console.log('✅ Diğer menülerin sırası güncellendi');
    } else {
      console.log('⚠️  Medya menüsü bulunamadı, en sona eklenecek');

      // En büyük order'ı bul
      const lastMenu = await prisma.menu.findFirst({
        where: { parentId: null },
        orderBy: { order: 'desc' }
      });

      if (lastMenu) {
        newOrder = lastMenu.order + 1;
      }
    }

    // Kariyer menüsünü ekle
    const careerMenu = await prisma.menu.create({
      data: {
        title: 'Kariyer',
        url: '/kariyer',
        order: newOrder,
        isActive: true,
        target: '_self'
      }
    });

    console.log('');
    console.log('✅ Kariyer menüsü başarıyla eklendi!');
    console.log('📌 Başlık:', careerMenu.title);
    console.log('🔗 URL:', careerMenu.url);
    console.log('🔢 Sıra:', careerMenu.order);
    console.log('');
    console.log('🌐 Ana sayfayı yenile: http://localhost:3000');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCareerMenu();
