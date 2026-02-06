import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, ArrowRight, Users, Building2, Award, TrendingUp,
  ChevronRight, Factory, Newspaper, Bell, Target, Briefcase, Globe, Shield,
  Monitor, Eye, Package, FileText, Scale, Gift, GraduationCap, FolderOpen, MapPin
} from 'lucide-react'
import Slider from 'react-slick'
import api from '../../utils/api'
import { formatDate, truncateText, stripHtml, toTitleCase } from '../../utils/helpers'
import AdBanner from '../../components/common/AdBanner'

export default function Home() {
  const [sliders, setSliders] = useState([])
  const [news, setNews] = useState([])
  const [sectorNews, setSectorNews] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [industryGroups, setIndustryGroups] = useState([])
  const [virtualFairs, setVirtualFairs] = useState([])
  const [settings, setSettings] = useState({})
  const sliderRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [slidersRes, newsRes, sectorNewsRes, announcementsRes, groupsRes, virtualFairsRes, settingsRes] = await Promise.all([
        api.get('/sliders'),
        api.get('/news?limit=6&featured=true'),
        api.get('/news?source=scraped&limit=3'),
        api.get('/announcements?limit=6'),
        api.get('/industry-groups'),
        api.get('/virtual-fairs'),
        api.get('/settings')
      ])

      setSliders(slidersRes.data)
      setNews(newsRes.data.news)
      setSectorNews(sectorNewsRes.data.news || [])
      setAnnouncements(announcementsRes.data.announcements)
      setIndustryGroups(groupsRes.data)
      setVirtualFairs(virtualFairsRes.data || [])
      setSettings(settingsRes.data)
    } catch (error) {
      console.error('Veri yüklenemedi')
    }
  }

  const totalMembers = industryGroups.reduce((acc, g) => acc + (g._count?.members || g.members?.length || 0), 0)

  return (
    <div>
      {/* Header Ad - Ana Sayfa Üst Banner */}
      <AdBanner code="homepage-top" className="bg-gray-100 py-4" wrapperClassName="container mx-auto px-4" />

      {/* Hero Section - Kurumsal */}
      <section className="relative bg-primary-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-accent-500/20 text-accent-300 px-4 py-2 rounded text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                {settings.home_hero_badge || '1995\'ten Beri Sektorun Yaninda'}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                {settings.site_name || 'Konfeksiyon Yan Sanayicileri Derneği'}
              </h1>
              <p className="text-base sm:text-lg text-primary-200 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                {settings.home_hero_description || settings.site_description || 'Turkiye\'nin en koklu konfeksiyon yan sanayi kurulusu olarak, sektorun gelisimi ve uyelerimizin haklarini korumak icin calisiyoruz.'}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  to="/uyelik-basvurusu"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded font-semibold transition-colors text-sm sm:text-base"
                >
                  Üye Olun
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/hakkimizda"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded font-medium transition-colors border border-white/20 text-sm sm:text-base"
                >
                  Hakkımızda
                </Link>
              </div>
            </div>

            {/* Right - Slider */}
            <div className="relative w-full max-w-full overflow-hidden">
              {sliders.length > 0 ? (
                <Slider
                  ref={sliderRef}
                  infinite={true}
                  slidesToShow={1}
                  slidesToScroll={1}
                  autoplay={true}
                  autoplaySpeed={5000}
                  speed={500}
                  dots={true}
                  arrows={false}
                  className="corporate-slider"
                  adaptiveHeight={true}
                >
                  {sliders.map((slide) => (
                    <div key={slide.id} className="px-0">
                      <Link to={slide.link || '#'} className="block">
                        <div className="relative overflow-hidden rounded-lg shadow-2xl aspect-video sm:aspect-[16/10]">
                          <img
                            src={slide.image}
                            alt={slide.title || ''}
                            className="w-full h-full object-cover"
                          />
                          {slide.title && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                              <h3 className="text-base sm:text-xl font-semibold text-white line-clamp-2">{slide.title}</h3>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="bg-primary-800 rounded-lg p-8 sm:p-12 text-center text-primary-300">
                  Yükleniyor...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-corporate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 mt-0 sm:-mt-8 lg:-mt-8 relative z-20 gap-3 sm:gap-0">
            <div className="bg-white p-4 sm:p-6 lg:p-8 text-center sm:border-r border-corporate-100 shadow-corporate-lg rounded-lg sm:rounded-none sm:first:rounded-l-lg">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Building2 className="w-5 h-5 sm:w-7 sm:h-7 text-primary-700" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-primary-900 mb-1">{industryGroups.length}</p>
              <p className="text-xs sm:text-sm text-corporate-500 font-medium">Sanayi Grubu</p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 text-center lg:border-r border-corporate-100 shadow-corporate-lg rounded-lg sm:rounded-none">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Users className="w-5 h-5 sm:w-7 sm:h-7 text-accent-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-primary-900 mb-1">{totalMembers}+</p>
              <p className="text-xs sm:text-sm text-corporate-500 font-medium">Üye Firma</p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 text-center sm:border-r border-corporate-100 shadow-corporate-lg rounded-lg sm:rounded-none">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Award className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-primary-900 mb-1">{settings.home_stats_years || '34'}+</p>
              <p className="text-xs sm:text-sm text-corporate-500 font-medium">Yıllık Deneyim</p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 text-center shadow-corporate-lg rounded-lg sm:rounded-none sm:rounded-r-lg">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Globe className="w-5 h-5 sm:w-7 sm:h-7 text-primary-700" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-primary-900 mb-1">{settings.home_stats_projects || '50'}+</p>
              <p className="text-xs sm:text-sm text-corporate-500 font-medium">Tamamlanan Proje</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sector News Section */}
      {sectorNews.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block text-primary-700 text-sm font-semibold tracking-wider uppercase mb-2">
                  Sektörden
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-900">
                  Güncel Haberler
                </h2>
              </div>
              <Link
                to="/haberler"
                className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors text-sm"
              >
                Tümünü Gör
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {sectorNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/haberler/${item.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Newspaper className="w-4 h-4" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {stripHtml(item.excerpt || item.content)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary-700 font-medium text-sm group-hover:gap-2 transition-all">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-12 sm:py-20 bg-corporate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-primary-700 text-sm font-semibold tracking-wider uppercase mb-3 sm:mb-4">
                Hakkımızda
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-4 sm:mb-6 leading-tight">
                Sektörün Güvenilir Sesi
              </h2>
              <p className="text-corporate-600 mb-6 leading-relaxed">
                KYSD, konfeksiyon yan sanayi sektöründe faaliyet gösteren firmaları bir araya getirerek,
                sektörün sorunlarına çözüm üretmek ve üyelerinin haklarını korumak amacıyla kurulmuştur.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-1">Sektörel Temsil</h4>
                    <p className="text-sm text-corporate-500">Resmi kurumlarda sektörün güçlü temsilcisi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-100 rounded flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-1">İş Geliştirme</h4>
                    <p className="text-sm text-corporate-500">Üyeler arası ticaret ve işbirliği imkanları</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-1">Sürdürülebilir Büyüme</h4>
                    <p className="text-sm text-corporate-500">Sektörün geleceğine birlikte yatırım</p>
                  </div>
                </div>
              </div>
              <Link
                to="/hakkimizda"
                className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors"
              >
                Daha Fazla Bilgi
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-lg shadow-corporate-lg">
                <img
                  src="/images/logo.jpg"
                  alt="KYSD"
                  className="w-32 mx-auto mb-6"
                />
                <h3 className="text-xl font-bold text-primary-900 text-center mb-4">
                  Konfeksiyon Yan Sanayicileri Derneği
                </h3>
                <p className="text-corporate-500 text-center text-sm mb-6">
                  {settings.site_description || 'Türkiye konfeksiyon yan sanayi sektörünün en köklü meslek kuruluşu.'}
                </p>
                <Link
                  to="/uyelik-basvurusu"
                  className="block w-full py-3 bg-primary-800 hover:bg-primary-900 text-white font-semibold rounded text-center transition-colors"
                >
                  Üyelik Başvurusu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Reklam Alanı */}
      <section className="py-12 bg-white border-b border-corporate-100">
        <div className="container mx-auto px-8 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            {/* Sol Banner */}
            <div className="flex justify-center">
              <AdBanner code="homepage-banner-left" />
            </div>
            {/* Sağ Banner */}
            <div className="flex justify-center">
              <AdBanner code="homepage-banner-right" />
            </div>
          </div>
        </div>
      </section>

      {/* Industry Groups - Mavi arka plan */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-primary-700 text-sm font-semibold tracking-wider uppercase mb-4">
              Sanayi Grupları
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Faaliyet Alanlarımız
            </h2>
            <p className="text-corporate-500">
              Konfeksiyon yan sanayi sektöründe organize edilmiş üye firmalarımız
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {industryGroups.slice(0, 8).map((group) => (
              <Link
                key={group.id}
                to={`/sanayi-grubu/${group.slug}`}
                className="group bg-primary-800 hover:bg-primary-900 p-4 sm:p-6 rounded-lg transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Factory className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm sm:text-base">
                  {toTitleCase(group.name)}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-primary-200">
                    {group._count?.members || group.members?.length || 0} Üye
                  </span>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/sanayi-gruplari"
              className="inline-flex items-center gap-2 border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white px-6 py-3 rounded font-semibold transition-all"
            >
              Tüm Sanayi Grupları
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Virtual Fairs Section - Sanal Fuar */}
      {virtualFairs.length > 0 && (
        <section className="py-20 bg-corporate-100">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-primary-700 text-sm font-semibold tracking-wider uppercase mb-4">
                Dijital Deneyim
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
                Sanal Fuarlar
              </h2>
              <p className="text-corporate-500">
                Online fuar standlarını ziyaret edin, firmaları ve ürünlerini 3D ortamda keşfedin
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {virtualFairs.slice(0, 3).map((fair) => (
                <Link
                  key={fair.id}
                  to={`/sanal-fuar/${fair.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-corporate hover:shadow-corporate-lg transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="h-48 relative overflow-hidden">
                    {fair.coverImage ? (
                      <img
                        src={fair.coverImage}
                        alt={fair.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <Monitor className="w-16 h-16 text-primary-300" />
                      </div>
                    )}
                    {/* Overlay badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">
                        Aktif Fuar
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
                      {fair.title}
                    </h3>
                    {fair.description && (
                      <p className="text-corporate-500 text-sm mb-4 line-clamp-2">
                        {truncateText(stripHtml(fair.description), 100)}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-corporate-600">
                        <Building2 className="w-4 h-4" />
                        <span>{fair._count?.booths || 0} Stant</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Eye className="w-4 h-4" />
                        <span>Ücretsiz Giriş</span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="mt-4 pt-4 border-t border-corporate-100 flex items-center justify-between">
                      <span className="text-corporate-400 text-xs">
                        {formatDate(fair.startDate)} - {formatDate(fair.endDate)}
                      </span>
                      <span className="flex items-center gap-1 text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-transform">
                        Ziyaret Et
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/sanal-fuarlar"
                className="inline-flex items-center gap-2 bg-primary-800 hover:bg-primary-900 text-white px-6 py-3 rounded font-semibold transition-colors"
              >
                <Monitor className="w-5 h-5" />
                Tüm Sanal Fuarları Gör
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sektörel Bilgiler & Faaliyetler Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Sektörel Bilgiler */}
            <div>
              <div className="mb-8">
                <span className="inline-block text-primary-700 text-sm font-semibold tracking-wider uppercase mb-2">
                  Sektörel Bilgiler
                </span>
                <h2 className="text-2xl font-bold text-primary-900">Bilgi Kaynakları</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Link
                  to="/sektor-raporlari"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-corporate-50 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-200"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-900 group-hover:text-primary-700 transition-colors text-sm sm:text-base">
                      Sektör Raporları
                    </h3>
                    <p className="text-xs sm:text-sm text-corporate-500 truncate sm:whitespace-normal">Güncel sektör analizleri ve istatistikler</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-corporate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>

                <Link
                  to="/mevzuat"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-corporate-50 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-200"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition-colors">
                    <Scale className="w-6 h-6 sm:w-7 sm:h-7 text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-900 group-hover:text-primary-700 transition-colors text-sm sm:text-base">
                      Mevzuat
                    </h3>
                    <p className="text-xs sm:text-sm text-corporate-500 truncate sm:whitespace-normal">Yasal düzenlemeler ve mevzuat bilgileri</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-corporate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>

                <Link
                  to="/tesvik-ve-destekler"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-corporate-50 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-200"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-900 group-hover:text-primary-700 transition-colors text-sm sm:text-base">
                      Teşvik ve Destekler
                    </h3>
                    <p className="text-xs sm:text-sm text-corporate-500 truncate sm:whitespace-normal">Devlet teşvikleri ve destek programları</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-corporate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              </div>
            </div>

            {/* Faaliyetler */}
            <div>
              <div className="mb-8">
                <span className="inline-block text-accent-600 text-sm font-semibold tracking-wider uppercase mb-2">
                  Faaliyetler
                </span>
                <h2 className="text-2xl font-bold text-primary-900">Etkinlikler & Projeler</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Link
                  to="/egitimler-seminerler"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-corporate-50 hover:bg-accent-50 rounded-xl transition-all border border-transparent hover:border-accent-200"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-primary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-900 group-hover:text-accent-600 transition-colors text-sm sm:text-base">
                      Eğitimler & Seminerler
                    </h3>
                    <p className="text-xs sm:text-sm text-corporate-500 truncate sm:whitespace-normal">Mesleki gelişim ve eğitim programları</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-corporate-400 group-hover:text-accent-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>

                <Link
                  to="/projeler"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-corporate-50 hover:bg-accent-50 rounded-xl transition-all border border-transparent hover:border-accent-200"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition-colors">
                    <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-900 group-hover:text-accent-600 transition-colors text-sm sm:text-base">
                      Projeler
                    </h3>
                    <p className="text-xs sm:text-sm text-corporate-500 truncate sm:whitespace-normal">Devam eden ve tamamlanan projeler</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-corporate-400 group-hover:text-accent-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>

                <Link
                  to="/fuarlar"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-corporate-50 hover:bg-accent-50 rounded-xl transition-all border border-transparent hover:border-accent-200"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-900 group-hover:text-accent-600 transition-colors text-sm sm:text-base">
                      Fuarlar
                    </h3>
                    <p className="text-xs sm:text-sm text-corporate-500 truncate sm:whitespace-normal">Yurt içi ve yurt dışı fuar katılımları</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-corporate-400 group-hover:text-accent-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Announcements - Grid yan yana */}
      <section className="py-12 sm:py-20 bg-corporate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {/* News */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="inline-block text-primary-700 text-sm font-semibold tracking-wider uppercase mb-2">
                    Haberler
                  </span>
                  <h2 className="text-2xl font-bold text-primary-900">Güncel Gelişmeler</h2>
                </div>
                <Link
                  to="/haberler"
                  className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors"
                >
                  Tümü
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {news.length > 0 ? (
                <div className="space-y-4">
                  {news.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/haber/${item.slug}`}
                      className="group flex gap-4 bg-white rounded-lg overflow-hidden shadow-corporate hover:shadow-corporate-md transition-shadow p-4"
                    >
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                            <Newspaper className="w-8 h-8 text-primary-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary-900 group-hover:text-primary-700 line-clamp-2 mb-2 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-corporate-500 text-sm line-clamp-1 mb-2">
                          {item.excerpt || truncateText(stripHtml(item.content), 80)}
                        </p>
                        <div className="flex items-center gap-2 text-corporate-400 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center text-corporate-500">
                  Henüz haber bulunmuyor
                </div>
              )}
            </div>

            {/* Announcements */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="inline-block text-accent-600 text-sm font-semibold tracking-wider uppercase mb-2">
                    Duyurular
                  </span>
                  <h2 className="text-2xl font-bold text-primary-900">Önemli Bilgilendirmeler</h2>
                </div>
                <Link
                  to="/duyurular"
                  className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors"
                >
                  Tümü
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/duyuru/${item.slug}`}
                      className="group block bg-white rounded-lg shadow-corporate hover:shadow-corporate-md transition-shadow p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5 text-accent-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary-900 group-hover:text-primary-700 line-clamp-2 mb-2 transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-corporate-400 text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-corporate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center text-corporate-500">
                  Henüz duyuru bulunmuyor
                </div>
              )}
            </div>
          </div>

          {/* Haberler Arası Banner */}
          <div className="mt-10">
            <AdBanner code="news-inline" />
          </div>
        </div>
      </section>

      {/* Sayfa İçi Geniş Banner */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <AdBanner code="content-wide" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-primary-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              KYSD Ailesine Katılın
            </h2>
            <p className="text-base sm:text-lg text-primary-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Konfeksiyon yan sanayi sektörünün güçlü derneğine üye olun,
              sektörel avantajlardan ve işbirliği fırsatlarından yararlanın.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/uyelik-basvurusu"
                className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded font-semibold transition-colors text-sm sm:text-base"
              >
                Üyelik Başvurusu
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded font-medium transition-colors border border-white/20 text-sm sm:text-base"
              >
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Üstü Banner */}
      <section className="py-8 bg-corporate-50">
        <div className="container mx-auto px-4">
          <AdBanner code="above-footer" />
        </div>
      </section>
    </div>
  )
}
