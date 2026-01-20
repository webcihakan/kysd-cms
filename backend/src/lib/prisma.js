const { PrismaClient } = require('@prisma/client');

/**
 * Merkezi Prisma Client yapılandırması
 * Singleton pattern kullanarak tek bir instance oluşturur
 * Bu sayede gereksiz database bağlantıları önlenir
 */

let prisma;

if (process.env.NODE_ENV === 'production') {
  // Production ortamı için optimize edilmiş ayarlar
  prisma = new PrismaClient({
    log: ['warn', 'error'], // Sadece uyarı ve hataları logla
    errorFormat: 'minimal', // Minimal hata formatı
  });
} else {
  // Development ortamı için detaylı loglar
  // Hot reload durumunda global kullanarak connection sızıntısını önle
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'], // Tüm logları göster
      errorFormat: 'pretty', // Daha okunabilir hata formatı
    });
  }
  prisma = global.prisma;
}

// Uygulama kapanırken bağlantıyı temiz kapat
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
