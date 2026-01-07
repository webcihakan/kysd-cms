import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Building, ChevronRight, Search, Calendar, MapPin, Globe,
  ExternalLink, ArrowRight, Star, Users, Clock, Monitor, Building2, Package, Plane
} from 'lucide-react'
import api from '../../utils/api'
import AdBanner from '../../components/common/AdBanner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Fairs() {
  const [fairs, setFairs] = useState([])
  const [virtualFairs, setVirtualFairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [fairsRes, virtualFairsRes] = await Promise.all([
        api.get('/fairs'),
        api.get('/virtual-fairs')
      ])
      setFairs(fairsRes.data)
      setVirtualFairs(virtualFairsRes.data)
    } catch (error) {
      console.error('Fuarlar yuklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVirtualFairStatus = (fair) => {
    const now = new Date()
    const start = new Date(fair.startDate)
    const end = new Date(fair.endDate)

    if (now < start) return { text: 'Yaklaşan', color: 'bg-blue-500' }
    if (now > end) return { text: 'Sona Erdi', color: 'bg-gray-500' }
    return { text: 'Devam Ediyor', color: 'bg-green-500' }
  }

  const activeVirtualFairs = virtualFairs.filter(f => {
    const now = new Date()
    return new Date(f.endDate) >= now
  })

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const filteredFairs = fairs
    .filter(item => {
      const matchesFilter = filter === 'all' ||
        (filter === 'kysd' && item.isKysdOrganized) ||
        (filter === 'upcoming' && item.startDate && new Date(item.startDate) >= new Date())
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      const now = new Date()
      const dateA = a.startDate ? new Date(a.startDate) : new Date(0)
      const dateB = b.startDate ? new Date(b.startDate) : new Date(0)
      const isUpcomingA = dateA >= now
      const isUpcomingB = dateB >= now

      // Önce gelecek fuarlar
      if (isUpcomingA && !isUpcomingB) return -1
      if (!isUpcomingA && isUpcomingB) return 1

      // Gelecek fuarlar: en yakın tarih üstte
      if (isUpcomingA && isUpcomingB) return dateA - dateB

      // Geçmiş fuarlar: en yakın geçmiş tarih üstte
      return dateB - dateA
    })

  const featuredFairs = fairs.filter(f => f.isFeatured)
  const upcomingFairs = fairs.filter(f => f.startDate && new Date(f.startDate) >= new Date())

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatDateRange = (start, end) => {
    if (!start) return ''
    const startDate = new Date(start).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    if (!end) return startDate
    const endDate = new Date(end).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${startDate} - ${endDate}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Fuarlar</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Building className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Fuar Takvimi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Fuarlar ve Etkinlikler</h1>
            <p className="text-lg text-primary-100">
              KYSD organizasyonunda ve katılımıyla gerçekleşen ulusal ve uluslararası fuarlar.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{fairs.length}</div>
              <div className="text-sm text-gray-500">Toplam Fuar</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{upcomingFairs.length}</div>
              <div className="text-sm text-gray-500">Yaklaşan Fuar</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {fairs.filter(f => f.isKysdOrganized).length}
              </div>
              <div className="text-sm text-gray-500">KYSD Organizasyonu</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(fairs.map(f => f.country).filter(Boolean)).size}
              </div>
              <div className="text-sm text-gray-500">Ülke</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Monitor className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{virtualFairs.length}</div>
              <div className="text-sm text-gray-500">Sanal Fuar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sanal Fuarlar Bölümü */}
      {virtualFairs.length > 0 && (
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sanal Fuarlar</h2>
                <p className="text-sm text-gray-500">Online sanal fuar alanlarımız</p>
              </div>
            </div>
            <Link
              to="/sanal-fuarlar"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Tümünü Gör
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeVirtualFairs.slice(0, 3).map((fair) => {
              const status = getVirtualFairStatus(fair)
              return (
                <Link
                  key={fair.id}
                  to={`/sanal-fuar/${fair.slug}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative h-40 bg-gradient-to-br from-purple-600 to-indigo-700">
                    {fair.coverImage ? (
                      <img
                        src={getImageUrl(fair.coverImage)}
                        alt={fair.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Monitor className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Building2 className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">{fair._count?.booths || 0} stant</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {fair.title}
                    </h3>
                    {fair.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{fair.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(fair.startDate)}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {activeVirtualFairs.length === 0 && virtualFairs.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-8 text-center">
              <Monitor className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Aktif Sanal Fuar Yok</h3>
              <p className="text-gray-600 text-sm mb-4">Şu an aktif bir sanal fuar bulunmuyor. Geçmiş fuarları inceleyebilirsiniz.</p>
              <Link
                to="/sanal-fuarlar"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                Tüm Sanal Fuarları Gör
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Featured Fairs */}
      {featuredFairs.length > 0 && (
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Öne Çıkan Fuarlar</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredFairs.slice(0, 3).map((fair) => (
              <div
                key={fair.id}
                className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl overflow-hidden shadow-xl text-white"
              >
                {fair.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={getImageUrl(fair.image)}
                      alt={fair.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {fair.isKysdOrganized && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent-500 text-white">
                        KYSD Organizasyonu
                      </span>
                    )}
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{fair.title}</h3>

                  <div className="space-y-2 text-sm text-white/70 mb-4">
                    {fair.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange(fair.startDate, fair.endDate)}</span>
                      </div>
                    )}
                    {(fair.location || fair.country) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{[fair.location, fair.country].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {fair.website && (
                      <a
                        href={fair.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Web Sitesi
                      </a>
                    )}
                    {fair.country && (
                      <Link
                        to={`/tur-rehberi?country=${encodeURIComponent(fair.country)}`}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium"
                      >
                        <Plane className="w-4 h-4" />
                        Tur Rehberi
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuar Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Fuar adı..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Filtre</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      filter === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span className="text-sm font-medium">Tüm Fuarlar</span>
                  </button>
                  <button
                    onClick={() => setFilter('upcoming')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      filter === 'upcoming' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Yaklaşan Fuarlar</span>
                  </button>
                  <button
                    onClick={() => setFilter('kysd')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      filter === 'kysd' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                    <span className="text-sm font-medium">KYSD Organizasyonu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fair List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredFairs.length}</span> fuar bulundu
              </p>
              {(filter !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setFilter('all')
                    setSearchTerm('')
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredFairs.map((fair) => (
                <div key={fair.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    {fair.image && (
                      <div className="md:w-56 h-48 md:h-auto flex-shrink-0">
                        <img
                          src={getImageUrl(fair.image)}
                          alt={fair.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {fair.isKysdOrganized && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-100 text-primary-700">
                            KYSD Organizasyonu
                          </span>
                        )}
                        {fair.isFeatured && (
                          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
                            <Star className="w-3 h-3 fill-current" />
                            Öne Çıkan
                          </span>
                        )}
                        {fair.discount && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                            {fair.discount}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">{fair.title}</h3>
                      {fair.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{fair.description}</p>
                      )}

                      <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        {fair.startDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateRange(fair.startDate, fair.endDate)}</span>
                          </div>
                        )}
                        {(fair.location || fair.country) && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{[fair.location, fair.country].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                        {fair.organizer && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{fair.organizer}</span>
                          </div>
                        )}
                        {fair.deadline && (
                          <div className="flex items-center gap-2 text-sm text-orange-600">
                            <Clock className="w-4 h-4" />
                            <span>Son Başvuru: {formatDate(fair.deadline)}</span>
                          </div>
                        )}
                      </div>

                      {fair.boothInfo && (
                        <p className="text-sm text-primary-600 font-medium mb-4">
                          Stand Bilgisi: {fair.boothInfo}
                        </p>
                      )}

                      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        {fair.website && (
                          <a
                            href={fair.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Web Sitesi
                          </a>
                        )}
                        {fair.country && (
                          <Link
                            to={`/tur-rehberi?country=${encodeURIComponent(fair.country)}`}
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <Plane className="w-4 h-4" />
                            Tur Rehberi
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFairs.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fuar Bulunamadı</h3>
                <p className="text-gray-500 mb-4">Arama kriterlerinize uygun fuar bulunamadı.</p>
                <button
                  onClick={() => {
                    setFilter('all')
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

      {/* Fuar Sayfası Premium Reklam */}
      <div className="container mx-auto px-4 py-8">
        <AdBanner code="fair-premium" className="mb-4" />
        <AdBanner code="content-wide" />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Fuar Katılımı</h2>
              <p className="text-primary-100">Fuarlara KYSD desteğiyle katılmak için iletişime geçin.</p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                İletişime Geç
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
