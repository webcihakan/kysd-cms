import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Pin,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  ArrowRight,
  Megaphone,
  AlertCircle,
  Info,
  Clock
} from 'lucide-react'
import api from '../../utils/api'
import { formatDate, truncateText, stripHtml } from '../../utils/helpers'
import AdBanner from '../../components/common/AdBanner'

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState([])
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAnnouncements()
  }, [page])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/announcements?page=${page}&limit=10`)
      const allAnnouncements = response.data.announcements

      // Sabitlenmiş duyuruları ayır
      const pinned = allAnnouncements.filter(a => a.isPinned)
      setPinnedAnnouncements(pinned)
      setAnnouncements(allAnnouncements)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Duyurular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const filteredAnnouncements = announcements.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Bugün'
    if (diffDays === 1) return 'Dün'
    if (diffDays < 7) return `${diffDays} gün önce`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
    return formatDate(dateStr)
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
            <span className="text-white font-medium">Duyurular</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Bell className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Bilgilendirmeler</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Duyurular
            </h1>
            <p className="text-lg text-primary-100">
              KYSD'den önemli duyurular, toplantı bilgileri ve güncel bilgilendirmeler.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Duyuru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary-600" />
                <span><strong className="text-gray-900">{announcements.length}</strong> duyuru</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
            </div>
          ) : (
            <>
              {/* Pinned Announcements */}
              {pinnedAnnouncements.length > 0 && page === 1 && !searchTerm && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Pin className="w-5 h-5 text-accent-500" />
                    Sabitlenmiş Duyurular
                  </h2>
                  <div className="space-y-4">
                    {pinnedAnnouncements.map((item) => (
                      <Link
                        key={item.id}
                        to={`/duyuru/${item.slug}`}
                        className="block bg-gradient-to-r from-accent-50 to-orange-50 border-l-4 border-accent-500 rounded-2xl p-6 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-7 h-7 text-accent-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-accent-500 text-white text-xs rounded-full font-medium">
                                Önemli
                              </span>
                              <span className="text-accent-600 text-sm flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {getTimeAgo(item.createdAt)}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-accent-600 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 line-clamp-2">
                              {item.excerpt || truncateText(stripHtml(item.content), 180)}
                            </p>
                            <div className="flex items-center text-accent-600 text-sm font-medium mt-4 group-hover:text-accent-700">
                              Devamını Oku
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All Announcements */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {searchTerm ? `"${searchTerm}" için sonuçlar` : 'Tüm Duyurular'}
                </h2>
              </div>

              <div className="space-y-4">
                {filteredAnnouncements.map((item) => (
                  <Link
                    key={item.id}
                    to={`/duyuru/${item.slug}`}
                    className={`block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all group ${
                      item.isPinned ? 'ring-2 ring-accent-200' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.isPinned ? 'bg-accent-100' : 'bg-primary-100'
                      }`}>
                        {item.isPinned ? (
                          <Pin className="w-6 h-6 text-accent-600" />
                        ) : (
                          <Info className="w-6 h-6 text-primary-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {item.isPinned && (
                            <span className="px-2.5 py-0.5 bg-accent-100 text-accent-700 text-xs rounded-full font-medium">
                              Sabitlenmiş
                            </span>
                          )}
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 line-clamp-2">
                          {item.excerpt || truncateText(stripHtml(item.content), 150)}
                        </p>
                        <div className="flex items-center text-primary-600 text-sm font-medium mt-4 group-hover:text-primary-700">
                          Devamını Oku
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* No Results */}
              {filteredAnnouncements.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Duyuru Bulunamadı</h3>
                  <p className="text-gray-500 mb-4">Arama kriterlerinize uygun duyuru bulunamadı.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Aramayı Temizle
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !searchTerm && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-11 h-11 rounded-xl font-medium transition-colors ${
                        page === i + 1
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reklam Alanı */}
      <div className="container mx-auto px-4 py-8">
        <AdBanner code="content-wide" />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Duyuruları Kaçırmayın
              </h2>
              <p className="text-primary-100">
                KYSD üyesi olarak önemli duyurulardan anında haberdar olun.
              </p>
            </div>
            <Link
              to="/uyelik-basvurusu"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Üye Ol
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
