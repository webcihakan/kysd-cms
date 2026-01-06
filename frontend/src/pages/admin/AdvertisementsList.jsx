import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, MousePointer, Eye, Layout, AlertCircle, CheckCircle2, Image, CreditCard, X, DollarSign, Clock } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const paymentStatusLabels = {
  PENDING: 'Ödeme Bekleniyor',
  PAID: 'Ödendi',
  PARTIAL: 'Kısmi Ödeme',
  CANCELLED: 'İptal'
}

const paymentStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  PARTIAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

export default function AdvertisementsList() {
  const [ads, setAds] = useState([])
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('positions') // 'positions' veya 'ads'
  const [showPayModal, setShowPayModal] = useState(null)
  const [paymentData, setPaymentData] = useState({ paymentMethod: 'Havale', invoiceNo: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [adsRes, positionsRes] = await Promise.all([
        api.get('/advertisements?all=true'),
        api.get('/ad-positions/admin')
      ])
      setAds(adsRes.data)
      setPositions(positionsRes.data)
    } catch (error) {
      console.error('Veriler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu reklamı silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/advertisements/${id}`)
      fetchData()
    } catch (error) {
      alert('Reklam silinemedi')
    }
  }

  const handleMarkAsPaid = async (ad) => {
    try {
      await api.patch(`/advertisements/${ad.id}/pay`, paymentData)
      setShowPayModal(null)
      setPaymentData({ paymentMethod: 'Havale', invoiceNo: '' })
      fetchData()
    } catch (error) {
      alert('Ödeme işlenemedi')
    }
  }

  // Pozisyon için reklam var mı kontrol et
  const getAdForPosition = (positionCode) => {
    return ads.find(ad => ad.positionCode === positionCode && ad.isActive)
  }

  // Görsel önizleme boyutlarını hesapla
  const getPreviewSize = (width, height) => {
    const maxWidth = 120
    const maxHeight = 80
    const scale = Math.min(maxWidth / width, maxHeight / height)
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reklam Yönetimi</h1>
        <div className="flex gap-2">
          <Link to="/admin/reklam-alanlari" className="btn-outline flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Pozisyon Ayarları
          </Link>
          <Link to="/admin/reklamlar/ekle" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Yeni Reklam
          </Link>
        </div>
      </div>

      {/* Özet Bilgi */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{ads.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Reklam</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{ads.filter(a => a.paymentStatus === 'PAID').length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ödendi</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{ads.filter(a => a.paymentStatus === 'PENDING' || !a.paymentStatus).length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ödeme Bekliyor</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(ads.filter(a => a.paymentStatus === 'PAID').reduce((sum, a) => sum + parseFloat(a.paidAmount || 0), 0))}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Gelir</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(ads.filter(a => a.paymentStatus !== 'PAID').reduce((sum, a) => sum + parseFloat(a.price || 0), 0))}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bekleyen Gelir</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('positions')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'positions'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Reklam Alanları ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'ads'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Yüklenen Reklamlar ({ads.length})
        </button>
      </div>

      {/* Reklam Alanları Tab */}
      {activeTab === 'positions' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {positions.map((position) => {
            const ad = getAdForPosition(position.code)
            const preview = getPreviewSize(position.width, position.height)

            return (
              <div
                key={position.id}
                className={`card p-4 border-2 transition-all ${
                  ad
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                }`}
              >
                {/* Başlık ve Durum */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{position.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{position.code}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    ad
                      ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                      : 'bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300'
                  }`}>
                    {ad ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Dolu
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Boş
                      </>
                    )}
                  </div>
                </div>

                {/* Görsel Önizleme */}
                <div className="flex items-center justify-center mb-3">
                  <div
                    className={`flex items-center justify-center rounded border-2 border-dashed ${
                      ad
                        ? 'border-green-300 dark:border-green-600 bg-white dark:bg-gray-800'
                        : 'border-orange-300 dark:border-orange-600 bg-white dark:bg-gray-800'
                    }`}
                    style={{ width: preview.width, height: preview.height }}
                  >
                    {ad ? (
                      <Image className="w-6 h-6 text-green-500" />
                    ) : (
                      <span className="text-[10px] text-gray-400 text-center px-1">
                        {position.width}x{position.height}
                      </span>
                    )}
                  </div>
                </div>

                {/* Boyut ve Fiyat Bilgisi */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="bg-white dark:bg-gray-800 rounded px-2 py-1">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Boyut</span>
                    <p className="font-medium text-gray-800 dark:text-white">{position.width} x {position.height}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded px-2 py-1">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Aylık Fiyat</span>
                    <p className="font-medium text-primary-600 dark:text-primary-400">
                      {position.priceMonthly ? formatCurrency(position.priceMonthly) : '-'}
                    </p>
                  </div>
                </div>

                {/* Açıklama */}
                {position.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {position.description}
                  </p>
                )}

                {/* Aktif Reklam Bilgisi veya Reklam Ekle Butonu */}
                {ad ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      {ad.image && (
                        <img src={ad.image} alt="" className="w-10 h-10 object-cover rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{ad.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {ad.viewCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MousePointer className="w-3 h-3" /> {ad.clickCount || 0}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/admin/reklamlar/${ad.id}`}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/admin/reklamlar/ekle?position=${position.code}`}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Reklam Ekle
                  </Link>
                )}

                {/* Aktif/Pasif Durumu */}
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className={`${position.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    {position.isActive ? 'Alan Aktif' : 'Alan Pasif'}
                  </span>
                  <span className="text-gray-400">Sıra: {position.order}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Yüklenen Reklamlar Tab */}
      {activeTab === 'ads' && (
        <div className="card">
          {ads.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Henüz reklam yüklenmemiş</p>
              <Link
                to="/admin/reklamlar/ekle"
                className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                İlk reklamı ekle
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Reklam</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Reklam Veren</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Ücret</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Ödeme</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Durum</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {ads.map((ad) => {
                    const position = positions.find(p => p.code === ad.position)
                    return (
                      <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {ad.imageDesktop ? (
                              <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${ad.imageDesktop}`} alt="" className="w-20 h-12 object-cover rounded" />
                            ) : (
                              <div className="w-20 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">Yok</div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">{ad.name}</p>
                              <span className="text-xs text-gray-500">{position?.name || ad.position}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{ad.advertiser || '-'}</p>
                            {ad.advertiserPhone && <p className="text-xs text-gray-500">{ad.advertiserPhone}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {ad.price ? formatCurrency(ad.price) : '-'}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${paymentStatusColors[ad.paymentStatus] || paymentStatusColors.PENDING}`}>
                            {paymentStatusLabels[ad.paymentStatus] || 'Bekleniyor'}
                          </span>
                          {ad.paidDate && (
                            <p className="text-xs text-gray-500 mt-1">{formatDate(ad.paidDate)}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ad.isActive
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {ad.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {ad.paymentStatus !== 'PAID' && (
                              <button
                                onClick={() => setShowPayModal(ad)}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Ödendi
                              </button>
                            )}
                            <Link to={`/admin/reklamlar/${ad.id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                              <Edit className="w-4 h-4 text-blue-500" />
                            </Link>
                            <button onClick={() => handleDelete(ad.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Ödeme Modalı */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ödeme Bilgileri
              </h3>
              <button onClick={() => setShowPayModal(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              <strong>{showPayModal.name}</strong>
              {showPayModal.price && ` - ${formatCurrency(showPayModal.price)}`}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ödeme Yöntemi
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Havale">Havale/EFT</option>
                  <option value="Nakit">Nakit</option>
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Çek">Çek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fatura No (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={paymentData.invoiceNo}
                  onChange={(e) => setPaymentData({...paymentData, invoiceNo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="FTR-2024-001"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPayModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                İptal
              </button>
              <button
                onClick={() => handleMarkAsPaid(showPayModal)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ödendi Olarak İşaretle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
