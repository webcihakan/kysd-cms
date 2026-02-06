import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Download, Eye, Calendar, Building2,
  ChevronRight, Filter, Search, Star, FileText
} from 'lucide-react'
import api from '../../utils/api'

const categoryConfig = {
  all: { name: 'Tümü', color: 'bg-gray-500' },
  general: { name: 'Genel', color: 'bg-blue-500' },
  industry: { name: 'Sanayi', color: 'bg-orange-500' },
  technology: { name: 'Teknoloji', color: 'bg-purple-500' },
  economy: { name: 'Ekonomi', color: 'bg-green-500' }
}

export default function Magazines() {
  const [magazines, setMagazines] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchMagazines()
  }, [selectedCategory, currentPage])

  const fetchMagazines = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        page: currentPage,
        limit: 12
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await api.get(`/magazines?${params}`)
      setMagazines(response.data.magazines || [])
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Dergiler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchMagazines()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
  }

  const handleDownload = async (magazineId) => {
    try {
      await api.post(`/magazines/${magazineId}/download`)
    } catch (error) {
      console.error('İndirme kaydedilemedi:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Sektörel Dergiler</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Dijital Dergiler</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sektörel Dergiler
            </h1>
            <p className="text-lg text-primary-100">
              Tekstil sektörünün önde gelen dergilerini keşfedin, detaylı içeriklere ulaşın.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Dergi ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>

            {/* Kategori Filtreleri */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === key
                      ? `${config.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dergi Listesi */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : magazines.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dergi Bulunamadı</h3>
            <p className="text-gray-500">Aradığınız kriterlere uygun dergi bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {magazines.map((magazine) => (
                <a
                  key={magazine.id}
                  href={magazine.pdfFile || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Kapak Görseli */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {magazine.coverImage && magazine.coverImage.includes('http') ? (
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}

                    {/* Fallback - Kategoriye göre renkli kapak */}
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${
                        magazine.category === 'industry' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                        magazine.category === 'technology' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                        magazine.category === 'economy' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                        'bg-gradient-to-br from-blue-500 to-blue-700'
                      } group-hover:scale-105 transition-transform duration-300`}
                      style={{ display: magazine.coverImage && magazine.coverImage.includes('http') ? 'none' : 'flex' }}
                    >
                      <BookOpen className="w-16 h-16 text-white/80 mb-4" />
                      <h4 className="text-white font-bold text-lg line-clamp-3 px-2">
                        {magazine.title}
                      </h4>
                      {magazine.issueNumber && (
                        <p className="text-white/80 text-sm mt-2">
                          {magazine.issueNumber}
                        </p>
                      )}
                    </div>

                    {/* Öne Çıkan Badge */}
                    {magazine.isFeatured && (
                      <div className="absolute top-3 right-3 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Öne Çıkan
                      </div>
                    )}

                    {/* Kategori Badge */}
                    <div className={`absolute bottom-3 left-3 ${categoryConfig[magazine.category]?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {categoryConfig[magazine.category]?.name || magazine.category}
                    </div>
                  </div>

                  {/* Dergi Bilgileri */}
                  <div className="p-5">
                    {magazine.publisher && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <Building2 className="w-4 h-4" />
                        <span className="truncate">{magazine.publisher}</span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {magazine.title}
                    </h3>

                    {magazine.issueNumber && (
                      <p className="text-sm text-gray-600 mb-3">
                        {magazine.issueNumber}
                      </p>
                    )}

                    {magazine.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {magazine.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      {magazine.publishDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(magazine.publishDate)}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-primary-600 font-semibold">
                        <span>Detay</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Önceki
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
