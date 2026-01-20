import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap, ChevronRight, Search, Calendar, Clock, MapPin,
  Users, Video, BookOpen, Award, ArrowRight, CheckCircle2, Star,
  Mic, Target
} from 'lucide-react'
import api from '../../utils/api'
import AdBanner from '../../components/common/AdBanner'

const API_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000'

const categories = [
  { id: 'all', name: 'Tümü', icon: BookOpen },
  { id: 'seminar', name: 'Seminerler', icon: Mic },
  { id: 'workshop', name: 'Atölye', icon: Target },
  { id: 'certificate', name: 'Sertifikalı', icon: Award },
  { id: 'online', name: 'Online', icon: Video }
]

const categoryColors = {
  seminar: 'bg-blue-100 text-blue-700',
  workshop: 'bg-purple-100 text-purple-700',
  certificate: 'bg-green-100 text-green-700',
  online: 'bg-orange-100 text-orange-700'
}

export default function Trainings() {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      const response = await api.get('/trainings')
      setTrainings(response.data)
    } catch (error) {
      console.error('Egitimler yuklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const filteredTrainings = trainings.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    const now = new Date()
    const dateA = a.eventDate ? new Date(a.eventDate) : new Date(0)
    const dateB = b.eventDate ? new Date(b.eventDate) : new Date(0)
    const isUpcomingA = dateA >= now
    const isUpcomingB = dateB >= now

    // Önce gelecek eğitimler
    if (isUpcomingA && !isUpcomingB) return -1
    if (!isUpcomingA && isUpcomingB) return 1

    // Gelecek eğitimler: en yakın tarih üstte
    if (isUpcomingA && isUpcomingB) return dateA - dateB

    // Geçmiş eğitimler: en yakın geçmiş tarih üstte
    return dateB - dateA
  })

  const featuredTrainings = trainings.filter(t => t.isFeatured)
  const upcomingTrainings = trainings.filter(t => t.eventDate && new Date(t.eventDate) >= new Date())

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0]
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
            <span className="text-white font-medium">Eğitimler ve Seminerler</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">KYSD Akademi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Eğitimler ve Seminerler</h1>
            <p className="text-lg text-primary-100">
              Sektör profesyonelleri için düzenlenen eğitim programları, seminerler ve atölye çalışmaları.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{trainings.length}</div>
              <div className="text-sm text-gray-500">Toplam Eğitim</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{upcomingTrainings.length}</div>
              <div className="text-sm text-gray-500">Yaklaşan Etkinlik</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {trainings.filter(t => t.category === 'certificate').length}
              </div>
              <div className="text-sm text-gray-500">Sertifikalı Program</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {trainings.filter(t => t.category === 'online').length}
              </div>
              <div className="text-sm text-gray-500">Online Eğitim</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Trainings */}
      {featuredTrainings.length > 0 && (
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Öne Çıkan Eğitimler</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTrainings.slice(0, 3).map((training) => {
              const catInfo = getCategoryInfo(training.category)
              return (
                <div
                  key={training.id}
                  className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-6 shadow-xl text-white"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[training.category] || 'bg-gray-100 text-gray-700'}`}>
                      {catInfo.name}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{training.title}</h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">{training.description}</p>

                  <div className="space-y-2 text-sm text-white/70 mb-4">
                    {training.eventDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(training.eventDate)}</span>
                        {training.eventTime && <span>- {training.eventTime}</span>}
                      </div>
                    )}
                    {training.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{training.location}</span>
                      </div>
                    )}
                    {training.instructor && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{training.instructor}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-accent-400 font-bold">{training.price || 'Ücretsiz'}</span>
                  </div>
                </div>
              )
            })}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Eğitim Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Eğitim adı..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Kategori</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Training List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredTrainings.length}</span> eğitim bulundu
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

            <div className="space-y-4">
              {filteredTrainings.map((training) => {
                const catInfo = getCategoryInfo(training.category)

                return (
                  <div key={training.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      {training.image && (
                        <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                          <img
                            src={getImageUrl(training.image)}
                            alt={training.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[training.category] || 'bg-gray-100 text-gray-700'}`}>
                            {catInfo.name}
                          </span>
                          {training.isFeatured && (
                            <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
                              <Star className="w-3 h-3 fill-current" />
                              Öne Çıkan
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{training.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{training.description}</p>

                        <div className="grid sm:grid-cols-2 gap-3 mb-4">
                          {training.eventDate && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(training.eventDate)}</span>
                            </div>
                          )}
                          {training.eventTime && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{training.eventTime}</span>
                            </div>
                          )}
                          {training.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{training.location}</span>
                            </div>
                          )}
                          {training.instructor && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              <span>{training.instructor}</span>
                            </div>
                          )}
                          {training.duration && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{training.duration}</span>
                            </div>
                          )}
                          {training.quota && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              <span>Kontenjan: {training.quota} kişi</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-xl font-bold text-primary-600">{training.price || 'Ücretsiz'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredTrainings.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Eğitim Bulunamadı</h3>
                <p className="text-gray-500 mb-4">Arama kriterlerinize uygun eğitim bulunamadı.</p>
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

      {/* Eğitim Sayfası Sponsor Reklam */}
      <div className="container mx-auto px-4 py-8">
        <AdBanner code="training-sponsor" className="mb-4" />
        <AdBanner code="content-wide" />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Eğitim Talebi</h2>
              <p className="text-primary-100">Sektörel eğitim ihtiyaçlarınız için bizimle iletişime geçin.</p>
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
