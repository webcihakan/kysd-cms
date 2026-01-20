import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, ArrowLeft, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const statusLabels = {
  PAID: 'Ödendi',
  PENDING: 'Beklemede',
  OVERDUE: 'Gecikmiş',
  CANCELLED: 'İptal'
}

const statusColors = {
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
}

const statusIcons = {
  PAID: CheckCircle,
  PENDING: Clock,
  OVERDUE: AlertCircle,
  CANCELLED: AlertCircle
}

export default function MemberDues() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dues, setDues] = useState([])
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0, overdue: 0, totalAmount: 0, paidAmount: 0 })
  const [yearFilter, setYearFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [years, setYears] = useState([])

  useEffect(() => {
    fetchDues()
    fetchStats()
  }, [yearFilter, statusFilter])

  const fetchDues = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (yearFilter) params.append('year', yearFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await api.get(`/member-dues/member/my-dues?${params}`)
      setDues(response.data)

      // Yılları çıkar
      const uniqueYears = [...new Set(response.data.map(d => d.year))].sort((a, b) => b - a)
      setYears(uniqueYears)
    } catch (error) {
      console.error('Aidatlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/member-dues/member/stats')
      setStats(response.data)
    } catch (error) {
      console.error('İstatistikler yüklenemedi')
    }
  }

  const downloadReceipt = (dueId) => {
    // Makbuz indirme endpoint'i - backend'de implement edilecek
    window.open(`${import.meta.env.VITE_API_URL}/api/member-dues/member/${dueId}/receipt`, '_blank')
  }

  const StatusIcon = ({ status }) => {
    const Icon = statusIcons[status] || AlertCircle
    return <Icon className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/uye/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <CreditCard className="w-7 h-7" />
              Aidat Takibi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Aidat ödemelerinizi görüntüleyin ve takip edin
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Aidat</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total || 0}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {stats.totalAmount ? `${parseFloat(stats.totalAmount).toLocaleString('tr-TR')} TL` : '-'}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-800 dark:text-green-300">Ödenen</div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-200 mt-2">{stats.paid || 0}</div>
            <div className="text-xs text-green-700 dark:text-green-400 mt-1">
              {stats.paidAmount ? `${parseFloat(stats.paidAmount).toLocaleString('tr-TR')} TL` : '-'}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-yellow-800 dark:text-yellow-300">Bekleyen</div>
            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-200 mt-2">{stats.unpaid || 0}</div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
            <div className="text-sm text-red-800 dark:text-red-300">Gecikmiş</div>
            <div className="text-3xl font-bold text-red-900 dark:text-red-200 mt-2">{stats.overdue || 0}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yıl
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="input"
              >
                <option value="">Tüm Yıllar</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durum
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">Tümü</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dues List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
            </div>
          ) : dues.length === 0 ? (
            <div className="text-center py-12 px-4">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Aidat Kaydı Bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {yearFilter || statusFilter ? 'Filtre kriterlerine uygun aidat bulunamadı' : 'Henüz aidat kaydınız bulunmuyor'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Dönem</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Tutar</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Son Ödeme</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Durum</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Ödeme Tarihi</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {dues.map((due) => (
                    <tr key={due.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {due.year} Yılı
                          </p>
                          {due.month && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {due.month}. Ay
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {parseFloat(due.amount).toLocaleString('tr-TR')} TL
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(due.dueDate)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[due.status]}`}>
                          <StatusIcon status={due.status} />
                          {statusLabels[due.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {due.paymentDate ? formatDate(due.paymentDate) : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {due.status === 'PAID' && (
                            <button
                              onClick={() => downloadReceipt(due.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Makbuz İndir"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          )}
                          {due.notes && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate" title={due.notes}>
                              {due.notes}
                            </div>
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

        {/* Info Box */}
        {stats.overdue > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200">Gecikmiş Ödemeler</h3>
                <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                  {stats.overdue} adet gecikmiş aidat ödemeniz bulunmaktadır. Lütfen en kısa sürede ödeme yapınız.
                  Aidat ödemeleriniz için dernek ile iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
