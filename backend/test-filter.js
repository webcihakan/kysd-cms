const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const now = new Date();
    console.log('Current time:', now);
    
    // API ile ayni filtre
    const ads = await prisma.advertisement.findMany({
      where: {
        position: 'homepage-banner-left',
        isActive: true,
        paymentStatus: 'PAID',
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Filtered ads count:', ads.length);
    
    if (ads.length > 0) {
      console.log('Found ad:', ads[0].name);
    } else {
      console.log('No ads matched the filter!');
      
      // Her bir kosulu ayri ayri test et
      const test1 = await prisma.advertisement.findMany({
        where: {
          position: 'homepage-banner-left',
          isActive: true
        }
      });
      console.log('With isActive=true:', test1.length);
      
      const test2 = await prisma.advertisement.findMany({
        where: {
          position: 'homepage-banner-left',
          isActive: true,
          paymentStatus: 'PAID'
        }
      });
      console.log('With paymentStatus=PAID:', test2.length);
    }
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
