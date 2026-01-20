import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, MapPin, Clock, Search,
  ChevronRight, Building2, Calendar, Users
} from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const jobTypeLabels = {
  FULL_TIME: 'Tam Zamanlı',
  PART_TIME: 'Yarı Zamanlı',
  REMOTE: 'Uzaktan',
  HYBRID: 'Hibrit',
  INTERNSHIP: 'Staj',
  CONTRACT: 'Sözleşmeli'
}

const experienceLevelLabels = {
  ENTRY: 'Giriş Seviyesi',
  JUNIOR: 'Junior',
  MID: 'Orta Seviye',
  SENIOR: 'Kıdemli',
  LEAD: 'Lider',
  EXECUTIVE: 'Yönetici'
}

export default function Careers() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0 })
  const [filters, setFilters] = useState({ cities: [], jobTypes: [], experienceLevels: [] })

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchJobs()
    fetchFilters()
    fetchStats()
  }, [page, selectedCity, selectedJobType])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })

      if (selectedCity) params.append('city', selectedCity)
      if (selectedJobType) params.append('jobType', selectedJobType)
      if (searchTerm) params.append('search', searchTerm)

      const response = await api.get(`/job-postings?${params}`)
      setJobs(response.data.jobs)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const response = await api.get('/job-postings/filters')
      setFilters(response.data)
    } catch (error) {
      console.error('Filtreler yüklenemedi')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/job-postings/stats/public')
      setStats(response.data)
    } catch (error) {
      console.error('İstatistikler yüklenemedi')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchJobs()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Kariyer</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Briefcase className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">KYSD Kariyer Platformu</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kariyerinize Yön Verin
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl mb-8">
              Konfeksiyon yan sanayi sektöründe <strong>{stats.total}</strong> aktif iş ilanı
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pozisyon, firma veya beceri ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 py-3 outline-none text-gray-900"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                İş Ara
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-6">Filtrele</h3>

              <div className="space-y-6">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value)
                      setPage(1)
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Tüm Şehirler</option>
                    {filters.cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çalışma Şekli
                  </label>
                  <select
                    value={selectedJobType}
                    onChange={(e) => {
                      setSelectedJobType(e.target.value)
                      setPage(1)
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Tüm Tipler</option>
                    {filters.jobTypes.map(type => (
                      <option key={type} value={type}>{jobTypeLabels[type]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Aktif İlan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">İlan Bulunamadı</h3>
                <p className="text-gray-500">Arama kriterlerinize uygun ilan bulunmuyor.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/kariyer/${job.slug}`}
                      className="block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                {job.title}
                              </h3>
                              <p className="text-gray-600">{job.companyName}</p>
                            </div>
                            {job.showSalary && job.salaryMin && (
                              <div className="text-right flex-shrink-0">
                                <div className="text-lg font-bold text-green-600">
                                  {job.salaryMin.toLocaleString('tr-TR')} - {job.salaryMax?.toLocaleString('tr-TR')} TL
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Job Meta */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {jobTypeLabels[job.jobType]}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.applicationCount} Başvuru
                            </span>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {formatDate(job.publishedAt || job.createdAt)}
                            </span>
                            <span className="text-primary-600 font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                              Detayları Gör
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-semibold ${
                          page === i + 1
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
