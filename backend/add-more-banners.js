const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    // Diger pozisyonlarda da banner ekleyelim
    const banners = [
      {
        name: 'Astar Tekstil - Ana Sayfa Ust',
        position: 'homepage-top',
        positionId: 1,
        image: '/uploads/banners/ad-banner-3-800x100.png',
        advertiser: 'Astar Tekstil',
        link: 'https://www.kysd.org.tr/sanayi-gruplari'
      },
      {
        name: 'Makina Dunyasi - Icerik Arasi',
        position: 'content-middle',
        positionId: 3,
        image: '/uploads/banners/ad-banner-4-800x100.png',
        advertiser: 'Makina Dunyasi',
        link: 'https://www.kysd.org.tr/fuarlar'
      },
      {
        name: 'Fermuar Deposu - Footer Ustu',
        position: 'footer-top',
        positionId: 4,
        image: '/uploads/banners/ad-banner-5-800x100.png',
        advertiser: 'Fermuar Deposu',
        link: 'https://www.kysd.org.tr/projeler'
      }
    ];

    for (const banner of banners) {
      await prisma.advertisement.create({
        data: {
          name: banner.name,
          position: banner.position,
          positionId: banner.positionId,
          duration: 12,
          imageDesktop: banner.image,
          imageMobile: banner.image,
          link: banner.link,
          startDate: yesterday,
          endDate: oneYearLater,
          isActive: true,
          paymentStatus: 'PAID',
          status: 'APPROVED',
          price: 2000,
          paidAmount: 2000,
          paidDate: new Date(),
          advertiser: banner.advertiser
        }
      });
      console.log('Eklendi:', banner.name);
    }

    console.log('\nToplam aktif reklam sayisi:');
    const count = await prisma.advertisement.count({
      where: { isActive: true }
    });
    console.log(count, 'adet');

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
