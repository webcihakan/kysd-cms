const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Örnek Sanal Stant oluşturuluyor...')

  // İlk fuarı al
  const fair = await prisma.virtualFair.findFirst({
    include: { boothTypes: true }
  })

  if (!fair) {
    console.log('Önce sanal fuar oluşturulmalı!')
    return
  }

  const premiumType = fair.boothTypes.find(bt => bt.name === 'Premium Stand') || fair.boothTypes[0]

  // Önce başvuru oluştur
  const application = await prisma.virtualBoothApplication.create({
    data: {
      fairId: fair.id,
      boothTypeId: premiumType.id,
      companyName: 'ABC Düğme Sanayi A.Ş.',
      contactName: 'Ahmet Yılmaz',
      email: 'info@abcdugme.com',
      phone: '+90 212 555 00 00',
      website: 'https://www.abcdugme.com',
      message: 'Premium stant için başvuru yapıyoruz.',
      status: 'APPROVED',
      reviewedAt: new Date()
    }
  })

  // Stant oluştur
  const booth = await prisma.virtualBooth.create({
    data: {
      fairId: fair.id,
      boothTypeId: premiumType.id,
      applicationId: application.id,
      companyName: 'ABC Düğme Sanayi A.Ş.',
      companyLogo: null,
      description: 'ABC Düğme Sanayi, 1985 yılından bu yana Türkiye\'nin önde gelen düğme üreticilerinden biridir. Polyester, metal, sedef ve ahşap düğme çeşitlerimizle moda sektörüne hizmet vermekteyiz. ISO 9001 kalite belgeli tesislerimizde, çevre dostu üretim anlayışıyla çalışıyoruz.',
      website: 'https://www.abcdugme.com',
      email: 'info@abcdugme.com',
      phone: '+90 212 555 00 00',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      catalogUrl: null,
      bannerImage: null,
      isActive: true,
      viewCount: 156,
      order: 1
    }
  })

  console.log('Stant oluşturuldu:', booth.companyName)

  // Ürünler ekle
  const products = await prisma.virtualBoothProduct.createMany({
    data: [
      {
        boothId: booth.id,
        name: 'Premium Polyester Düğme Koleksiyonu',
        description: '20mm, 24mm, 28mm çaplarda, 50+ renk seçeneği. Yüksek dayanıklılık, solmaz renkler.',
        image: null,
        price: '₺0.50 - ₺2.00 / Adet',
        order: 1,
        isActive: true
      },
      {
        boothId: booth.id,
        name: 'Metal Düğme Serisi',
        description: 'Zamak ve pirinç metal düğmeler. Antik, nikel, gold kaplama seçenekleri.',
        image: null,
        price: '₺1.50 - ₺5.00 / Adet',
        order: 2,
        isActive: true
      },
      {
        boothId: booth.id,
        name: 'Sedef Düğme Koleksiyonu',
        description: 'Doğal sedef ve MOP (Mother of Pearl) düğmeler. Lüks giyim için ideal.',
        image: null,
        price: '₺3.00 - ₺15.00 / Adet',
        order: 3,
        isActive: true
      },
      {
        boothId: booth.id,
        name: 'Ahşap Düğme Serisi',
        description: 'Ceviz, meşe ve bambu ahşap düğmeler. Eko-friendly, doğal görünüm.',
        image: null,
        price: '₺1.00 - ₺4.00 / Adet',
        order: 4,
        isActive: true
      },
      {
        boothId: booth.id,
        name: 'Özel Tasarım Düğmeler',
        description: 'Markanıza özel logo baskılı, custom renk ve şekil seçenekleri.',
        image: null,
        price: 'Teklif Alın',
        order: 5,
        isActive: true
      }
    ]
  })

  console.log('5 ürün eklendi')

  // İkinci bir stant daha ekleyelim
  const application2 = await prisma.virtualBoothApplication.create({
    data: {
      fairId: fair.id,
      boothTypeId: fair.boothTypes[1]?.id || premiumType.id,
      companyName: 'Fermuar Dünyası Ltd.',
      contactName: 'Mehmet Kaya',
      email: 'info@fermuardunyasi.com',
      phone: '+90 216 444 00 00',
      website: 'https://www.fermuardunyasi.com',
      status: 'APPROVED',
      reviewedAt: new Date()
    }
  })

  const booth2 = await prisma.virtualBooth.create({
    data: {
      fairId: fair.id,
      boothTypeId: fair.boothTypes[1]?.id || premiumType.id,
      applicationId: application2.id,
      companyName: 'Fermuar Dünyası Ltd.',
      description: 'Fermuar Dünyası, 30 yılı aşkın tecrübesiyle metal ve plastik fermuar üretiminde sektörün güvenilir markasıdır. YKK kalite standartlarında üretim yapan firmamız, giyim, çanta ve ayakkabı sektörlerine hizmet vermektedir.',
      website: 'https://www.fermuardunyasi.com',
      email: 'info@fermuardunyasi.com',
      phone: '+90 216 444 00 00',
      isActive: true,
      viewCount: 89,
      order: 2
    }
  })

  await prisma.virtualBoothProduct.createMany({
    data: [
      {
        boothId: booth2.id,
        name: 'Naylon Spiral Fermuar',
        description: '3#, 5#, 8# numaralarda. Giyim ve ev tekstili için ideal.',
        price: '₺2.00 - ₺8.00 / Adet',
        order: 1,
        isActive: true
      },
      {
        boothId: booth2.id,
        name: 'Metal Fermuar',
        description: 'Pirinç ve alüminyum metal fermuarlar. Kot ve deri ürünler için.',
        price: '₺5.00 - ₺15.00 / Adet',
        order: 2,
        isActive: true
      },
      {
        boothId: booth2.id,
        name: 'Su Geçirmez Fermuar',
        description: 'Outdoor giyim ve çantalar için özel su geçirmez fermuarlar.',
        price: '₺10.00 - ₺25.00 / Adet',
        order: 3,
        isActive: true
      }
    ]
  })

  console.log('İkinci stant oluşturuldu:', booth2.companyName)
  console.log('\nToplam 2 stant ve 8 ürün başarıyla oluşturuldu!')
  console.log('\nTest URL: http://localhost:5173/sanal-fuar/kysd-dijital-tekstil-fuari-2025')
}

main()
  .catch(e => {
    console.error('Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
