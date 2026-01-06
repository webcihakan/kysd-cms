import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Edit, Trash2, Monitor, Eye, EyeOff, Calendar, Users,
  RefreshCw, Settings, ClipboardList, Package
} from 'lucide-react'
import api from '../../utils/api'

export default function VirtualFairsList() {
  const [fairs, setFairs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFairs()
  }, [])

  const fetchFairs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/virtual-fairs/admin/all')
      setFairs(response.data)
    } catch (error) {
      console.error('Sanal fuarlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" fuarını silmek istediğinize emin misiniz?`)) return

    try {
      await api.delete(`/virtual-fairs/${id}`)
      fetchFairs()
    } catch (error) {
      alert('Fuar silinemedi')
    }
  }

  const toggleActive = async (fair) => {
    try {
      const formData = new FormData()
      formData.append('title', fair.title)
      formData.append('description', fair.description || '')
      formData.append('startDate', fair.startDate)
      formData.append('endDate', fair.endDate)
      formData.append('isActive', !fair.isActive)

      await api.put(`/virtual-fairs/${fair.id}`, formData)
      fetchFairs()
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getFairStatus = (fair) => {
    const now = new Date()
    const start = new Date(fair.startDate)
    const end = new Date(fair.endDate)

    if (now < start) return { text: 'Yaklaşan', color: 'bg-blue-100 text-blue-700' }
    if (now > end) return { text: 'Sona Erdi', color: 'bg-gray-100 text-gray-700' }
    return { text: 'Devam Ediyor', color: 'bg-green-100 text-green-700' }
  }

  // İstatistikler
  const activeFairs = fairs.filter(f => f.isActive).length
  const totalBooths = fairs.reduce((sum, f) => sum + (f._count?.booths || 0), 0)
  const totalApplications = fairs.reduce((sum, f) => sum + (f._count?.applications || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sanal Fuarlar</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Online sanal fuar etkinliklerini yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchFairs}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
          <Link
            to="/admin/sanal-fuar-basvurulari"
            className="btn-secondary flex items-center gap-2"
          >
            <ClipboardList className="w-5 h-5" />
            Başvurular
          </Link>
          <Link
            to="/admin/sanal-fuarlar/ekle"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Fuar
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{fairs.length}</p>
              <p className="text-xs text-gray-500">Toplam Fuar</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{activeFairs}</p>
              <p className="text-xs text-gray-500">Aktif Fuar</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalBooths}</p>
              <p className="text-xs text-gray-500">Toplam Stant</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalApplications}</p>
              <p className="text-xs text-gray-500">Toplam Başvuru</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        </div>
      ) : fairs.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <Monitor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz sanal fuar oluşturulmamış</p>
            <Link to="/admin/sanal-fuarlar/ekle" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              İlk Fuarı Oluştur
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {fairs.map((fair) => {
            const status = getFairStatus(fair)
            return (
              <div key={fair.id} className="card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Kapak Resmi */}
                  <div className="md:w-48 h-32 md:h-auto bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    {fair.coverImage ? (
                      <img
                        src={fair.coverImage}
                        alt={fair.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Monitor className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {fair.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                          {!fair.isActive && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Pasif
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {fair.description || 'Açıklama eklenmemiş'}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(fair.startDate)} - {formatDate(fair.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span>{fair._count?.booths || 0} Stant</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClipboardList className="w-4 h-4" />
                            <span>{fair._count?.applications || 0} Başvuru</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4" />
                            <span>{fair.boothTypes?.length || 0} Stant Türü</span>
                          </div>
                        </div>
                      </div>

                      {/* Aksiyonlar */}
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/sanal-fuarlar/${fair.id}/stantlar`}
                          className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="Stantları Yönet"
                        >
                          <Package className="w-4 h-4 text-purple-500" />
                        </Link>
                        <button
                          onClick={() => toggleActive(fair)}
                          className={`p-2 rounded-lg transition-colors ${
                            fair.isActive
                              ? 'hover:bg-green-50 dark:hover:bg-green-900/20'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title={fair.isActive ? 'Pasife Al' : 'Aktife Al'}
                        >
                          {fair.isActive ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <Link
                          to={`/admin/sanal-fuarlar/${fair.id}`}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                        <button
                          onClick={() => handleDelete(fair.id, fair.title)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
