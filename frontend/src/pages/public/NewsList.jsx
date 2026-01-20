import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Search,
  Eye,
  ArrowRight,
  Clock,
  TrendingUp,
  Star,
  Filter,
  X
} from 'lucide-react'
import api from '../../utils/api'
import { formatDate, truncateText, stripHtml } from '../../utils/helpers'
import AdBanner from '../../components/common/AdBanner'

const API_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000'

// Filtreleme seçenekleri
const categoryOptions = [
  { value: 'all', label: 'Tüm Haberler' },
  { value: 'ekonomi', label: 'Ekonomi' },
  { value: 'sektor', label: 'Sektör Haberleri' },
  { value: 'ihracat', label: 'İhracat' },
  { value: 'uretim', label: 'Üretim' },
  { value: 'yatirim', label: 'Yatırım' }
]

const dateFilterOptions = [
  { value: 'all', label: 'Tüm Zamanlar' },
  { value: '7', label: 'Son 7 Gün' },
  { value: '30', label: 'Son 30 Gün' },
  { value: '90', label: 'Son 3 Ay' }
]

export default function NewsList() {
  const [news, setNews] = useState([])
  const [featuredNews, setFeaturedNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [page, categoryFilter, dateFilter])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9'
      })

      // Kategori filtresi
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter)
      }

      // Tarih filtresi
      if (dateFilter !== 'all') {
        params.append('days', dateFilter)
      }

      const response = await api.get(`/news?${params.toString()}`)
      const allNews = response.data.news

      // Öne çıkan haberleri ayır
      const featured = allNews.filter(n => n.isFeatured).slice(0, 2)
      setFeaturedNews(featured)
      setNews(allNews)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Haberler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const clearFilters = () => {
    setCategoryFilter('all')
    setDateFilter('all')
    setSearchTerm('')
    setPage(1)
  }

  const hasActiveFilters = categoryFilter !== 'all' || dateFilter !== 'all' || searchTerm !== ''

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
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
            <span className="text-white font-medium">Haberler</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Newspaper className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Güncel Haberler</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Haberler
            </h1>
            <p className="text-lg text-primary-100">
              Tekstil yan sanayi sektöründen en güncel haberler ve gelişmeler.
              Sektörün nabzını tutun.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col gap-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Haber ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                    hasActiveFilters
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Filtrele</span>
                  {hasActiveFilters && (
                    <span className="bg-white text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      ●
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <span><strong className="text-gray-900">{news.length}</strong> haber</span>
                </div>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih Aralığı
                    </label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      {dateFilterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Filters and Clear Button */}
                {hasActiveFilters && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      {categoryFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          {categoryOptions.find(o => o.value === categoryFilter)?.label}
                          <button
                            onClick={() => setCategoryFilter('all')}
                            className="hover:text-primary-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {dateFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          {dateFilterOptions.find(o => o.value === dateFilter)?.label}
                          <button
                            onClick={() => setDateFilter('all')}
                            className="hover:text-primary-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          "{searchTerm}"
                          <button
                            onClick={() => setSearchTerm('')}
                            className="hover:text-primary-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      Tümünü Temizle
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
          </div>
        ) : (
          <>
            {/* Featured News */}
            {featuredNews.length > 0 && page === 1 && !searchTerm && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent-500" />
                  Öne Çıkan Haberler
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredNews.map((item) => (
                    <Link
                      key={item.id}
                      to={`/haber/${item.slug}`}
                      className="group relative overflow-hidden rounded-2xl shadow-lg"
                    >
                      <div className="aspect-[16/9]">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="48" font-weight="bold" text-anchor="middle" x="200" y="165"%3EKYSD%3C/text%3E%3C/svg%3E'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                            <span className="text-6xl font-bold text-white/20">KYSD</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-accent-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                            Öne Çıkan
                          </span>
                          <span className="text-white/70 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-accent-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-white/80 text-sm line-clamp-2">
                          {item.excerpt || truncateText(stripHtml(item.content), 150)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All News Grid */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {searchTerm ? `"${searchTerm}" için sonuçlar` : 'Tüm Haberler'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/haber/${item.slug}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="48" font-weight="bold" text-anchor="middle" x="200" y="165"%3EKYSD%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-300">KYSD</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.createdAt)}
                      </span>
                      {item.viewCount > 0 && (
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {item.viewCount} görüntülenme
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                      {item.excerpt || truncateText(stripHtml(item.content), 120)}
                    </p>
                    <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {filteredNews.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Haber Bulunamadı</h3>
                <p className="text-gray-500 mb-4">Arama kriterlerinize uygun haber bulunamadı.</p>
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
                Haberleri Kaçırmayın
              </h2>
              <p className="text-primary-100">
                KYSD üyesi olarak sektördeki tüm gelişmelerden anında haberdar olun.
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
      {/* Footer Üstü Reklam */}
      <div className="container mx-auto px-4 py-8">
        <AdBanner code="above-footer" />
      </div>
    </div>
  )
}
