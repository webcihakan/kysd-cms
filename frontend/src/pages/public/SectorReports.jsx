import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  ChevronRight,
  Download,
  Calendar,
  Search,
  BarChart3,
  TrendingUp,
  PieChart,
  FileSpreadsheet,
  Eye,
  Star,
  FolderOpen,
  ArrowUpRight,
  ExternalLink,
  Building2
} from 'lucide-react'
import api from '../../utils/api'

const reportCategories = [
  { id: 'all', name: 'Tümü', icon: FolderOpen },
  { id: 'sektor-raporu', name: 'Sektör Raporları', icon: BarChart3 },
  { id: 'ihracat-raporu', name: 'İhracat Raporları', icon: TrendingUp },
  { id: 'analiz', name: 'Analizler', icon: PieChart }
]

const sources = [
  { id: 'all', name: 'Tümü' },
  { id: 'İSO', name: 'İSO' },
  { id: 'İTO', name: 'İTO' },
  { id: 'TGSD', name: 'TGSD' },
  { id: 'İHKİB', name: 'İHKİB' },
  { id: 'AKİB', name: 'AKİB' },
  { id: 'MÜSİAD', name: 'MÜSİAD' },
  { id: 'Ticaret Bakanlığı', name: 'Ticaret Bakanlığı' },
  { id: 'İş Bankası', name: 'İş Bankası' }
]

export default function SectorReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await api.get('/reports')
      setReports(response.data)
    } catch (error) {
      console.error('Raporlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory
    const matchesSource = selectedSource === 'all' || report.source === selectedSource
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSource && matchesSearch
  })

  const featuredReport = reports.find(r => r.isFeatured)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getCategoryName = (categoryId) => {
    return reportCategories.find(c => c.id === categoryId)?.name || categoryId
  }

  const getCategoryColor = (categoryId) => {
    const colors = {
      'sektor-raporu': 'bg-blue-100 text-blue-700',
      'ihracat-raporu': 'bg-green-100 text-green-700',
      'analiz': 'bg-purple-100 text-purple-700'
    }
    return colors[categoryId] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
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
            <span className="text-white font-medium">Sektör Raporları</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BarChart3 className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Güncel Veriler</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sektör Raporları
            </h1>
            <p className="text-lg text-primary-100">
              İSO, İTO, TGSD, İHKİB ve diğer kurumların hazırladığı konfeksiyon yan sanayi
              sektörüne ait güncel pazar analizleri, ihracat verileri ve istatistiksel raporlar.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Report */}
      {featuredReport && (
        <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-sm font-medium mb-1">Öne Çıkan Rapor</div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 break-words">
                    {featuredReport.title}
                  </h2>
                  <p className="text-white/80 text-sm line-clamp-2">{featuredReport.description}</p>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3 text-white/70 text-sm">
                    {featuredReport.source && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {featuredReport.source}
                      </span>
                    )}
                    {featuredReport.publishDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredReport.publishDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                {featuredReport.pdfUrl && (
                  <a
                    href={featuredReport.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-accent-600 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    <Download className="w-5 h-5" />
                    PDF İndir
                  </a>
                )}
                {featuredReport.sourceUrl && (
                  <a
                    href={featuredReport.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-5 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Kaynağa Git
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rapor Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Anahtar kelime..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Kategori</label>
                <div className="space-y-2">
                  {reportCategories.map((category) => (
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

              {/* Source Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Kaynak</label>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => setSelectedSource(source.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedSource === source.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {source.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{reports.length}</div>
                  <div className="text-sm text-gray-500">Toplam Rapor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredReports.length}</span> rapor bulundu
              </p>
              {(selectedCategory !== 'all' || selectedSource !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedSource('all')
                    setSearchTerm('')
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-7 h-7 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(report.category)}`}>
                            {getCategoryName(report.category)}
                          </span>
                          {report.isFeatured && (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent-100 text-accent-700">
                              Öne Çıkan
                            </span>
                          )}
                          {report.source && (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                              {report.source}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {report.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {report.publishDate && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {formatDate(report.publishDate)}
                            </span>
                          )}
                          {report.pdfUrl && (
                            <span className="flex items-center gap-1.5">
                              <FileSpreadsheet className="w-4 h-4" />
                              PDF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 md:items-end">
                      {report.pdfUrl && (
                        <a
                          href={report.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          İndir
                        </a>
                      )}
                      {report.sourceUrl && (
                        <a
                          href={report.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Kaynak
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredReports.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapor Bulunamadı</h3>
                <p className="text-gray-500 mb-4">Arama kriterlerinize uygun rapor bulunamadı.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedSource('all')
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

      {/* CTA Section */}
      <div className="bg-gray-100 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Özel Raporlara Erişim
                </h2>
                <p className="text-primary-100">
                  KYSD üyesi olarak tüm raporlara ve özel analizlere erişebilirsiniz.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/uyelik-basvurusu"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Üye Ol
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/iletisim"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  İletişim
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
