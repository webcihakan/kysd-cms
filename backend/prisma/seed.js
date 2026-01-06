const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seed işlemi başlıyor...');

  // Admin kullanıcı
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kysd.org.tr' },
    update: {},
    create: {
      email: 'admin@kysd.org.tr',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  console.log('Admin kullanıcı oluşturuldu:', admin.email);

  // Site ayarları
  const settings = [
    { key: 'site_name', value: 'KYSD - Konfeksiyon Yan Sanayi Derneği', type: 'text', group: 'general' },
    { key: 'site_description', value: 'Konfeksiyon Yan Sanayi Derneği Resmi Web Sitesi', type: 'text', group: 'general' },
    { key: 'contact_email', value: 'info@kysd.org.tr', type: 'text', group: 'contact' },
    { key: 'contact_phone', value: '+90 212 XXX XX XX', type: 'text', group: 'contact' },
    { key: 'contact_address', value: 'İstanbul, Türkiye', type: 'textarea', group: 'contact' },
    { key: 'social_facebook', value: '', type: 'text', group: 'social' },
    { key: 'social_twitter', value: '', type: 'text', group: 'social' },
    { key: 'social_instagram', value: '', type: 'text', group: 'social' },
    { key: 'social_linkedin', value: '', type: 'text', group: 'social' }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    });
  }

  console.log('Site ayarları oluşturuldu');

  // Menü yapısı - sadece menü yoksa oluştur
  const existingMenus = await prisma.menu.count();

  if (existingMenus === 0) {
    const kurumsal = await prisma.menu.create({
      data: {
        title: 'Kurumsal',
        url: '#',
        order: 1,
        children: {
          create: [
            { title: 'KYSD Yönetim Kurulu Listesi', url: '/sayfa/kysd-yonetim-kurulu-listesi', order: 1 },
            { title: 'Kuruluş ve Amaçlarımız', url: '/sayfa/kurulus-ve-amaclarimiz', order: 2 },
            { title: 'Faaliyetlerimiz', url: '/sayfa/faaliyetlerimiz', order: 3 },
            { title: 'Tüzüğümüz', url: '/sayfa/tuzugumuz', order: 4 }
          ]
        }
      }
    });

    const sanayiGruplari = await prisma.menu.create({
      data: {
        title: 'Sanayi Grupları ve Üyeler',
        url: '#',
        order: 2,
        children: {
          create: [
            { title: 'Askı Sanayi Grubu Üyeleri', url: '/sanayi-grubu/aski-sanayi-grubu-uyeleri', order: 1 },
            { title: 'Dar Dokuma ve Örme Sanayi', url: '/sanayi-grubu/dar-dokuma-ve-orme-sanayi', order: 2 },
            { title: 'Düğme – Toka ve Metal Aksesuar Sanayi', url: '/sanayi-grubu/dugme-toka-ve-metal-aksesuar-sanayi', order: 3 },
            { title: 'Etiket Sanayi', url: '/sanayi-grubu/etiket-sanayi', order: 4 },
            { title: 'Fermuar Sanayi Grubu Üyeleri', url: '/sanayi-grubu/fermuar-sanayi-grubu-uyeleri', order: 5 },
            { title: 'İplik Sanayi', url: '/sanayi-grubu/iplik-sanayi', order: 6 },
            { title: 'Kapitone Sanayi', url: '/sanayi-grubu/kapitone-sanayi', order: 7 },
            { title: 'Tele Elyaf ve Vatka Sanayi', url: '/sanayi-grubu/tele-elyaf-ve-vatka-sanayi', order: 8 }
          ]
        }
      }
    });

    await prisma.menu.createMany({
      data: [
        { title: 'KYSD Akademi', url: '/kysd-akademi', order: 3 },
        { title: 'Duyurular', url: '/duyurular', order: 4 },
        { title: 'Haberler', url: '/haberler', order: 5 },
        { title: 'İletişim', url: '/iletisim', order: 6 }
      ]
    });

    console.log('Menü yapısı oluşturuldu');
  } else {
    console.log('Menüler zaten mevcut, atlanıyor');
  }

  // Sanayi Grupları
  const industryGroups = [
    { name: 'Askı Sanayi Grubu Üyeleri', slug: 'aski-sanayi-grubu-uyeleri', order: 1 },
    { name: 'Dar Dokuma ve Örme Sanayi', slug: 'dar-dokuma-ve-orme-sanayi', order: 2 },
    { name: 'Düğme – Toka ve Metal Aksesuar Sanayi', slug: 'dugme-toka-ve-metal-aksesuar-sanayi', order: 3 },
    { name: 'Etiket Sanayi', slug: 'etiket-sanayi', order: 4 },
    { name: 'Fermuar Sanayi Grubu Üyeleri', slug: 'fermuar-sanayi-grubu-uyeleri', order: 5 },
    { name: 'İplik Sanayi', slug: 'iplik-sanayi', order: 6 },
    { name: 'Kapitone Sanayi', slug: 'kapitone-sanayi', order: 7 },
    { name: 'Tele Elyaf ve Vatka Sanayi', slug: 'tele-elyaf-ve-vatka-sanayi', order: 8 }
  ];

  for (const group of industryGroups) {
    await prisma.industryGroup.upsert({
      where: { slug: group.slug },
      update: {},
      create: group
    });
  }

  console.log('Sanayi grupları oluşturuldu');

  // Örnek sayfalar
  const pages = [
    {
      title: 'KYSD Yönetim Kurulu Listesi',
      slug: 'kysd-yonetim-kurulu-listesi',
      content: '<h2>KYSD Yönetim Kurulu</h2><p>Yönetim kurulu üyelerimiz...</p>',
      excerpt: 'KYSD Yönetim Kurulu üyeleri hakkında bilgi'
    },
    {
      title: 'Kuruluş ve Amaçlarımız',
      slug: 'kurulus-ve-amaclarimiz',
      content: '<h2>Kuruluş</h2><p>Derneğimiz hakkında...</p>',
      excerpt: 'Derneğimizin kuruluş hikayesi ve amaçları'
    },
    {
      title: 'Faaliyetlerimiz',
      slug: 'faaliyetlerimiz',
      content: '<h2>Faaliyetlerimiz</h2><p>Gerçekleştirdiğimiz faaliyetler...</p>',
      excerpt: 'KYSD faaliyetleri'
    },
    {
      title: 'Tüzüğümüz',
      slug: 'tuzugumuz',
      content: '<h2>Dernek Tüzüğü</h2><p>Tüzük maddeleri...</p>',
      excerpt: 'KYSD dernek tüzüğü'
    },
    {
      title: 'KYSD Akademi',
      slug: 'kysd-akademi',
      content: '<h2>KYSD Akademi</h2><p>Eğitim programlarımız...</p>',
      excerpt: 'KYSD Akademi eğitim programları'
    }
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page
    });
  }

  console.log('Örnek sayfalar oluşturuldu');

  console.log('Seed işlemi tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
