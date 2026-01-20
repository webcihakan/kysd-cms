import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Eye, CheckCircle, XCircle, Star, Users, Plus } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const statusLabels = {
  DRAFT: 'Taslak',
  PENDING: 'Beklemede',
  ACTIVE: 'Aktif',
  PAUSED: 'Duraklatıldı',
  CLOSED: 'Kapandı',
  EXPIRED: 'Süresi Doldu'
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACTIVE: 'bg-green-100 text-green-800',
  PAUSED: 'bg-blue-100 text-blue-800',
  CLOSED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-600'
}

const jobTypeLabels = {
  FULL_TIME: 'Tam Zamanlı',
  PART_TIME: 'Yarı Zamanlı',
  REMOTE: 'Uzaktan',
  HYBRID: 'Hibrit',
  INTERNSHIP: 'Staj',
  CONTRACT: 'Sözleşmeli'
}

export default function JobPostingsList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({})
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchJobs()
    fetchStats()
  }, [page, statusFilter])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '20' })
      if (statusFilter) params.append('status', statusFilter)

      const response = await api.get(`/job-postings/admin/all?${params}`)
      setJobs(response.data.jobs)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/job-postings/admin/stats/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('İstatistikler yüklenemedi')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/job-postings/admin/${id}`)
      fetchJobs()
      fetchStats()
    } catch (error) {
      alert('İlan silinemedi')
    }
  }

  const handleReview = async (id, status, notes = '') => {
    try {
      await api.put(`/job-postings/admin/${id}/review`, { status, adminNotes: notes })
      fetchJobs()
      fetchStats()
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  const toggleFeatured = async (job) => {
    try {
      await api.put(`/job-postings/admin/${job.id}`, {
        ...job,
        isFeatured: !job.isFeatured
      })
      fetchJobs()
    } catch (error) {
      alert('Öne çıkarma durumu güncellenemedi')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">İş İlanları</h1>
        <Link to="/admin/kariyer/ilanlar/ekle" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni İlan Ekle
        </Link>
      </div>

      <div className="mb-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam İlan</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-yellow-800 dark:text-yellow-300">Beklemede</div>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">{stats.pending || 0}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-800 dark:text-green-300">Aktif</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-200">{stats.active || 0}</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-800 dark:text-blue-300">Öne Çıkan</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{stats.featured || 0}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-purple-800 dark:text-purple-300">Toplam Başvuru</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">{stats.totalApplications || 0}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === ''
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'PENDING'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Beklemede ({stats.pending || 0})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'ACTIVE'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setStatusFilter('PAUSED')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'PAUSED'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Duraklatıldı
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {statusFilter ? `${statusLabels[statusFilter]} ilan bulunmuyor` : 'Henüz ilan bulunmuyor'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">İlan Bilgileri</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Firma</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Durum</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Başvuru</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Tarih</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800 dark:text-white">{job.title}</p>
                          {job.isFeatured && (
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {jobTypeLabels[job.jobType]} • {job.city}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">{job.companyName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                        {statusLabels[job.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{job.applicationCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(job.publishedAt || job.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {job.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleReview(job.id, 'ACTIVE')}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Onayla"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                const notes = prompt('Reddetme nedeni (opsiyonel):')
                                handleReview(job.id, 'CLOSED', notes || '')
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Reddet"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => toggleFeatured(job)}
                          className={`p-2 rounded-lg transition-colors ${
                            job.isFeatured
                              ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          title={job.isFeatured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                        >
                          <Star className={`w-5 h-5 ${job.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                        <Link
                          to={`/admin/kariyer/ilanlar/${job.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <a
                          href={`/kariyer/${job.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => handleDelete(job.id)}
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
    </div>
  )
}
