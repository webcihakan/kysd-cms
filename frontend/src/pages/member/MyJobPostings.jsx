import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, Users, Pause, Play, XCircle } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const statusLabels = {
  DRAFT: 'Taslak',
  PENDING: 'Onay Bekliyor',
  ACTIVE: 'Yayında',
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

export default function MyJobPostings() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, totalApplications: 0 })

  useEffect(() => {
    fetchJobs()
    fetchStats()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/job-postings/member/my-jobs')
      // Map _count.applications to applicationCount
      const jobsWithCount = response.data.map(job => ({
        ...job,
        applicationCount: job._count?.applications || 0
      }))
      setJobs(jobsWithCount)
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/job-postings/member/stats')
      setStats(response.data)
    } catch (error) {
      console.error('İstatistikler yüklenemedi')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/job-postings/member/${id}`)
      fetchJobs()
      fetchStats()
    } catch (error) {
      alert(error.response?.data?.error || 'İlan silinemedi')
    }
  }

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED'

    try {
      await api.patch(`/job-postings/member/${job.id}/toggle-status`, { status: newStatus })
      fetchJobs()
      fetchStats()
    } catch (error) {
      alert('Durum değiştirilemedi')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">İş İlanlarım</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Yayınladığınız iş ilanlarını yönetin</p>
          </div>
          <Link to="/uye/ilan-ekle" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Yeni İlan Ekle
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam İlan</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total || 0}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-800 dark:text-green-300">Aktif İlan</div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-200 mt-2">{stats.active || 0}</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-yellow-800 dark:text-yellow-300">Onay Bekliyor</div>
            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-200 mt-2">{stats.pending || 0}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-purple-800 dark:text-purple-300">Toplam Başvuru</div>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-200 mt-2">{stats.totalApplications || 0}</div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 dark:text-blue-400 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">Önemli Bilgi</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                Yeni eklediğiniz ilanlar admin onayından sonra yayınlanacaktır.
                Onaylanan ilanları dilediğiniz zaman duraklatabilir veya kapatabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Henüz İlan Yok
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                İlk iş ilanınızı oluşturun ve adaylara ulaşmaya başlayın
              </p>
              <Link to="/uye/ilan-ekle" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                İlk İlanı Oluştur
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Pozisyon</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Durum</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Başvuru</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Yayın Tarihi</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {jobTypeLabels[job.jobType]} • {job.city}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                          {statusLabels[job.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/uye/basvurular?jobId=${job.id}`}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{job.applicationCount || 0}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(job.publishedAt || job.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {job.status === 'ACTIVE' && (
                            <button
                              onClick={() => toggleStatus(job)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Duraklat"
                            >
                              <Pause className="w-5 h-5" />
                            </button>
                          )}
                          {job.status === 'PAUSED' && (
                            <button
                              onClick={() => toggleStatus(job)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Yayınla"
                            >
                              <Play className="w-5 h-5" />
                            </button>
                          )}
                          <Link
                            to={`/uye/ilan-duzenle/${job.id}`}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <a
                            href={`/kariyer/${job.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
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
        </div>
      </div>
    </div>
  )
}
