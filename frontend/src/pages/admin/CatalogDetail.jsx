import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Eye, Download, FileText, Calendar } from 'lucide-react'
import api from '../../utils/api'

export default function CatalogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchCatalog()
  }, [id])

  const fetchCatalog = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/catalogs/admin/${id}/detail`)
      setCatalog(response.data)

      // Varsayılan tarihleri ayarla
      if (!startDate) {
        setStartDate(new Date().toISOString().split('T')[0])
      }
      if (!endDate && response.data.package) {
        const end = new Date()
        end.setMonth(end.getMonth() + response.data.package.duration)
        setEndDate(end.toISOString().split('T')[0])
      }
    } catch (error) {
      console.error('Katalog yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      setProcessing(true)
      await api.put(`/catalogs/admin/${id}/approve`, {
        startDate,
        endDate,
        adminNotes
      })
      alert('Katalog onaylandı!')
      navigate('/admin/kataloglar')
    } catch (error) {
      alert('Onaylama başarısız: ' + (error.response?.data?.error || error.message))
    } finally {
      setProcessing(false)
      setShowApproveModal(false)
    }
  }

  const handleReject = async () => {
    try {
      setProcessing(true)
      await api.put(`/catalogs/admin/${id}/reject`, { adminNotes })
      alert('Katalog reddedildi')
      navigate('/admin/kataloglar')
    } catch (error) {
      alert('Reddetme başarısız: ' + (error.response?.data?.error || error.message))
    } finally {
      setProcessing(false)
      setShowRejectModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!catalog) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Katalog Bulunamadı</h3>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/kataloglar')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Katalog Detayı</h1>
          <p className="text-gray-600 text-sm mt-1">{catalog.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol - Bilgiler */}
        <div className="lg:col-span-1 space-y-6">
          {/* Katalog Bilgileri */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Katalog Bilgileri</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Başlık:</span>
                <div className="font-medium text-gray-900">{catalog.title}</div>
              </div>
              <div>
                <span className="text-gray-500">Kategori:</span>
                <div className="font-medium text-gray-900">{catalog.category}</div>
              </div>
              <div>
                <span className="text-gray-500">Sayfa Sayısı:</span>
                <div className="font-medium text-gray-900">{catalog.pageCount || '-'}</div>
              </div>
              <div>
                <span className="text-gray-500">Dosya Boyutu:</span>
                <div className="font-medium text-gray-900">{catalog.fileSize || '-'}</div>
              </div>
            </div>
          </div>

          {/* Firma Bilgileri */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Firma Bilgileri</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Firma:</span>
                <div className="font-medium text-gray-900">{catalog.companyName}</div>
              </div>
              {catalog.contactPerson && (
                <div>
                  <span className="text-gray-500">Yetkili:</span>
                  <div className="font-medium text-gray-900">{catalog.contactPerson}</div>
                </div>
              )}
              {catalog.phone && (
                <div>
                  <span className="text-gray-500">Telefon:</span>
                  <div className="font-medium text-gray-900">{catalog.phone}</div>
                </div>
              )}
              {catalog.email && (
                <div>
                  <span className="text-gray-500">E-posta:</span>
                  <div className="font-medium text-gray-900">{catalog.email}</div>
                </div>
              )}
            </div>
          </div>

          {/* Paket Bilgileri */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Paket Bilgileri</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Paket:</span>
                <div className="font-medium text-gray-900">{catalog.package?.name}</div>
              </div>
              <div>
                <span className="text-gray-500">Süre:</span>
                <div className="font-medium text-gray-900">{catalog.package?.duration} ay</div>
              </div>
              <div>
                <span className="text-gray-500">Fiyat:</span>
                <div className="font-semibold text-primary-600 text-lg">{catalog.price} TL</div>
              </div>
            </div>
          </div>

          {/* Ödeme Bilgileri */}
          {catalog.payment && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Ödeme Bilgileri</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Durum:</span>
                  <div className="font-medium text-gray-900">{catalog.payment.status}</div>
                </div>
                {catalog.payment.bankName && (
                  <div>
                    <span className="text-gray-500">Banka:</span>
                    <div className="font-medium text-gray-900">{catalog.payment.bankName}</div>
                  </div>
                )}
                {catalog.payment.senderName && (
                  <div>
                    <span className="text-gray-500">Gönderen:</span>
                    <div className="font-medium text-gray-900">{catalog.payment.senderName}</div>
                  </div>
                )}
                {catalog.payment.referenceNo && (
                  <div>
                    <span className="text-gray-500">Referans:</span>
                    <div className="font-medium text-gray-900">{catalog.payment.referenceNo}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sağ - PDF ve İşlemler */}
        <div className="lg:col-span-2 space-y-6">
          {/* İşlem Butonları */}
          {catalog.status === 'PAID' && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Katalog İşlemleri</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Onayla
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reddet
                </button>
              </div>
            </div>
          )}

          {/* PDF Önizleme */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-800 mb-4">PDF Önizleme</h2>
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={`${catalog.pdfFile}#toolbar=0`}
                className="w-full h-full"
                title={catalog.title}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Onaylama Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Katalogu Onayla</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notlar (Opsiyonel)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                  className="input"
                  placeholder="Admin notları..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                İptal
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {processing ? 'İşleniyor...' : 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reddetme Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Katalogu Reddet</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ret Sebebi *
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows="4"
                className="input"
                placeholder="Katalog neden reddediliyor?"
                required
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                İptal
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !adminNotes.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {processing ? 'İşleniyor...' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
