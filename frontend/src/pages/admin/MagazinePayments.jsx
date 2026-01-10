import { useState, useEffect } from 'react'
import { Search, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, XCircle, Filter, Calendar, BookOpen, FileText, User } from 'lucide-react'
import api from '../../utils/api'

const paymentStatusConfig = {
  FREE: { label: 'Ücretsiz', color: 'bg-gray-100 text-gray-800', icon: BookOpen },
  PENDING: { label: 'Ödeme Bekleniyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PAID: { label: 'Ödendi', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  PARTIAL: { label: 'Kısmi Ödeme', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-800', icon: XCircle }
}

const categoryLabels = {
  general: 'Genel',
  industry: 'Endüstriyel',
  technology: 'Teknoloji',
  economy: 'Ekonomi'
}

export default function MagazinePayments() {
  const [magazines, setMagazines] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedMagazine, setSelectedMagazine] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    free: 0,
    totalRevenue: 0,
    pendingRevenue: 0
  })

  const [paymentData, setPaymentData] = useState({
    paymentStatus: 'PAID',
    isPaid: true,
    paidAmount: '',
    paidDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Havale',
    invoiceNo: '',
    paymentNotes: ''
  })

  useEffect(() => {
    fetchMagazines()
  }, [])

  const fetchMagazines = async () => {
    try {
      setLoading(true)
      const response = await api.get('/magazines/admin/all')
      setMagazines(response.data)
      calculateStats(response.data)
    } catch (error) {
      console.error('Dergiler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (mags) => {
    const total = mags.length
    const paid = mags.filter(m => m.paymentStatus === 'PAID').length
    const pending = mags.filter(m => m.paymentStatus === 'PENDING').length
    const free = mags.filter(m => m.paymentStatus === 'FREE').length

    const totalRevenue = mags
      .filter(m => m.paymentStatus === 'PAID')
      .reduce((sum, m) => sum + parseFloat(m.paidAmount || 0), 0)

    const pendingRevenue = mags
      .filter(m => m.paymentStatus === 'PENDING')
      .reduce((sum, m) => sum + parseFloat(m.price || 0), 0)

    setStats({
      total,
      paid,
      pending,
      free,
      totalRevenue,
      pendingRevenue
    })
  }

  const filteredMagazines = magazines.filter(mag => {
    const matchesSearch =
      mag.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mag.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mag.issueNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || mag.paymentStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const openPaymentModal = (mag) => {
    setSelectedMagazine(mag)
    setPaymentData({
      paymentStatus: mag.paymentStatus || 'FREE',
      isPaid: mag.isPaid || false,
      paidAmount: mag.paidAmount || mag.price || '',
      paidDate: mag.paidDate ? new Date(mag.paidDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      paymentMethod: mag.paymentMethod || 'Havale',
      invoiceNo: mag.invoiceNo || '',
      paymentNotes: mag.paymentNotes || ''
    })
    setShowPaymentModal(true)
  }

  const handlePaymentUpdate = async () => {
    try {
      await api.put(`/magazines/${selectedMagazine.id}/payment`, paymentData)
      alert('Ödeme bilgileri güncellendi')
      setShowPaymentModal(false)
      fetchMagazines()
    } catch (error) {
      console.error('Ödeme güncellenemedi:', error)
      alert('Hata: ' + (error.response?.data?.error || 'Ödeme güncellenemedi'))
    }
  }

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₺'
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('tr-TR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sektörel Dergi Ödemeleri</h1>
        <p className="text-gray-600">Dergi sponsorluk ve yayın ödemelerinin takibi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Toplam Dergi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">Ücretsiz: {stats.free}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ödeme Bekleyen</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Toplam Gelir</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Beklenen Gelir</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.pendingRevenue)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Dergi veya yayıncı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="ALL">Tüm Dergiler</option>
              <option value="FREE">Ücretsiz</option>
              <option value="PENDING">Ödeme Bekleyenler</option>
              <option value="PAID">Ödenenler</option>
              <option value="PARTIAL">Kısmi Ödemeler</option>
              <option value="CANCELLED">İptal Edilenler</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dergi Bilgileri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yayıncı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödeme Durumu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMagazines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Dergi bulunamadı
                  </td>
                </tr>
              ) : (
                filteredMagazines.map((mag) => {
                  const StatusIcon = paymentStatusConfig[mag.paymentStatus]?.icon || AlertCircle
                  return (
                    <tr key={mag.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{mag.title}</span>
                          <span className="text-xs text-gray-500">Sayı: {mag.issueNumber || '-'}</span>
                          {mag.publishDate && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(mag.publishDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{mag.publisher || '-'}</span>
                          {mag.publisherContact && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <User className="w-3 h-3" />
                              {mag.publisherContact}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {categoryLabels[mag.category] || mag.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          {mag.price ? (
                            <>
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(mag.price)}
                              </span>
                              {mag.paidAmount && (
                                <span className="text-xs text-green-600">
                                  Ödenen: {formatCurrency(mag.paidAmount)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Ücretsiz</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            paymentStatusConfig[mag.paymentStatus]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            <StatusIcon className="w-3 h-3" />
                            {paymentStatusConfig[mag.paymentStatus]?.label || mag.paymentStatus}
                          </span>
                        </div>
                        {mag.paidDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(mag.paidDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openPaymentModal(mag)}
                          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        >
                          Ödeme Güncelle
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedMagazine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Ödeme Bilgilerini Güncelle</h2>
              <p className="text-sm text-gray-600 mt-1">{selectedMagazine.title}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Dergi Bilgileri */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Dergi Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Dergi:</span>
                    <span className="ml-2 font-medium">{selectedMagazine.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sayı:</span>
                    <span className="ml-2 font-medium">{selectedMagazine.issueNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Yayıncı:</span>
                    <span className="ml-2 font-medium">{selectedMagazine.publisher || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tutar:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedMagazine.price)}</span>
                  </div>
                </div>
              </div>

              {/* Ödeme Durumu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Durumu
                </label>
                <select
                  value={paymentData.paymentStatus}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="FREE">Ücretsiz</option>
                  <option value="PENDING">Ödeme Bekleniyor</option>
                  <option value="PAID">Ödendi</option>
                  <option value="PARTIAL">Kısmi Ödeme</option>
                  <option value="CANCELLED">İptal</option>
                </select>
              </div>

              {/* Ücretli mi? */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={paymentData.isPaid}
                  onChange={(e) => setPaymentData({ ...paymentData, isPaid: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isPaid" className="ml-2 text-sm text-gray-700">
                  Ücretli dergi
                </label>
              </div>

              {/* Ödenen Tutar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödenen Tutar (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.paidAmount}
                  onChange={(e) => setPaymentData({ ...paymentData, paidAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Ödeme Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Tarihi
                </label>
                <input
                  type="date"
                  value={paymentData.paidDate}
                  onChange={(e) => setPaymentData({ ...paymentData, paidDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Ödeme Yöntemi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Yöntemi
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Havale">Havale/EFT</option>
                  <option value="Nakit">Nakit</option>
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Çek">Çek</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              {/* Fatura No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fatura Numarası
                </label>
                <input
                  type="text"
                  value={paymentData.invoiceNo}
                  onChange={(e) => setPaymentData({ ...paymentData, invoiceNo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Örn: FAT-2024-001"
                />
              </div>

              {/* Notlar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Notları
                </label>
                <textarea
                  value={paymentData.paymentNotes}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentNotes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ödeme ile ilgili notlar..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handlePaymentUpdate}
                className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
