const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Faaliyetler seed işlemi başlıyor...');

  // ========== RAPORLAR ==========
  const reports = [
    {
      title: 'İSO Konfeksiyon Yan Sanayi Sektör Raporu 2024',
      slug: 'iso-konfeksiyon-yan-sanayi-sektor-raporu-2024',
      description: 'İstanbul Sanayi Odası tarafından hazırlanan kapsamlı konfeksiyon yan sanayi sektör raporu. Sektörde 49.010 kişi istihdam edilmekte, doğrudan ihracat 681,2 milyon dolar, dolaylı ihracat katkısı 2,5 milyar dolar seviyesindedir.',
      source: 'İSO',
      sourceUrl: 'https://www.iso.org.tr/haberler/diger-haberler/iso-tarafindan-hazirlanan-konfeksiyon%C2%A0yan-sanayi-sektor-raporu-aciklandi/',
      pdfUrl: 'https://www.iso.org.tr/Sites/1/upload/files/konfeksiyon_raporu_16.05.2024-12258.pdf',
      category: 'sektor-raporu',
      publishDate: new Date('2024-05-16'),
      isFeatured: true,
      order: 1
    },
    {
      title: 'Tekstil ve Hazır Giyim Sektörel Güncel Gelişmeler 2025-I',
      slug: 'tekstil-hazir-giyim-sektorel-guncel-gelismeler-2025',
      description: 'İş Bankası ekonomik araştırma raporu. 2025 ilk çeyrekte tekstil ihracatı %3,4 azalarak 3,8 milyar USD, hazır giyim ihracatı %8,4 düşüş yaşamıştır.',
      source: 'İş Bankası',
      sourceUrl: 'https://ekonomi.isbank.com.tr/',
      category: 'sektor-raporu',
      publishDate: new Date('2025-04-01'),
      isFeatured: true,
      order: 2
    },
    {
      title: 'Hazır Giyim ve Konfeksiyon İhracat Raporu Ağustos 2024',
      slug: 'hazir-giyim-konfeksiyon-ihracat-raporu-agustos-2024',
      description: 'Türkiye Hazır Giyim ve Konfeksiyon sektörü Ocak-Ağustos 2024 döneminde %8,9 azalışla yaklaşık 12 milyar dolar ihracat gerçekleştirmiştir.',
      source: 'AKİB',
      sourceUrl: 'https://www.akib.org.tr/',
      pdfUrl: 'https://www.akib.org.tr/files/documents/2024%20AĞUSTOS%20AYI%20HAZIR%20GİYİM%20VE%20KONFEKSİYON%20İHRACAT%20RAPORU.pdf',
      category: 'ihracat-raporu',
      publishDate: new Date('2024-09-15'),
      order: 3
    },
    {
      title: 'Tekstil Sektörünün Geleceği: Mevcut Durum ve Öngörüler',
      slug: 'tekstil-sektorunun-gelecegi-musiad-raporu',
      description: 'MÜSİAD tarafından hazırlanan rapor. Türkiye dünya sıralamasında Çin, AB-27, Bangladeş ve Vietnam\'ın ardından beşinci sırada yer almaktadır.',
      source: 'MÜSİAD',
      sourceUrl: 'https://www.musiad.org.tr/',
      pdfUrl: 'https://www.musiad.org.tr/uploads/press-472/teskti%CC%87l.pdf',
      category: 'analiz',
      publishDate: new Date('2024-06-01'),
      order: 4
    },
    {
      title: 'İHKİB Hazır Giyim Sektörü Güncel Durum Raporu',
      slug: 'ihkib-hazir-giyim-sektoru-raporu-2024',
      description: 'İstanbul Hazır Giyim ve Konfeksiyon İhracatçıları Birliği sektör değerlendirmesi. İstanbul 8,1 milyar dolar ile ihracatta ilk sırada.',
      source: 'İHKİB',
      sourceUrl: 'https://www.ihkib.org.tr/',
      category: 'ihracat-raporu',
      publishDate: new Date('2024-07-01'),
      order: 5
    },
    {
      title: 'Ticaret Bakanlığı Hazır Giyim Sektör Raporu',
      slug: 'ticaret-bakanligi-hazir-giyim-sektor-raporu',
      description: 'T.C. Ticaret Bakanlığı tarafından hazırlanan resmi hazır giyim sektör raporu ve analizi.',
      source: 'Ticaret Bakanlığı',
      sourceUrl: 'https://ticaret.gov.tr/',
      pdfUrl: 'https://ticaret.gov.tr/data/5b87000813b8761450e18d7b/Hazır%20Giyim%20Sektör%20Raporu%202022.pdf',
      category: 'sektor-raporu',
      publishDate: new Date('2023-01-01'),
      order: 6
    }
  ];

  for (const report of reports) {
    await prisma.report.upsert({
      where: { slug: report.slug },
      update: report,
      create: report
    });
  }
  console.log('✓ Raporlar eklendi');

  // ========== EĞİTİMLER ==========
  const trainings = [
    {
      title: 'Konfeksiyon Yan Sanayi Kalite Yönetimi Semineri',
      slug: 'konfeksiyon-yan-sanayi-kalite-yonetimi-semineri',
      description: 'Konfeksiyon yan sanayinde kalite kontrol süreçleri, ISO standartları ve müşteri beklentilerinin yönetimi konularında kapsamlı eğitim programı.',
      category: 'seminar',
      instructor: 'Prof. Dr. Ahmet Yılmaz',
      location: 'İstanbul Sanayi Odası Konferans Salonu',
      eventDate: new Date('2025-02-15'),
      eventTime: '10:00 - 17:00',
      duration: '1 Gün',
      quota: 50,
      price: 'Ücretsiz',
      isFeatured: true,
      order: 1
    },
    {
      title: 'Sürdürülebilir Tekstil Üretimi Workshop',
      slug: 'surdurulebilir-tekstil-uretimi-workshop',
      description: 'Çevre dostu üretim teknikleri, geri dönüşüm malzemeleri kullanımı ve karbon ayak izi azaltma stratejileri üzerine uygulamalı atölye çalışması.',
      category: 'workshop',
      instructor: 'Dr. Elif Demir',
      location: 'KYSD Eğitim Merkezi',
      eventDate: new Date('2025-03-10'),
      eventTime: '09:00 - 18:00',
      duration: '3 Gün',
      quota: 30,
      price: '1.500 TL',
      isFeatured: true,
      order: 2
    },
    {
      title: 'Dijital Dönüşüm ve Endüstri 4.0 Eğitimi',
      slug: 'dijital-donusum-endustri-40-egitimi',
      description: 'Tekstil ve konfeksiyon sektöründe dijitalleşme, akıllı fabrika uygulamaları, IoT ve otomasyon sistemleri eğitimi.',
      category: 'certificate',
      instructor: 'Mühendis Mehmet Kaya',
      location: 'Online (Zoom)',
      eventDate: new Date('2025-04-05'),
      eventTime: '14:00 - 17:00',
      duration: '15 Gün (Haftada 3 Gün)',
      quota: 100,
      price: '2.000 TL',
      order: 3
    },
    {
      title: 'Fermuar ve Metal Aksesuar Teknik Eğitimi',
      slug: 'fermuar-metal-aksesuar-teknik-egitimi',
      description: 'Fermuar çeşitleri, metal aksesuar üretim teknikleri, kalite testleri ve uluslararası standartlar hakkında teknik eğitim.',
      category: 'certificate',
      instructor: 'Uzman Ali Özkan',
      location: 'Bursa Tekstil OSB',
      eventDate: new Date('2025-05-08'),
      eventTime: '09:00 - 17:00',
      duration: '3 Gün',
      quota: 40,
      price: '1.200 TL',
      order: 4
    },
    {
      title: 'İhracat ve Dış Ticaret Mevzuatı Semineri',
      slug: 'ihracat-dis-ticaret-mevzuati-semineri',
      description: 'Tekstil ve konfeksiyon sektörüne özel ihracat prosedürleri, gümrük işlemleri, teşvikler ve uluslararası ticaret mevzuatı.',
      category: 'seminar',
      instructor: 'Gümrük Müşaviri Fatma Şen',
      location: 'İTO Konferans Salonu',
      eventDate: new Date('2025-03-25'),
      eventTime: '10:00 - 16:00',
      duration: '1 Gün',
      quota: 80,
      price: 'Ücretsiz',
      order: 5
    },
    {
      title: 'Etiket Tasarımı ve Baskı Teknikleri',
      slug: 'etiket-tasarimi-baski-teknikleri',
      description: 'Modern etiket tasarım trendleri, dijital ve ofset baskı teknikleri, RFID etiket uygulamaları üzerine uygulamalı eğitim.',
      category: 'workshop',
      instructor: 'Tasarımcı Zeynep Arslan',
      location: 'KYSD Eğitim Merkezi',
      eventDate: new Date('2025-06-15'),
      eventTime: '10:00 - 17:00',
      duration: '2 Gün',
      quota: 25,
      price: '800 TL',
      order: 6
    }
  ];

  for (const training of trainings) {
    await prisma.training.upsert({
      where: { slug: training.slug },
      update: training,
      create: training
    });
  }
  console.log('✓ Eğitimler eklendi');

  // ========== PROJELER ==========
  const projects = [
    {
      title: 'Sürdürülebilir Üretim Altyapısı Geliştirme Projesi',
      slug: 'surdurulebilir-uretim-altyapisi-gelistirme-projesi',
      description: 'AB destekli proje kapsamında konfeksiyon yan sanayi firmalarının çevre dostu üretim altyapılarının geliştirilmesi ve karbon emisyonlarının azaltılması hedeflenmektedir.',
      category: 'ab-projesi',
      status: 'devam-ediyor',
      budget: '2.500.000 EUR',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2026-06-01'),
      partners: 'KYSD, İSO, TGSD, AB Türkiye Delegasyonu',
      isFeatured: true,
      order: 1
    },
    {
      title: 'Dijital Dönüşüm ve Akıllı Fabrika Projesi',
      slug: 'dijital-donusum-akilli-fabrika-projesi',
      description: 'Sanayi ve Teknoloji Bakanlığı desteğiyle üye firmaların Endüstri 4.0 uyumlu üretim sistemlerine geçişinin sağlanması.',
      category: 'bakanlik-projesi',
      status: 'devam-ediyor',
      budget: '5.000.000 TL',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-12-31'),
      partners: 'KYSD, Sanayi ve Teknoloji Bakanlığı, TÜBİTAK',
      isFeatured: true,
      order: 2
    },
    {
      title: 'Mesleki Yeterlilik ve İstihdam Projesi',
      slug: 'mesleki-yeterlilik-istihdam-projesi',
      description: 'İŞKUR işbirliğiyle sektörde nitelikli işgücü yetiştirme, mesleki yeterlilik belgesi kazandırma ve istihdam garantili eğitim programları.',
      category: 'istihdam-projesi',
      status: 'devam-ediyor',
      budget: '1.800.000 TL',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-03-01'),
      partners: 'KYSD, İŞKUR, MEB',
      order: 3
    },
    {
      title: 'Ar-Ge ve İnovasyon Merkezi Kurulumu',
      slug: 'arge-inovasyon-merkezi-kurulumu',
      description: 'Konfeksiyon yan sanayi sektörüne özel Ar-Ge merkezi kurularak yeni malzeme, üretim tekniği ve ürün geliştirme çalışmalarının yapılması.',
      category: 'arge-projesi',
      status: 'planlanan',
      budget: '10.000.000 TL',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2027-06-01'),
      partners: 'KYSD, TÜBİTAK, Üniversiteler',
      order: 4
    },
    {
      title: 'Uluslararası Pazar Geliştirme Projesi',
      slug: 'uluslararasi-pazar-gelistirme-projesi',
      description: 'Ticaret Bakanlığı UR-GE desteğiyle üye firmaların yeni ihracat pazarlarına açılması, fuar katılımları ve B2B görüşmelerinin organize edilmesi.',
      category: 'ihracat-projesi',
      status: 'devam-ediyor',
      budget: '3.200.000 TL',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      partners: 'KYSD, Ticaret Bakanlığı, İHKİB',
      isFeatured: true,
      order: 5
    },
    {
      title: 'Yeşil Mutabakat Uyum Projesi',
      slug: 'yesil-mutabakat-uyum-projesi',
      description: 'AB Yeşil Mutabakatı kapsamında sektörün çevresel uyum sürecinin desteklenmesi, karbon ayak izi hesaplama ve raporlama sistemlerinin kurulması.',
      category: 'ab-projesi',
      status: 'planlanan',
      budget: '1.500.000 EUR',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2027-09-01'),
      partners: 'KYSD, Çevre ve Şehircilik Bakanlığı, AB',
      order: 6
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project
    });
  }
  console.log('✓ Projeler eklendi');

  // ========== FUARLAR ==========
  const fairs = [
    // Uluslararası Fuarlar
    {
      title: 'Texworld Evolution Paris 2025',
      slug: 'texworld-evolution-paris-2025',
      description: '130 ülkeden 29.000 alıcı ve 1.500 üreticinin katıldığı dünyanın en büyük tekstil fuarı. Giyim ve aksesuar üreticilerinin Avrupa\'daki en önemli buluşma noktası.',
      location: 'Paris Le Bourget',
      country: 'Fransa',
      startDate: new Date('2025-09-15'),
      endDate: new Date('2025-09-17'),
      deadline: new Date('2025-07-15'),
      organizer: 'Messe Frankfurt',
      website: 'https://texworld-paris.fr.messefrankfurt.com/',
      boothInfo: 'KYSD ortak stant alanı mevcut',
      discount: '%30 erken kayıt indirimi',
      isFeatured: true,
      isKysdOrganized: true,
      order: 1
    },
    {
      title: 'Milano Unica Şubat 2025',
      slug: 'milano-unica-subat-2025',
      description: 'İtalya\'nın prestijli tekstil, kumaş ve aksesuar fuarı. Premium segment üreticileri için ideal platform.',
      location: 'Fiera Milano (Rho)',
      country: 'İtalya',
      startDate: new Date('2025-02-04'),
      endDate: new Date('2025-02-06'),
      deadline: new Date('2024-12-15'),
      organizer: 'Milano Unica',
      website: 'https://www.milanounica.it/',
      boothInfo: 'Bireysel katılım',
      isFeatured: true,
      order: 2
    },
    {
      title: 'Milano Unica Temmuz 2025',
      slug: 'milano-unica-temmuz-2025',
      description: 'Milano Unica\'nın yaz edisyonu. Moda, tekstil ve sürdürülebilirlik temalı özel etkinlikler.',
      location: 'Fiera Milano (Rho)',
      country: 'İtalya',
      startDate: new Date('2025-07-08'),
      endDate: new Date('2025-07-10'),
      deadline: new Date('2025-05-01'),
      organizer: 'Milano Unica',
      website: 'https://www.milanounica.it/',
      order: 3
    },
    {
      title: 'CISMA 2025 - Çin Uluslararası Konfeksiyon Makineleri Fuarı',
      slug: 'cisma-2025-cin',
      description: 'Asya\'nın en büyük konfeksiyon, dikiş makineleri ve aksesuarları fuarı. Çin pazarına giriş için stratejik önem taşımaktadır.',
      location: 'Shanghai New International Expo Centre',
      country: 'Çin',
      startDate: new Date('2025-09-24'),
      endDate: new Date('2025-09-27'),
      deadline: new Date('2025-07-01'),
      organizer: 'CISMA',
      website: 'https://www.cismafair.com/',
      boothInfo: 'KYSD heyeti ile katılım imkanı',
      discount: '%25 grup indirimi',
      isFeatured: true,
      isKysdOrganized: true,
      order: 4
    },
    {
      title: 'Première Vision Paris 2025',
      slug: 'premiere-vision-paris-2025',
      description: 'Dünya moda endüstrisinin kalbi, yaratıcı tekstil ve malzemelerin buluşma noktası. Trend belirleme açısından kritik öneme sahip.',
      location: 'Paris Nord Villepinte',
      country: 'Fransa',
      startDate: new Date('2025-09-16'),
      endDate: new Date('2025-09-18'),
      organizer: 'Première Vision',
      website: 'https://www.premierevision.com/',
      isFeatured: true,
      order: 5
    },
    {
      title: 'Texprocess Americas 2025',
      slug: 'texprocess-americas-2025',
      description: 'Kuzey Amerika\'nın önde gelen tekstil ve konfeksiyon teknolojileri fuarı. ABD pazarı için önemli networking fırsatı.',
      location: 'Georgia World Congress Center, Atlanta',
      country: 'ABD',
      startDate: new Date('2025-05-06'),
      endDate: new Date('2025-05-08'),
      organizer: 'Messe Frankfurt',
      website: 'https://texprocess-americas.us.messefrankfurt.com/',
      order: 6
    },
    // Türkiye Fuarları
    {
      title: 'GarmentTech İstanbul 2025',
      slug: 'garmenttech-istanbul-2025',
      description: 'Konfeksiyon ve hazır giyim üretiminde kullanılan tüm teknolojileri bir araya getiren Türkiye\'nin en kapsamlı yan sanayi fuarı. Etiket, düğme, fermuar gibi aksesuarlar sergilenecek.',
      location: 'İstanbul Fuar Merkezi (İFM)',
      country: 'Türkiye',
      startDate: new Date('2025-06-25'),
      endDate: new Date('2025-06-28'),
      deadline: new Date('2025-05-01'),
      organizer: 'İFM Fuarcılık',
      website: 'https://www.garmenttech.com.tr/',
      boothInfo: 'KYSD üyelerine özel stant alanı',
      discount: 'Üyelere %40 indirim',
      isFeatured: true,
      isKysdOrganized: true,
      order: 7
    },
    {
      title: 'Texhibition İstanbul 2025',
      slug: 'texhibition-istanbul-2025',
      description: 'Kumaş, denim, tekstil aksesuarları ve iplik fuarı. İTKİB tarafından düzenlenen sektörün önemli buluşması.',
      location: 'İstanbul Fuar Merkezi',
      country: 'Türkiye',
      startDate: new Date('2025-09-10'),
      endDate: new Date('2025-09-12'),
      deadline: new Date('2025-07-15'),
      organizer: 'İTKİB Fuarcılık',
      website: 'https://www.texhibition.com/',
      boothInfo: 'KYSD ortak katılım',
      isKysdOrganized: true,
      order: 8
    },
    {
      title: 'Fashion Prime İzmir 2025',
      slug: 'fashion-prime-izmir-2025',
      description: '8. Tekstil, Hazır Giyim Tedarikçileri ve Teknolojileri Fuarı. Ege Bölgesi\'nin en önemli tekstil etkinliği.',
      location: 'Fuar İzmir',
      country: 'Türkiye',
      startDate: new Date('2025-10-22'),
      endDate: new Date('2025-10-25'),
      organizer: 'İZFAŞ Fuarcılık',
      website: 'https://www.fashionprime.com.tr/',
      order: 9
    },
    {
      title: 'Gaziantep Tekstil ve Konfeksiyon Fuarı 2025',
      slug: 'gaziantep-tekstil-konfeksiyon-fuari-2025',
      description: 'Güneydoğu Anadolu\'nun tekstil ve konfeksiyon makineleri, yan sanayi ve aksesuarları fuarı.',
      location: 'Gaziantep Ortadoğu Fuar Merkezi',
      country: 'Türkiye',
      startDate: new Date('2025-10-15'),
      endDate: new Date('2025-10-17'),
      organizer: 'International Fuarcılık',
      order: 10
    },
    {
      title: 'Bursa Tekstil Makineleri Fuarı BTM Expo 2025',
      slug: 'bursa-tekstil-makineleri-btm-expo-2025',
      description: 'Bursa\'da düzenlenen tekstil makineleri ve yan sanayi ürünleri fuarı. Askı, düğme, fermuar, etiket üreticileri için önemli platform.',
      location: 'Bursa Uluslararası Fuar ve Kongre Merkezi',
      country: 'Türkiye',
      startDate: new Date('2025-11-12'),
      endDate: new Date('2025-11-15'),
      organizer: 'BTM Expo',
      website: 'https://btmexpo.com/',
      boothInfo: 'KYSD üyelerine özel alan',
      discount: '%35 erken kayıt',
      isKysdOrganized: true,
      order: 11
    }
  ];

  for (const fair of fairs) {
    await prisma.fair.upsert({
      where: { slug: fair.slug },
      update: fair,
      create: fair
    });
  }
  console.log('✓ Fuarlar eklendi');

  console.log('\n========================================');
  console.log('Tüm faaliyetler başarıyla eklendi!');
  console.log('========================================');
  console.log('- ' + reports.length + ' Sektörel Rapor');
  console.log('- ' + trainings.length + ' Eğitim/Seminer');
  console.log('- ' + projects.length + ' Proje');
  console.log('- ' + fairs.length + ' Fuar');
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
