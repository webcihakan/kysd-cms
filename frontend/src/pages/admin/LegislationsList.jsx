import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, AlertCircle, Scale, Gavel, ScrollText, FileText, Globe, Calendar, Building, ExternalLink } from 'lucide-react'
import api from '../../utils/api'

const categoryLabels = {
  law: 'Kanun',
  regulation: 'Yönetmelik',
  circular: 'Genelge',
  international: 'Uluslararası'
}

const categoryColors = {
  law: 'bg-red-100 text-red-800',
  regulation: 'bg-blue-100 text-blue-800',
  circular: 'bg-green-100 text-green-800',
  international: 'bg-purple-100 text-purple-800'
}

const categoryIcons = {
  law: Gavel,
  regulation: ScrollText,
  circular: FileText,
  international: Globe
}

export default function LegislationsList() {
  const [legislations, setLegislations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchLegislations()
  }, [])

  const fetchLegislations = async () => {
    try {
      const response = await api.get('/legislations/admin')
      setLegislations(response.data)
    } catch (error) {
      console.error('Mevzuatlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu mevzuatı silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/legislations/${id}`)
      setLegislations(legislations.filter(l => l.id !== id))
    } catch (error) {
      console.error('Mevzuat silinemedi:', error)
      alert('Mevzuat silinemedi')
    }
  }

  const toggleActive = async (id) => {
    try {
      const response = await api.patch(`/legislations/${id}/toggle-active`)
      setLegislations(legislations.map(l =>
        l.id === id ? response.data : l
      ))
    } catch (error) {
      console.error('Durum güncellenemedi:', error)
    }
  }

  const toggleImportant = async (id) => {
    try {
      const response = await api.patch(`/legislations/${id}/toggle-important`)
      setLegislations(legislations.map(l =>
        l.id === id ? response.data : l
      ))
    } catch (error) {
      console.error('Önemli durumu güncellenemedi:', error)
    }
  }

  const filteredLegislations = filter === 'all'
    ? legislations
    : legislations.filter(l => l.category === filter)

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mevzuat</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Toplam {legislations.length} mevzuat</p>
        </div>
        <Link
          to="/admin/mevzuat/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Mevzuat
        </Link>
      </div>

      {/* Filtreler */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Tümü ({legislations.length})
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = legislations.filter(l => l.category === key).length
          const Icon = categoryIcons[key]
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Mevzuat Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredLegislations.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Scale className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Henüz mevzuat bulunmuyor</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredLegislations.map((legislation) => {
              const CategoryIcon = categoryIcons[legislation.category] || Scale
              return (
                <div key={legislation.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Kategori İkonu */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      categoryColors[legislation.category]?.replace('text-', 'text-').replace('100', '100') || 'bg-gray-100 text-gray-600'
                    }`}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {legislation.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[legislation.category] || 'bg-gray-100 text-gray-600'}`}>
                              {categoryLabels[legislation.category] || legislation.category}
                            </span>
                            {legislation.isImportant && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                                Önemli
                              </span>
                            )}
                            {!legislation.isActive && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                                Pasif
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {legislation.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {legislation.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                        {legislation.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(legislation.date)}
                          </span>
                        )}
                        {legislation.source && (
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {legislation.source}
                          </span>
                        )}
                        {legislation.sourceUrl && (
                          <a
                            href={legislation.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Kaynak
                          </a>
                        )}
                      </div>

                      {/* Etiketler */}
                      {legislation.tags && legislation.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {legislation.tags.slice(0, 5).map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {legislation.tags.length > 5 && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
                              +{legislation.tags.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Aksiyonlar */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleImportant(legislation.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          legislation.isImportant
                            ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={legislation.isImportant ? 'Önemliden kaldır' : 'Önemli işaretle'}
                      >
                        <AlertCircle className={`w-5 h-5 ${legislation.isImportant ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => toggleActive(legislation.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          legislation.isActive
                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={legislation.isActive ? 'Pasife al' : 'Aktif yap'}
                      >
                        {legislation.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <Link
                        to={`/admin/mevzuat/${legislation.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(legislation.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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
