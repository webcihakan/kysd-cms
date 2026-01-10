import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Megaphone, Eye, CheckCircle, XCircle, Clock, AlertCircle, DollarSign } from 'lucide-react'
import api from '../../utils/api'

const paymentStatusConfig = {
  PENDING: { label: 'Ödeme Bekleniyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PAID: { label: 'Ödendi', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  PARTIAL: { label: 'Kısmi Ödeme', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-800', icon: XCircle }
}

const statusConfig = {
  PENDING: { label: 'Onay Bekleniyor', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800' }
}

export default function AdPayments() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAd, setSelectedAd] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    paymentStatus: 'PAID',
    paidAmount: '',
    paidDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'havale',
    invoiceNo: '',
    paymentNotes: ''
  })

  useEffect(() => {
    fetchAds()
  }, [activeTab])

  const fetchAds = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (activeTab !== 'all') {
        params.append('paymentStatus', activeTab)
      }
      const response = await api.get(`/advertisements?${params}`)
      setAds(response.data)
    } catch (error) {
      console.error('Reklamlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAds = ads.filter(ad =>
    ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.advertiser?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openPaymentModal = (ad) => {
    setSelectedAd(ad)
    setPaymentData({
      paymentStatus: ad.paymentStatus || 'PAID',
      paidAmount: ad.paidAmount || ad.price || '',
      paidDate: ad.paidDate ? new Date(ad.paidDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      paymentMethod: ad.paymentMethod || 'havale',
      invoiceNo: ad.invoiceNo || '',
      paymentNotes: ad.paymentNotes || ''
    })
    setShowPaymentModal(true)
  }

  const handlePaymentUpdate = async () => {
    try {
      await api.put(`/advertisements/${selectedAd.id}/payment`, paymentData)
      alert('Ödeme bilgileri güncellendi')
      setShowPaymentModal(false)
      fetchAds()
    } catch (error) {
      alert('Güncelleme başarısız: ' + (error.response?.data?.error || error.message))
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('tr-TR')
  }

  const formatCurrency = (amount) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
  }

  const pendingCount = ads.filter(a => a.paymentStatus === 'PENDING').length
  const paidCount = ads.filter(a => a.paymentStatus === 'PAID').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reklam Ödemeleri</h1>
          <p className="text-gray-600 text-sm mt-1">Reklam satış ve ödeme takibi</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-gray-500 text-sm mb-1">Toplam</div>
          <div className="text-2xl font-bold text-gray-900">{ads.length}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-yellow-700 text-sm mb-1">Ödeme Bekleniyor</div>
          <div className="text-2xl font-bold text-yellow-900">{pendingCount}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-700 text-sm mb-1">Ödendi</div>
          <div className="text-2xl font-bold text-green-900">{paidCount}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-700 text-sm mb-1">Kısmi Ödeme</div>
          <div className="text-2xl font-bold text-blue-900">
            {ads.filter(a => a.paymentStatus === 'PARTIAL').length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-700 text-sm mb-1">İptal</div>
          <div className="text-2xl font-bold text-red-900">
            {ads.filter(a => a.paymentStatus === 'CANCELLED').length}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-4 px-6 overflow-x-auto">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'PENDING', label: `Ödeme Bekleniyor ${pendingCount > 0 ? `(${pendingCount})` : ''}` },
              { key: 'PAID', label: 'Ödenmiş' },
              { key: 'PARTIAL', label: 'Kısmi Ödeme' },
              { key: 'CANCELLED', label: 'İptal' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-primary-600 text-primary-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Reklam veya firma adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reklam Bulunamadı</h3>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Reklam
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Firma
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Pozisyon
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Tarih
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Fiyat
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Ödeme Durumu
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAds.map((ad) => {
                const PaymentIcon = paymentStatusConfig[ad.paymentStatus]?.icon || Clock
                return (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Megaphone className="w-8 h-8 text-primary-500" />
                        <div>
                          <div className="font-semibold text-gray-900">{ad.name}</div>
                          <div className="text-sm text-gray-500">{ad.duration} Ay</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{ad.advertiser || '-'}</div>
                        <div className="text-gray-500">{ad.advertiserEmail || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {ad.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>{formatDate(ad.startDate)}</div>
                      {ad.endDate && (
                        <div className="text-gray-500 text-xs">{formatDate(ad.endDate)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{formatCurrency(ad.price)}</div>
                      {ad.paidAmount && ad.paymentStatus === 'PARTIAL' && (
                        <div className="text-xs text-gray-500">
                          Ödenen: {formatCurrency(ad.paidAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${paymentStatusConfig[ad.paymentStatus]?.color}`}>
                        <PaymentIcon className="w-3 h-3" />
                        {paymentStatusConfig[ad.paymentStatus]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openPaymentModal(ad)}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        <DollarSign className="w-4 h-4" />
                        Ödeme
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ödeme Bilgileri</h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">{selectedAd.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                {selectedAd.advertiser} - {formatCurrency(selectedAd.price)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Durumu *
                  </label>
                  <select
                    value={paymentData.paymentStatus}
                    onChange={(e) => setPaymentData({...paymentData, paymentStatus: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="PENDING">Ödeme Bekleniyor</option>
                    <option value="PAID">Ödendi</option>
                    <option value="PARTIAL">Kısmi Ödeme</option>
                    <option value="CANCELLED">İptal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Yöntemi
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="havale">Havale/EFT</option>
                    <option value="nakit">Nakit</option>
                    <option value="kredi_karti">Kredi Kartı</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödenen Tutar (TL)
                  </label>
                  <input
                    type="number"
                    value={paymentData.paidAmount}
                    onChange={(e) => setPaymentData({...paymentData, paidAmount: e.target.value})}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Tarihi
                  </label>
                  <input
                    type="date"
                    value={paymentData.paidDate}
                    onChange={(e) => setPaymentData({...paymentData, paidDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fatura/Dekont No
                </label>
                <input
                  type="text"
                  value={paymentData.invoiceNo}
                  onChange={(e) => setPaymentData({...paymentData, invoiceNo: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="INV-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Notları
                </label>
                <textarea
                  value={paymentData.paymentNotes}
                  onChange={(e) => setPaymentData({...paymentData, paymentNotes: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ek bilgiler..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handlePaymentUpdate}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold"
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
