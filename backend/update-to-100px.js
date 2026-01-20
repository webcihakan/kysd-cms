const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    // Pozisyonlari 800x100 yap
    await prisma.advertisementPosition.update({
      where: { code: 'homepage-banner-left' },
      data: { 
        width: 800, 
        height: 100,
        priceMonthly: 2000,
        description: 'Ana sayfada yer alan sol banner alani (800x100)'
      }
    });
    
    await prisma.advertisementPosition.update({
      where: { code: 'homepage-banner-right' },
      data: { 
        width: 800, 
        height: 100,
        priceMonthly: 2000,
        description: 'Ana sayfada yer alan sag banner alani (800x100)'
      }
    });
    console.log('Pozisyonlar 800x100 olarak guncellendi');

    // Eski banner'lari sil
    await prisma.advertisement.deleteMany({
      where: {
        position: { in: ['homepage-banner-left', 'homepage-banner-right'] }
      }
    });
    console.log('Eski banner\'lar silindi');

    // Sol Banner - Tekstil A.S.
    await prisma.advertisement.create({
      data: {
        name: 'Tekstil A.S. - Fermuar Uretimi',
        position: 'homepage-banner-left',
        positionId: 6,
        duration: 12,
        imageDesktop: '/uploads/banners/ad-banner-1-800x100.png',
        imageMobile: '/uploads/banners/ad-banner-1-800x100.png',
        link: 'https://www.kysd.org.tr/uyelik-basvurusu',
        startDate: yesterday,
        endDate: oneYearLater,
        isActive: true,
        paymentStatus: 'PAID',
        status: 'APPROVED',
        price: 2000,
        paidAmount: 2000,
        paidDate: new Date(),
        advertiser: 'Tekstil A.S.'
      }
    });
    console.log('Sol banner eklendi: Tekstil A.S.');

    // Sag Banner - Dugme Sanayi
    await prisma.advertisement.create({
      data: {
        name: 'Dugme Sanayi - Dugme Uretimi',
        position: 'homepage-banner-right',
        positionId: 7,
        duration: 12,
        imageDesktop: '/uploads/banners/ad-banner-2-800x100.png',
        imageMobile: '/uploads/banners/ad-banner-2-800x100.png',
        link: 'https://www.kysd.org.tr/uyeler',
        startDate: yesterday,
        endDate: oneYearLater,
        isActive: true,
        paymentStatus: 'PAID',
        status: 'APPROVED',
        price: 2000,
        paidAmount: 2000,
        paidDate: new Date(),
        advertiser: 'Dugme Sanayi'
      }
    });
    console.log('Sag banner eklendi: Dugme Sanayi');

    // Kontrol
    const ads = await prisma.advertisement.findMany({
      where: {
        position: { in: ['homepage-banner-left', 'homepage-banner-right'] }
      },
      select: {
        id: true,
        name: true,
        position: true,
        imageDesktop: true
      }
    });

    console.log('\nEklenen banner\'lar:');
    ads.forEach(ad => {
      console.log('-', ad.position, ':', ad.name);
    });

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
