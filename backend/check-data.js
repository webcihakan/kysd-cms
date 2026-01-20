const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const economicCount = await prisma.economicIndicator.count();
    const holidayCount = await prisma.holiday.count();
    const catalogPackageCount = await prisma.catalogPackage.count();
    const magazineCount = await prisma.magazine.count();
    
    console.log('Ekonomik Göstergeler:', economicCount);
    console.log('Tatiller:', holidayCount);
    console.log('Katalog Paketleri:', catalogPackageCount);
    console.log('Dergiler:', magazineCount);
  } catch (error) {
    console.error('Hata:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
