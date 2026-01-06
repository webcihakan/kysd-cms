const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Yeni menü yapısı
const menuStructure = [
  {
    title: 'Kurumsal',
    url: null,
    order: 1,
    children: [
      { title: 'Hakkımızda', url: '/sayfa/hakkimizda', order: 1 },
      { title: 'Vizyon & Misyon', url: '/sayfa/vizyon-misyon', order: 2 },
      { title: 'Yönetim Kurulu', url: '/yonetim-kurulu', order: 3 },
      { title: 'Tüzük', url: '/sayfa/tuzuk', order: 4 }
    ]
  },
  {
    title: 'Üyelik',
    url: null,
    order: 2,
    children: [
      { title: 'Neden Üye Olmalıyım?', url: '/sayfa/neden-uye-olmaliyim', order: 1 },
      { title: 'Üyelik Başvurusu', url: '/uyelik-basvurusu', order: 2 },
      { title: 'Üye Rehberi', url: '/uyeler', order: 3 }
    ]
  },
  {
    title: 'Sektörel Bilgiler',
    url: null,
    order: 3,
    children: [
      { title: 'Sektör Raporları', url: '/sayfa/sektor-raporlari', order: 1 },
      { title: 'Mevzuat', url: '/sayfa/mevzuat', order: 2 },
      { title: 'Teşvik ve Destekler', url: '/sayfa/tesvik-destekler', order: 3 }
    ]
  },
  {
    title: 'Faaliyetler',
    url: null,
    order: 4,
    children: [
      { title: 'Eğitimler & Seminerler', url: '/sayfa/egitimler', order: 1 },
      { title: 'Projeler', url: '/sayfa/projeler', order: 2 },
      { title: 'Fuarlar', url: '/sayfa/fuarlar', order: 3 }
    ]
  },
  {
    title: 'Medya',
    url: null,
    order: 5,
    children: [
      { title: 'Haberler', url: '/haberler', order: 1 },
      { title: 'Duyurular', url: '/duyurular', order: 2 },
      { title: 'Galeri', url: '/sayfa/galeri', order: 3 }
    ]
  },
  {
    title: 'İletişim',
    url: '/iletisim',
    order: 6,
    children: []
  }
];

// Sayfa oluşturma için şablon içerikler
const pageTemplates = {
  'hakkimizda': {
    title: 'Hakkımızda',
    content: `<h2>KYSD Hakkında</h2>
<p>Konfeksiyon Yan Sanayi Derneği (KYSD), Türkiye'nin önde gelen konfeksiyon yan sanayi kuruluşlarını bir araya getiren köklü bir meslek örgütüdür.</p>
<p>1990 yılından bu yana sektörün gelişimi için çalışmaktayız.</p>
<h3>Tarihçemiz</h3>
<p>Derneğimiz, konfeksiyon yan sanayinin ihtiyaçlarını karşılamak ve sektörün sorunlarına çözüm üretmek amacıyla kurulmuştur.</p>`,
    excerpt: 'Konfeksiyon Yan Sanayi Derneği hakkında bilgi edinin.'
  },
  'vizyon-misyon': {
    title: 'Vizyon & Misyon',
    content: `<h2>Vizyonumuz</h2>
<p>Türk konfeksiyon yan sanayini dünya standartlarına taşıyarak, sektörümüzün küresel rekabet gücünü artırmak.</p>
<h2>Misyonumuz</h2>
<ul>
<li>Üyelerimizin çıkarlarını korumak ve geliştirmek</li>
<li>Sektörel işbirliğini güçlendirmek</li>
<li>Yenilikçi çözümler üretmek</li>
<li>Uluslararası pazarlarda etkinliğimizi artırmak</li>
</ul>`,
    excerpt: 'KYSD vizyon ve misyon değerleri.'
  },
  'tuzuk': {
    title: 'Tüzük',
    content: `<h2>Dernek Tüzüğü</h2>
<p>Konfeksiyon Yan Sanayi Derneği Tüzüğü, derneğin kuruluş amacı, üyelik koşulları, organları ve çalışma esaslarını düzenlemektedir.</p>
<p><em>Tüzük tam metni için dernek sekreterliği ile iletişime geçebilirsiniz.</em></p>`,
    excerpt: 'KYSD Dernek Tüzüğü'
  },
  'neden-uye-olmaliyim': {
    title: 'Neden Üye Olmalıyım?',
    content: `<h2>KYSD Üyeliğinin Avantajları</h2>
<ul>
<li><strong>Sektörel Temsil:</strong> Konfeksiyon yan sanayinin güçlü sesi olun</li>
<li><strong>Networking:</strong> Sektördeki diğer firmalarla işbirliği fırsatları</li>
<li><strong>Bilgi Paylaşımı:</strong> Sektörel raporlar, mevzuat güncellemeleri</li>
<li><strong>Eğitim İmkanları:</strong> Ücretsiz veya indirimli eğitim ve seminerler</li>
<li><strong>Fuar Katılımı:</strong> Toplu fuar katılım organizasyonları</li>
<li><strong>Lobi Faaliyetleri:</strong> Sektörün sorunlarının yetkili makamlara iletilmesi</li>
</ul>`,
    excerpt: 'KYSD üyeliğinin sağladığı avantajlar ve fırsatlar.'
  },
  'sektor-raporlari': {
    title: 'Sektör Raporları',
    content: `<h2>Sektör Raporları ve Analizler</h2>
<p>Konfeksiyon yan sanayi sektörüne ait güncel raporlar ve analizler bu sayfada paylaşılmaktadır.</p>
<p><em>Raporlar yakında eklenecektir.</em></p>`,
    excerpt: 'Konfeksiyon yan sanayi sektör raporları.'
  },
  'mevzuat': {
    title: 'Mevzuat',
    content: `<h2>Sektörel Mevzuat</h2>
<p>Konfeksiyon yan sanayini ilgilendiren yasa, yönetmelik ve tebliğler hakkında güncel bilgiler.</p>
<p><em>Mevzuat bilgileri yakında eklenecektir.</em></p>`,
    excerpt: 'Sektörü ilgilendiren yasal düzenlemeler.'
  },
  'tesvik-destekler': {
    title: 'Teşvik ve Destekler',
    content: `<h2>Devlet Teşvikleri ve Destekler</h2>
<p>Sektörümüze yönelik yatırım teşvikleri, hibe programları ve devlet destekleri hakkında bilgi edinin.</p>
<p><em>Detaylı bilgiler yakında eklenecektir.</em></p>`,
    excerpt: 'Sektöre yönelik teşvik ve destek programları.'
  },
  'egitimler': {
    title: 'Eğitimler & Seminerler',
    content: `<h2>Eğitim ve Seminer Programları</h2>
<p>KYSD tarafından düzenlenen eğitim ve seminer programları hakkında bilgi alın.</p>
<p><em>Eğitim takvimi yakında güncellenecektir.</em></p>`,
    excerpt: 'KYSD eğitim ve seminer programları.'
  },
  'projeler': {
    title: 'Projeler',
    content: `<h2>Projelerimiz</h2>
<p>UR-GE, AB projeleri ve diğer sektörel projeler hakkında bilgi edinin.</p>
<p><em>Proje detayları yakında eklenecektir.</em></p>`,
    excerpt: 'KYSD projeleri ve girişimleri.'
  },
  'fuarlar': {
    title: 'Fuarlar',
    content: `<h2>Fuar Takvimi</h2>
<p>Sektörel fuarlar ve KYSD toplu katılım organizasyonları hakkında bilgi.</p>
<p><em>Fuar takvimi yakında güncellenecektir.</em></p>`,
    excerpt: 'Sektörel fuar takvimi ve katılım bilgileri.'
  },
  'galeri': {
    title: 'Galeri',
    content: `<h2>Fotoğraf ve Video Galerisi</h2>
<p>Etkinliklerimizden fotoğraf ve videolar.</p>
<p><em>Galeri içeriği yakında eklenecektir.</em></p>`,
    excerpt: 'KYSD etkinlik fotoğrafları ve videoları.'
  }
};

async function main() {
  console.log('=== MEVCUT MENÜLER SİLİNİYOR ===\n');

  // Önce alt menüleri sil
  await prisma.menu.deleteMany({
    where: { parentId: { not: null } }
  });

  // Sonra ana menüleri sil
  await prisma.menu.deleteMany({});

  console.log('✓ Tüm menüler silindi\n');

  console.log('=== SAYFALAR OLUŞTURULUYOR ===\n');

  // Eksik sayfaları oluştur
  for (const [slug, data] of Object.entries(pageTemplates)) {
    const existing = await prisma.page.findFirst({
      where: { slug }
    });

    if (!existing) {
      await prisma.page.create({
        data: {
          title: data.title,
          slug: slug,
          content: data.content,
          excerpt: data.excerpt,
          isActive: true
        }
      });
      console.log(`  + Sayfa oluşturuldu: ${data.title}`);
    } else {
      console.log(`  ○ Sayfa mevcut: ${data.title}`);
    }
  }

  console.log('\n=== YENİ MENÜ YAPISI OLUŞTURULUYOR ===\n');

  // Menüleri oluştur
  for (const menu of menuStructure) {
    const parentMenu = await prisma.menu.create({
      data: {
        title: menu.title,
        url: menu.url,
        order: menu.order,
        isActive: true,
        target: '_self'
      }
    });

    console.log(`[${menu.order}] ${menu.title}`);

    // Alt menüleri oluştur
    for (const child of menu.children) {
      await prisma.menu.create({
        data: {
          title: child.title,
          url: child.url,
          parentId: parentMenu.id,
          order: child.order,
          isActive: true,
          target: '_self'
        }
      });
      console.log(`    - ${child.title}`);
    }
  }

  console.log('\n=== TAMAMLANDI ===\n');

  // Özet
  const menuCount = await prisma.menu.count();
  const pageCount = await prisma.page.count();
  console.log(`Toplam ${menuCount} menü ve ${pageCount} sayfa mevcut.`);
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
