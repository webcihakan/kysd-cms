import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Building2, Calendar, Award, Target, Eye, Heart,
  Handshake, ChevronRight, ArrowRight, Globe, Shield,
  TrendingUp, Factory, CheckCircle2, Star
} from 'lucide-react'
import api from '../../utils/api'

export default function About() {
  const [pageData, setPageData] = useState(null)
  const [stats, setStats] = useState({
    members: 0,
    groups: 0,
    years: 34
  })
  const [loading, setLoading] = useState(true)

  // Varsayılan değerler
  const defaultValues = [
    {
      icon: 'Handshake',
      title: 'Dayanışma',
      description: 'Sektördeki tüm paydaşlarla güçlü işbirlikleri kurarak birlikte büyüyoruz.',
      color: 'bg-blue-500'
    },
    {
      icon: 'Shield',
      title: 'Güvenilirlik',
      description: 'Üyelerimizin haklarını korumak ve temsil etmek en önemli önceliğimizdir.',
      color: 'bg-emerald-500'
    },
    {
      icon: 'TrendingUp',
      title: 'Gelişim',
      description: 'Sürekli öğrenme ve yenilikçi yaklaşımlarla sektörün gelişimine katkı sağlıyoruz.',
      color: 'bg-purple-500'
    },
    {
      icon: 'Globe',
      title: 'Küresel Vizyon',
      description: 'Türk konfeksiyon yan sanayini uluslararası arenada temsil ediyoruz.',
      color: 'bg-orange-500'
    }
  ]

  const defaultMilestones = [
    { year: '1995', title: 'Kuruluş', desc: 'KYSD\'nin temelleri atıldı' },
    { year: '2000', title: 'Büyüme', desc: 'Üye sayısı 50\'yi aştı' },
    { year: '2010', title: 'Uluslararası', desc: 'İlk yurt dışı fuar katılımı' },
    { year: '2020', title: 'Dijitalleşme', desc: 'Online hizmetler başlatıldı' },
    { year: '2024', title: 'Bugün', desc: '116+ üye ile güçlü bir aile' }
  ]

  const iconMap = {
    'Handshake': Handshake,
    'Shield': Shield,
    'TrendingUp': TrendingUp,
    'Globe': Globe,
    'Heart': Heart,
    'Award': Award,
    'Users': Users,
    'Target': Target
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Sayfa verisi
      const pageResponse = await api.get('/pages/slug/hakkimizda')
      setPageData(pageResponse.data)

      // İstatistikler
      const groupsResponse = await api.get('/industry-groups')
      let memberCount = 0
      groupsResponse.data.forEach(group => {
        memberCount += group.members?.length || 0
      })
      setStats({
        members: memberCount,
        groups: groupsResponse.data.length,
        years: 34
      })
    } catch (error) {
      console.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // Sayfa verilerini parse et
  const getPageContent = () => {
    if (!pageData) return {}

    // excerpt'ten JSON veri çekmeye çalış
    let extraData = {}
    try {
      if (pageData.excerpt && pageData.excerpt.startsWith('{')) {
        extraData = JSON.parse(pageData.excerpt)
      }
    } catch (e) {}

    return {
      title: pageData.title || 'Konfeksiyon Yan Sanayicileri Derneği',
      subtitle: extraData.subtitle || 'Türkiye\'nin önde gelen konfeksiyon yan sanayi kuruluşlarını bir araya getiren, sektörün güçlü sesi ve temsilcisi.',
      content: pageData.content || '',
      vision: extraData.vision || 'Türk konfeksiyon yan sanayini dünya standartlarına taşıyarak, sektörümüzün küresel rekabet gücünü artırmak ve uluslararası pazarlarda söz sahibi olmak.',
      mission: extraData.mission || 'Üyelerimizin çıkarlarını korumak, sektörel işbirliğini güçlendirmek, yenilikçi çözümler üretmek ve sürdürülebilir büyümeye katkı sağlamak.',
      values: extraData.values || defaultValues,
      milestones: extraData.milestones || defaultMilestones,
      image: pageData.image
    }
  }

  const content = getPageContent()
  const values = content.values || defaultValues
  const milestones = content.milestones || defaultMilestones

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
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 md:py-28 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Hakkımızda</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Star className="w-5 h-5 text-accent-400" />
                <span className="text-white/90 text-sm font-medium">1995'ten Beri</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {content.title}
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
                {content.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/yonetim-kurulu"
                  className="inline-flex items-center gap-2 bg-white text-primary-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Yönetim Kurulu
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/uyeler"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Üyelerimiz
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stats.years}+</div>
                <div className="text-primary-200 text-sm">Yıllık Deneyim</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-accent-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-accent-400" />
                </div>
                <div className="text-4xl font-bold text-accent-400 mb-1">{stats.members}+</div>
                <div className="text-primary-200 text-sm">Üye Firma</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Factory className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stats.groups}</div>
                <div className="text-primary-200 text-sm">Sanayi Grubu</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-primary-200 text-sm">Yıllık Etkinlik</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 font-medium mb-4">
              <div className="w-8 h-0.5 bg-primary-600"></div>
              Biz Kimiz
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Sektörün Güçlü Sesi
            </h2>
            {content.content ? (
              <div
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            ) : (
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Konfeksiyon Yan Sanayicileri Derneği (KYSD)</strong>,
                  1995 yılında İstanbul'da kurulmuş olup, konfeksiyon yan sanayi sektöründe faaliyet
                  gösteren firmaları bir araya getiren köklü bir meslek örgütüdür.
                </p>
                <p>
                  Derneğimiz, üyelerinin ortak menfaatlerini korumak, sektörün sorunlarına çözüm
                  üretmek ve Türk konfeksiyon yan sanayinin uluslararası arenada rekabet gücünü
                  artırmak amacıyla çalışmaktadır.
                </p>
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                'Sektörel temsil ve lobicilik',
                'Eğitim ve seminer programları',
                'Fuar organizasyonları',
                'Networking etkinlikleri'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-8 md:p-12">
              <img
                src={content.image || "/images/logo.jpg"}
                alt="KYSD"
                className="w-32 h-32 object-contain mx-auto mb-8 rounded-2xl shadow-lg"
              />
              <blockquote className="text-center">
                <p className="text-xl md:text-2xl font-medium text-gray-800 italic mb-6">
                  "Birlikte daha güçlüyüz. Sektörün geleceğini birlikte şekillendiriyoruz."
                </p>
                <footer className="text-gray-600">
                  <div className="font-semibold">KYSD Yönetim Kurulu</div>
                </footer>
              </blockquote>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-medium mb-4">
              <div className="w-8 h-0.5 bg-primary-600"></div>
              Hedeflerimiz
              <div className="w-8 h-0.5 bg-primary-600"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Vizyon & Misyon
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-8 md:p-10 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Vizyonumuz</h3>
              <p className="text-primary-100 leading-relaxed">
                {content.vision}
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl p-8 md:p-10 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Misyonumuz</h3>
              <p className="text-white/90 leading-relaxed">
                {content.mission}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary-600 font-medium mb-4">
            <div className="w-8 h-0.5 bg-primary-600"></div>
            İlkelerimiz
            <div className="w-8 h-0.5 bg-primary-600"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Değerlerimiz
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const IconComponent = iconMap[value.icon] || Handshake
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-medium mb-4">
              <div className="w-8 h-0.5 bg-primary-600"></div>
              Yolculuğumuz
              <div className="w-8 h-0.5 bg-primary-600"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tarihçemiz
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200"></div>

              {/* Milestones */}
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`w-5/12 ${
                        index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 order-2'
                      }`}
                    >
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-primary-600 mb-1">
                          {milestone.year}
                        </div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {milestone.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {milestone.desc}
                        </div>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            KYSD Ailesine Katılın
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Sektörün güçlü sesiyle birlikte hareket edin, avantajlardan yararlanın.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/uyelik-basvurusu"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg"
            >
              Üyelik Başvurusu
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              İletişime Geçin
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
