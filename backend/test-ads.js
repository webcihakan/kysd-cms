const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const now = new Date();
    
    // Tum reklamlari getir
    const allAds = await prisma.advertisement.findMany({
      where: { position: 'homepage-banner-left' }
    });
    console.log('Total ads:', allAds.length);
    
    if (allAds.length > 0) {
      const ad = allAds[0];
      console.log('Ad details:');
      console.log('  - Name:', ad.name);
      console.log('  - Position:', ad.position);
      console.log('  - Active:', ad.isActive);
      console.log('  - Payment:', ad.paymentStatus);
      console.log('  - Status:', ad.status);
      console.log('  - Start:', ad.startDate);
      console.log('  - End:', ad.endDate);
    }
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
