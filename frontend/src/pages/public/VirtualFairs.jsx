import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Monitor, Calendar, Package, Building2, ArrowRight,
  ChevronRight, Clock, Users
} from 'lucide-react'
import api from '../../utils/api'

export default function VirtualFairs() {
  const [fairs, setFairs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFairs()
  }, [])

  const fetchFairs = async () => {
    try {
      const response = await api.get('/virtual-fairs')
      setFairs(response.data)
    } catch (error) {
      console.error('Sanal fuarlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getFairStatus = (fair) => {
    const now = new Date()
    const start = new Date(fair.startDate)
    const end = new Date(fair.endDate)

    if (now < start) return { text: 'Yaklaşan', color: 'bg-blue-500', textColor: 'text-blue-600' }
    if (now > end) return { text: 'Sona Erdi', color: 'bg-gray-500', textColor: 'text-gray-600' }
    return { text: 'Devam Ediyor', color: 'bg-green-500', textColor: 'text-green-600' }
  }

  const activeFairs = fairs.filter(f => {
    const now = new Date()
    return new Date(f.endDate) >= now
  }).sort((a, b) => {
    // Yaklaşan fuarlar tarihe göre sırala (en yakın tarih üstte)
    return new Date(a.startDate) - new Date(b.startDate)
  })

  const pastFairs = fairs.filter(f => {
    const now = new Date()
    return new Date(f.endDate) < now
  }).sort((a, b) => {
    // Geçmiş fuarlar tarihe göre sırala (en yakın geçmiş üstte)
    return new Date(b.endDate) - new Date(a.endDate)
  })

  // İstatistikler
  const totalBooths = fairs.reduce((sum, f) => sum + (f._count?.booths || 0), 0)
  const totalBoothTypes = fairs.reduce((sum, f) => sum + (f.boothTypes?.length || 0), 0)

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
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Monitor className="w-5 h-5 text-purple-300" />
              <span className="text-white/90 text-sm font-medium">KYSD Sanal Fuar</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Sanal Fuar <br className="hidden md:block" />
              <span className="text-purple-300">Alanı</span>
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
              Online sanal fuarlarımızda sektörün öncü firmalarını keşfedin,
              ürün ve hizmetleri inceleyin, iletişime geçin.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-xl mb-4">
                <Monitor className="w-7 h-7 text-purple-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{fairs.length}</div>
              <div className="text-gray-500 mt-1">Toplam Fuar</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-4">
                <Clock className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{activeFairs.length}</div>
              <div className="text-gray-500 mt-1">Aktif Fuar</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{totalBooths}</div>
              <div className="text-gray-500 mt-1">Katılımcı Firma</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-xl mb-4">
                <Package className="w-7 h-7 text-orange-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{totalBoothTypes}</div>
              <div className="text-gray-500 mt-1">Stant Seçeneği</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {fairs.length === 0 ? (
          <div className="text-center py-16">
            <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Henüz Sanal Fuar Yok</h2>
            <p className="text-gray-500">Yakında yeni sanal fuarlar duyurulacaktır.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Aktif Fuarlar */}
            {activeFairs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  Aktif & Yaklaşan Fuarlar
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {activeFairs.map((fair) => {
                    const status = getFairStatus(fair)
                    return (
                      <Link
                        key={fair.id}
                        to={`/sanal-fuar/${fair.slug}`}
                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-purple-600 to-indigo-700">
                          {fair.coverImage ? (
                            <img
                              src={fair.coverImage}
                              alt={fair.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Monitor className="w-16 h-16 text-white/30" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {fair.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {fair.description || 'Sanal fuar alanını keşfedin'}
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(fair.startDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{fair._count?.booths || 0} stant</span>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Geçmiş Fuarlar */}
            {pastFairs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Geçmiş Fuarlar</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {pastFairs.map((fair) => (
                    <Link
                      key={fair.id}
                      to={`/sanal-fuar/${fair.slug}`}
                      className="group bg-white rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {fair.coverImage ? (
                            <img src={fair.coverImage} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Monitor className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600">
                            {fair.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(fair.startDate)} - {formatDate(fair.endDate)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {fair._count?.booths || 0} stant katılımcı
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sanal Fuarda Yerinizi Alın
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Firmanızı online ortamda tanıtın, potansiyel müşterilerinize ulaşın.
          </p>
          <Link
            to="/iletisim"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Bilgi Alın
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
