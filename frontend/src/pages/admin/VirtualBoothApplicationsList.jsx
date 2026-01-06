import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList, Check, X, Eye, Trash2, RefreshCw, Filter,
  Building2, Mail, Phone, Globe, MessageSquare, Calendar
} from 'lucide-react'
import api from '../../utils/api'

export default function VirtualBoothApplicationsList() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedFair, setSelectedFair] = useState('')
  const [fairs, setFairs] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [selectedApp, setSelectedApp] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchFairs()
  }, [])

  useEffect(() => {
    fetchApplications()
    fetchStats()
  }, [filter, selectedFair, pagination.page])

  const fetchFairs = async () => {
    try {
      const response = await api.get('/virtual-fairs/admin/all')
      setFairs(response.data)
    } catch (error) {
      console.error('Fuarlar yüklenemedi')
    }
  }

  const fetchStats = async () => {
    try {
      const params = selectedFair ? `?fairId=${selectedFair}` : ''
      const response = await api.get(`/virtual-booth-applications/stats${params}`)
      setStats(response.data)
    } catch (error) {
      console.error('İstatistikler yüklenemedi')
    }
  }

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter) params.append('status', filter)
      if (selectedFair) params.append('fairId', selectedFair)
      params.append('page', pagination.page)
      params.append('limit', 20)

      const response = await api.get(`/virtual-booth-applications?${params}`)
      setApplications(response.data.applications)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Başvurular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    const messages = {
      APPROVED: 'Bu başvuruyu onaylamak istediğinize emin misiniz? Otomatik olarak stant oluşturulacak.',
      REJECTED: 'Bu başvuruyu reddetmek istediğinize emin misiniz?'
    }

    if (!confirm(messages[status])) return

    try {
      await api.put(`/virtual-booth-applications/${id}/status`, { status })
      fetchApplications()
      fetchStats()
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  const deleteApplication = async (id) => {
    if (!confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/virtual-booth-applications/${id}`)
      fetchApplications()
      fetchStats()
    } catch (error) {
      alert('Başvuru silinemedi')
    }
  }

  const openDetail = (app) => {
    setSelectedApp(app)
    setShowDetailModal(true)
  }

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700'
    }
    const labels = {
      PENDING: 'Beklemede',
      APPROVED: 'Onaylandı',
      REJECTED: 'Reddedildi',
      CANCELLED: 'İptal'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Stant Başvuruları</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Sanal fuar stant başvurularını yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchApplications(); fetchStats(); }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
          <Link to="/admin/sanal-fuarlar" className="btn-secondary">
            Fuarlara Git
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500">Toplam</p>
            </div>
          </div>
        </div>
        <div className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('PENDING')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.pending}</p>
              <p className="text-xs text-gray-500">Beklemede</p>
            </div>
          </div>
        </div>
        <div className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('APPROVED')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.approved}</p>
              <p className="text-xs text-gray-500">Onaylanan</p>
            </div>
          </div>
        </div>
        <div className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('REJECTED')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.rejected}</p>
              <p className="text-xs text-gray-500">Reddedilen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">Filtrele:</span>
        </div>

        <select
          value={selectedFair}
          onChange={(e) => { setSelectedFair(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
        >
          <option value="">Tüm Fuarlar</option>
          {fairs.map(f => (
            <option key={f.id} value={f.id}>{f.title}</option>
          ))}
        </select>

        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
        >
          <option value="">Tüm Durumlar</option>
          <option value="PENDING">Beklemede</option>
          <option value="APPROVED">Onaylanan</option>
          <option value="REJECTED">Reddedilen</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz başvuru yok</p>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Firma</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Fuar</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Stant Türü</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tarih</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Durum</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{app.companyName}</p>
                        <p className="text-sm text-gray-500">{app.contactName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {app.fair?.title || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{app.boothType?.name}</p>
                        <p className="text-xs text-green-600">{parseFloat(app.boothType?.price || 0).toLocaleString('tr-TR')} TL</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openDetail(app)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Detay"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        {app.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateStatus(app.id, 'APPROVED')}
                              className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Onayla"
                            >
                              <Check className="w-4 h-4 text-green-500" />
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, 'REJECTED')}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Reddet"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Toplam {pagination.total} başvuru
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Önceki
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pagination.page} / {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Başvuru Detayı</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Firma Bilgileri */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Firma Bilgileri</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedApp.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedApp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedApp.phone}</span>
                  </div>
                  {selectedApp.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a href={selectedApp.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedApp.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Fuar Bilgileri */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Fuar & Stant</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApp.fair?.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Stant Türü: {selectedApp.boothType?.name} - {parseFloat(selectedApp.boothType?.price || 0).toLocaleString('tr-TR')} TL
                  </p>
                </div>
              </div>

              {/* Mesaj */}
              {selectedApp.message && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Mesaj</h4>
                  <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300">{selectedApp.message}</p>
                  </div>
                </div>
              )}

              {/* Durum */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Durum</h4>
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedApp.status)}
                  <span className="text-sm text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {formatDate(selectedApp.createdAt)}
                  </span>
                </div>
              </div>

              {/* Aksiyonlar */}
              {selectedApp.status === 'PENDING' && (
                <div className="flex items-center gap-3 pt-4 border-t dark:border-gray-700">
                  <button
                    onClick={() => { updateStatus(selectedApp.id, 'APPROVED'); setShowDetailModal(false); }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Onayla
                  </button>
                  <button
                    onClick={() => { updateStatus(selectedApp.id, 'REJECTED'); setShowDetailModal(false); }}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Reddet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
