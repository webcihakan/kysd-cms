import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, FolderOpen, Calendar, MapPin } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const categoryLabels = {
  'ab-projesi': 'AB Projeleri',
  'bakanlik-projesi': 'Bakanlık Projeleri',
  'istihdam-projesi': 'İstihdam Projeleri',
  'arge-projesi': 'Ar-Ge Projeleri',
  'ihracat-projesi': 'İhracat Projeleri',
  // Eski İngilizce değerler
  'national': 'Ulusal Projeler',
  'rd': 'Ar-Ge Projeleri',
  'eu': 'AB Projeleri',
  'international': 'Uluslararası Projeler'
}

const statusLabels = {
  'devam-ediyor': 'Devam Ediyor',
  'planlanan': 'Planlanan',
  'tamamlanan': 'Tamamlanan',
  'upcoming': 'Yaklaşan',
  // Eski İngilizce değerler için
  'ongoing': 'Devam Ediyor',
  'planned': 'Planlanan',
  'completed': 'Tamamlanan',
  'active': 'Aktif',
  'pending': 'Beklemede',
  'cancelled': 'İptal Edildi'
}

const statusColors = {
  'devam-ediyor': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'planlanan': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'tamamlanan': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'upcoming': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  // Eski İngilizce değerler için
  'ongoing': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'planned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'pending': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

export default function ProjectsList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/admin')
      setProjects(response.data)
    } catch (error) {
      console.error('Projeler yuklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu projeyi silmek istediginize emin misiniz?')) return

    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter(p => p.id !== id))
    } catch (error) {
      console.error('Proje silinemedi:', error)
      alert('Proje silinemedi')
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/projects/${id}`, { isActive: (!currentStatus).toString() })
      setProjects(projects.map(p =>
        p.id === id ? { ...p, isActive: !currentStatus } : p
      ))
    } catch (error) {
      console.error('Durum guncellenemedi:', error)
    }
  }

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await api.put(`/projects/${id}`, { isFeatured: (!currentStatus).toString() })
      setProjects(projects.map(p =>
        p.id === id ? { ...p, isFeatured: !currentStatus } : p
      ))
    } catch (error) {
      console.error('One cikan durumu guncellenemedi:', error)
    }
  }

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter)

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projeler</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Toplam {projects.length} proje</p>
        </div>
        <Link
          to="/admin/projeler/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Proje
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
          Tümü ({projects.length})
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = projects.filter(p => p.category === key).length
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

      {/* Proje Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Henüz proje bulunmuyor</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredProjects.map((project) => (
              <div key={project.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Görsel */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {project.image ? (
                      <img
                        src={getImageUrl(project.image)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderOpen className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-600'}`}>
                            {statusLabels[project.status] || project.status}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                            {categoryLabels[project.category] || project.category}
                          </span>
                          {project.isFeatured && (
                            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded text-xs font-medium">
                              Öne Çıkan
                            </span>
                          )}
                          {!project.isActive && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded text-xs font-medium">
                              Pasif
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </span>
                      )}
                      {project.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.startDate).toLocaleDateString('tr-TR')}
                          {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('tr-TR')}`}
                        </span>
                      )}
                    </div>

                    {project.progress > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            %{project.progress}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFeatured(project.id, project.isFeatured)}
                      className={`p-2 rounded-lg transition-colors ${
                        project.isFeatured
                          ? 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={project.isFeatured ? 'Öne çıkandan kaldır' : 'Öne çıkar'}
                    >
                      {project.isFeatured ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => toggleActive(project.id, project.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        project.isActive
                          ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={project.isActive ? 'Pasife al' : 'Aktif yap'}
                    >
                      {project.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <Link
                      to={`/admin/projeler/${project.id}`}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
