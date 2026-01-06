const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Slug oluşturma fonksiyonu
const generateSlug = (text) => {
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };

  return text
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

async function seedLegislation() {
  console.log('Mevzuatlar ekleniyor...\n');

  const legislations = [
    // ========== KANUNLAR ==========
    {
      title: '5174 Sayılı Türkiye Odalar ve Borsalar Birliği Kanunu',
      description: 'Odalar, borsalar ve bunların birliklerinin kuruluşu, organları, faaliyetleri ve denetimlerine ilişkin esasları düzenler.',
      category: 'law',
      date: new Date('2004-06-01'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5174.pdf',
      tags: JSON.stringify(['Odalar', 'Birlikler', 'Ticaret']),
      order: 1
    },
    {
      title: '5253 Sayılı Dernekler Kanunu',
      description: 'Derneklerin kuruluşu, faaliyetleri, denetimi ve cezai hükümlerini içeren temel kanun.',
      category: 'law',
      date: new Date('2004-11-23'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5253.pdf',
      tags: JSON.stringify(['Dernekler', 'Sivil Toplum', 'Tüzel Kişilik']),
      isImportant: true,
      order: 2
    },
    {
      title: '6102 Sayılı Türk Ticaret Kanunu',
      description: 'Ticari işletme, şirketler, kıymetli evrak ve deniz ticaretine ilişkin hükümleri düzenler.',
      category: 'law',
      date: new Date('2011-02-14'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6102.pdf',
      tags: JSON.stringify(['Ticaret', 'Şirketler', 'İşletme']),
      order: 3
    },
    {
      title: '4857 Sayılı İş Kanunu',
      description: 'İşçi ve işveren ilişkilerini, çalışma koşullarını ve iş güvenliğini düzenleyen temel kanun.',
      category: 'law',
      date: new Date('2003-06-10'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.pdf',
      tags: JSON.stringify(['İş Hukuku', 'Çalışma', 'İşçi Hakları']),
      order: 4
    },
    {
      title: '2872 Sayılı Çevre Kanunu',
      description: 'Çevrenin korunması, iyileştirilmesi; kara, hava, su, toprak kirliliğinin önlenmesi; atık yönetimi ve çevresel etki değerlendirmesi hükümlerini içerir.',
      category: 'law',
      date: new Date('1983-08-11'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.2872.pdf',
      tags: JSON.stringify(['Çevre', 'Atık Yönetimi', 'Sürdürülebilirlik']),
      isImportant: true,
      order: 5
    },
    {
      title: '6502 Sayılı Tüketicinin Korunması Hakkında Kanun',
      description: 'Tüketici işlemleri ile tüketiciye yönelik uygulamalar, etiketleme, garanti ve iade koşullarını düzenler.',
      category: 'law',
      date: new Date('2013-11-28'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6502.pdf',
      tags: JSON.stringify(['Tüketici', 'Garanti', 'Etiketleme']),
      order: 6
    },
    {
      title: '5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu',
      description: 'İşçi ve işverenlerin sosyal güvenlik yükümlülükleri, prim hesaplamaları ve iş kazası prosedürlerini içerir.',
      category: 'law',
      date: new Date('2006-06-16'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5510.pdf',
      tags: JSON.stringify(['SGK', 'Sigorta', 'İşveren Yükümlülükleri']),
      order: 7
    },
    {
      title: '6331 Sayılı İş Sağlığı ve Güvenliği Kanunu',
      description: 'İşyerlerinde iş sağlığı ve güvenliğinin sağlanması, mevcut sağlık ve güvenlik şartlarının iyileştirilmesi için işveren ve çalışanların görev, yetki ve yükümlülüklerini düzenler.',
      category: 'law',
      date: new Date('2012-06-30'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6331.pdf',
      tags: JSON.stringify(['İSG', 'İş Güvenliği', 'Risk Değerlendirme']),
      isImportant: true,
      order: 8
    },

    // ========== YÖNETMELİKLER ==========
    {
      title: 'Dernekler Yönetmeliği',
      description: 'Derneklerin kuruluşu, tescili, faaliyetleri ve denetimi ile ilgili usul ve esasları belirler.',
      category: 'regulation',
      date: new Date('2005-03-31'),
      source: 'Resmi Gazete',
      sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=8038',
      tags: JSON.stringify(['Dernekler', 'Tescil', 'Denetim']),
      isImportant: true,
      order: 10
    },
    {
      title: 'Tekstil Elyaf İsimleri ve Etiketleme Yönetmeliği',
      description: 'Tekstil ürünlerinin elyaf bileşimlerinin belirlenmesi, etiketlenmesi ve işaretlenmesine ilişkin usul ve esasları düzenler. AB mevzuatı ile uyumlu.',
      category: 'regulation',
      date: new Date('2024-06-15'),
      source: 'Ticaret Bakanlığı',
      sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=51243',
      tags: JSON.stringify(['Tekstil', 'Etiketleme', 'Elyaf Bileşimi']),
      isImportant: true,
      order: 11
    },
    {
      title: 'CE İşaretlemesi Yönetmeliği',
      description: 'Ürünlerin CE işareti taşıma zorunluluğu, uygunluk değerlendirme prosedürleri ve piyasa gözetimi kurallarını belirler.',
      category: 'regulation',
      date: new Date('2022-04-23'),
      source: 'Ticaret Bakanlığı',
      sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=36987',
      tags: JSON.stringify(['CE İşareti', 'Uygunluk', 'Piyasa Gözetimi']),
      order: 12
    },
    {
      title: 'İhracat Rejimi Kararı',
      description: 'İhracatın düzenlenmesi ve denetlenmesine ilişkin usul ve esasları belirler.',
      category: 'regulation',
      date: new Date('2023-05-20'),
      source: 'Ticaret Bakanlığı',
      sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=49756',
      tags: JSON.stringify(['İhracat', 'Dış Ticaret', 'Gümrük']),
      order: 13
    },
    {
      title: 'Ürün Güvenliği ve Teknik Düzenlemeler Kanunu Uygulama Yönetmeliği',
      description: 'Piyasaya arz edilen ürünlerin güvenlik ve denetim usullerini, teknik düzenlemelere uygunluk prosedürlerini düzenler.',
      category: 'regulation',
      date: new Date('2021-08-10'),
      source: 'Ticaret Bakanlığı',
      tags: JSON.stringify(['Ürün Güvenliği', 'Teknik Düzenleme', 'Denetim']),
      order: 14
    },
    {
      title: 'Gümrük Yönetmeliği (Güncel)',
      description: 'Gümrük işlemlerinin yürütülmesi, beyanname düzenlenmesi, menşe kuralları ve tercihli ticaret anlaşmalarına ilişkin usul ve esasları düzenler.',
      category: 'regulation',
      date: new Date('2024-01-10'),
      source: 'Ticaret Bakanlığı',
      sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=13050',
      tags: JSON.stringify(['Gümrük', 'İthalat', 'İhracat', 'Menşe']),
      order: 15
    },
    {
      title: 'Kimyasalların Kaydı, Değerlendirilmesi, İzni ve Kısıtlanması Hakkında Yönetmelik (KKDİK)',
      description: 'Türkiye\'nin REACH benzeri kimyasal mevzuatı. Tekstil ürünlerinde kullanılan kimyasalların kaydı ve kısıtlamaları.',
      category: 'regulation',
      date: new Date('2023-12-23'),
      source: 'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı',
      sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=28848',
      tags: JSON.stringify(['Kimyasal', 'KKDİK', 'REACH', 'Çevre']),
      isImportant: true,
      order: 16
    },
    {
      title: 'Atık Yönetimi Yönetmeliği',
      description: 'Atıkların oluşumundan bertarafına kadar çevre ve insan sağlığına zarar vermeden yönetiminin sağlanmasına ilişkin usul ve esasları düzenler.',
      category: 'regulation',
      date: new Date('2015-04-02'),
      source: 'Çevre ve Şehircilik Bakanlığı',
      sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=20644',
      tags: JSON.stringify(['Atık', 'Geri Dönüşüm', 'Çevre']),
      order: 17
    },
    {
      title: 'Bazı Tekstil Ürünlerinin İthalatında Gözetim ve Korunma Önlemleri Yönetmeliği',
      description: 'Tekstil ve konfeksiyon ürünlerinin ithalatında uygulanan gözetim ve korunma önlemlerini düzenler.',
      category: 'regulation',
      date: new Date('2024-03-15'),
      source: 'Ticaret Bakanlığı',
      tags: JSON.stringify(['İthalat', 'Tekstil', 'Korunma Önlemi']),
      order: 18
    },

    // ========== GENELGELER ==========
    {
      title: 'İhracat Destekleri Hakkında Karar (2024)',
      description: 'Devlet destekli ihracat teşviklerinin güncel uygulama usul ve esaslarını açıklar. Fuar, pazar araştırması, marka ve tasarım destekleri dahil.',
      category: 'circular',
      date: new Date('2024-03-01'),
      source: 'Ticaret Bakanlığı',
      sourceUrl: 'https://www.ticaret.gov.tr/ihracat/destekler',
      tags: JSON.stringify(['İhracat', 'Teşvik', 'Destek', 'Fuar']),
      isImportant: true,
      order: 20
    },
    {
      title: 'KOSGEB KOBİ ve Girişimcilik Destekleri Uygulama Esasları',
      description: 'Küçük ve orta ölçekli işletmelere yönelik destek programlarının güncel uygulama esaslarını düzenler. Makine-teçhizat, yazılım ve eğitim destekleri dahil.',
      category: 'circular',
      date: new Date('2024-01-15'),
      source: 'KOSGEB',
      sourceUrl: 'https://www.kosgeb.gov.tr/site/tr/genel/destekler',
      tags: JSON.stringify(['KOBİ', 'Destek', 'Teşvik', 'KOSGEB']),
      order: 21
    },
    {
      title: 'Yurt Dışı Fuar Katılım Destekleri Genelgesi (2024)',
      description: 'Yurt dışı fuarlara milli veya bireysel katılımlarda sağlanan stand, nakliye ve tanıtım desteklerinin uygulama esaslarını belirler.',
      category: 'circular',
      date: new Date('2024-02-20'),
      source: 'Ticaret Bakanlığı',
      tags: JSON.stringify(['Fuar', 'Yurt Dışı', 'Destek', 'Stand']),
      isImportant: true,
      order: 22
    },
    {
      title: 'Türk Ürünlerinin Yurt Dışında Markalaşması (TURQUALITY) Genelgesi',
      description: 'Türk markalarının uluslararası pazarlarda konumlandırılması için sağlanan desteklerin uygulama esaslarını düzenler.',
      category: 'circular',
      date: new Date('2023-11-10'),
      source: 'Ticaret Bakanlığı',
      sourceUrl: 'https://www.ticaret.gov.tr/ihracat/destekler/turquality',
      tags: JSON.stringify(['TURQUALITY', 'Marka', 'İhracat', 'Pazarlama']),
      order: 23
    },
    {
      title: 'Ar-Ge ve Tasarım Merkezleri Destekleri Uygulama Genelgesi',
      description: 'Ar-Ge ve tasarım merkezlerine sağlanan vergi indirimi, SGK desteği ve diğer teşviklerin uygulama esaslarını belirler.',
      category: 'circular',
      date: new Date('2024-04-01'),
      source: 'Sanayi ve Teknoloji Bakanlığı',
      tags: JSON.stringify(['Ar-Ge', 'Tasarım', 'Teşvik', 'Vergi']),
      order: 24
    },
    {
      title: 'Yeşil Mutabakat Eylem Planı Uygulama Genelgesi',
      description: 'AB Yeşil Mutabakat\'ına uyum sürecinde Türk sanayicilerinin yapması gereken hazırlıklar ve destek mekanizmalarını açıklar.',
      category: 'circular',
      date: new Date('2024-06-01'),
      source: 'Ticaret Bakanlığı',
      tags: JSON.stringify(['Yeşil Mutabakat', 'Sürdürülebilirlik', 'AB Uyum']),
      isImportant: true,
      order: 25
    },

    // ========== ULUSLARARASI ==========
    {
      title: 'AB Tekstil Ürünleri Yönetmeliği (EU) 2024/1781',
      description: 'Avrupa Birliği\'ne ihraç edilen tekstil ürünlerinin uyması gereken teknik standartlar, elyaf bileşimi etiketleme gereksinimleri.',
      category: 'international',
      date: new Date('2024-06-01'),
      source: 'Avrupa Komisyonu',
      sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1781',
      tags: JSON.stringify(['AB', 'Tekstil', 'Etiketleme']),
      order: 30
    },
    {
      title: 'REACH Tüzüğü - Tekstil Kimyasalları Kısıtlamaları',
      description: 'AB\'de tekstil ürünlerinde kullanılması kısıtlanan veya yasaklanan kimyasallara ilişkin güncel düzenlemeler.',
      category: 'international',
      date: new Date('2024-01-01'),
      source: 'Avrupa Kimyasallar Ajansı (ECHA)',
      sourceUrl: 'https://echa.europa.eu/regulations/reach/legislation',
      tags: JSON.stringify(['REACH', 'Kimyasal', 'AB', 'Kısıtlama']),
      isImportant: true,
      order: 31
    },
    {
      title: 'Karbon Sınırda Düzenleme Mekanizması (CBAM) Tüzüğü',
      description: 'AB\'nin karbon sınır vergisi mekanizması. Tekstil sektörüne olası etkileri ve raporlama yükümlülükleri.',
      category: 'international',
      date: new Date('2024-01-01'),
      source: 'Avrupa Komisyonu',
      sourceUrl: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en',
      tags: JSON.stringify(['CBAM', 'Karbon', 'AB', 'Vergi']),
      isImportant: true,
      order: 32
    },
    {
      title: 'AB Dijital Ürün Pasaportu Yönetmeliği (Taslak)',
      description: 'Tekstil ürünleri için dijital ürün pasaportu zorunluluğu, izlenebilirlik ve sürdürülebilirlik bilgileri gereksinimleri.',
      category: 'international',
      date: new Date('2024-07-01'),
      source: 'Avrupa Komisyonu',
      tags: JSON.stringify(['Dijital Pasaport', 'İzlenebilirlik', 'AB', 'QR Kod']),
      order: 33
    },
    {
      title: 'AB Sürdürülebilir Ürünler için Eko-Tasarım Yönetmeliği (ESPR)',
      description: 'Tekstil ürünlerinin dayanıklılık, onarılabilirlik, geri dönüştürülebilirlik ve çevresel ayak izi gereksinimlerini belirler.',
      category: 'international',
      date: new Date('2024-07-18'),
      source: 'Avrupa Komisyonu',
      sourceUrl: 'https://environment.ec.europa.eu/topics/circular-economy/ecodesign-sustainable-products-regulation_en',
      tags: JSON.stringify(['Eko-Tasarım', 'Sürdürülebilirlik', 'AB', 'Döngüsel Ekonomi']),
      isImportant: true,
      order: 34
    },
    {
      title: 'ISO 3758 - Tekstil Bakım Etiketleme Sembol Standardı',
      description: 'Tekstil ürünlerinin bakım etiketlerinde kullanılan uluslararası semboller ve işaretleme gereksinimleri.',
      category: 'international',
      date: new Date('2023-01-01'),
      source: 'ISO',
      tags: JSON.stringify(['ISO', 'Etiketleme', 'Bakım Sembolleri', 'Standart']),
      order: 35
    },
    {
      title: 'OEKO-TEX Standart 100 Sertifikasyonu',
      description: 'Tekstil ürünlerinde zararlı madde bulunmadığını belgeleyen uluslararası sertifikasyon standardı ve test gereksinimleri.',
      category: 'international',
      date: new Date('2024-01-01'),
      source: 'OEKO-TEX',
      sourceUrl: 'https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100',
      tags: JSON.stringify(['OEKO-TEX', 'Sertifika', 'Zararlı Madde', 'Test']),
      order: 36
    },
    {
      title: 'AB Kurumsal Sürdürülebilirlik Raporlaması Direktifi (CSRD)',
      description: 'Büyük şirketler için çevresel, sosyal ve yönetişim (ESG) raporlama zorunluluğu. Tekstil tedarik zinciri etkileri.',
      category: 'international',
      date: new Date('2024-01-01'),
      source: 'Avrupa Komisyonu',
      tags: JSON.stringify(['CSRD', 'ESG', 'Sürdürülebilirlik', 'Raporlama']),
      order: 37
    },
    {
      title: 'AB Zorla Çalıştırma Yasağı Tüzüğü',
      description: 'Zorla çalıştırma ile üretilmiş ürünlerin AB pazarına girişinin yasaklanmasına ilişkin düzenleme.',
      category: 'international',
      date: new Date('2024-04-23'),
      source: 'Avrupa Parlamentosu',
      tags: JSON.stringify(['Zorla Çalıştırma', 'İnsan Hakları', 'AB', 'Tedarik Zinciri']),
      isImportant: true,
      order: 38
    }
  ];

  for (const leg of legislations) {
    const slug = generateSlug(leg.title);

    await prisma.legislation.upsert({
      where: { slug },
      update: {
        ...leg,
        slug
      },
      create: {
        ...leg,
        slug
      }
    });
  }

  console.log('✓ Mevzuatlar eklendi:', legislations.length);

  // İstatistikleri göster
  const stats = await prisma.legislation.groupBy({
    by: ['category'],
    _count: { id: true }
  });

  console.log('\n=== Kategori İstatistikleri ===');
  stats.forEach(s => {
    const catName = {
      'law': 'Kanunlar',
      'regulation': 'Yönetmelikler',
      'circular': 'Genelgeler',
      'international': 'Uluslararası'
    }[s.category] || s.category;
    console.log(`${catName}: ${s._count.id}`);
  });

  await prisma.$disconnect();
}

seedLegislation();
