const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const newsUpdates = [
  {
    title: 'Tekstil ve Konfeksiyon Sektorune Yonelik Ihracat Tesvikleri Hakkinda Teblig',
    image: '/uploads/news/news-1-ihracat.jpg',
    content: `
      <h2>Ihracat Tesvikleri Detaylari</h2>
      <p>Tekstil ve hazir giyim sektorundeki ihracatcilara yonelik yeni tesvik uygulamalari hakkinda onemli duzenleme yayimlandi.</p>

      <h3>Kapsam</h3>
      <ul>
        <li>Tekstil urunleri ihracatinda %15'e varan vergi indirimi</li>
        <li>Hazir giyim sektorunde navlun destegi</li>
        <li>Fuar katilim masraflarinin %50'sine kadar destek</li>
        <li>Pazar arastirmasi faaliyetleri icin hibe</li>
      </ul>

      <h3>Basvuru Sartlari</h3>
      <p>Tesviklerden yararlanmak isteyen firmalar asagidaki sartlari karsilamalidir:</p>
      <ul>
        <li>Turkiye'de yerlesik tuzel kisilik olmak</li>
        <li>En az 2 yildir faal olmak</li>
        <li>Yillik ihracat tutari en az 100.000 USD olmak</li>
      </ul>

      <p><strong>Kaynak:</strong> Resmi Gazete</p>
    `
  },
  {
    title: 'Hazir Giyim Ithalat Rejimi Karari Degisikligi',
    image: '/uploads/news/gumruk-lojistik.jpg',
    content: `
      <h2>Ithalat Rejiminde Yeni Duzenlemeler</h2>
      <p>Hazir giyim urunlerinin ithalatinda uygulanacak yeni gumruk vergileri ve kotalar belirlendi.</p>

      <h3>Onemli Degisiklikler</h3>
      <ul>
        <li>Belirli urun gruplarinda gumruk vergisi oranlarinda guncelleme</li>
        <li>Mensei ispat belgesi zorunlulugu genisletildi</li>
        <li>Kalite kontrol standartlari sıkılastırıldı</li>
      </ul>

      <h3>Etkilenen Urun Gruplari</h3>
      <p>Dis giyim, ic giyim, spor giyim ve aksesuar kategorilerinde uygulanacaktir.</p>

      <p><strong>Kaynak:</strong> Resmi Gazete</p>
    `
  },
  {
    title: 'Konfeksiyon Yan Sanayi Urunleri Standardizasyonu Yonetmeligi',
    image: '/uploads/news/news-4-fermuar.jpg',
    content: `
      <h2>Kalite Standartlari Belirlendi</h2>
      <p>Dugme, fermuar ve aksesuar urunlerinde uygulanacak kalite standartlari resmi olarak belirlendi.</p>

      <h3>Yeni Standartlar</h3>
      <ul>
        <li>Fermuar dayaniklilik testleri zorunlu hale getirildi</li>
        <li>Dugme ve cit-cit urunlerinde alerjen madde sinirlamalari</li>
        <li>Etiket ve aksesuar malzemelerinde izlenebilirlik</li>
        <li>Ambalaj ve etiketleme gereksinimleri standardize edildi</li>
      </ul>

      <h3>Uyum Sureci</h3>
      <p>Ureticilere 6 aylik uyum sureci taninmistir. Bu sure zarfinda mevcut stoklarin satisi serbest olacaktir.</p>

      <p><strong>Kaynak:</strong> Resmi Gazete</p>
    `
  },
  {
    title: 'Tekstil ve Konfeksiyon Sektorunde Calisma Sartlari Yonetmeligi',
    image: '/uploads/news/istihdam-ekip.jpg',
    content: `
      <h2>Calisanlarin Haklari Guclendirildi</h2>
      <p>Tekstil ve konfeksiyon sektorunde calisanlarin haklari ve isveren yukumlulukleri yeniden duzenlendi.</p>

      <h3>Yeni Duzenlemeler</h3>
      <ul>
        <li>Calisma saatlerinin yeniden duzenlenmesi</li>
        <li>Is sagligi ve guvenligi standartlarinin guncellenmesi</li>
        <li>Ergonomik calisma kosullari zorunlulugu</li>
        <li>Haftalik izin haklarinin genisletilmesi</li>
      </ul>

      <h3>Isveren Yukumlulukleri</h3>
      <p>Isverenlerin yeni standartlara uyum saglamasi icin 3 aylik gecis sureci taninmistir.</p>

      <p><strong>Kaynak:</strong> Resmi Gazete</p>
    `
  },
  {
    title: 'Gumruk Vergisi Muafiyetleri - Konfeksiyon Makine ve Ekipmanlari',
    image: '/uploads/news/makine-ekipman.jpg',
    content: `
      <h2>Makine Ithalatinda Vergi Avantaji</h2>
      <p>Konfeksiyon uretiminde kullanilacak makine ve ekipman ithalatinda gumruk muafiyeti saglandi.</p>

      <h3>Kapsam</h3>
      <ul>
        <li>Dikim makineleri ve otomasyonu</li>
        <li>Kesim ve serim sistemleri</li>
        <li>Utu ve pres ekipmanlari</li>
        <li>Kalite kontrol cihazlari</li>
        <li>CAD/CAM yazilimlari ve donanimi</li>
      </ul>

      <h3>Basvuru</h3>
      <p>Muafiyetten yararlanmak isteyen firmalar Ticaret Bakanligi'na basvuru yapabilir.</p>

      <p><strong>Kaynak:</strong> Resmi Gazete</p>
    `
  },
  {
    title: 'KOSGEB Ihracat Destek Programi',
    image: '/uploads/news/tesvik-destek.jpg',
    content: `
      <h2>KOBIlere Ihracat Destegi</h2>
      <p>Tekstil ve konfeksiyon sektorundeki KOBIlere ozel ihracat destek programi basladi.</p>

      <h3>Destek Kalemleri</h3>
      <ul>
        <li>Uluslararasi fuar katilim destegi (stand, ulasim, konaklama)</li>
        <li>Pazar arastirmasi ve raporlama destegi</li>
        <li>Yurt disi ofis acma destegi</li>
        <li>E-ihracat platformlari uyelik destegi</li>
        <li>Tanitim ve markalaşma destegi</li>
      </ul>

      <h3>Destek Oranlari</h3>
      <p>Giderlerin %50 ila %70'i karsilanmaktadir. Yillik destek limiti 200.000 TL'dir.</p>

      <p><strong>Kaynak:</strong> KOSGEB</p>
    `
  },
  {
    title: 'Ar-Ge ve Inovasyon Destegi',
    image: '/uploads/news/arge-inovasyon.jpg',
    content: `
      <h2>Yenilikci Urun Gelistirme Destegi</h2>
      <p>Konfeksiyon yan sanayi urunlerinde yenilikci urun ve surec gelistirme projeleri icin hibe destegi.</p>

      <h3>Desteklenen Alanlar</h3>
      <ul>
        <li>Akilli tekstil ve giyilebilir teknoloji</li>
        <li>Surdurulebilir malzeme gelistirme</li>
        <li>Uretim sureclerinde otomasyon</li>
        <li>Kalite kontrol teknolojileri</li>
        <li>Cevre dostu uretim yontemleri</li>
      </ul>

      <h3>Hibe Orani</h3>
      <p>Proje butcesinin %75'ine kadar hibe destegi saglanmaktadir. Ust limit 2.000.000 TL.</p>

      <p><strong>Kaynak:</strong> KOSGEB</p>
    `
  },
  {
    title: 'Dijital Donusum Destegi',
    image: '/uploads/news/dijital-donusum.jpg',
    content: `
      <h2>Endustri 4.0 Yatirim Destegi</h2>
      <p>Uretim tesislerinin dijitallesmesi, otomasyon ve ERP sistemleri icin destek programi.</p>

      <h3>Kapsam</h3>
      <ul>
        <li>ERP ve MRP yazilim lisanslari</li>
        <li>IoT sensör ve veri toplama sistemleri</li>
        <li>Bulut bilisim altyapisi</li>
        <li>Robotik otomasyon sistemleri</li>
        <li>Dijital ikiz ve simulasyon</li>
      </ul>

      <h3>Destek Detaylari</h3>
      <p>Yatirim tutarinin %50'sine kadar hibe verilmektedir. Maksimum destek tutari 500.000 TL.</p>

      <p><strong>Kaynak:</strong> TUBITAK</p>
    `
  },
  {
    title: 'Yesil Donusum Finansmani',
    image: '/uploads/news/yesil-donusum.jpg',
    content: `
      <h2>Surdurulebilir Uretim Finansmani</h2>
      <p>Surdurulebilir uretim, enerji verimliligi ve cevre dostu teknolojiler icin dusuk faizli kredi imkani.</p>

      <h3>Kredi Kosullari</h3>
      <ul>
        <li>Yillik %5 sabit faiz orani</li>
        <li>5 yil vade, 1 yil odemesiz donem</li>
        <li>Maksimum kredi tutari: 10.000.000 TL</li>
      </ul>

      <h3>Desteklenen Yatirimlar</h3>
      <ul>
        <li>Gunes enerjisi sistemleri</li>
        <li>Su aritma ve geri donusum tesisleri</li>
        <li>Atik yonetim sistemleri</li>
        <li>Enerji verimli makine degisimi</li>
      </ul>

      <p><strong>Kaynak:</strong> Kalkinma Bankasi</p>
    `
  },
  {
    title: 'Istihdam Tesviki - Tekstil Sektoru',
    image: '/uploads/news/news-8-istihdam.jpg',
    content: `
      <h2>Yeni Istihdam Yaratana Destek</h2>
      <p>Tekstil ve konfeksiyon sektorunde yeni istihdam yaratan firmalara SGK prim destegi.</p>

      <h3>Tesvik Detaylari</h3>
      <ul>
        <li>Isveren SGK priminin %100'u 12 ay boyunca karsilanir</li>
        <li>Genc istihdam icin ek 6 ay destek</li>
        <li>Kadin istihdaminda %50 ek destek</li>
        <li>Engelli istihdaminda tam muafiyet</li>
      </ul>

      <h3>Basvuru Kosullari</h3>
      <p>Son 3 ayda calistirilan ortalama isci sayisina ek istihdam yapilmasi gerekmektedir.</p>

      <p><strong>Kaynak:</strong> ISKUR</p>
    `
  },
  {
    title: 'Makine-Ekipman Kredi Destegi',
    image: '/uploads/news/makine-ekipman.jpg',
    content: `
      <h2>Faizsiz Makine Kredisi</h2>
      <p>Konfeksiyon makineleri ve uretim ekipmanlari alimi icin faizsiz kredi imkani.</p>

      <h3>Kredi Kosullari</h3>
      <ul>
        <li>%0 faiz orani</li>
        <li>36 ay vade</li>
        <li>6 ay odemesiz donem</li>
        <li>Maksimum kredi tutari: 2.000.000 TL</li>
      </ul>

      <h3>Kapsam</h3>
      <ul>
        <li>Dikim ve overlok makineleri</li>
        <li>Kesim sistemleri</li>
        <li>Pres ve utu ekipmanlari</li>
        <li>Nakis ve baski makineleri</li>
      </ul>

      <p><strong>Kaynak:</strong> Halkbank</p>
    `
  }
]

async function updateNews() {
  console.log('Haberler guncelleniyor...')

  for (const update of newsUpdates) {
    try {
      const news = await prisma.news.findFirst({
        where: { title: update.title }
      })

      if (news) {
        await prisma.news.update({
          where: { id: news.id },
          data: {
            image: update.image,
            content: update.content,
            isFeatured: true
          }
        })
        console.log(`✓ Guncellendi: ${update.title.substring(0, 40)}...`)
      } else {
        console.log(`✗ Bulunamadi: ${update.title.substring(0, 40)}...`)
      }
    } catch (err) {
      console.log(`Hata: ${err.message}`)
    }
  }

  await prisma.$disconnect()
  console.log('\\nTamamlandi!')
}

updateNews()
