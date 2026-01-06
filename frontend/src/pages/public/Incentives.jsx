import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Gift,
  ChevronRight,
  Search,
  Building2,
  Globe,
  Briefcase,
  GraduationCap,
  Factory,
  Banknote,
  TrendingUp,
  Users,
  FileText,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Clock,
  Calendar,
  AlertCircle,
  Percent,
  Target,
  Award
} from 'lucide-react'

const categories = [
  { id: 'all', name: 'Tümü', icon: Gift },
  { id: 'ito', name: 'İTO Destekleri', icon: Building2 },
  { id: 'export', name: 'İhracat Destekleri', icon: Globe },
  { id: 'kosgeb', name: 'KOSGEB Destekleri', icon: Building2 },
  { id: 'investment', name: 'Yatırım Teşvikleri', icon: Factory },
  { id: 'employment', name: 'İstihdam Destekleri', icon: Users },
  { id: 'rd', name: 'Ar-Ge Destekleri', icon: Target },
  { id: 'education', name: 'Eğitim Destekleri', icon: GraduationCap }
]

const incentivesData = [
  // İTO Destekleri (2025)
  {
    id: 101,
    title: 'İTO Yurt Dışı Pazar Araştırması Desteği',
    description: 'Yurt dışı pazar araştırması gezileri için ulaşım ve konaklama giderlerinin desteklenmesi.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%70',
    maxAmount: '5.000 $ / gezinti',
    deadline: '2025-12-31',
    status: 'active',
    featured: true,
    benefits: [
      'Ulaşım giderleri desteği',
      'Konaklama giderleri desteği',
      'Pazar analizi desteği',
      'İş görüşmeleri organizasyonu'
    ],
    conditions: [
      'İTO üyesi olmak',
      'İhracatçı Birliği üyeliği',
      'Başvuru 6 ay içinde yapılmalı'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  {
    id: 102,
    title: 'İTO UR-GE Projeleri Desteği',
    description: 'Uluslararası Rekabetçiliğin Geliştirilmesi kapsamında ihtiyaç analizi, eğitim, danışmanlık ve yurt dışı pazarlama destekleri.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%75',
    maxAmount: '400.000 $',
    deadline: 'Sürekli',
    status: 'active',
    featured: true,
    benefits: [
      'İhtiyaç analizi desteği',
      'Eğitim ve danışmanlık hizmetleri',
      'Yurt dışı pazarlama desteği (150.000 $/faaliyet)',
      'Alım heyetleri organizasyonu (100.000 $/faaliyet)'
    ],
    conditions: [
      'İşbirliği kuruluşu üzerinden başvuru',
      'Proje süresi 3 yıl (2 yıl uzatılabilir)',
      'Minimum firma sayısı şartı'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  {
    id: 103,
    title: 'İTO Fuar Katılım Desteği',
    description: 'Yurt dışında düzenlenen sektörel ve prestijli fuarlara katılım için stand ve tanıtım giderleri desteği.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası',
    supportRate: '%50 - %70',
    maxAmount: '250.000 TL',
    deadline: '2025-12-31',
    status: 'active',
    benefits: [
      'Genel nitelikli fuarlar: 50.000 TL',
      'Sektörel fuarlar: 75.000 TL',
      'Prestijli fuarlar: 250.000 TL',
      'Yıllık maksimum 2 fuar katılımı'
    ],
    conditions: [
      'İTO üyesi olmak',
      'İhracatçı Birliği üyeliği',
      'Başvuru İhracatçı Birlikleri Genel Sekreterliğine yapılır'
    ],
    link: 'https://www.ito.org.tr/tr/fuarlar'
  },
  {
    id: 104,
    title: 'İTO E-Ticaret ve Dijital Pazarlama Desteği',
    description: 'E-ticaret platformlarına üyelik ve dijital pazarlama faaliyetleri için destek programı.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%80',
    maxAmount: '2.000 $ / site / yıl',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'E-ticaret platformu üyelik desteği',
      'Dijital pazarlama giderleri',
      '3 yıla kadar destek süresi',
      'Minimum 250 şirket katılımı ile işbirliği'
    ],
    conditions: [
      'İşbirliği kuruluşu üzerinden başvuru',
      'Türkiye\'de üretim yapan firma olmak',
      'Sermaye şirketi statüsünde olmak'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  {
    id: 105,
    title: 'İTO Pazara Giriş Belgeleri Desteği',
    description: 'Uluslararası sertifikasyon, test ve akreditasyon giderlerinin desteklenmesi.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%50',
    maxAmount: '250.000 $ / yıl',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Sertifikasyon giderleri',
      'Test ve analiz giderleri',
      'Akreditasyon masrafları',
      'Küresel Tedarik Zinciri Yetkinlik Projesi: 1.000.000 $'
    ],
    conditions: [
      'İhracatçı Birliği üyeliği',
      'Uluslararası standartlara uyum hedefi',
      'Başvuru İhracatçı Birlikleri Genel Sekreterliğine'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  {
    id: 106,
    title: 'İTO TURQUALITY ve Marka Desteği',
    description: 'Türk markalarının uluslararası pazarlarda tanınırlığını artırmak için kapsamlı destek programı.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%50',
    maxAmount: '2.400.000 TL / yıl',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Marka tescili: 200.000 TL/yıl',
      'Tanıtım faaliyetleri: 1.600.000 TL/yıl',
      'Mağaza kiralama: 2.400.000 TL/yıl',
      'Kurulum ve dekorasyon: 1.200.000 TL/yıl'
    ],
    conditions: [
      'Türkiye\'de tescilli marka sahibi olmak',
      'Marka stratejisi planı sunmak',
      'TURQUALITY programı için ek kriterler'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  {
    id: 107,
    title: 'İTO Yurt Dışı Birim Kira Desteği',
    description: 'Yurt dışında mağaza, ofis veya showroom açan firmalara kira desteği.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%50 - %60',
    maxAmount: '120.000 $ / yıl',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Mağaza/Ofis kirası: %50, 120.000 $',
      'Tanıtım giderleri: %60, 150.000 $/ülke',
      'Birim olmayan şirketler: %60, 250.000 $',
      '4 yıla kadar destek süresi'
    ],
    conditions: [
      'İhracatçı Birliği üyeliği',
      'Yurt dışında birim açma taahhüdü',
      'Başvuru İhracatçı Birlikleri Genel Sekreterliğine'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  {
    id: 108,
    title: 'İTO Sektörel Ticaret Heyeti Desteği',
    description: 'Ticaret ve alım heyetleri organizasyonları için destek programı.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%50 - %60',
    maxAmount: '100.000 $ / program',
    deadline: '2025-12-31',
    status: 'active',
    benefits: [
      'Ticaret heyetleri: %50, 100.000 $/program',
      'Alım heyetleri: %50, 75.000 $/program',
      'Hedef ülkelerde +%10 ek destek',
      'Bölgesel destek: +%20 puana kadar'
    ],
    conditions: [
      'Başvuru 3 ay öncesinden Bakanlığa',
      'Hedef ülke kriterlerine uyum',
      'Minimum katılımcı sayısı şartı'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  {
    id: 109,
    title: 'İTO Tasarım Desteği',
    description: 'Tasarımcı şirketleri ve tasarım ofisleri için tanıtım, istihdam ve ekipman destekleri.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%50',
    maxAmount: '1.000.000 $',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Tanıtım desteği: 300.000 $',
      'Yurt dışı birim kiralama: 200.000 $',
      'Marka tescili: 50.000 $',
      'Personel istihdamı: 1.000.000 $'
    ],
    conditions: [
      'Tasarımcı şirketi veya tasarım ofisi olmak',
      'Özgün tasarım ürünleri üretmek',
      'Uluslararası pazarlara açılım hedefi'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  {
    id: 110,
    title: 'İTO Rapor ve Danışmanlık Desteği',
    description: 'Pazar araştırma raporları ve danışmanlık hizmetleri için destek programı.',
    category: 'ito',
    institution: 'İstanbul Ticaret Odası / Ticaret Bakanlığı',
    supportRate: '%60 - %75',
    maxAmount: '500.000 $ / yıl',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Şirketler için: %60, 200.000 $/yıl',
      'İşbirliği kuruluşları için: %75',
      'İleri teknoloji şirket alım danışmanlığı: 500.000 $',
      'Kredi faiz desteği: TL 5 puan, Döviz 2 puan'
    ],
    conditions: [
      'Başvuru Ticaret Bakanlığı İhracat Genel Müdürlüğüne',
      'Uluslararası pazarlara açılım stratejisi',
      'Raporların kullanım amacının belirlenmesi'
    ],
    link: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler/ihracata-yonelik-devlet-destekleri'
  },
  // Mevcut destekler
  {
    id: 1,
    title: 'Yurt Dışı Fuar Katılım Desteği',
    description: 'Yurt dışında düzenlenen fuarlara katılım için stand kirası, nakliye ve tanıtım giderlerinin desteklenmesi.',
    category: 'export',
    institution: 'Ticaret Bakanlığı',
    supportRate: '%50 - %70',
    maxAmount: '50.000 $',
    deadline: '2025-06-30',
    status: 'active',
    benefits: [
      'Stand kirası desteği',
      'Nakliye giderleri desteği',
      'Tanıtım ve promosyon desteği',
      'Tercümanlık hizmeti desteği'
    ],
    conditions: [
      'İmalatçı veya imalatçı-ihracatçı olmak',
      'Son 3 yılda en az 1 yurt dışı fuar katılımı',
      'Başvuru süresi içinde müracaat'
    ],
    link: 'https://www.ticaret.gov.tr'
  },
  {
    id: 2,
    title: 'Marka ve TURQUALITY Desteği',
    description: 'Türk markalarının uluslararası pazarlarda bilinirliğini artırmak için kapsamlı destek programı.',
    category: 'export',
    institution: 'Ticaret Bakanlığı',
    supportRate: '%50',
    maxAmount: '300.000 $',
    deadline: '2025-12-31',
    status: 'active',
    featured: true,
    benefits: [
      'Marka tescil giderleri',
      'Tanıtım ve pazarlama faaliyetleri',
      'Yurt dışı birim giderleri',
      'Danışmanlık hizmetleri'
    ],
    conditions: [
      'Türkiye\'de tescilli marka sahibi olmak',
      'Son 3 yılda en az 1 milyon $ ihracat',
      'Marka stratejisi planı sunmak'
    ],
    link: 'https://www.ticaret.gov.tr'
  },
  {
    id: 3,
    title: 'KOSGEB İşletme Geliştirme Desteği',
    description: 'KOBİ\'lerin üretim, kalite, verimlilik ve kapasitelerini artırmaya yönelik destekler.',
    category: 'kosgeb',
    institution: 'KOSGEB',
    supportRate: '%60',
    maxAmount: '300.000 TL',
    deadline: '2025-03-31',
    status: 'active',
    benefits: [
      'Makine-teçhizat desteği',
      'Yazılım desteği',
      'Kalite belgelendirme desteği',
      'Test ve analiz desteği'
    ],
    conditions: [
      'KOSGEB veri tabanına kayıtlı olmak',
      'KOBİ tanımına uymak',
      'Aktif üretim faaliyeti yürütmek'
    ],
    link: 'https://www.kosgeb.gov.tr'
  },
  {
    id: 4,
    title: 'KOSGEB Girişimcilik Desteği',
    description: 'Yeni girişimcilerin iş kurma ve geliştirme süreçlerinde finansal destek.',
    category: 'kosgeb',
    institution: 'KOSGEB',
    supportRate: '%100',
    maxAmount: '150.000 TL',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Kuruluş desteği',
      'Makine-teçhizat desteği',
      'İşletme giderleri desteği',
      'Mentörlük hizmeti'
    ],
    conditions: [
      'Girişimcilik eğitimi almak',
      'İş planı hazırlamak',
      'Son 1 yıl içinde şirket kurmak'
    ],
    link: 'https://www.kosgeb.gov.tr'
  },
  {
    id: 5,
    title: 'Yatırım Teşvik Belgesi',
    description: 'Stratejik ve büyük ölçekli yatırımlar için vergi indirimleri ve gümrük muafiyetleri.',
    category: 'investment',
    institution: 'Sanayi Bakanlığı',
    supportRate: 'Değişken',
    maxAmount: 'Yatırıma göre',
    deadline: 'Sürekli',
    status: 'active',
    featured: true,
    benefits: [
      'KDV istisnası',
      'Gümrük vergisi muafiyeti',
      'Vergi indirimi',
      'Sigorta primi desteği',
      'Faiz desteği',
      'Yatırım yeri tahsisi'
    ],
    conditions: [
      'Asgari yatırım tutarını sağlamak',
      'Teşvik edilecek sektörde olmak',
      'Yatırım projesini sunmak'
    ],
    link: 'https://www.sanayi.gov.tr'
  },
  {
    id: 6,
    title: 'SGK Prim Teşviki (6111)',
    description: 'İşverenlere sağlanan SGK primi işveren hissesi desteği.',
    category: 'employment',
    institution: 'SGK',
    supportRate: '%5',
    maxAmount: 'Sınırsız',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'İşveren primi 5 puan indirimi',
      'Otomatik uygulama',
      'Tüm çalışanlar için geçerli'
    ],
    conditions: [
      'SGK\'ya borcu olmamak',
      'Kayıt dışı işçi çalıştırmamak',
      'Aylık bildirgeleri süresinde vermek'
    ],
    link: 'https://www.sgk.gov.tr'
  },
  {
    id: 7,
    title: 'Genç ve Kadın İstihdamı Teşviki',
    description: '18-29 yaş arası gençler ve kadın çalışanlar için SGK prim desteği.',
    category: 'employment',
    institution: 'İŞKUR / SGK',
    supportRate: '%100',
    maxAmount: '24 ay',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'İşveren SGK primi tam destek',
      'Gelir vergisi stopajı desteği',
      'Damga vergisi desteği'
    ],
    conditions: [
      'İŞKUR\'a kayıtlı işsiz istihdam etmek',
      '18-29 yaş arası erkek veya 18+ kadın',
      'Son 6 ay sigortalı olmamış olmak'
    ],
    link: 'https://www.iskur.gov.tr'
  },
  {
    id: 8,
    title: 'TÜBİTAK Ar-Ge Desteği',
    description: 'Ar-Ge ve yenilik projelerinin desteklenmesi programı.',
    category: 'rd',
    institution: 'TÜBİTAK',
    supportRate: '%75',
    maxAmount: '2.000.000 TL',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Personel giderleri desteği',
      'Malzeme ve sarf desteği',
      'Makine-teçhizat desteği',
      'Danışmanlık ve hizmet alımı'
    ],
    conditions: [
      'Ar-Ge projesi sunmak',
      'Türkiye\'de yerleşik olmak',
      'Proje ekibi oluşturmak'
    ],
    link: 'https://www.tubitak.gov.tr'
  },
  {
    id: 9,
    title: 'Ar-Ge Merkezi Teşvikleri',
    description: 'Ar-Ge merkezi kuran firmalara sağlanan vergisel avantajlar.',
    category: 'rd',
    institution: 'Sanayi Bakanlığı',
    supportRate: '%100',
    maxAmount: 'Sınırsız',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Ar-Ge indirimi',
      'Gelir vergisi stopajı teşviki',
      'SGK işveren hissesi desteği',
      'Damga vergisi istisnası',
      'Gümrük vergisi muafiyeti'
    ],
    conditions: [
      'En az 15 tam zamanlı Ar-Ge personeli',
      'Ar-Ge merkezi başvurusu',
      'Yıllık faaliyet raporu sunmak'
    ],
    link: 'https://www.sanayi.gov.tr'
  },
  {
    id: 10,
    title: 'Mesleki Eğitim Desteği',
    description: 'Çalışanlara yönelik mesleki eğitim programları desteği.',
    category: 'education',
    institution: 'İŞKUR',
    supportRate: '%100',
    maxAmount: '50.000 TL',
    deadline: 'Sürekli',
    status: 'active',
    benefits: [
      'Eğitmen giderleri',
      'Eğitim materyalleri',
      'Katılımcı ulaşım desteği',
      'Belgelendirme desteği'
    ],
    conditions: [
      'İŞKUR onaylı eğitim programı',
      'En az 10 çalışan eğitimi',
      'Mesleki yeterlilik belgesi'
    ],
    link: 'https://www.iskur.gov.tr'
  }
]

export default function Incentives() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  const filteredIncentives = incentivesData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.institution.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !showOnlyActive || item.status === 'active'
    return matchesCategory && matchesSearch && matchesStatus
  })

  const featuredIncentives = incentivesData.filter(i => i.featured)

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0]
  }

  const getCategoryColor = (categoryId) => {
    const colors = {
      ito: 'bg-amber-500',
      export: 'bg-blue-500',
      kosgeb: 'bg-green-500',
      investment: 'bg-purple-500',
      employment: 'bg-orange-500',
      rd: 'bg-cyan-500',
      education: 'bg-pink-500'
    }
    return colors[categoryId] || 'bg-gray-500'
  }

  const getCategoryBadge = (categoryId) => {
    const colors = {
      ito: 'bg-amber-100 text-amber-700',
      export: 'bg-blue-100 text-blue-700',
      kosgeb: 'bg-green-100 text-green-700',
      investment: 'bg-purple-100 text-purple-700',
      employment: 'bg-orange-100 text-orange-700',
      rd: 'bg-cyan-100 text-cyan-700',
      education: 'bg-pink-100 text-pink-700'
    }
    return colors[categoryId] || 'bg-gray-100 text-gray-700'
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
            <span className="text-white font-medium">Teşvik ve Destekler</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Gift className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Devlet Destekleri</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Teşvik ve Destekler
            </h1>
            <p className="text-lg text-primary-100">
              Konfeksiyon yan sanayi sektörüne yönelik devlet teşvikleri, KOSGEB destekleri,
              ihracat yardımları ve yatırım teşvikleri hakkında bilgi edinin.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Incentives */}
      {featuredIncentives.length > 0 && (
        <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {featuredIncentives.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-white/80 text-xs font-medium">Öne Çıkan</span>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{item.supportRate}</div>
                    <div className="text-white/70 text-xs">Destek Oranı</div>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {item.institution}
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-white text-accent-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Detaylar
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Quick Filters */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Destek Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Teşvik, destek ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{incentivesData.filter(i => i.status === 'active').length}</div>
                  <div className="text-xs text-green-700">Aktif Destek</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{categories.length - 1}</div>
                  <div className="text-xs text-blue-700">Kategori</div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Hızlı Erişim</h4>
                {[
                  { name: 'İstanbul Ticaret Odası', url: 'https://www.ito.org.tr/tr/hizmetler/tesvik-ve-destekler', icon: Building2 },
                  { name: 'KOSGEB', url: 'https://www.kosgeb.gov.tr', icon: Building2 },
                  { name: 'Ticaret Bakanlığı', url: 'https://www.ticaret.gov.tr', icon: Briefcase },
                  { name: 'TÜBİTAK', url: 'https://www.tubitak.gov.tr', icon: Target },
                  { name: 'İŞKUR', url: 'https://www.iskur.gov.tr', icon: Users },
                  { name: 'Kolay Destek', url: 'https://kolaydestek.gov.tr', icon: Gift }
                ].map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <link.icon className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-primary-600">{link.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Incentives Grid */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredIncentives.length}</span> destek programı bulundu
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

            {/* Incentives List */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredIncentives.map((item) => {
                const catInfo = getCategoryInfo(item.category)

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                  >
                    {/* Header */}
                    <div className={`${getCategoryColor(item.category)} h-1.5`}></div>

                    <div className="p-5">
                      {/* Category & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryBadge(item.category)}`}>
                          {catInfo.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Aktif
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                            <Percent className="w-3 h-3" />
                            Destek Oranı
                          </div>
                          <div className="font-bold text-gray-900">{item.supportRate}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                            <Banknote className="w-3 h-3" />
                            Üst Limit
                          </div>
                          <div className="font-bold text-gray-900 text-sm">{item.maxAmount}</div>
                        </div>
                      </div>

                      {/* Institution & Deadline */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {item.institution}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.deadline}
                        </span>
                      </div>

                      {/* Benefits Preview */}
                      <div className="border-t border-gray-100 pt-4">
                        <div className="text-xs font-medium text-gray-500 mb-2">Sağlanan Destekler:</div>
                        <div className="flex flex-wrap gap-1">
                          {item.benefits.slice(0, 3).map((benefit, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                              {benefit}
                            </span>
                          ))}
                          {item.benefits.length > 3 && (
                            <span className="text-xs text-primary-600 px-2 py-1">
                              +{item.benefits.length - 3} daha
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
                      >
                        Detaylı Bilgi
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* No Results */}
            {filteredIncentives.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Destek Bulunamadı</h3>
                <p className="text-gray-500 mb-4">Arama kriterlerinize uygun destek programı bulunamadı.</p>
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

      {/* Info Section */}
      <div className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Önemli Bilgilendirme</h3>
                  <p className="text-amber-800 mb-4">
                    Bu sayfada yer alan teşvik ve destek bilgileri genel bilgilendirme amaçlıdır.
                    Güncel şartlar, başvuru süreçleri ve detaylar için ilgili kurumların resmi
                    web sitelerini ziyaret ediniz.
                  </p>
                  <ul className="space-y-2 text-sm text-amber-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Başvuru öncesi güncel şartları kontrol edin
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Son başvuru tarihlerini takip edin
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Gerekli belgeleri eksiksiz hazırlayın
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Teşvik Danışmanlığı
              </h2>
              <p className="text-primary-100">
                Hangi desteklerden yararlanabileceğinizi öğrenmek için bizimle iletişime geçin.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Danışmanlık Al
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/uyelik-basvurusu"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
