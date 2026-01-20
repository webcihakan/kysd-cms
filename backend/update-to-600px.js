const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    console.log('Pozisyonlar 600x100 olarak guncelleniyor...');
    
    // Pozisyonlari 600x100 yap
    await prisma.advertisementPosition.update({
      where: { code: 'homepage-banner-left' },
      data: { 
        width: 600, 
        height: 100,
        priceMonthly: 1800,
        description: 'Ana sayfada yer alan sol banner (600x100 - Mobil uyumlu)'
      }
    });
    
    await prisma.advertisementPosition.update({
      where: { code: 'homepage-banner-right' },
      data: { 
        width: 600, 
        height: 100,
        priceMonthly: 1800,
        description: 'Ana sayfada yer alan sag banner (600x100 - Mobil uyumlu)'
      }
    });

    console.log('Eski banner\'lar guncelleniyor...');

    // Sol banner guncelle
    const leftBanner = await prisma.advertisement.findFirst({
      where: { position: 'homepage-banner-left' }
    });
    
    if (leftBanner) {
      await prisma.advertisement.update({
        where: { id: leftBanner.id },
        data: {
          imageDesktop: '/uploads/banners/banner-left-600x100.png',
          imageMobile: '/uploads/banners/banner-left-600x100.png',
          startDate: yesterday,
          endDate: oneYearLater,
          price: 1800,
          paidAmount: 1800
        }
      });
      console.log('Sol banner guncellendi (600x100)');
    }

    // Sag banner guncelle
    const rightBanner = await prisma.advertisement.findFirst({
      where: { position: 'homepage-banner-right' }
    });
    
    if (rightBanner) {
      await prisma.advertisement.update({
        where: { id: rightBanner.id },
        data: {
          imageDesktop: '/uploads/banners/banner-right-600x100.png',
          imageMobile: '/uploads/banners/banner-right-600x100.png',
          startDate: yesterday,
          endDate: oneYearLater,
          price: 1800,
          paidAmount: 1800
        }
      });
      console.log('Sag banner guncellendi (600x100)');
    }

    // Kontrol
    const positions = await prisma.advertisementPosition.findMany({
      where: {
        code: { in: ['homepage-banner-left', 'homepage-banner-right'] }
      },
      select: {
        code: true,
        width: true,
        height: true
      }
    });

    console.log('\nGuncel pozisyonlar:');
    positions.forEach(pos => {
      console.log('-', pos.code, ':', pos.width, 'x', pos.height);
    });

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
