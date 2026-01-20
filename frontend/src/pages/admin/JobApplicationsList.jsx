import { useState, useEffect } from 'react'
import { Eye, Trash2, Download, X, Send } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const statusLabels = {
  PENDING: 'Beklemede',
  REVIEWED: 'İncelendi',
  SHORTLISTED: 'Kısa Liste',
  INTERVIEW: 'Mülakat',
  OFFER: 'Teklif',
  HIRED: 'İşe Alındı',
  REJECTED: 'Reddedildi'
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  SHORTLISTED: 'bg-purple-100 text-purple-800',
  INTERVIEW: 'bg-indigo-100 text-indigo-800',
  OFFER: 'bg-green-100 text-green-800',
  HIRED: 'bg-green-200 text-green-900',
  REJECTED: 'bg-red-100 text-red-800'
}

export default function JobApplicationsList() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [page, statusFilter, searchTerm])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '20' })
      if (statusFilter) params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await api.get(`/job-applications/admin/all?${params}`)
      setApplications(response.data.applications)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      console.error('Başvurular yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/job-applications/admin/${id}`)
      fetchApplications()
    } catch (error) {
      alert('Başvuru silinemedi')
    }
  }

  const sendToMembers = async (id, applicantName) => {
    if (!confirm(`${applicantName} adayının başvurusunu tüm KYSD üyelerine göndermek istediğinize emin misiniz?`)) return

    try {
      setSending(true)
      const response = await api.post(`/job-applications/admin/${id}/send-to-members`)

      if (response.data.sent > 0) {
        alert(`Başarılı!\n${response.data.sent} üyeye gönderildi.\n${response.data.failed > 0 ? `${response.data.failed} başarısız.` : ''}`)
      } else {
        alert('Mail gönderilemedi')
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Mail gönderilemedi')
    } finally {
      setSending(false)
    }
  }

  const viewDetails = async (id) => {
    try {
      const response = await api.get(`/job-applications/admin/${id}`)
      setSelectedApp(response.data)
    } catch (error) {
      alert('Başvuru detayları yüklenemedi')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">İş Başvuruları</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Ad, soyad veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
            className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Başvuru bulunmuyor
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Aday</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">İlan</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Eğitim</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Deneyim</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Durum</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Tarih</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {app.firstName} {app.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{app.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{app.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {app.jobPosting?.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {app.jobPosting?.companyName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{app.educationLevel}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{app.experienceYears}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(app.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(app.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Detayları Gör"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {app.cvFile && (
                          <a
                            href={`${import.meta.env.VITE_UPLOADS_URL}${app.cvFile}`}
                            download
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="CV İndir"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        )}
                        <button
                          onClick={() => sendToMembers(app.id, `${app.firstName} ${app.lastName}`)}
                          disabled={sending}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Tüm Üyelere Gönder"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t dark:border-gray-700">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              Önceki
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Sayfa {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Başvuru Detayları</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Kişisel Bilgiler</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ad Soyad</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedApp.firstName} {selectedApp.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">E-posta</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Telefon</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Şehir</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedApp.city}</p>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Eğitim</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Eğitim Seviyesi</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedApp.educationLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deneyim</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedApp.experienceYears}</p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Ön Yazı</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                </div>
              )}

              {/* Links */}
              {(selectedApp.linkedinUrl || selectedApp.cvFile) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bağlantılar</h3>
                  <div className="space-y-2">
                    {selectedApp.linkedinUrl && (
                      <a
                        href={selectedApp.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        LinkedIn Profili
                      </a>
                    )}
                    {selectedApp.cvFile && (
                      <a
                        href={`${import.meta.env.VITE_UPLOADS_URL}${selectedApp.cvFile}`}
                        download
                        className="flex items-center gap-2 text-green-600 hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        CV İndir
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Job Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Başvurulan İlan</h3>
                <p className="font-medium text-gray-900 dark:text-white">{selectedApp.jobPosting?.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApp.jobPosting?.companyName}</p>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Durum</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedApp.status]}`}>
                  {statusLabels[selectedApp.status]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
