import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  ChevronRight,
  Download,
  BookOpen,
  Scale,
  Users,
  Building2,
  Gavel,
  ClipboardList,
  Shield,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import api from '../../utils/api'

const statuteSections = [
  {
    id: 1,
    title: 'Derneğin Adı ve Merkezi',
    icon: Building2,
    type: 'info',
    items: [
      { label: 'Dernek Adı', value: 'Konfeksiyon Yan Sanayi Derneği' },
      { label: 'Kısa Adı', value: 'KYSD' },
      { label: 'Merkez', value: 'İstanbul' }
    ]
  },
  {
    id: 2,
    title: 'Derneğin Amacı',
    icon: Scale,
    type: 'list',
    description: 'Dernek, konfeksiyon yan sanayi sektöründe faaliyet gösteren gerçek ve tüzel kişileri bir araya getirerek aşağıdaki amaçlarla kurulmuştur:',
    items: [
      'Üyelerinin ortak menfaatlerini korumak ve geliştirmek',
      'Sektörün sorunlarını tespit ederek çözüm önerileri üretmek',
      'Üyeler arasında dayanışma ve işbirliğini sağlamak',
      'Sektörün tanıtımına katkıda bulunmak',
      'Mesleki eğitim ve gelişim faaliyetleri düzenlemek',
      'Ulusal ve uluslararası kuruluşlarla işbirliği yapmak'
    ]
  },
  {
    id: 3,
    title: 'Üyelik Şartları',
    icon: Users,
    type: 'checklist',
    description: 'Derneğe üye olabilmek için aşağıdaki şartların sağlanması gerekmektedir:',
    items: [
      'Konfeksiyon yan sanayi sektöründe faaliyet göstermek',
      'Türkiye Cumhuriyeti yasalarına göre tescilli bir işletme olmak',
      'Dernek tüzüğünü kabul etmek',
      'Yönetim Kurulu tarafından üyelik başvurusunun onaylanması',
      'Giriş aidatı ve yıllık aidatları düzenli ödemek'
    ],
    note: 'Üyelik başvuruları Yönetim Kurulu tarafından 30 gün içinde karara bağlanır.'
  },
  {
    id: 4,
    title: 'Üyelik Türleri',
    icon: ClipboardList,
    type: 'cards',
    items: [
      {
        title: 'Asıl Üye',
        description: 'Derneğin amaçlarını benimseyen, üyelik şartlarını taşıyan gerçek ve tüzel kişiler.',
        color: 'bg-blue-500'
      },
      {
        title: 'Onursal Üye',
        description: 'Derneğe maddi veya manevi önemli katkılarda bulunan kişilere Yönetim Kurulu kararıyla verilir. Genel kurulda oy kullanamazlar.',
        color: 'bg-purple-500'
      },
      {
        title: 'Fahri Üye',
        description: 'Sektöre katkıda bulunan akademisyen, araştırmacı ve uzmanlara verilebilir.',
        color: 'bg-emerald-500'
      }
    ]
  },
  {
    id: 5,
    title: 'Üyelikten Çıkma ve Çıkarılma',
    icon: Shield,
    type: 'dual',
    sections: [
      {
        title: 'Üyelikten Çıkma',
        color: 'green',
        description: 'Her üye yazılı olarak bildirmek kaydıyla dernek üyeliğinden çıkabilir.'
      },
      {
        title: 'Üyelikten Çıkarılma',
        color: 'red',
        description: 'Aşağıdaki durumlarda üyelikten çıkarılma kararı verilebilir:',
        items: [
          'Dernek tüzüğüne aykırı davranışlarda bulunmak',
          'Verilen görevlerden sürekli kaçınmak',
          'Üyelik aidatını üst üste iki yıl ödememek',
          'Dernek organlarınca verilen kararlara uymamak',
          'Üye olma şartlarını kaybetmek'
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Dernek Organları',
    icon: Gavel,
    type: 'organs',
    items: [
      {
        title: 'Genel Kurul',
        members: 'Tüm üyeler',
        description: 'Derneğin en yetkili karar organıdır. Olağan genel kurul yılda bir kez toplanır.',
        icon: Users
      },
      {
        title: 'Yönetim Kurulu',
        members: '7 asıl + 7 yedek üye',
        description: 'Derneği temsil ve yönetim yetkisine sahiptir.',
        icon: Building2
      },
      {
        title: 'Denetim Kurulu',
        members: '3 asıl + 3 yedek üye',
        description: 'Derneğin hesaplarını ve faaliyetlerini denetler.',
        icon: Shield
      },
      {
        title: 'Disiplin Kurulu',
        members: '3 asıl + 3 yedek üye',
        description: 'Üyelerin tüzüğe aykırı davranışlarını inceler.',
        icon: Gavel
      }
    ]
  }
]

export default function Statute() {
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id)
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
            <Link to="/hakkimizda" className="text-primary-200 hover:text-white transition-colors">
              Kurumsal
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Tüzük</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FileText className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Resmi Belge</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Dernek Tüzüğü
            </h1>
            <p className="text-lg text-primary-100 mb-8">
              Konfeksiyon Yan Sanayi Derneği'nin kuruluş amacı, üyelik şartları ve
              organizasyon yapısını düzenleyen resmi tüzük belgesi.
            </p>
            <a
              href="/documents/kysd-tuzuk.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <Download className="w-5 h-5" />
              PDF Olarak İndir
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900">İçindekiler</h3>
              </div>

              <nav className="space-y-2">
                {statuteSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setExpandedSection(section.id)
                      document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      expandedSection === section.id
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-primary-500 font-medium mr-2">{section.id}.</span>
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Quick Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent-500" />
                    <span>Son güncelleme: 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-500" />
                    <span>Resmi Gazete ile tescilli</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Introduction Card */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Konfeksiyon Yan Sanayi Derneği Tüzüğü
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Bu tüzük, 5253 sayılı Dernekler Kanunu ve ilgili mevzuat hükümlerine uygun olarak
                    hazırlanmış olup, derneğin kuruluşu, amacı, faaliyetleri ve yönetim yapısını düzenlemektedir.
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion Sections */}
            {statuteSections.map((section) => (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-24"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-primary-600 font-medium mb-1">
                        Madde {section.id}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    expandedSection === section.id ? 'bg-primary-600' : 'bg-gray-100'
                  }`}>
                    {expandedSection === section.id ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>

                {expandedSection === section.id && (
                  <div className="px-6 pt-2 pb-6">
                    <div className="bg-gray-50 rounded-xl p-6 ml-16">
                      {/* Type: Info - Bilgi kartları */}
                      {section.type === 'info' && (
                        <div className="grid sm:grid-cols-3 gap-4">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{item.label}</div>
                              <div className="text-lg font-semibold text-gray-900">{item.value}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Type: List - Madde listesi */}
                      {section.type === 'list' && (
                        <div>
                          <p className="text-gray-600 mb-4">{section.description}</p>
                          <div className="space-y-3">
                            {section.items.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-bold text-primary-600">{idx + 1}</span>
                                </div>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Type: Checklist - Onay listesi */}
                      {section.type === 'checklist' && (
                        <div>
                          <p className="text-gray-600 mb-4">{section.description}</p>
                          <div className="space-y-2 mb-4">
                            {section.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                          {section.note && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">!</span>
                              </div>
                              <p className="text-amber-800 text-sm">{section.note}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Type: Cards - Üyelik türleri kartları */}
                      {section.type === 'cards' && (
                        <div className="grid sm:grid-cols-3 gap-4">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              <div className={`${item.color} h-2`}></div>
                              <div className="p-4">
                                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Type: Dual - Çıkma/Çıkarılma */}
                      {section.type === 'dual' && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {section.sections.map((sec, idx) => (
                            <div
                              key={idx}
                              className={`rounded-xl border-2 p-5 ${
                                sec.color === 'green'
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-red-50 border-red-200'
                              }`}
                            >
                              <h4 className={`font-bold mb-3 flex items-center gap-2 ${
                                sec.color === 'green' ? 'text-green-800' : 'text-red-800'
                              }`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  sec.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {sec.color === 'green' ? (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                  )}
                                </div>
                                {sec.title}
                              </h4>
                              <p className={`text-sm mb-3 ${sec.color === 'green' ? 'text-green-700' : 'text-red-700'}`}>
                                {sec.description}
                              </p>
                              {sec.items && (
                                <ul className="space-y-2">
                                  {sec.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                                      <span className="text-red-400 mt-1">•</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Type: Organs - Dernek organları */}
                      {section.type === 'organs' && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <item.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                  <div className="text-xs text-primary-600 font-medium mb-2 bg-primary-50 inline-block px-2 py-1 rounded">
                                    {item.members}
                                  </div>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Footer Note */}
            <div className="bg-gray-100 rounded-2xl p-6 mt-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Not</h4>
                  <p className="text-sm text-gray-600">
                    Yukarıda yer alan maddeler tüzüğün özet halidir. Tam metin için PDF dosyasını
                    indirebilir veya dernek merkezimizden temin edebilirsiniz.
                  </p>
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
                Üye Olmak İster misiniz?
              </h2>
              <p className="text-primary-100">
                Tüzüğümüzü incelediyseniz, şimdi başvuru yapabilirsiniz.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/uyelik-basvurusu"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Başvuru Yap
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
