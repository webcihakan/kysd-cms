import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, GraduationCap, Calendar, MapPin, Users, Clock } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const categoryLabels = {
  seminar: 'Seminer',
  workshop: 'Atölye',
  certificate: 'Sertifikalı Eğitim',
  online: 'Online Eğitim'
}

const categoryColors = {
  seminar: 'bg-blue-100 text-blue-800',
  workshop: 'bg-purple-100 text-purple-800',
  certificate: 'bg-green-100 text-green-800',
  online: 'bg-orange-100 text-orange-800'
}

export default function TrainingsList() {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      const response = await api.get('/trainings/admin')
      setTrainings(response.data)
    } catch (error) {
      console.error('Egitimler yuklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu egitimi silmek istediginize emin misiniz?')) return

    try {
      await api.delete(`/trainings/${id}`)
      setTrainings(trainings.filter(t => t.id !== id))
    } catch (error) {
      console.error('Egitim silinemedi:', error)
      alert('Egitim silinemedi')
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/trainings/${id}`, { isActive: (!currentStatus).toString() })
      setTrainings(trainings.map(t =>
        t.id === id ? { ...t, isActive: !currentStatus } : t
      ))
    } catch (error) {
      console.error('Durum guncellenemedi:', error)
    }
  }

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await api.put(`/trainings/${id}`, { isFeatured: (!currentStatus).toString() })
      setTrainings(trainings.map(t =>
        t.id === id ? { ...t, isFeatured: !currentStatus } : t
      ))
    } catch (error) {
      console.error('One cikan durumu guncellenemedi:', error)
    }
  }

  const filteredTrainings = filter === 'all'
    ? trainings
    : trainings.filter(t => t.category === filter)

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Eğitimler</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Toplam {trainings.length} eğitim</p>
        </div>
        <Link
          to="/admin/egitimler/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Eğitim
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
          Tümü ({trainings.length})
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = trainings.filter(t => t.category === key).length
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Eğitim Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredTrainings.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Henüz eğitim bulunmuyor</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTrainings.map((training) => (
              <div key={training.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Görsel */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {training.image ? (
                      <img
                        src={getImageUrl(training.image)}
                        alt={training.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {training.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[training.category] || 'bg-gray-100 text-gray-600'}`}>
                            {categoryLabels[training.category] || training.category}
                          </span>
                          {training.isFeatured && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                              Öne Çıkan
                            </span>
                          )}
                          {!training.isActive && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                              Pasif
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      {training.instructor && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {training.instructor}
                        </span>
                      )}
                      {training.eventDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(training.eventDate).toLocaleDateString('tr-TR')}
                          {training.eventTime && ` - ${training.eventTime}`}
                        </span>
                      )}
                      {training.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {training.location}
                        </span>
                      )}
                      {training.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {training.duration}
                        </span>
                      )}
                    </div>

                    {(training.quota || training.price) && (
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        {training.quota && (
                          <span className="text-gray-600">
                            Kontenjan: <strong>{training.quota}</strong> kişi
                          </span>
                        )}
                        {training.price && (
                          <span className="text-primary-600 font-medium">
                            {training.price}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFeatured(training.id, training.isFeatured)}
                      className={`p-2 rounded-lg transition-colors ${
                        training.isFeatured
                          ? 'text-yellow-600 hover:bg-yellow-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={training.isFeatured ? 'Öne çıkandan kaldır' : 'Öne çıkar'}
                    >
                      {training.isFeatured ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => toggleActive(training.id, training.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        training.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={training.isActive ? 'Pasife al' : 'Aktif yap'}
                    >
                      {training.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <Link
                      to={`/admin/egitimler/${training.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(training.id)}
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
