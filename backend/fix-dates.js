const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    
    // Sol banner guncelle
    await prisma.advertisement.update({
      where: { id: 11 },
      data: {
        startDate: yesterday,
        endDate: oneYearLater,
        updatedAt: new Date()
      }
    });
    console.log('Sol banner tarihleri guncellendi');
    
    // Sag banner guncelle
    await prisma.advertisement.update({
      where: { id: 12 },
      data: {
        startDate: yesterday,
        endDate: oneYearLater,
        updatedAt: new Date()
      }
    });
    console.log('Sag banner tarihleri guncellendi');
    
    // Kontrol et
    const ads = await prisma.advertisement.findMany({
      where: {
        position: { in: ['homepage-banner-left', 'homepage-banner-right'] }
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true
      }
    });
    
    console.log('\nGuncel tarihler:');
    ads.forEach(ad => {
      console.log(ad.name, ':', ad.startDate, '-', ad.endDate);
    });
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
