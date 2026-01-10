import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, TrendingUp, Calendar, Search, Filter } from 'lucide-react'
import api from '../../utils/api'

const categoryInfo = {
  ihracat: { name: 'İhracat', color: 'bg-blue-100 text-blue-800' },
  ithalat: { name: 'İthalat', color: 'bg-purple-100 text-purple-800' },
  asgari_ucret: { name: 'Asgari Ücret', color: 'bg-green-100 text-green-800' },
  emekli_maasi: { name: 'Emekli Maaşı', color: 'bg-teal-100 text-teal-800' },
  kira_artis: { name: 'Kira Artışı', color: 'bg-orange-100 text-orange-800' },
  enflasyon: { name: 'Enflasyon', color: 'bg-red-100 text-red-800' },
  dolar: { name: 'Dolar', color: 'bg-emerald-100 text-emerald-800' },
  euro: { name: 'Euro', color: 'bg-indigo-100 text-indigo-800' },
  altin: { name: 'Altın', color: 'bg-yellow-100 text-yellow-800' }
}

export default function EconomicIndicatorsList() {
  const [indicators, setIndicators] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [years, setYears] = useState([])

  useEffect(() => {
    fetchYearsForCategory()
  }, [])

  useEffect(() => {
    fetchYearsForCategory()
    setSelectedYear('all')
  }, [selectedCategory])

  useEffect(() => {
    fetchIndicators()
  }, [selectedCategory, selectedYear])

  const fetchYearsForCategory = async () => {
    try {
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
      alert('Göstergeler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu göstergeyi silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      await api.delete(`/economic-indicators/${id}`)
      alert('Gösterge başarıyla silindi')
      fetchIndicators()
    } catch (error) {
      console.error('Gösterge silinemedi:', error)
      alert('Gösterge silinirken hata oluştu')
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

  const filteredIndicators = indicators.filter(ind =>
    ind.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-7 h-7" />
              Ekonomik Göstergeler
            </h1>
            <p className="text-gray-600 mt-1">Türkiye ekonomi raporlarını yönetin</p>
          </div>
          <Link
            to="/admin/ekonomik-gostergeler/ekle"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Gösterge Ekle
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Gösterge ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-gray-900">{indicators.length}</div>
          <div className="text-sm text-gray-600">Toplam Gösterge</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="text-2xl font-bold text-gray-900">{indicators.filter(i => i.isActive).length}</div>
          <div className="text-sm text-gray-600">Aktif Gösterge</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-gray-900">{Object.keys(categoryInfo).length}</div>
          <div className="text-sm text-gray-600">Kategori</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-gray-900">{years.length}</div>
          <div className="text-sm text-gray-600">Yıl</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
          </div>
        ) : filteredIndicators.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Gösterge Bulunamadı</h3>
            <p className="text-gray-600 mb-4">Henüz eklenmiş gösterge bulunmamaktadır.</p>
            <Link to="/admin/ekonomik-gostergeler/ekle" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              İlk Göstergeyi Ekle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Değer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dönem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Değişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIndicators.map((indicator) => {
                  const info = categoryInfo[indicator.category] || { name: indicator.category, color: 'bg-gray-100 text-gray-800' }
                  return (
                    <tr key={indicator.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{indicator.title}</div>
                        {indicator.source && (
                          <div className="text-xs text-gray-500">Kaynak: {indicator.source}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${info.color}`}>
                          {info.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatValue(indicator.value, indicator.unit)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatMonth(indicator.month)} {indicator.year}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {indicator.changePercent && (
                          <div className={`text-sm font-medium ${parseFloat(indicator.changePercent) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {parseFloat(indicator.changePercent) > 0 ? '+' : ''}{parseFloat(indicator.changePercent).toFixed(2)}%
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${indicator.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {indicator.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/ekonomik-gostergeler/${indicator.id}`}
                            className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(indicator.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
