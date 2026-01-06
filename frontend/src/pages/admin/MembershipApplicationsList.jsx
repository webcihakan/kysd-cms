import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Check, X, Trash2, Building2, Phone, Mail, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../utils/api'

export default function MembershipApplicationsList() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [filter, pagination.page])

  const fetchStats = async () => {
    try {
      const response = await api.get('/membership-applications/stats')
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
      params.append('page', pagination.page)
      params.append('limit', 10)

      const response = await api.get(`/membership-applications?${params}`)
      setApplications(response.data.applications)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Başvurular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(true)
      await api.put(`/membership-applications/${id}/status`, { status })
      fetchApplications()
      fetchStats()
      setShowModal(false)
      setSelectedApplication(null)
    } catch (error) {
      alert('Durum güncellenemedi')
    } finally {
      setActionLoading(false)
    }
  }

  const deleteApplication = async (id) => {
    if (!confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/membership-applications/${id}`)
      fetchApplications()
      fetchStats()
    } catch (error) {
      alert('Başvuru silinemedi')
    }
  }

  const openDetail = (application) => {
    setSelectedApplication(application)
    setShowModal(true)
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    }
    const labels = {
      PENDING: 'Beklemede',
      APPROVED: 'Onaylandı',
      REJECTED: 'Reddedildi'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Üyelik Başvuruları</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Toplam</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">Beklemede</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-sm text-gray-500">Onaylanan</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              <p className="text-sm text-gray-500">Reddedilen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setPagination(p => ({ ...p, page: 1 }))
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tüm Başvurular</option>
            <option value="PENDING">Beklemede</option>
            <option value="APPROVED">Onaylanan</option>
            <option value="REJECTED">Reddedilen</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Henüz başvuru bulunmuyor
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Firma</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Yetkili</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">İletişim</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sanayi Grubu</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tarih</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{app.companyName}</p>
                    <p className="text-sm text-gray-500">{app.city}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.contactName}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{app.phone}</p>
                    <p className="text-sm text-gray-500">{app.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {app.industryGroup?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(app.createdAt)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openDetail(app)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Detay"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {app.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateStatus(app.id, 'APPROVED')}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Onayla"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'REJECTED')}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reddet"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Toplam {pagination.total} başvurudan {((pagination.page - 1) * 10) + 1}-{Math.min(pagination.page * 10, pagination.total)} arası gösteriliyor
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Başvuru Detayı</h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedApplication(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Company Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Firma Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Firma Adı:</span>
                    <p className="font-medium">{selectedApplication.companyName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Firma Türü:</span>
                    <p className="font-medium">{selectedApplication.companyType || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Vergi No:</span>
                    <p className="font-medium">{selectedApplication.taxNumber || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Vergi Dairesi:</span>
                    <p className="font-medium">{selectedApplication.taxOffice || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ticaret Sicil No:</span>
                    <p className="font-medium">{selectedApplication.tradeRegistry || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Kuruluş Yılı:</span>
                    <p className="font-medium">{selectedApplication.foundedYear || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">İletişim Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <span className="text-gray-500">Adres:</span>
                    <p className="font-medium">{selectedApplication.address}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Şehir:</span>
                    <p className="font-medium">{selectedApplication.city}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">İlçe:</span>
                    <p className="font-medium">{selectedApplication.district || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <p className="font-medium">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Faks:</span>
                    <p className="font-medium">{selectedApplication.fax || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">E-posta:</span>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Website:</span>
                    <p className="font-medium">{selectedApplication.website || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Authorized Person */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Yetkili Kişi</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Ad Soyad:</span>
                    <p className="font-medium">{selectedApplication.contactName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ünvan:</span>
                    <p className="font-medium">{selectedApplication.contactTitle || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <p className="font-medium">{selectedApplication.contactPhone || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">E-posta:</span>
                    <p className="font-medium">{selectedApplication.contactEmail || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Activity Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Faaliyet Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Sanayi Grubu:</span>
                    <p className="font-medium">{selectedApplication.industryGroup?.name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Çalışan Sayısı:</span>
                    <p className="font-medium">{selectedApplication.employeeCount || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Faaliyet Alanı:</span>
                    <p className="font-medium">{selectedApplication.activityArea || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Durum:</span>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                <div className="text-sm text-gray-500">
                  Başvuru: {formatDate(selectedApplication.createdAt)}
                </div>
              </div>

              {/* Actions */}
              {selectedApplication.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => updateStatus(selectedApplication.id, 'APPROVED')}
                    disabled={actionLoading}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Onayla
                  </button>
                  <button
                    onClick={() => updateStatus(selectedApplication.id, 'REJECTED')}
                    disabled={actionLoading}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
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
