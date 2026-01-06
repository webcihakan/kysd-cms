const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Sanal fuar görselleri güncelleniyor...')

  // Fuar 1: KYSD Dijital Tekstil Fuarı 2025
  await prisma.virtualFair.update({
    where: { id: 1 },
    data: { coverImage: '/uploads/virtual-fairs/fair-1.jpg' }
  })
  console.log('Fuar 1 görseli güncellendi')

  // Fuar 2: Aksesuar & Yan Sanayi Online Showcase
  await prisma.virtualFair.update({
    where: { id: 2 },
    data: { coverImage: '/uploads/virtual-fairs/fair-2.jpg' }
  })
  console.log('Fuar 2 görseli güncellendi')

  console.log('Tüm fuar görselleri güncellendi!')
}

main()
  .catch(e => {
    console.error('Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
