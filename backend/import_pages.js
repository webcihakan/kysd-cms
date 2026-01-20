const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pages = [
  {id:8,title:'Tuzuk',slug:'tuzuk',content:'<h2>Dernek Tuzugu</h2>\n<p>Konfeksiyon Yan Sanayi Dernegi Tuzugu, dernegin kurulus amaci, uyelik kosullari, organlari ve calisma esaslarini duzenlemektedir.</p>\n<p><em>Tuzuk tam metni icin dernek sekreterlig ile iletisime gecebilirsiniz.</em></p>',excerpt:'{"subtitle":"Konfeksiyon Yan Sanayi Derneginin kurulus amaci, uyelik sartlari ve organizasyon yapisini duzenleyen resmi tuzuk belgesi.","pdfUrl":"/documents/kysd-tuzuk.pdf","lastUpdate":"2024"}',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:9,title:'Neden Uye Olmaliyim?',slug:'neden-uye-olmaliyim',content:'<h2>KYSD Uyeliginin Avantajlari</h2>\n<ul>\n<li><strong>Sektorel Temsil:</strong> Konfeksiyon yan sanayinin guclu sesi olun</li>\n<li><strong>Networking:</strong> Sektordeki diger firmalarla isbirligi firsatlari</li>\n<li><strong>Bilgi Paylasimi:</strong> Sektorel raporlar, mevzuat guncellemeleri</li>\n<li><strong>Egitim Imkanlari:</strong> Ucretsiz veya indirimli egitim ve seminerler</li>\n<li><strong>Fuar Katilimi:</strong> Toplu fuar katilim organizasyonlari</li>\n<li><strong>Lobi Faaliyetleri:</strong> Sektorun sorunlarinin yetkili makamlara iletilmesi</li>\n</ul>',excerpt:'{"subtitle":"Turkiyenin en koklu konfeksiyon yan sanayi dernegine katilin, sektorun gucunden yararlaning."}',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:10,title:'Sektor Raporlari',slug:'sektor-raporlari',content:'<h2>Sektor Raporlari ve Analizler</h2>\n<p>Konfeksiyon yan sanayi sektorune ait guncel raporlar ve analizler bu sayfada paylasilmaktadir.</p>\n<p><em>Raporlar yakinda eklenecektir.</em></p>',excerpt:'Konfeksiyon yan sanayi sektor raporlari.',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:11,title:'Mevzuat',slug:'mevzuat',content:'<h2>Sektorel Mevzuat</h2>\n<p>Konfeksiyon yan sanayini ilgilendiren yasa, yonetmelik ve tebligler hakkinda guncel bilgiler.</p>\n<p><em>Mevzuat bilgileri yakinda eklenecektir.</em></p>',excerpt:'Sektoru ilgilendiren yasal duzenlemeler.',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:12,title:'Tesvik ve Destekler',slug:'tesvik-destekler',content:'<h2>Devlet Tesvikleri ve Destekler</h2>\n<p>Sektorumuze yonelik yatirim tesvikleri, hibe programlari ve devlet destekleri hakkinda bilgi edinin.</p>\n<p><em>Detayli bilgiler yakinda eklenecektir.</em></p>',excerpt:'Sektore yonelik tesvik ve destek programlari.',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:13,title:'Egitimler & Seminerler',slug:'egitimler',content:'<h2>Egitim ve Seminer Programlari</h2>\n<p>KYSD tarafindan duzenlenen egitim ve seminer programlari hakkinda bilgi alin.</p>\n<p><em>Egitim takvimi yakinda guncellenecektir.</em></p>',excerpt:'KYSD egitim ve seminer programlari.',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:14,title:'Projeler',slug:'projeler',content:'<h2>Projelerimiz</h2>\n<p>UR-GE, AB projeleri ve diger sektorel projeler hakkinda bilgi edinin.</p>\n<p><em>Proje detaylari yakinda eklenecektir.</em></p>',excerpt:'KYSD projeleri ve girisimleri.',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:15,title:'Fuarlar',slug:'fuarlar',content:'<h2>Fuar Takvimi</h2>\n<p>Sektorel fuarlar ve KYSD toplu katilim organizasyonlari hakkinda bilgi.</p>\n<p><em>Fuar takvimi yakinda guncellenecektir.</em></p>',excerpt:'Sektorel fuar takvimi ve katilim bilgileri.',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:16,title:'Galeri',slug:'galeri',content:'<h2>Fotograf ve Video Galerisi</h2>\n<p>Etkinliklerimizden fotograflar ve videolar.</p>\n<p><em>Galeri icerigi yakinda eklenecektir.</em></p>',excerpt:'KYSD etkinlik fotograflari ve videolari.',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:17,title:'Gizlilik Politikasi',slug:'gizlilik-politikasi',content:'<h2>Gizlilik Politikasi</h2>\n<p>KYSD olarak kisisel verilerinizin guvenligine onem veriyoruz.</p>',excerpt:null,image:null,parentId:null,order:100,isActive:true,metaTitle:null,metaDesc:null},
  {id:18,title:'Kullanim Kosullari',slug:'kullanim-kosullari',content:'<h2>Kullanim Kosullari</h2>\n<p>Bu web sitesini kullanarak asagidaki kosullari kabul etmis sayilirsiniz.</p>',excerpt:null,image:null,parentId:null,order:101,isActive:true,metaTitle:null,metaDesc:null},
  {id:19,title:'Hakkimizda',slug:'hakkimizda',content:'\n<h2>Biz Kimiz</h2>\n<p><strong>Konfeksiyon Yan Sanayi Dernegi (KYSD)</strong>, 1990 yilinda Istanbulda kurulmus olup, konfeksiyon yan sanayi sektorunde faaliyet gosteren firmalari bir araya getiren koklu bir meslek orgutudur.</p>',excerpt:'{"subtitle":"Turkiyenin onde gelen konfeksiyon yan sanayi kuruluslarini bir araya getiren, sektorun guclu sesi ve temsilcisi.","vision":"Turk konfeksiyon yan sanayini dunya standartlarina tasiyarak, sektorumuzun kuresel rekabet gucunu artirmak.","mission":"Uyelerimizin cikarlarini korumak, sektorel isbirligini guclendirmek, yenilikci cozumler uretmek."}',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:20,title:'Iletisim',slug:'iletisim',content:'<h2>Iletisim Bilgileri</h2><p>Bize ulasin...</p>',excerpt:'{"subtitle":"Sorulariniz, onerileriniz veya isbirligi talepleriniz icin bizimle iletisime gecin.","successTitle":"Mesajiniz Gonderildi!","successMessage":"En kisa surede size donus yapacagiz."}',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:21,title:'Yonetim Kurulu',slug:'yonetim-kurulu',content:'<h2>Yonetim Kurulu Uyeleri</h2><p>KYSD Yonetim Kurulu...</p>',excerpt:'{"subtitle":"Konfeksiyon Yan Sanayi Dernegi yonetim kurulu uyelerimiz","executivesTitle":"Yonetim Kadrosu","membersTitle":"Yonetim Kurulu Uyeleri"}',image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:22,title:'Uyelik Basvurusu',slug:'uyelik-basvurusu',content:'<h2>Uyelik Basvurusu</h2><p>KYSD ailesine katilin...</p>',excerpt:null,image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null},
  {id:24,title:'Uye Rehberi',slug:'uyeler',content:'<h2>Uye Rehberi</h2><p>Tum uye firmalarimiz...</p>',excerpt:null,image:null,parentId:null,order:0,isActive:true,metaTitle:null,metaDesc:null}
];

async function main() {
  console.log('Importing pages...');
  for (const page of pages) {
    await prisma.page.create({ data: page });
  }
  console.log('Pages imported:', pages.length);
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
