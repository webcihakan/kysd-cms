import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Calendar, DollarSign, Briefcase, Home as HomeIcon, ExternalLink, BarChart3, Filter, Grid, List } from 'lucide-react'
import api from '../../utils/api'

const categoryInfo = {
  ihracat: { name: 'İhracat', icon: TrendingUp, color: 'bg-blue-500' },
  ithalat: { name: 'İthalat', icon: TrendingDown, color: 'bg-purple-500' },
  asgari_ucret: { name: 'Asgari Ücret', icon: DollarSign, color: 'bg-green-500' },
  emekli_maasi: { name: 'Emekli Maaşı', icon: DollarSign, color: 'bg-teal-500' },
  kira_artis: { name: 'Kira Artışı', icon: HomeIcon, color: 'bg-orange-500' },
  enflasyon: { name: 'Enflasyon', icon: TrendingUp, color: 'bg-red-500' },
  dolar: { name: 'Dolar', icon: DollarSign, color: 'bg-emerald-500' },
  euro: { name: 'Euro', icon: DollarSign, color: 'bg-indigo-500' },
  altin: { name: 'Altın', icon: TrendingUp, color: 'bg-yellow-500' }
}

export default function TurkeyReports() {
  const [indicators, setIndicators] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [loading, setLoading] = useState(true)
  const [years, setYears] = useState([])
  const [viewMode, setViewMode] = useState('grid') // 'grid' veya 'list'

  useEffect(() => {
    fetchCategories()
    fetchYearsForCategory() // İlk yükleme
  }, [])

  useEffect(() => {
    fetchYearsForCategory() // Kategori değiştiğinde yılları güncelle
    setSelectedYear('all') // Yıl seçimini sıfırla
  }, [selectedCategory])

  useEffect(() => {
    fetchIndicators() // Kategori veya yıl değiştiğinde verileri çek
  }, [selectedCategory, selectedYear])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/economic-indicators/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error)
    }
  }

  const fetchYearsForCategory = async () => {
    try {
      // Seçili kategoriye göre yılları çek
      const params = {}
      if (selectedCategory !== 'all') params.category = selectedCategory

      const response = await api.get('/economic-indicators', { params })
      const uniqueYears = [...new Set(response.data.map(ind => ind.year))].sort((a, b) => b - a)
      setYears(uniqueYears)
    } catch (error) {
      console.error('Yıllar yüklenemedi:', error)
    }
  }

  const fetchIndicators = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (selectedYear !== 'all') params.year = selectedYear

      const response = await api.get('/economic-indicators', { params })
      setIndicators(response.data)
    } catch (error) {
      console.error('Göstergeler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatValue = (value, unit) => {
    return `${parseFloat(value).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`
  }

  const formatMonth = (month) => {
    if (!month) return 'Yıllık'
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    return months[month - 1]
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Türkiye Genel Raporları</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Türkiye Genel Raporları</h1>
          </div>
          <p className="text-primary-100 text-lg">
            2005 yılından bu yana Türkiye ekonomisinin güncel göstergeleri ve istatistikleri
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left side - Filters */}
            <div className="flex items-center gap-4 flex-wrap flex-1">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Filtreler:</span>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tüm Kategoriler</option>
                {Object.keys(categoryInfo).map(cat => (
                  <option key={cat} value={cat}>{categoryInfo[cat].name}</option>
                ))}
              </select>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tüm Yıllar</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Right side - View Mode Toggle and Count */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{indicators.length}</span> gösterge
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Kart Görünümü"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Liste Görünümü"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
          </div>
        ) : indicators.length === 0 ? (
          <div className="text-center py-16">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Gösterge Bulunamadı</h3>
            <p className="text-gray-600">Seçtiğiniz filtrelere uygun gösterge bulunmamaktadır.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((indicator) => {
              const info = categoryInfo[indicator.category] || { name: indicator.category, icon: BarChart3, color: 'bg-gray-500' }
              const Icon = info.icon
              const isPositive = indicator.changePercent && parseFloat(indicator.changePercent) > 0

              return (
                <div key={indicator.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${info.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{indicator.title}</h3>
                        <span className="text-sm text-gray-500">{info.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {formatValue(indicator.value, indicator.unit)}
                    </div>
                    {indicator.changePercent && (
                      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isPositive ? '+' : ''}{parseFloat(indicator.changePercent).toFixed(2)}%
                      </div>
                    )}
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{formatMonth(indicator.month)} {indicator.year}</span>
                  </div>

                  {/* Description */}
                  {indicator.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {indicator.description}
                    </p>
                  )}

                  {/* Source */}
                  {indicator.source && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Kaynak: {indicator.source}</span>
                        {indicator.sourceUrl && (
                          <a
                            href={indicator.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* Liste Görünümü */
          <div className="space-y-4">
            {indicators.map((indicator) => {
              const info = categoryInfo[indicator.category] || { name: indicator.category, icon: BarChart3, color: 'bg-gray-500' }
              const Icon = info.icon
              const isPositive = indicator.changePercent && parseFloat(indicator.changePercent) > 0

              return (
                <div key={indicator.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    {/* Üst Kısım - Mobil ve Desktop */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                      {/* Sol: Kategori ve Başlık */}
                      <div className="flex items-center gap-4 lg:flex-1">
                        <div className={`${info.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${info.color}`}>
                              {info.name}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{indicator.title}</h3>
                          {indicator.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {indicator.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Sağ: Değerler */}
                      <div className="flex flex-wrap items-center gap-4 lg:gap-6 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                        {/* Değer */}
                        <div className="flex-shrink-0">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Değer</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatValue(indicator.value, indicator.unit)}
                          </div>
                        </div>

                        {/* Değişim */}
                        <div className="flex-shrink-0">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Değişim</div>
                          {indicator.changePercent ? (
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-lg ${
                              isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                              {isPositive ? '+' : ''}{parseFloat(indicator.changePercent).toFixed(2)}%
                            </div>
                          ) : (
                            <span className="text-gray-400 text-lg">-</span>
                          )}
                        </div>

                        {/* Dönem */}
                        <div className="flex-shrink-0">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dönem</div>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-900">
                              {formatMonth(indicator.month)} {indicator.year}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alt Kısım - Kaynak */}
                    {indicator.source && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Kaynak:</span>
                            <span className="text-sm font-medium text-gray-700">{indicator.source}</span>
                          </div>
                          {indicator.sourceUrl && (
                            <a
                              href={indicator.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <span>Kaynağa Git</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
