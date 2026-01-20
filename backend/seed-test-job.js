const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedTestJob() {
  try {
    console.log('🔍 Firma profilleri kontrol ediliyor...');

    // KYSD üyesi bir firma bul
    let companyProfile = await prisma.userCompanyProfile.findFirst({
      where: {
        NOT: {
          memberId: null
        }
      }
    });

    // Eğer KYSD üyesi firma yoksa, test firma oluştur
    if (!companyProfile) {
      console.log('⚠️  KYSD üyesi firma bulunamadı. Test firma oluşturuluyor...');

      // Test kullanıcıyı kontrol et veya oluştur
      let testUser = await prisma.user.findUnique({
        where: { email: 'test-firma@kysd.com' }
      });

      if (!testUser) {
        testUser = await prisma.user.create({
          data: {
            name: 'Test Firma Kullanıcı',
            email: 'test-firma@kysd.com',
            password: '$2a$10$abcdefghijklmnopqrstuvwxyz123456', // dummy hash
            role: 'MEMBER',
            isActive: true
          }
        });
        console.log('✅ Test kullanıcı oluşturuldu');
      } else {
        console.log('✅ Mevcut test kullanıcı bulundu');
      }

      // Mevcut bir IndustryMember bul veya oluştur
      let industryMember = await prisma.industryMember.findFirst();

      if (!industryMember) {
        // Test IndustryMember oluştur
        industryMember = await prisma.industryMember.create({
          data: {
            groupId: 1, // Varsayılan grup
            companyName: 'KYSD Test Konfeksiyon A.Ş.',
            contactPerson: 'Ahmet Yılmaz',
            phone: '+90 212 555 01 01',
            email: 'info@test-konfeksiyon.com',
            membershipStatus: 'ACTIVE'
          }
        });
        console.log('✅ Test IndustryMember oluşturuldu');
      }

      // Test firma profili oluştur
      companyProfile = await prisma.userCompanyProfile.create({
        data: {
          userId: testUser.id,
          memberId: industryMember.id,
          companyName: 'KYSD Test Konfeksiyon A.Ş.',
          taxNumber: '1234567890',
          phone: '+90 212 555 01 01',
          address: 'Test Mahallesi, Test Caddesi, No: 123, Bağcılar/İstanbul',
          website: 'https://test-konfeksiyon.com',
          description: 'Konfeksiyon sektöründe 10+ yıldır hizmet veren öncü firmamız, kaliteli üretim ve müşteri memnuniyeti odaklı çalışmaktadır.',
          isVerified: true
        }
      });
      console.log('✅ Test firma oluşturuldu:', companyProfile.companyName);
    } else {
      console.log('✅ Mevcut KYSD üyesi firma bulundu:', companyProfile.companyName);
    }

    // Test iş ilanları oluştur
    console.log('📝 Test iş ilanları oluşturuluyor...');

    const jobs = [
      {
        title: 'Kıdemli Dikiş Operatörü',
        slug: 'kidemli-dikis-operatoru',
        description: `
          <p>Konfeksiyon sektöründe faaliyet gösteren firmamızda çalışmak üzere deneyimli dikiş operatörleri arıyoruz.</p>
          <h3>İş Tanımı:</h3>
          <ul>
            <li>Düz ve overlok makinelerinde çalışabilme</li>
            <li>Konfeksiyon ürünlerinin dikimi</li>
            <li>Kalite kontrol süreçlerine uyum</li>
            <li>Günlük üretim hedeflerine ulaşma</li>
          </ul>
        `,
        requirements: `
          <ul>
            <li>En az 3 yıl dikiş operatörlüğü deneyimi</li>
            <li>Düz dikiş ve overlok makinelerinde uzmanlık</li>
            <li>Hızlı ve kaliteli çalışabilme</li>
            <li>Takım çalışmasına yatkınlık</li>
          </ul>
        `,
        responsibilities: `
          <ul>
            <li>Verilen modelleri teknik çizimlere göre dikmek</li>
            <li>Üretim süreçlerinde kalite standartlarına uymak</li>
            <li>Günlük üretim raporlarını takip etmek</li>
          </ul>
        `,
        benefits: `
          <ul>
            <li>SGK + özel sağlık sigortası</li>
            <li>Yemek kartı</li>
            <li>Yıllık performans primi</li>
            <li>Servis imkanı</li>
          </ul>
        `,
        jobType: 'FULL_TIME',
        experienceLevel: 'MID',
        city: 'İstanbul',
        district: 'Bağcılar',
        isRemote: false,
        salaryMin: 25000,
        salaryMax: 35000,
        showSalary: true,
        positions: 5,
        companyId: companyProfile.id,
        companyName: companyProfile.companyName,
        companyLogo: null,
        status: 'ACTIVE',
        isActive: true,
        isFeatured: true,
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 gün
      },
      {
        title: 'Üretim Müdürü',
        slug: 'uretim-muduru',
        description: `
          <p>Konfeksiyon üretim süreçlerini yönetecek deneyimli bir üretim müdürü arıyoruz.</p>
          <h3>İş Tanımı:</h3>
          <ul>
            <li>Üretim planlaması ve koordinasyonu</li>
            <li>Kalite kontrol süreçlerinin yönetimi</li>
            <li>Ekip yönetimi ve geliştirme</li>
            <li>Üretim maliyetlerinin optimizasyonu</li>
          </ul>
        `,
        requirements: `
          <ul>
            <li>Tekstil/Konfeksiyon mühendisliği mezunu</li>
            <li>En az 5 yıl üretim yönetimi deneyimi</li>
            <li>Lean manufacturing bilgisi</li>
            <li>ERP sistemleri deneyimi</li>
            <li>Ekip yönetimi becerileri</li>
          </ul>
        `,
        responsibilities: `
          <ul>
            <li>Üretim süreçlerinin planlanması ve yönetimi</li>
            <li>Kalite standartlarının uygulanması</li>
            <li>Üretim ekiplerinin koordinasyonu</li>
            <li>Maliyet analizi ve raporlama</li>
          </ul>
        `,
        benefits: `
          <ul>
            <li>Rekabetçi maaş</li>
            <li>Özel sağlık sigortası (aile dahil)</li>
            <li>Yıllık performans primi</li>
            <li>Araç tahsisi</li>
            <li>Eğitim ve gelişim programları</li>
          </ul>
        `,
        jobType: 'FULL_TIME',
        experienceLevel: 'SENIOR',
        city: 'İstanbul',
        district: 'Bağcılar',
        isRemote: false,
        salaryMin: 70000,
        salaryMax: 100000,
        showSalary: true,
        positions: 1,
        companyId: companyProfile.id,
        companyName: companyProfile.companyName,
        status: 'ACTIVE',
        isActive: true,
        isFeatured: false,
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 gün
      },
      {
        title: 'Kalite Kontrol Elemanı',
        slug: 'kalite-kontrol-elemani',
        description: `
          <p>Üretim süreçlerinde kalite kontrol yapacak titiz ve detaycı çalışanlar arıyoruz.</p>
          <h3>İş Tanımı:</h3>
          <ul>
            <li>Üretim sürecinde kalite kontrolleri</li>
            <li>Hatalı ürünlerin tespiti</li>
            <li>Kalite raporlarının hazırlanması</li>
            <li>Standartlara uygunluk kontrolü</li>
          </ul>
        `,
        requirements: `
          <ul>
            <li>Lise veya önlisans mezunu</li>
            <li>Kalite kontrol deneyimi (tercihen)</li>
            <li>Detaylara dikkat</li>
            <li>Bilgisayar kullanımı</li>
          </ul>
        `,
        jobType: 'FULL_TIME',
        experienceLevel: 'JUNIOR',
        city: 'İstanbul',
        district: 'Güngören',
        isRemote: false,
        salaryMin: 20000,
        salaryMax: 28000,
        showSalary: true,
        positions: 3,
        companyId: companyProfile.id,
        companyName: companyProfile.companyName,
        status: 'ACTIVE',
        isActive: true,
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Stajyer Tasarımcı',
        slug: 'stajyer-tasarimci',
        description: `
          <p>Moda tasarım bölümü öğrencilerine staj imkanı sunuyoruz.</p>
          <h3>İş Tanımı:</h3>
          <ul>
            <li>Tasarım ekibine destek</li>
            <li>Trend araştırması</li>
            <li>Teknik çizim hazırlama</li>
            <li>Kumaş ve aksesuar araştırması</li>
          </ul>
        `,
        requirements: `
          <ul>
            <li>Moda Tasarımı veya Tekstil Tasarımı öğrencisi</li>
            <li>Adobe Photoshop, Illustrator bilgisi</li>
            <li>Yaratıcı düşünme becerisi</li>
          </ul>
        `,
        jobType: 'INTERNSHIP',
        experienceLevel: 'ENTRY',
        city: 'İstanbul',
        district: 'Bağcılar',
        isRemote: false,
        showSalary: false,
        positions: 2,
        companyId: companyProfile.id,
        companyName: companyProfile.companyName,
        status: 'ACTIVE',
        isActive: true,
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const jobData of jobs) {
      const job = await prisma.jobPosting.create({
        data: jobData
      });
      console.log(`✅ İlan oluşturuldu: ${job.title}`);
    }

    console.log('');
    console.log('🎉 Test ilanları başarıyla oluşturuldu!');
    console.log('🌐 Kariyer sayfasını görüntüle: http://localhost:3000/kariyer');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestJob();
