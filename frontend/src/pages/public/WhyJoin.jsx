import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, TrendingUp, BookOpen, Globe, Shield, Handshake,
  Award, FileText, Calendar, Building2, ChevronRight,
  CheckCircle2, ArrowRight, Star
} from 'lucide-react'
import api from '../../utils/api'
import { toTitleCase } from '../../utils/helpers'

const benefits = [
  {
    icon: Users,
    title: 'Güçlü Sektörel Temsil',
    description: 'Konfeksiyon yan sanayinin güçlü sesi olun. Sektörün sorunları ve talepleri yetkili makamlara etkin şekilde iletilir.',
    color: 'bg-blue-500'
  },
  {
    icon: Handshake,
    title: 'İş Birliği & Networking',
    description: 'Sektördeki diğer firmalarla tanışma, işbirliği ve ortak iş geliştirme fırsatları yakalayın.',
    color: 'bg-emerald-500'
  },
  {
    icon: BookOpen,
    title: 'Eğitim & Seminerler',
    description: 'Ücretsiz veya indirimli eğitim programları, sertifikalı kurslar ve sektörel seminerlerden yararlanın.',
    color: 'bg-purple-500'
  },
  {
    icon: Globe,
    title: 'Fuar Katılımları',
    description: 'Yurt içi ve yurt dışı fuarlara toplu katılım organizasyonları ile maliyetlerinizi düşürün.',
    color: 'bg-orange-500'
  },
  {
    icon: FileText,
    title: 'Sektörel Raporlar',
    description: 'Güncel pazar analizleri, sektör raporları ve mevzuat değişikliklerinden anında haberdar olun.',
    color: 'bg-cyan-500'
  },
  {
    icon: Shield,
    title: 'Hukuki Destek',
    description: 'Sektörel hukuki danışmanlık ve mevzuat konularında uzman desteği alın.',
    color: 'bg-red-500'
  }
]

const criteria = [
  'Konfeksiyon yan sanayi sektöründe faaliyet göstermek',
  'Türkiye\'de tescilli bir şirket olmak',
  'Dernek tüzüğünü kabul etmek',
  'Yıllık aidat ödemelerini düzenli yapmak',
  'Sektörel etik kurallara uymak'
]

export default function WhyJoin() {
  const [groups, setGroups] = useState([])
  const [memberCount, setMemberCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await api.get('/industry-groups')
      setGroups(response.data)

      let total = 0
      response.data.forEach(group => {
        total += group.members?.length || 0
      })
      setMemberCount(total)
    } catch (error) {
      console.error('Veri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { value: `${memberCount || 116}+`, label: 'Üye Firma', icon: Building2 },
    { value: '34+', label: 'Yıllık Deneyim', icon: Award },
    { value: `${groups.length || 8}`, label: 'Sanayi Grubu', icon: Users },
    { value: '50+', label: 'Yıllık Etkinlik', icon: Calendar }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
          <p className="mt-4 text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">KYSD Üyelik Avantajları</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Neden KYSD Üyesi <br className="hidden md:block" />
              <span className="text-accent-400">Olmalısınız?</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-10">
              Türkiye'nin en köklü konfeksiyon yan sanayi derneğine katılın, sektörün gücünden yararlanın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/uyelik-basvurusu"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Hemen Üye Ol
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/uyeler"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-colors backdrop-blur-sm"
              >
                Üye Rehberi
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4">
                  <stat.icon className="w-7 h-7 text-primary-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Üyelik Avantajları
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            KYSD üyesi olarak birçok özel avantajdan yararlanabilirsiniz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 ${benefit.color} rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Üyelik Süreci
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sadece 3 adımda KYSD ailesine katılın
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Online Başvuru', desc: 'Başvuru formunu doldurun' },
                { step: '02', title: 'Değerlendirme', desc: 'Başvurunuz incelenir' },
                { step: '03', title: 'Üyelik Onayı', desc: 'KYSD ailesine hoş geldiniz!' }
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <span className="text-2xl font-bold text-primary-600">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>

                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary-100">
                      <ChevronRight className="absolute right-0 -top-2 w-5 h-5 text-primary-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Membership Criteria */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Üyelik Kriterleri
            </h2>
            <p className="text-gray-600 mb-8">
              KYSD üyeliği için aşağıdaki kriterleri karşılayan tüm firmalar başvurabilir:
            </p>

            <div className="space-y-4">
              {criteria.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Sanayi Gruplarımız</h3>
            <div className="space-y-3">
              {groups.slice(0, 6).map((group) => (
                <Link
                  key={group.id}
                  to={`/sanayi-grubu/${group.slug}`}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <span className="font-medium">{toTitleCase(group.name)}</span>
                  <span className="text-primary-200 text-sm">{group.members?.length || 0} üye</span>
                </Link>
              ))}
            </div>
            <Link
              to="/sanayi-gruplari"
              className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 mt-6 font-medium"
            >
              Tüm Grupları Gör
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-accent-500 to-accent-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sektörün Gücüne Katılın
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            {memberCount}+ üye firma ile birlikte sektörün geleceğini şekillendirin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/uyelik-basvurusu"
              className="inline-flex items-center gap-2 bg-white text-accent-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Üyelik Başvurusu Yap
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
