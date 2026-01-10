import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Building2, Eye, Download, Search, Filter,
  ChevronRight, FileText, Tag, Calendar
} from 'lucide-react'
import api from '../../utils/api'

const categoryConfig = {
  all: { name: 'Tümü', color: 'bg-gray-500', icon: '📚' },
  genel: { name: 'Genel', color: 'bg-blue-500', icon: '📄' },
  tekstil: { name: 'Tekstil Ürünleri', color: 'bg-purple-500', icon: '🧵' },
  aksesuar: { name: 'Aksesuar', color: 'bg-pink-500', icon: '👔' },
  makine: { name: 'Makine & Ekipman', color: 'bg-orange-500', icon: '⚙️' },
  hammadde: { name: 'Hammadde', color: 'bg-green-500', icon: '🏭' },
  diger: { name: 'Diğer', color: 'bg-gray-500', icon: '📦' }
}

export default function Catalogs() {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchCatalogs()
  }, [selectedCategory, currentPage])

  const fetchCatalogs = async () => {
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

      const response = await api.get(`/catalogs?${params}`)
      setCatalogs(response.data.catalogs || [])
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Kataloglar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchCatalogs()
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
            <span className="text-white font-medium">Ürün Kataloğu</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Dijital Kataloglar</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ürün Kataloğu
            </h1>
            <p className="text-lg text-primary-100 mb-6">
              Üye firmalarımızın ürün kataloglarını online olarak inceleyin, PDF formatında indirin.
            </p>

            {/* CTA Button */}
            <Link
              to="/uye/katalog-ekle"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FileText className="w-5 h-5" />
              Kataloğunuzu Ekleyin
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Katalog veya firma adı ara..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Ara
              </button>
            </div>
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(key)
                  setCurrentPage(1)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === key
                    ? `${config.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{config.icon}</span>
                <span className="font-medium text-sm">{config.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalogs Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : catalogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Katalog Bulunamadı</h3>
            <p className="text-gray-500">Aradığınız kriterlere uygun katalog bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catalogs.map((catalog) => (
                <Link
                  key={catalog.id}
                  to={`/katalog/${catalog.slug}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Kapak */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {catalog.coverImage && catalog.coverImage.includes('http') ? (
                      <img
                        src={catalog.coverImage}
                        alt={catalog.title}
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
                        catalog.category === 'tekstil' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                        catalog.category === 'aksesuar' ? 'bg-gradient-to-br from-pink-500 to-pink-700' :
                        catalog.category === 'makine' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                        catalog.category === 'hammadde' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                        'bg-gradient-to-br from-blue-500 to-blue-700'
                      } group-hover:scale-105 transition-transform duration-300`}
                      style={{ display: catalog.coverImage && catalog.coverImage.includes('http') ? 'none' : 'flex' }}
                    >
                      <BookOpen className="w-16 h-16 text-white/80 mb-4" />
                      <h4 className="text-white font-bold text-lg line-clamp-3 px-2">
                        {catalog.title}
                      </h4>
                      {catalog.pageCount && (
                        <p className="text-white/80 text-sm mt-2">
                          {catalog.pageCount} sayfa
                        </p>
                      )}
                    </div>

                    {/* Kategori Badge */}
                    <div className={`absolute top-3 left-3 ${categoryConfig[catalog.category]?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
                      <span>{categoryConfig[catalog.category]?.icon}</span>
                      <span>{categoryConfig[catalog.category]?.name || catalog.category}</span>
                    </div>
                  </div>

                  {/* Bilgiler */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{catalog.companyName}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {catalog.title}
                    </h3>

                    {catalog.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {catalog.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      {catalog.viewCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {catalog.viewCount}
                        </div>
                      )}

                      {catalog.downloadCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {catalog.downloadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
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
