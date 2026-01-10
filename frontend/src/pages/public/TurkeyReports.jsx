import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Calendar, DollarSign, Briefcase, Home as HomeIcon, ExternalLink, BarChart3, Filter } from 'lucide-react'
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
          <div className="flex items-center gap-4 flex-wrap">
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

            <div className="ml-auto text-sm text-gray-600">
              <span className="font-medium">{indicators.length}</span> gösterge bulundu
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
        ) : (
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
        )}
      </div>
    </div>
  )
}
