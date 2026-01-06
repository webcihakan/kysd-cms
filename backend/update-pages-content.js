const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updatePages() {
  const pagesToUpdate = [
    {
      slug: 'tuzuk',
      title: 'Dernek Tüzüğü',
      content: '',
      excerpt: JSON.stringify({
        subtitle: 'Konfeksiyon Yan Sanayi Derneği\'nin kuruluş amacı, üyelik şartları ve organizasyon yapısını düzenleyen resmi tüzük belgesi.',
        pdfUrl: '/documents/kysd-tuzuk.pdf',
        lastUpdate: '2024'
      }),
      isActive: true
    },
    {
      slug: 'iletisim',
      title: 'İletişim',
      content: '',
      excerpt: JSON.stringify({
        subtitle: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin.',
        successTitle: 'Mesajınız Gönderildi!',
        successMessage: 'En kısa sürede size dönüş yapacağız.'
      }),
      isActive: true
    },
    {
      slug: 'yonetim-kurulu',
      title: 'KYSD Yönetim Kurulu',
      content: '',
      excerpt: JSON.stringify({
        subtitle: 'Konfeksiyon Yan Sanayi Derneği yönetim kurulu üyelerimiz',
        executivesTitle: 'Yönetim Kadrosu',
        membersTitle: 'Yönetim Kurulu Üyeleri'
      }),
      isActive: true
    },
    {
      slug: 'neden-uye-olmaliyim',
      title: 'Neden KYSD Üyesi Olmalısınız?',
      content: '',
      excerpt: JSON.stringify({
        subtitle: 'Türkiye\'nin en köklü konfeksiyon yan sanayi derneğine katılın, sektörün gücünden yararlanın.'
      }),
      isActive: true
    }
  ]

  for (const pageData of pagesToUpdate) {
    try {
      // Önce mevcut kaydı kontrol et
      const existing = await prisma.page.findUnique({
        where: { slug: pageData.slug }
      })

      if (existing) {
        // Sadece excerpt'ı güncelle (içerik varsa dokunma)
        await prisma.page.update({
          where: { slug: pageData.slug },
          data: {
            excerpt: pageData.excerpt
          }
        })
        console.log(`Güncellendi: ${pageData.slug}`)
      } else {
        // Yeni kayıt oluştur
        await prisma.page.create({
          data: pageData
        })
        console.log(`Oluşturuldu: ${pageData.slug}`)
      }
    } catch (error) {
      console.error(`Hata (${pageData.slug}):`, error.message)
    }
  }

  // Mevcut tüm sayfaları listele
  const allPages = await prisma.page.findMany({
    select: { slug: true, title: true }
  })
  console.log('\nTüm Sayfalar:')
  allPages.forEach(p => console.log(`  - ${p.slug}: ${p.title}`))
}

updatePages()
  .then(() => {
    console.log('\nSayfa güncellemesi tamamlandı!')
    process.exit(0)
  })
  .catch(error => {
    console.error('Hata:', error)
    process.exit(1)
  })
