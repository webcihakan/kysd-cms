import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Scale,
  ChevronRight,
  Search,
  FileText,
  BookOpen,
  Gavel,
  ScrollText,
  Building,
  Globe,
  ExternalLink,
  Calendar,
  Tag,
  Filter,
  ChevronDown,
  ChevronUp,
  Info,
  Download
} from 'lucide-react'
import api from '../../utils/api'

const categoryConfig = [
  { id: 'all', name: 'Tümü', icon: BookOpen },
  { id: 'law', name: 'Kanunlar', icon: Gavel },
  { id: 'regulation', name: 'Yönetmelikler', icon: ScrollText },
  { id: 'circular', name: 'Genelgeler', icon: FileText },
  { id: 'international', name: 'Uluslararası', icon: Globe }
]

// Eski statik veri kaldırıldı - API'den çekilecek
const staticLegislationData = [
  // ========== KANUNLAR ==========
  {
    id: 1,
    title: '5174 Sayılı Türkiye Odalar ve Borsalar Birliği Kanunu',
    description: 'Odalar, borsalar ve bunların birliklerinin kuruluşu, organları, faaliyetleri ve denetimlerine ilişkin esasları düzenler.',
    category: 'law',
    date: '2004-06-01',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5174.pdf',
    tags: ['Odalar', 'Birlikler', 'Ticaret']
  },
  {
    id: 2,
    title: '5253 Sayılı Dernekler Kanunu',
    description: 'Derneklerin kuruluşu, faaliyetleri, denetimi ve cezai hükümlerini içeren temel kanun.',
    category: 'law',
    date: '2004-11-23',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5253.pdf',
    tags: ['Dernekler', 'Sivil Toplum', 'Tüzel Kişilik'],
    important: true
  },
  {
    id: 3,
    title: '6102 Sayılı Türk Ticaret Kanunu',
    description: 'Ticari işletme, şirketler, kıymetli evrak ve deniz ticaretine ilişkin hükümleri düzenler.',
    category: 'law',
    date: '2011-02-14',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6102.pdf',
    tags: ['Ticaret', 'Şirketler', 'İşletme']
  },
  {
    id: 4,
    title: '4857 Sayılı İş Kanunu',
    description: 'İşçi ve işveren ilişkilerini, çalışma koşullarını ve iş güvenliğini düzenleyen temel kanun.',
    category: 'law',
    date: '2003-06-10',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.4857.pdf',
    tags: ['İş Hukuku', 'Çalışma', 'İşçi Hakları']
  },
  {
    id: 5,
    title: '2872 Sayılı Çevre Kanunu',
    description: 'Çevrenin korunması, iyileştirilmesi; kara, hava, su, toprak kirliliğinin önlenmesi; atık yönetimi ve çevresel etki değerlendirmesi hükümlerini içerir.',
    category: 'law',
    date: '1983-08-11',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.2872.pdf',
    tags: ['Çevre', 'Atık Yönetimi', 'Sürdürülebilirlik'],
    important: true
  },
  {
    id: 6,
    title: '6502 Sayılı Tüketicinin Korunması Hakkında Kanun',
    description: 'Tüketici işlemleri ile tüketiciye yönelik uygulamalar, etiketleme, garanti ve iade koşullarını düzenler.',
    category: 'law',
    date: '2013-11-28',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6502.pdf',
    tags: ['Tüketici', 'Garanti', 'Etiketleme']
  },
  {
    id: 7,
    title: '5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu',
    description: 'İşçi ve işverenlerin sosyal güvenlik yükümlülükleri, prim hesaplamaları ve iş kazası prosedürlerini içerir.',
    category: 'law',
    date: '2006-06-16',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5510.pdf',
    tags: ['SGK', 'Sigorta', 'İşveren Yükümlülükleri']
  },
  {
    id: 8,
    title: '6331 Sayılı İş Sağlığı ve Güvenliği Kanunu',
    description: 'İşyerlerinde iş sağlığı ve güvenliğinin sağlanması, mevcut sağlık ve güvenlik şartlarının iyileştirilmesi için işveren ve çalışanların görev, yetki ve yükümlülüklerini düzenler.',
    category: 'law',
    date: '2012-06-30',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6331.pdf',
    tags: ['İSG', 'İş Güvenliği', 'Risk Değerlendirme'],
    important: true
  },

  // ========== YÖNETMELİKLER ==========
  {
    id: 9,
    title: 'Dernekler Yönetmeliği',
    description: 'Derneklerin kuruluşu, tescili, faaliyetleri ve denetimi ile ilgili usul ve esasları belirler.',
    category: 'regulation',
    date: '2005-03-31',
    source: 'Resmi Gazete',
    sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=8038',
    tags: ['Dernekler', 'Tescil', 'Denetim'],
    important: true
  },
  {
    id: 10,
    title: 'Tekstil Elyaf İsimleri ve Etiketleme Yönetmeliği',
    description: 'Tekstil ürünlerinin elyaf bileşimlerinin belirlenmesi, etiketlenmesi ve işaretlenmesine ilişkin usul ve esasları düzenler. AB mevzuatı ile uyumlu.',
    category: 'regulation',
    date: '2024-06-15',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=51243',
    tags: ['Tekstil', 'Etiketleme', 'Elyaf Bileşimi'],
    important: true
  },
  {
    id: 11,
    title: 'CE İşaretlemesi Yönetmeliği',
    description: 'Ürünlerin CE işareti taşıma zorunluluğu, uygunluk değerlendirme prosedürleri ve piyasa gözetimi kurallarını belirler.',
    category: 'regulation',
    date: '2022-04-23',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=36987',
    tags: ['CE İşareti', 'Uygunluk', 'Piyasa Gözetimi']
  },
  {
    id: 12,
    title: 'İhracat Rejimi Kararı',
    description: 'İhracatın düzenlenmesi ve denetlenmesine ilişkin usul ve esasları belirler.',
    category: 'regulation',
    date: '2023-05-20',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=49756',
    tags: ['İhracat', 'Dış Ticaret', 'Gümrük']
  },
  {
    id: 13,
    title: 'Ürün Güvenliği ve Teknik Düzenlemeler Kanunu Uygulama Yönetmeliği',
    description: 'Piyasaya arz edilen ürünlerin güvenlik ve denetim usullerini, teknik düzenlemelere uygunluk prosedürlerini düzenler.',
    category: 'regulation',
    date: '2021-08-10',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=7221',
    tags: ['Ürün Güvenliği', 'Teknik Düzenleme', 'Denetim']
  },
  {
    id: 14,
    title: 'Gümrük Yönetmeliği (Güncel)',
    description: 'Gümrük işlemlerinin yürütülmesi, beyanname düzenlenmesi, menşe kuralları ve tercihli ticaret anlaşmalarına ilişkin usul ve esasları düzenler.',
    category: 'regulation',
    date: '2024-01-10',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=13050',
    tags: ['Gümrük', 'İthalat', 'İhracat', 'Menşe']
  },
  {
    id: 15,
    title: 'Kimyasalların Kaydı, Değerlendirilmesi, İzni ve Kısıtlanması Hakkında Yönetmelik (KKDİK)',
    description: 'Türkiye\'nin REACH benzeri kimyasal mevzuatı. Tekstil ürünlerinde kullanılan kimyasalların kaydı ve kısıtlamaları.',
    category: 'regulation',
    date: '2023-12-23',
    source: 'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı',
    sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=28848',
    tags: ['Kimyasal', 'KKDİK', 'REACH', 'Çevre'],
    important: true
  },
  {
    id: 16,
    title: 'Atık Yönetimi Yönetmeliği',
    description: 'Atıkların oluşumundan bertarafına kadar çevre ve insan sağlığına zarar vermeden yönetiminin sağlanmasına ilişkin usul ve esasları düzenler.',
    category: 'regulation',
    date: '2015-04-02',
    source: 'Çevre ve Şehircilik Bakanlığı',
    sourceUrl: 'https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=20644',
    tags: ['Atık', 'Geri Dönüşüm', 'Çevre']
  },
  {
    id: 17,
    title: 'Bazı Tekstil Ürünlerinin İthalatında Gözetim ve Korunma Önlemleri Yönetmeliği',
    description: 'Tekstil ve konfeksiyon ürünlerinin ithalatında uygulanan gözetim ve korunma önlemlerini düzenler.',
    category: 'regulation',
    date: '2024-03-15',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.ticaret.gov.tr/dis-iliskiler/ticaret-politikasi-savunma-araclari/korunma-onlemleri',
    tags: ['İthalat', 'Tekstil', 'Korunma Önlemi']
  },

  // ========== GENELGELER ==========
  {
    id: 18,
    title: 'İhracat Destekleri Hakkında Karar (2024)',
    description: 'Devlet destekli ihracat teşviklerinin güncel uygulama usul ve esaslarını açıklar. Fuar, pazar araştırması, marka ve tasarım destekleri dahil.',
    category: 'circular',
    date: '2024-03-01',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.ticaret.gov.tr/ihracat/destekler',
    tags: ['İhracat', 'Teşvik', 'Destek', 'Fuar'],
    important: true
  },
  {
    id: 19,
    title: 'KOSGEB KOBİ ve Girişimcilik Destekleri Uygulama Esasları',
    description: 'Küçük ve orta ölçekli işletmelere yönelik destek programlarının güncel uygulama esaslarını düzenler. Makine-teçhizat, yazılım ve eğitim destekleri dahil.',
    category: 'circular',
    date: '2024-01-15',
    source: 'KOSGEB',
    sourceUrl: 'https://www.kosgeb.gov.tr/site/tr/genel/destekler',
    tags: ['KOBİ', 'Destek', 'Teşvik', 'KOSGEB']
  },
  {
    id: 20,
    title: 'Yurt Dışı Fuar Katılım Destekleri Genelgesi (2024)',
    description: 'Yurt dışı fuarlara milli veya bireysel katılımlarda sağlanan stand, nakliye ve tanıtım desteklerinin uygulama esaslarını belirler.',
    category: 'circular',
    date: '2024-02-20',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.ticaret.gov.tr/ihracat/destekler/fuar-destekleri',
    tags: ['Fuar', 'Yurt Dışı', 'Destek', 'Stand'],
    important: true
  },
  {
    id: 21,
    title: 'Türk Ürünlerinin Yurt Dışında Markalaşması (TURQUALITY) Genelgesi',
    description: 'Türk markalarının uluslararası pazarlarda konumlandırılması için sağlanan desteklerin uygulama esaslarını düzenler.',
    category: 'circular',
    date: '2023-11-10',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.ticaret.gov.tr/ihracat/destekler/turquality',
    tags: ['TURQUALITY', 'Marka', 'İhracat', 'Pazarlama']
  },
  {
    id: 22,
    title: 'Ar-Ge ve Tasarım Merkezleri Destekleri Uygulama Genelgesi',
    description: 'Ar-Ge ve tasarım merkezlerine sağlanan vergi indirimi, SGK desteği ve diğer teşviklerin uygulama esaslarını belirler.',
    category: 'circular',
    date: '2024-04-01',
    source: 'Sanayi ve Teknoloji Bakanlığı',
    sourceUrl: 'https://www.sanayi.gov.tr/destek-ve-tesvikler/ar-ge-destekleri',
    tags: ['Ar-Ge', 'Tasarım', 'Teşvik', 'Vergi']
  },
  {
    id: 23,
    title: 'Yeşil Mutabakat Eylem Planı Uygulama Genelgesi',
    description: 'AB Yeşil Mutabakat\'ına uyum sürecinde Türk sanayicilerinin yapması gereken hazırlıklar ve destek mekanizmalarını açıklar.',
    category: 'circular',
    date: '2024-06-01',
    source: 'Ticaret Bakanlığı',
    sourceUrl: 'https://www.ticaret.gov.tr/dis-iliskiler/yesil-mutabakat',
    tags: ['Yeşil Mutabakat', 'Sürdürülebilirlik', 'AB Uyum'],
    important: true
  },

  // ========== ULUSLARARASI ==========
  {
    id: 24,
    title: 'AB Tekstil Ürünleri Yönetmeliği (EU) 2024/1781',
    description: 'Avrupa Birliği\'ne ihraç edilen tekstil ürünlerinin uyması gereken teknik standartlar, elyaf bileşimi etiketleme gereksinimleri.',
    category: 'international',
    date: '2024-06-01',
    source: 'Avrupa Komisyonu',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1781',
    tags: ['AB', 'Tekstil', 'Etiketleme']
  },
  {
    id: 25,
    title: 'REACH Tüzüğü - Tekstil Kimyasalları Kısıtlamaları',
    description: 'AB\'de tekstil ürünlerinde kullanılması kısıtlanan veya yasaklanan kimyasallara ilişkin güncel düzenlemeler.',
    category: 'international',
    date: '2024-01-01',
    source: 'Avrupa Kimyasallar Ajansı (ECHA)',
    sourceUrl: 'https://echa.europa.eu/regulations/reach/legislation',
    tags: ['REACH', 'Kimyasal', 'AB', 'Kısıtlama'],
    important: true
  },
  {
    id: 26,
    title: 'Karbon Sınırda Düzenleme Mekanizması (CBAM) Tüzüğü',
    description: 'AB\'nin karbon sınır vergisi mekanizması. Tekstil sektörüne olası etkileri ve raporlama yükümlülükleri.',
    category: 'international',
    date: '2024-01-01',
    source: 'Avrupa Komisyonu',
    sourceUrl: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en',
    tags: ['CBAM', 'Karbon', 'AB', 'Vergi'],
    important: true
  },
  {
    id: 27,
    title: 'AB Dijital Ürün Pasaportu Yönetmeliği (Taslak)',
    description: 'Tekstil ürünleri için dijital ürün pasaportu zorunluluğu, izlenebilirlik ve sürdürülebilirlik bilgileri gereksinimleri.',
    category: 'international',
    date: '2024-07-01',
    source: 'Avrupa Komisyonu',
    sourceUrl: 'https://environment.ec.europa.eu/topics/circular-economy/digital-product-passport_en',
    tags: ['Dijital Pasaport', 'İzlenebilirlik', 'AB', 'QR Kod']
  },
  {
    id: 28,
    title: 'AB Sürdürülebilir Ürünler için Eko-Tasarım Yönetmeliği (ESPR)',
    description: 'Tekstil ürünlerinin dayanıklılık, onarılabilirlik, geri dönüştürülebilirlik ve çevresel ayak izi gereksinimlerini belirler.',
    category: 'international',
    date: '2024-07-18',
    source: 'Avrupa Komisyonu',
    sourceUrl: 'https://environment.ec.europa.eu/topics/circular-economy/ecodesign-sustainable-products-regulation_en',
    tags: ['Eko-Tasarım', 'Sürdürülebilirlik', 'AB', 'Döngüsel Ekonomi'],
    important: true
  },
  {
    id: 29,
    title: 'ISO 3758 - Tekstil Bakım Etiketleme Sembol Standardı',
    description: 'Tekstil ürünlerinin bakım etiketlerinde kullanılan uluslararası semboller ve işaretleme gereksinimleri.',
    category: 'international',
    date: '2023-01-01',
    source: 'ISO',
    sourceUrl: 'https://www.iso.org/standard/75484.html',
    tags: ['ISO', 'Etiketleme', 'Bakım Sembolleri', 'Standart']
  },
  {
    id: 30,
    title: 'OEKO-TEX Standart 100 Sertifikasyonu',
    description: 'Tekstil ürünlerinde zararlı madde bulunmadığını belgeleyen uluslararası sertifikasyon standardı ve test gereksinimleri.',
    category: 'international',
    date: '2024-01-01',
    source: 'OEKO-TEX',
    sourceUrl: 'https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100',
    tags: ['OEKO-TEX', 'Sertifika', 'Zararlı Madde', 'Test']
  },
  {
    id: 31,
    title: 'AB Kurumsal Sürdürülebilirlik Raporlaması Direktifi (CSRD)',
    description: 'Büyük şirketler için çevresel, sosyal ve yönetişim (ESG) raporlama zorunluluğu. Tekstil tedarik zinciri etkileri.',
    category: 'international',
    date: '2024-01-01',
    source: 'Avrupa Komisyonu',
    sourceUrl: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en',
    tags: ['CSRD', 'ESG', 'Sürdürülebilirlik', 'Raporlama']
  },
  {
    id: 32,
    title: 'AB Zorla Çalıştırma Yasağı Tüzüğü',
    description: 'Zorla çalıştırma ile üretilmiş ürünlerin AB pazarına girişinin yasaklanmasına ilişkin düzenleme.',
    category: 'international',
    date: '2024-04-23',
    source: 'Avrupa Parlamentosu',
    sourceUrl: 'https://www.europarl.europa.eu/news/en/press-room/20240419IPR20551/parliament-adopts-ban-on-products-made-with-forced-labour',
    tags: ['Zorla Çalıştırma', 'İnsan Hakları', 'AB', 'Tedarik Zinciri'],
    important: true
  }
]

export default function Legislation() {
  const [legislationData, setLegislationData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState([])

  useEffect(() => {
    fetchLegislations()
  }, [])

  const fetchLegislations = async () => {
    try {
      const response = await api.get('/legislations')
      setLegislationData(response.data)
    } catch (error) {
      console.error('Mevzuatlar yüklenemedi:', error)
      // API'den veri alınamazsa statik veriyi kullan
      setLegislationData(staticLegislationData)
    } finally {
      setLoading(false)
    }
  }

  // Kategorilerin sayılarını hesapla
  const categories = categoryConfig.map(cat => ({
    ...cat,
    count: cat.id === 'all'
      ? legislationData.length
      : legislationData.filter(l => l.category === cat.id).length
  }))

  const filteredLegislation = legislationData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const tags = item.tags || []
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    // Önce önemli olanlar (hem important hem isImportant kontrolü)
    const isImportantA = a.important || a.isImportant
    const isImportantB = b.important || b.isImportant
    if (isImportantA && !isImportantB) return -1
    if (!isImportantA && isImportantB) return 1

    // Sonra tarihe göre sırala (en yeni üstte)
    const dateA = a.date ? new Date(a.date) : new Date(0)
    const dateB = b.date ? new Date(b.date) : new Date(0)
    return dateB - dateA
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const toggleExpand = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0]
  }

  const getCategoryColor = (categoryId) => {
    const colors = {
      law: 'bg-red-100 text-red-700 border-red-200',
      regulation: 'bg-blue-100 text-blue-700 border-blue-200',
      circular: 'bg-green-100 text-green-700 border-green-200',
      international: 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return colors[categoryId] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getCategoryIconBg = (categoryId) => {
    const colors = {
      law: 'bg-red-500',
      regulation: 'bg-blue-500',
      circular: 'bg-green-500',
      international: 'bg-purple-500'
    }
    return colors[categoryId] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Mevzuat</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Scale className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Yasal Düzenlemeler</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mevzuat
            </h1>
            <p className="text-lg text-primary-100">
              Konfeksiyon yan sanayi sektörünü ilgilendiren kanunlar, yönetmelikler,
              genelgeler ve uluslararası düzenlemeler.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(1).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all hover:shadow-md ${
                selectedCategory === cat.id ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <div className={`w-10 h-10 ${getCategoryIconBg(cat.id)} rounded-lg flex items-center justify-center mb-3`}>
                <cat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{cat.count}</div>
              <div className="text-sm text-gray-500">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mevzuat Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Kanun, yönetmelik ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Kategori</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-primary-200 text-primary-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm mb-1">Bilgilendirme</h4>
                    <p className="text-xs text-blue-700">
                      Mevzuat metinleri bilgilendirme amaçlıdır. Güncel metinler için Resmi Gazete'yi kontrol ediniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legislation List */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredLegislation.length}</span> mevzuat bulundu
              </p>
              {(selectedCategory !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchTerm('')
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>

            {/* Legislation Items */}
            <div className="space-y-4">
              {filteredLegislation.map((item) => {
                const catInfo = getCategoryInfo(item.category)
                const isExpanded = expandedItems.includes(item.id)

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                      (item.important || item.isImportant) ? 'border-amber-200' : 'border-gray-100'
                    }`}
                  >
                    {/* Header */}
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${getCategoryIconBg(item.category)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <catInfo.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                              {catInfo.name}
                            </span>
                            {(item.important || item.isImportant) && (
                              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                Önemli
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.date)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Building className="w-4 h-4" />
                              {item.source}
                            </span>
                          </div>
                        </div>
                        <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isExpanded ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <div className="ml-16">
                          <p className="text-gray-600 mb-4">{item.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(item.tags || []).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            {item.sourceUrl && (
                              <>
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Resmi Kaynağa Git
                                </a>
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                  PDF İndir
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* No Results */}
            {filteredLegislation.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mevzuat Bulunamadı</h3>
                <p className="text-gray-500 mb-4">Arama kriterlerinize uygun mevzuat bulunamadı.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchTerm('')
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Useful Links */}
      <div className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Faydalı Bağlantılar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Resmi Gazete', url: 'https://www.resmigazete.gov.tr', icon: FileText },
              { name: 'Mevzuat Bilgi Sistemi', url: 'https://www.mevzuat.gov.tr', icon: BookOpen },
              { name: 'Ticaret Bakanlığı', url: 'https://www.ticaret.gov.tr', icon: Building },
              { name: 'KOSGEB', url: 'https://www.kosgeb.gov.tr', icon: Globe }
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <link.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{link.name}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    Ziyaret et <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Mevzuat Danışmanlığı
              </h2>
              <p className="text-primary-100">
                Sektörel mevzuat konularında uzman desteği almak için bizimle iletişime geçin.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Bize Ulaşın
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
