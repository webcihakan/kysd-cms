const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newsData = [
  {id:24,title:'Yeni Tesvik Paketi Aciklandi',slug:'yeni-tesvik-paketi-aciklandi-1766883271927',content:'<h2>Sektor Icin Yeni Destekler</h2><p>Hukumet, tekstil ve konfeksiyon sektorune yonelik kapsamli bir tesvik paketi acikladi.</p>',excerpt:'Tekstil ve konfeksiyon sektorune yonelik yeni tesvik ve destek programlari devreye girdi.',image:'/uploads/news/tesvik-destek.jpg',isActive:true,isFeatured:true,viewCount:2},
  {id:23,title:'Tekstil Fuarlarina Yogun Katilim',slug:'tekstil-fuarlarina-yogun-katilim-1766883271912',content:'<h2>Fuar Sezonunda Buyuk Basari</h2><p>Turkiye tekstil ve konfeksiyon sektoru, uluslararasi fuarlarda guclu bir performans sergiledi.</p>',excerpt:'ITM ve Texworld fuarlarinda Turk firmalari buyuk ilgi gordu.',image:'/uploads/news/news-5-fuar.jpg',isActive:true,isFeatured:true,viewCount:2},
  {id:22,title:'Surdurulebilir Tekstil Uretimine Yonetim Artiyor',slug:'surdurulebilir-tekstil-uretimine-yonetim-artiyor-1766883271899',content:'<h2>Yesil Uretim Trendi</h2><p>Tekstil ve konfeksiyon sektoru, surdurulebilirlik konusunda onemli adimlar atiyor.</p>',excerpt:'Cevre dostu uretim ve geri donusum teknolojileri sektorde on plana cikiyor.',image:'/uploads/news/yesil-donusum.jpg',isActive:true,isFeatured:true,viewCount:0},
  {id:21,title:'Konfeksiyon Yan Sanayinde Dijital Donusum Hizlandi',slug:'konfeksiyon-yan-sanayinde-dijital-donusum-hizlandi-1766883271886',content:'<h2>Dijital Fabrikalar Kuruluyor</h2><p>Konfeksiyon yan sanayi sektoru, dijital donusum yatirimlarini hizlandirdi.</p>',excerpt:'Dugme, fermuar ve aksesuar ureticileri Endustri 4.0 yatirimlarini artirdi.',image:'/uploads/news/dijital-donusum.jpg',isActive:true,isFeatured:true,viewCount:0},
  {id:20,title:'Turkiye Tekstil Ihracati Rekor Kirildi',slug:'turkiye-tekstil-ihracati-rekor-kirildi-1766883271831',content:'<h2>Tekstil Sektorunde Buyuk Basari</h2><p>Turkiye tekstil ve hazir giyim sektoru, 2024 yilinda tarihi bir basariya imza atarak 35 milyar dolar ihracat rakamina ulasti.</p>',excerpt:'Turkiye tekstil ve hazir giyim sektoru 2024 yilinda 35 milyar dolar ihracat hedefine ulasti.',image:'/uploads/news/news-1-ihracat.jpg',isActive:true,isFeatured:true,viewCount:0},
  {id:19,title:'Makine-Ekipman Kredi Destegi',slug:'makine-ekipman-kredi-destegi-1766882459157',content:'<h2>Faizsiz Makine Kredisi</h2><p>Konfeksiyon makineleri ve uretim ekipmanlari alimi icin faizsiz kredi imkani.</p>',excerpt:'Konfeksiyon makineleri ve uretim ekipmanlari alimi icin faizsiz kredi imkani.',image:'/uploads/news/makine-ekipman.jpg',isActive:true,isFeatured:true,viewCount:4},
  {id:18,title:'Istihdam Tesviki - Tekstil Sektoru',slug:'istihdam-tesviki-tekstil-sektoru-1766882459149',content:'<h2>Yeni Istihdam Yaratana Destek</h2><p>Tekstil ve konfeksiyon sektorunde yeni istihdam yaratan firmalara SGK prim destegi.</p>',excerpt:'Tekstil ve konfeksiyon sektorunde yeni istihdam yaratan firmalara SGK prim destegi.',image:'/uploads/news/news-8-istihdam.jpg',isActive:true,isFeatured:true,viewCount:4},
  {id:17,title:'Yesil Donusum Finansmani',slug:'yesil-donusum-finansmani-1766882459142',content:'<h2>Surdurulebilir Uretim Finansmani</h2><p>Surdurulebilir uretim, enerji verimliligi ve cevre dostu teknolojiler icin dusuk faizli kredi imkani.</p>',excerpt:'Surdurulebilir uretim, enerji verimliligi ve cevre dostu teknolojiler icin dusuk faizli kredi.',image:'/uploads/news/yesil-donusum.jpg',isActive:true,isFeatured:true,viewCount:0},
  {id:16,title:'Dijital Donusum Destegi',slug:'dijital-donusum-destegi-1766882459133',content:'<h2>Endustri 4.0 Yatirim Destegi</h2><p>Uretim tesislerinin dijitallesmesi, otomasyon ve ERP sistemleri icin destek programi.</p>',excerpt:'Uretim tesislerinin dijitallesmesi, otomasyon ve ERP sistemleri icin destek programi.',image:'/uploads/news/dijital-donusum.jpg',isActive:true,isFeatured:true,viewCount:2},
  {id:15,title:'Ar-Ge ve Inovasyon Destegi',slug:'ar-ge-ve-inovasyon-destegi-1766882459125',content:'<h2>Yenilikci Urun Gelistirme Destegi</h2><p>Konfeksiyon yan sanayi urunlerinde yenilikci urun ve surec gelistirme projeleri icin hibe destegi.</p>',excerpt:'Konfeksiyon yan sanayi urunlerinde yenilikci urun ve surec gelistirme projeleri icin hibe destegi.',image:'/uploads/news/arge-inovasyon.jpg',isActive:true,isFeatured:true,viewCount:0}
];

async function main() {
  console.log('Importing news articles...');
  for (const news of newsData) {
    await prisma.news.create({ data: news });
  }
  console.log('News imported:', newsData.length);
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
