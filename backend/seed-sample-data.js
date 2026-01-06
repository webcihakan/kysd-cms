const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Örnek veriler ekleniyor...\n')

  // 1. Örnek İletişim Mesajları
  console.log('📧 İletişim mesajları ekleniyor...')
  const contacts = [
    {
      name: 'Mehmet Yılmaz',
      email: 'mehmet.yilmaz@abctekstil.com',
      phone: '0532 111 2233',
      subject: 'Üyelik Hakkında Bilgi',
      message: 'Merhaba, firmamız konfeksiyon yan sanayi sektöründe aksesuar üretimi yapmaktadır. Derneğinize üyelik şartları ve avantajları hakkında bilgi almak istiyoruz. İlginiz için teşekkür ederiz.',
      isRead: false,
      createdAt: new Date('2024-12-20')
    },
    {
      name: 'Ayşe Kara',
      email: 'ayse.kara@xyzbutton.com.tr',
      phone: '0544 222 3344',
      subject: 'Fuar Katılımı',
      message: '2025 yılında düzenlenecek fuarlar hakkında bilgi almak istiyorum. Firmamız düğme ve aksesuar üretimi yapıyor, sektördeki fuarlara katılım konusunda derneğinizin desteği olur mu?',
      isRead: true,
      createdAt: new Date('2024-12-18')
    },
    {
      name: 'Ali Demir',
      email: 'ali.demir@fermuartekstil.com',
      phone: '0555 333 4455',
      subject: 'Eğitim Programları',
      message: 'Derneğinizin düzenlediği eğitim programları hakkında detaylı bilgi rica ediyorum. Özellikle kalite kontrol ve üretim verimliliği konularında eğitimleriniz var mı?',
      isRead: false,
      createdAt: new Date('2024-12-22')
    },
    {
      name: 'Fatma Özcan',
      email: 'fatma@nakistekstil.com',
      phone: '0533 444 5566',
      subject: 'İş Birliği Teklifi',
      message: 'Firmamız nakış ve baskı sektöründe faaliyet göstermektedir. Dernek üyesi firmalarla iş birliği fırsatları konusunda görüşmek isteriz. Uygun bir zaman için randevu alabilir miyiz?',
      isRead: false,
      createdAt: new Date('2024-12-24')
    },
    {
      name: 'Hüseyin Şahin',
      email: 'huseyin.sahin@astartekstil.com',
      phone: '0542 555 6677',
      subject: 'Sektör Raporu Talebi',
      message: 'Konfeksiyon yan sanayi sektörüne ait güncel raporlarınız var mı? İhracat verileri ve sektör analizlerine erişmek istiyoruz.',
      isRead: true,
      createdAt: new Date('2024-12-15')
    },
    {
      name: 'Zeynep Aydın',
      email: 'zeynep@etiketteks.com.tr',
      phone: '0536 666 7788',
      subject: 'Teşvik ve Destekler',
      message: 'Devlet teşvikleri ve KOSGEB destekleri hakkında bilgi almak istiyorum. Derneğiniz bu konuda üyelerine danışmanlık hizmeti veriyor mu?',
      isRead: false,
      createdAt: new Date('2024-12-25')
    }
  ]

  for (const contact of contacts) {
    await prisma.contact.create({ data: contact })
  }
  console.log(`   ✓ ${contacts.length} mesaj eklendi\n`)

  // 2. Önce sanayi gruplarını kontrol edelim
  let industryGroups = await prisma.industryGroup.findMany()
  if (industryGroups.length === 0) {
    console.log('🏭 Sanayi grupları ekleniyor...')
    const groups = [
      { name: 'Düğme Sanayi', slug: 'dugme-sanayi', order: 1 },
      { name: 'Fermuar Sanayi', slug: 'fermuar-sanayi', order: 2 },
      { name: 'Etiket Sanayi', slug: 'etiket-sanayi', order: 3 },
      { name: 'Nakış Sanayi', slug: 'nakis-sanayi', order: 4 },
      { name: 'Aksesuar Sanayi', slug: 'aksesuar-sanayi', order: 5 }
    ]
    for (const group of groups) {
      await prisma.industryGroup.create({ data: group })
    }
    industryGroups = await prisma.industryGroup.findMany()
    console.log(`   ✓ ${groups.length} sanayi grubu eklendi\n`)
  }

  // 3. Örnek Üyelik Başvuruları
  console.log('📋 Üyelik başvuruları ekleniyor...')
  const applications = [
    {
      companyName: 'ABC Düğme Sanayi A.Ş.',
      companyType: 'Anonim Şirket',
      taxNumber: '1234567890',
      taxOffice: 'Büyük Mükellefler',
      tradeRegistry: 'İST-123456',
      address: 'Organize Sanayi Bölgesi 5. Cadde No:15 Başakşehir',
      city: 'İstanbul',
      district: 'Başakşehir',
      postalCode: '34490',
      phone: '0212 555 1234',
      fax: '0212 555 1235',
      email: 'info@abcdugme.com.tr',
      website: 'www.abcdugme.com.tr',
      contactName: 'Ahmet Yıldırım',
      contactTitle: 'Genel Müdür',
      contactPhone: '0532 111 2233',
      contactEmail: 'ahmet.yildirim@abcdugme.com.tr',
      industryGroupId: industryGroups.find(g => g.slug === 'dugme-sanayi')?.id,
      activityArea: 'Polyester, metal ve sedef düğme üretimi. Yıllık 50 milyon adet üretim kapasitesi.',
      employeeCount: '50-100',
      foundedYear: '1998',
      status: 'PENDING',
      createdAt: new Date('2024-12-20')
    },
    {
      companyName: 'XYZ Fermuar Ltd. Şti.',
      companyType: 'Limited Şirket',
      taxNumber: '9876543210',
      taxOffice: 'Kadıköy',
      tradeRegistry: 'İST-789012',
      address: 'Sanayi Mahallesi Fermuar Sokak No:8',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710',
      phone: '0216 444 5678',
      email: 'bilgi@xyzfermuar.com',
      website: 'www.xyzfermuar.com',
      contactName: 'Fatma Demir',
      contactTitle: 'Satış Müdürü',
      contactPhone: '0544 333 4455',
      contactEmail: 'fatma@xyzfermuar.com',
      industryGroupId: industryGroups.find(g => g.slug === 'fermuar-sanayi')?.id,
      activityArea: 'Plastik ve metal fermuar üretimi. İhracat ağırlıklı çalışıyoruz.',
      employeeCount: '25-50',
      foundedYear: '2005',
      status: 'APPROVED',
      reviewedAt: new Date('2024-12-22'),
      createdAt: new Date('2024-12-15')
    },
    {
      companyName: 'Mega Etiket ve Baskı San. Tic. A.Ş.',
      companyType: 'Anonim Şirket',
      taxNumber: '5678901234',
      taxOffice: 'Merter',
      tradeRegistry: 'İST-345678',
      address: 'Merter Tekstil Merkezi A Blok Kat:3 No:45',
      city: 'İstanbul',
      district: 'Güngören',
      postalCode: '34165',
      phone: '0212 666 7890',
      fax: '0212 666 7891',
      email: 'info@megaetiket.com.tr',
      website: 'www.megaetiket.com.tr',
      contactName: 'Mustafa Kaya',
      contactTitle: 'Yönetim Kurulu Üyesi',
      contactPhone: '0555 666 7788',
      contactEmail: 'mustafa.kaya@megaetiket.com.tr',
      industryGroupId: industryGroups.find(g => g.slug === 'etiket-sanayi')?.id,
      activityArea: 'Dokuma etiket, baskılı etiket, karton etiket ve askı üretimi yapıyoruz.',
      employeeCount: '100-250',
      foundedYear: '1992',
      status: 'PENDING',
      createdAt: new Date('2024-12-23')
    },
    {
      companyName: 'Star Nakış Tekstil',
      companyType: 'Limited Şirket',
      taxNumber: '3456789012',
      taxOffice: 'Bayrampaşa',
      address: 'Tekstilkent B12 Blok No:220',
      city: 'İstanbul',
      district: 'Esenler',
      phone: '0212 777 8901',
      email: 'star@starnakis.com',
      contactName: 'Elif Yılmaz',
      contactTitle: 'İşletme Sahibi',
      contactPhone: '0533 888 9900',
      industryGroupId: industryGroups.find(g => g.slug === 'nakis-sanayi')?.id,
      activityArea: 'Bilgisayarlı nakış, pul işleme, lazer kesim hizmetleri.',
      employeeCount: '10-25',
      foundedYear: '2010',
      status: 'REJECTED',
      notes: 'Başvuru belgeleri eksik. Vergi levhası ve ticaret sicil belgesi istendi.',
      reviewedAt: new Date('2024-12-18'),
      createdAt: new Date('2024-12-10')
    },
    {
      companyName: 'Premium Aksesuar San. Tic. Ltd. Şti.',
      companyType: 'Limited Şirket',
      taxNumber: '7890123456',
      taxOffice: 'Beylikdüzü',
      tradeRegistry: 'İST-901234',
      address: 'Beylikdüzü OSB Mah. 3. Sokak No:12',
      city: 'İstanbul',
      district: 'Beylikdüzü',
      postalCode: '34520',
      phone: '0212 888 9012',
      email: 'info@premiumaksesuar.com',
      website: 'www.premiumaksesuar.com',
      contactName: 'Kemal Arslan',
      contactTitle: 'Kurucu Ortak',
      contactPhone: '0542 999 0011',
      contactEmail: 'kemal@premiumaksesuar.com',
      industryGroupId: industryGroups.find(g => g.slug === 'aksesuar-sanayi')?.id,
      activityArea: 'Konfeksiyon aksesuarları: toka, klips, rivet, kuşgözü üretimi.',
      employeeCount: '25-50',
      foundedYear: '2015',
      status: 'PENDING',
      createdAt: new Date('2024-12-24')
    }
  ]

  for (const app of applications) {
    await prisma.membershipApplication.create({ data: app })
  }
  console.log(`   ✓ ${applications.length} üyelik başvurusu eklendi\n`)

  // 4. Reklam Pozisyonları ve Fiyatlandırma
  console.log('📢 Reklam pozisyonları ekleniyor...')
  const adPositions = [
    {
      name: 'Ana Sayfa Üst Banner',
      code: 'homepage-top',
      description: 'Ana sayfanın en üstünde, slider\'ın hemen altında görünen geniş banner alanı. Yüksek görünürlük.',
      width: 1200,
      height: 120,
      priceMonthly: 2500.00,
      priceQuarterly: 6500.00,
      priceYearly: 22000.00,
      order: 1
    },
    {
      name: 'Ana Sayfa Sağ Sidebar',
      code: 'homepage-sidebar-right',
      description: 'Ana sayfada sağ tarafta görünen dikey banner alanı. Scroll ile birlikte sabit kalır.',
      width: 300,
      height: 600,
      priceMonthly: 1500.00,
      priceQuarterly: 4000.00,
      priceYearly: 14000.00,
      order: 2
    },
    {
      name: 'Haber Detay Sidebar',
      code: 'news-sidebar',
      description: 'Haber detay sayfalarında sağ tarafta görünen banner. Hedefli reklam için ideal.',
      width: 300,
      height: 250,
      priceMonthly: 1000.00,
      priceQuarterly: 2700.00,
      priceYearly: 9500.00,
      order: 3
    },
    {
      name: 'Sanayi Grupları Arası',
      code: 'industry-between',
      description: 'Sanayi grupları listesinde firmalar arasında görünen yatay banner.',
      width: 728,
      height: 90,
      priceMonthly: 800.00,
      priceQuarterly: 2100.00,
      priceYearly: 7500.00,
      order: 4
    },
    {
      name: 'Footer Üstü Banner',
      code: 'footer-top',
      description: 'Footer\'ın hemen üstünde, tüm sayfalarda görünen geniş banner alanı.',
      width: 970,
      height: 90,
      priceMonthly: 1200.00,
      priceQuarterly: 3200.00,
      priceYearly: 11000.00,
      order: 5
    },
    {
      name: 'Mobil Ana Sayfa',
      code: 'mobile-homepage',
      description: 'Mobil cihazlarda ana sayfada görünen banner. Sadece mobil kullanıcılara gösterilir.',
      width: 320,
      height: 100,
      priceMonthly: 600.00,
      priceQuarterly: 1600.00,
      priceYearly: 5500.00,
      order: 6
    },
    {
      name: 'Eğitim Sayfası Sponsor',
      code: 'training-sponsor',
      description: 'Eğitim sayfalarında "Sponsor" olarak görünen özel alan. Logo ve firma adı ile.',
      width: 200,
      height: 100,
      priceMonthly: 500.00,
      priceQuarterly: 1300.00,
      priceYearly: 4500.00,
      order: 7
    },
    {
      name: 'Fuar Sayfası Premium',
      code: 'fair-premium',
      description: 'Fuar sayfalarında öne çıkan premium reklam alanı.',
      width: 468,
      height: 60,
      priceMonthly: 700.00,
      priceQuarterly: 1900.00,
      priceYearly: 6500.00,
      order: 8
    }
  ]

  for (const pos of adPositions) {
    await prisma.advertisementPosition.create({ data: pos })
  }
  console.log(`   ✓ ${adPositions.length} reklam pozisyonu eklendi\n`)

  // 5. Örnek Üyeler varsa aidat kayıtları ekleyelim
  const members = await prisma.industryMember.findMany({ take: 5 })
  if (members.length > 0) {
    console.log('💰 Örnek aidat kayıtları ekleniyor...')
    const currentYear = 2024
    let dueCount = 0

    for (const member of members) {
      // Her üye için 2024 yıllık aidatı
      const statuses = ['PAID', 'PENDING', 'OVERDUE']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      await prisma.memberDue.create({
        data: {
          memberId: member.id,
          year: currentYear,
          month: null, // Yıllık aidat
          amount: 5000.00,
          status: randomStatus,
          dueDate: new Date('2024-03-31'),
          paidDate: randomStatus === 'PAID' ? new Date('2024-03-15') : null,
          paidAmount: randomStatus === 'PAID' ? 5000.00 : null,
          paymentMethod: randomStatus === 'PAID' ? 'Havale' : null,
          receiptNo: randomStatus === 'PAID' ? `MKB-2024-${1000 + member.id}` : null
        }
      })
      dueCount++
    }
    console.log(`   ✓ ${dueCount} aidat kaydı eklendi\n`)
  }

  // 6. Örnek Aylık Giderler
  console.log('📊 Örnek aylık giderler ekleniyor...')
  const expenses = [
    // Aralık 2024 giderleri
    { year: 2024, month: 12, category: 'RENT', description: 'Ofis Kirası - Aralık', amount: 25000.00, isPaid: true, paidDate: new Date('2024-12-01'), vendor: 'ABC Gayrimenkul', invoiceNo: 'KR-2024-12' },
    { year: 2024, month: 12, category: 'UTILITIES', description: 'Elektrik Faturası', amount: 3500.00, isPaid: true, paidDate: new Date('2024-12-10'), vendor: 'İGDAŞ', invoiceNo: 'EL-2024-12' },
    { year: 2024, month: 12, category: 'UTILITIES', description: 'Doğalgaz Faturası', amount: 2800.00, isPaid: false, dueDate: new Date('2024-12-25'), vendor: 'İGDAŞ' },
    { year: 2024, month: 12, category: 'SALARY', description: 'Personel Maaşları', amount: 45000.00, isPaid: true, paidDate: new Date('2024-12-28'), vendor: 'Personel' },
    { year: 2024, month: 12, category: 'OFFICE', description: 'Kırtasiye ve Ofis Malzemeleri', amount: 1200.00, isPaid: true, paidDate: new Date('2024-12-05'), vendor: 'Metro Kırtasiye', invoiceNo: 'OFS-2024-112' },
    { year: 2024, month: 12, category: 'EVENTS', description: 'Yılsonu Toplantısı Organizasyonu', amount: 8500.00, isPaid: false, dueDate: new Date('2024-12-30'), vendor: 'Etkinlik A.Ş.' },

    // Kasım 2024 giderleri
    { year: 2024, month: 11, category: 'RENT', description: 'Ofis Kirası - Kasım', amount: 25000.00, isPaid: true, paidDate: new Date('2024-11-01'), vendor: 'ABC Gayrimenkul', invoiceNo: 'KR-2024-11' },
    { year: 2024, month: 11, category: 'UTILITIES', description: 'Elektrik Faturası', amount: 2900.00, isPaid: true, paidDate: new Date('2024-11-12'), vendor: 'İGDAŞ', invoiceNo: 'EL-2024-11' },
    { year: 2024, month: 11, category: 'SALARY', description: 'Personel Maaşları', amount: 45000.00, isPaid: true, paidDate: new Date('2024-11-28'), vendor: 'Personel' },
    { year: 2024, month: 11, category: 'MARKETING', description: 'Sosyal Medya Reklamları', amount: 5000.00, isPaid: true, paidDate: new Date('2024-11-15'), vendor: 'Dijital Ajans', invoiceNo: 'DJT-2024-045' },
    { year: 2024, month: 11, category: 'TRAVEL', description: 'Fuar Ziyareti Seyahat Masrafları', amount: 12000.00, isPaid: true, paidDate: new Date('2024-11-20'), vendor: 'Çeşitli' },
    { year: 2024, month: 11, category: 'LEGAL', description: 'Hukuki Danışmanlık Ücreti', amount: 7500.00, isPaid: true, paidDate: new Date('2024-11-25'), vendor: 'Hukuk Bürosu', invoiceNo: 'HKK-2024-089' },

    // Ekim 2024 giderleri
    { year: 2024, month: 10, category: 'RENT', description: 'Ofis Kirası - Ekim', amount: 25000.00, isPaid: true, paidDate: new Date('2024-10-01'), vendor: 'ABC Gayrimenkul', invoiceNo: 'KR-2024-10' },
    { year: 2024, month: 10, category: 'INSURANCE', description: 'Yıllık Sigorta Primi', amount: 15000.00, isPaid: true, paidDate: new Date('2024-10-10'), vendor: 'Sigorta A.Ş.', invoiceNo: 'SIG-2024-001' },
    { year: 2024, month: 10, category: 'SALARY', description: 'Personel Maaşları', amount: 45000.00, isPaid: true, paidDate: new Date('2024-10-28'), vendor: 'Personel' }
  ]

  for (const expense of expenses) {
    await prisma.monthlyExpense.create({ data: expense })
  }
  console.log(`   ✓ ${expenses.length} gider kaydı eklendi\n`)

  console.log('✅ Tüm örnek veriler başarıyla eklendi!')
}

main()
  .catch((e) => {
    console.error('Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
