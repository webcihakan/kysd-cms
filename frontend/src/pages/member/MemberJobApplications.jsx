import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, Eye, X, Calendar, Mail, Phone, MapPin, GraduationCap, Briefcase, FileText, Link as LinkIcon } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const statusLabels = {
  PENDING: 'Beklemede',
  REVIEWED: 'İncelendi',
  SHORTLISTED: 'Ön Seçim',
  INTERVIEW: 'Mülakat',
  OFFER: 'Teklif',
  HIRED: 'İşe Alındı',
  REJECTED: 'Reddedildi'
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  REVIEWED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  SHORTLISTED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  INTERVIEW: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
  OFFER: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  HIRED: 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
}

export default function MemberJobApplications() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [applications, setApplications] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, interview: 0 })
  const [selectedApp, setSelectedApp] = useState(null)
  const [selectedJob, setSelectedJob] = useState(searchParams.get('jobId') || '')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMyJobs()
    fetchStats()
  }, [])

  useEffect(() => {
    if (selectedJob) {
      fetchApplications()
    }
  }, [selectedJob, statusFilter])

  const fetchMyJobs = async () => {
    try {
      const response = await api.get('/job-postings/member/my-jobs')
      setMyJobs(response.data)

      // If jobId in URL params, set it
      const jobId = searchParams.get('jobId')
      if (jobId && response.data.some(job => job.id === parseInt(jobId))) {
        setSelectedJob(jobId)
      } else if (response.data.length > 0 && !selectedJob) {
        setSelectedJob(response.data[0].id.toString())
      }
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error)
    }
  }

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedJob) params.append('jobId', selectedJob)
      if (statusFilter) params.append('status', statusFilter)

      const response = await api.get(`/job-applications/member/applications?${params}`)
      setApplications(response.data.applications || response.data)
    } catch (error) {
      console.error('Başvurular yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/job-applications/member/stats/summary')
      setStats(response.data)
    } catch (error) {
      console.error('İstatistikler yüklenemedi')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/job-applications/member/${id}/status`, { status: newStatus })
      fetchApplications()
      fetchStats()
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus })
      }
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  const handleJobChange = (jobId) => {
    setSelectedJob(jobId)
    setSearchParams(jobId ? { jobId } : {})
  }

  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      app.firstName.toLowerCase().includes(search) ||
      app.lastName.toLowerCase().includes(search) ||
      app.email.toLowerCase().includes(search) ||
      app.phone.toLowerCase().includes(search)
    )
  })

  const downloadCV = (cvFile, applicantName) => {
    window.open(`${import.meta.env.VITE_API_URL}${cvFile}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">İş Başvuruları</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">İlanlarınıza gelen başvuruları yönetin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Başvuru</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total || 0}</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-yellow-800 dark:text-yellow-300">Beklemede</div>
            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-200 mt-2">{stats.pending || 0}</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-800 dark:text-blue-300">İncelendi</div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-200 mt-2">{stats.reviewed || 0}</div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
            <div className="text-sm text-indigo-800 dark:text-indigo-300">Mülakat</div>
            <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-200 mt-2">{stats.interview || 0}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İlan Seçin
              </label>
              <select
                value={selectedJob}
                onChange={(e) => handleJobChange(e.target.value)}
                className="input"
              >
                <option value="">Tüm İlanlar</option>
                {myJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.applicationCount || 0} başvuru)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durum Filtresi
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">Tüm Durumlar</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Arama
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ad, email, telefon..."
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Başvuru Bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedJob ? 'Bu ilana henüz başvuru yapılmamış' : 'Henüz başvuru bulunmuyor'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Aday</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">İlan</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Durum</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Başvuru Tarihi</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {app.firstName} {app.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{app.email}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{app.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{app.jobPosting?.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                          {statusLabels[app.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(app.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Detayları Gör"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {app.cvFile && (
                            <button
                              onClick={() => downloadCV(app.cvFile, `${app.firstName} ${app.lastName}`)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="CV İndir"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          )}
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

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedApp.firstName} {selectedApp.lastName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApp.jobPosting?.title}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başvuru Durumu
                </label>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                  className="input"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">İletişim Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{selectedApp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Telefon</p>
                      <p className="text-gray-900 dark:text-white">{selectedApp.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Konum</p>
                      <p className="text-gray-900 dark:text-white">
                        {selectedApp.city}{selectedApp.district && `, ${selectedApp.district}`}
                      </p>
                    </div>
                  </div>
                  {selectedApp.birthDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Doğum Tarihi</p>
                        <p className="text-gray-900 dark:text-white">{formatDate(selectedApp.birthDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Eğitim Bilgileri
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Seviye:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedApp.educationLevel}</span>
                  </div>
                  {selectedApp.university && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Üniversite:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedApp.university}</span>
                    </div>
                  )}
                  {selectedApp.department && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Bölüm:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedApp.department}</span>
                    </div>
                  )}
                  {selectedApp.graduationYear && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Mezuniyet:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedApp.graduationYear}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  İş Deneyimi
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Deneyim Süresi:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedApp.experienceYears}</span>
                  </div>
                  {selectedApp.currentCompany && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Mevcut Şirket:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedApp.currentCompany}</span>
                    </div>
                  )}
                  {selectedApp.currentPosition && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Mevcut Pozisyon:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedApp.currentPosition}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {selectedApp.skills && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Beceriler</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedApp.skills}</p>
                </div>
              )}

              {/* Languages */}
              {selectedApp.languages && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Yabancı Diller</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedApp.languages}</p>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Ön Yazı
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* Links */}
              {(selectedApp.linkedinUrl || selectedApp.portfolioUrl) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Bağlantılar
                  </h3>
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
                    {selectedApp.portfolioUrl && (
                      <a
                        href={selectedApp.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* CV Download */}
              {selectedApp.cvFile && (
                <div>
                  <button
                    onClick={() => downloadCV(selectedApp.cvFile, `${selectedApp.firstName} ${selectedApp.lastName}`)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    CV İndir
                  </button>
                </div>
              )}

              {/* Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Ek Bilgiler</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                  {selectedApp.expectedSalary && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Beklenen Maaş:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {parseFloat(selectedApp.expectedSalary).toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  )}
                  {selectedApp.availableDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">İşe Başlama:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{formatDate(selectedApp.availableDate)}</span>
                    </div>
                  )}
                  {selectedApp.militaryStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Askerlik:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedApp.militaryStatus}</span>
                    </div>
                  )}
                  {selectedApp.drivingLicense && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ehliyet:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedApp.drivingLicense}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Şehir Değişikliği:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedApp.canRelocate ? 'Evet' : 'Hayır'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
