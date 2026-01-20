const { PrismaClient } = require('@prisma/client');
const https = require('https');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
  });
};

(async () => {
  const url = 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=1200';
  const uploadDir = path.join(__dirname, 'uploads/travel-guides');
  const filename = `${Date.now()}-32.jpg`;
  const filepath = path.join(uploadDir, filename);

  await downloadImage(url, filepath);

  await prisma.travelGuideImage.create({
    data: {
      guideId: 32,
      image: `/uploads/travel-guides/${filename}`,
      title: 'Louvre Müzesi',
      order: 0
    }
  });

  console.log('✓ Louvre Müzesi fotoğrafı eklendi');
  await prisma.$disconnect();
})();
