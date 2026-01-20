import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Users,
  CreditCard,
  Building2,
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

export default function MemberDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    jobPostings: { total: 0, active: 0, pending: 0 },
    applications: { total: 0, pending: 0 },
    dues: { total: 0, paid: 0, unpaid: 0, overdue: 0 }
  })
  const [recentDues, setRecentDues] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [companyInfo, setCompanyInfo] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Paralel olarak tüm verileri çek
      const [
        jobStatsRes,
        appStatsRes,
        duesStatsRes,
        recentDuesRes,
        recentAppsRes,
        companyRes
      ] = await Promise.all([
        api.get('/job-postings/member/stats').catch(() => ({ data: { total: 0, active: 0, pending: 0 } })),
        api.get('/job-applications/member/stats/summary').catch(() => ({ data: { total: 0, pending: 0 } })),
        api.get('/member-dues/member/stats').catch(() => ({ data: { total: 0, paid: 0, unpaid: 0, overdue: 0 } })),
        api.get('/member-dues/member/recent?limit=5').catch(() => ({ data: [] })),
        api.get('/job-applications/member/applications?limit=5').catch(() => ({ data: { applications: [] } })),
        api.get('/auth/me').catch(() => ({ data: null }))
      ])

      setStats({
        jobPostings: jobStatsRes.data,
        applications: appStatsRes.data,
        dues: duesStatsRes.data
      })

      setRecentDues(recentDuesRes.data)
      setRecentApplications(recentAppsRes.data.applications || recentAppsRes.data)
      setCompanyInfo(companyRes.data?.companyProfile || null)
    } catch (error) {
      console.error('Dashboard verileri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDueStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getDueStatusLabel = (status) => {
    switch (status) {
      case 'PAID':
        return 'Ödendi'
      case 'PENDING':
        return 'Beklemede'
      case 'OVERDUE':
        return 'Gecikmiş'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Üye Paneli</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hoş geldiniz, {companyInfo?.companyName || 'Değerli Üyemiz'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* İş İlanları */}
          <Link
            to="/uye/ilanlarim"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">İş İlanları</h3>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.jobPostings.total}</p>
              <span className="text-sm text-green-600 dark:text-green-400 mb-1">
                {stats.jobPostings.active} Aktif
              </span>
            </div>
            {stats.jobPostings.pending > 0 && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                {stats.jobPostings.pending} ilan onay bekliyor
              </p>
            )}
          </Link>

          {/* Başvurular */}
          <Link
            to="/uye/basvurular"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam Başvuru</h3>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.applications.total}</p>
              {stats.applications.pending > 0 && (
                <span className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">
                  {stats.applications.pending} Yeni
                </span>
              )}
            </div>
          </Link>

          {/* Aidatlar */}
          <Link
            to="/uye/aidatlar"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              {stats.dues.overdue > 0 && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Aidat Durumu</h3>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.dues.paid}</p>
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                / {stats.dues.total} Ödendi
              </span>
            </div>
            {stats.dues.overdue > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                {stats.dues.overdue} gecikmiş ödeme
              </p>
            )}
          </Link>

          {/* Firma Bilgileri */}
          <Link
            to="/uye/profil"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Building2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Firma Profili</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {companyInfo?.companyName || 'Firma Adı'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Bilgileri Düzenle
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Son Aidatlar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Son Aidatlar
                </h2>
                <Link to="/uye/aidatlar" className="text-sm text-primary-600 hover:text-primary-700">
                  Tümünü Gör
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentDues.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Henüz aidat kaydı bulunmuyor
                </p>
              ) : (
                <div className="space-y-4">
                  {recentDues.map((due) => (
                    <div
                      key={due.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {due.year} Yılı {due.month ? `- ${due.month}. Ay` : ''}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Son Ödeme: {formatDate(due.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {parseFloat(due.amount).toLocaleString('tr-TR')} TL
                        </p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getDueStatusColor(due.status)}`}>
                          {getDueStatusLabel(due.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Son Başvurular */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Son Başvurular
                </h2>
                <Link to="/uye/basvurular" className="text-sm text-primary-600 hover:text-primary-700">
                  Tümünü Gör
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentApplications.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Henüz başvuru bulunmuyor
                </p>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {app.firstName} {app.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {app.jobPosting?.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                          {app.experienceYears}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link
            to="/uye/ilan-ekle"
            className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <Briefcase className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Yeni İlan Ekle</h3>
            <p className="text-sm text-blue-100">İş ilanı yayınlayın</p>
          </Link>

          <Link
            to="/uye/profil"
            className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg text-white hover:from-purple-600 hover:to-purple-700 transition-all"
          >
            <Building2 className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Profili Düzenle</h3>
            <p className="text-sm text-purple-100">Firma bilgilerini güncelle</p>
          </Link>

          <Link
            to="/uye/kataloglarim"
            className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg text-white hover:from-green-600 hover:to-green-700 transition-all"
          >
            <FileText className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Kataloglarım</h3>
            <p className="text-sm text-green-100">Katalog yönetimi</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
