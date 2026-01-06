import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, MapPin, Calendar, ExternalLink, Building } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function FairsList() {
  const [fairs, setFairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchFairs()
  }, [])

  const fetchFairs = async () => {
    try {
      const response = await api.get('/fairs/admin')
      setFairs(response.data)
    } catch (error) {
      console.error('Fuarlar yuklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu fuari silmek istediginize emin misiniz?')) return

    try {
      await api.delete(`/fairs/${id}`)
      setFairs(fairs.filter(f => f.id !== id))
    } catch (error) {
      console.error('Fuar silinemedi:', error)
      alert('Fuar silinemedi')
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/fairs/${id}`, { isActive: (!currentStatus).toString() })
      setFairs(fairs.map(f =>
        f.id === id ? { ...f, isActive: !currentStatus } : f
      ))
    } catch (error) {
      console.error('Durum guncellenemedi:', error)
    }
  }

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await api.put(`/fairs/${id}`, { isFeatured: (!currentStatus).toString() })
      setFairs(fairs.map(f =>
        f.id === id ? { ...f, isFeatured: !currentStatus } : f
      ))
    } catch (error) {
      console.error('One cikan durumu guncellenemedi:', error)
    }
  }

  const filteredFairs = filter === 'all'
    ? fairs
    : filter === 'kysd'
    ? fairs.filter(f => f.isKysdOrganized)
    : fairs.filter(f => !f.isKysdOrganized)

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const formatDateRange = (start, end) => {
    if (!start) return ''
    const startDate = new Date(start).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    if (!end) return startDate
    const endDate = new Date(end).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${startDate} - ${endDate}`
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fuarlar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Toplam {fairs.length} fuar</p>
        </div>
        <Link
          to="/admin/fuarlar/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Fuar
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
          Tümü ({fairs.length})
        </button>
        <button
          onClick={() => setFilter('kysd')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'kysd'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          KYSD Organizasyonu ({fairs.filter(f => f.isKysdOrganized).length})
        </button>
        <button
          onClick={() => setFilter('other')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'other'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Diğer Fuarlar ({fairs.filter(f => !f.isKysdOrganized).length})
        </button>
      </div>

      {/* Fuar Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredFairs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Building className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Henüz fuar bulunmuyor</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredFairs.map((fair) => (
              <div key={fair.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Görsel */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {fair.image ? (
                      <img
                        src={getImageUrl(fair.image)}
                        alt={fair.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {fair.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {fair.isKysdOrganized && (
                            <span className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded text-xs font-medium">
                              KYSD Organizasyonu
                            </span>
                          )}
                          {fair.isFeatured && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                              Öne Çıkan
                            </span>
                          )}
                          {!fair.isActive && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                              Pasif
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      {(fair.location || fair.country) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {[fair.location, fair.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {fair.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDateRange(fair.startDate, fair.endDate)}
                        </span>
                      )}
                      {fair.website && (
                        <a
                          href={fair.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Web Sitesi
                        </a>
                      )}
                    </div>

                    {fair.organizer && (
                      <p className="mt-2 text-sm text-gray-500">
                        Organizatör: <span className="font-medium">{fair.organizer}</span>
                      </p>
                    )}

                    {fair.deadline && (
                      <p className="mt-1 text-sm text-orange-600">
                        Son Başvuru: {new Date(fair.deadline).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFeatured(fair.id, fair.isFeatured)}
                      className={`p-2 rounded-lg transition-colors ${
                        fair.isFeatured
                          ? 'text-yellow-600 hover:bg-yellow-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={fair.isFeatured ? 'Öne çıkandan kaldır' : 'Öne çıkar'}
                    >
                      {fair.isFeatured ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => toggleActive(fair.id, fair.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        fair.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={fair.isActive ? 'Pasife al' : 'Aktif yap'}
                    >
                      {fair.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <Link
                      to={`/admin/fuarlar/${fair.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(fair.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
