import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../../utils/api'

export default function CatalogPayment() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [catalog, setCatalog] = useState(null)
  const [formData, setFormData] = useState({
    paymentMethod: 'havale',
    bankName: '',
    senderName: '',
    referenceNo: '',
    receiptUrl: '',
    notes: ''
  })

  useEffect(() => {
    fetchCatalogStatus()
  }, [id])

  const fetchCatalogStatus = async () => {
    try {
      const response = await api.get(`/catalogs/member/${id}/status`)
      setCatalog(response.data)

      // Eğer zaten ödeme yapılmışsa
      if (response.data.payment) {
        setFormData({
          paymentMethod: response.data.payment.paymentMethod || 'havale',
          bankName: response.data.payment.bankName || '',
          senderName: response.data.payment.senderName || '',
          referenceNo: response.data.payment.referenceNo || '',
          receiptUrl: response.data.payment.receiptUrl || '',
          notes: response.data.payment.notes || ''
        })
      }
    } catch (error) {
      console.error('Katalog bilgileri yüklenemedi:', error)
      alert('Katalog bilgileri yüklenemedi')
      navigate('/uye/kataloglarim')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post(`/catalog-payments/${id}`, formData)

      alert('Ödeme bilgileriniz alındı! Admin onayından sonra kataloğunuz yayınlanacak.')
      navigate('/uye/kataloglarim')
    } catch (error) {
      alert('Ödeme kaydedilemedi: ' + (error.response?.data?.error || error.message))
    } finally {
      setSubmitting(false)
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Katalog Bulunamadı</h3>
          <p className="text-red-700 mb-4">İlgili katalog bilgilerine ulaşılamadı.</p>
          <button
            onClick={() => navigate('/uye/kataloglarim')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Kataloglarıma Dön
          </button>
        </div>
      </div>
    )
  }

  // Eğer katalog PENDING değilse ödeme sayfası gösterme
  if (catalog.status !== 'PENDING') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Ödeme Durumu</h3>
          <p className="text-blue-700 mb-4">
            {catalog.status === 'PAID' && 'Ödemeniz alındı, admin onayı bekleniyor.'}
            {catalog.status === 'APPROVED' && 'Kataloğunuz onaylandı ve yayında!'}
            {catalog.status === 'REJECTED' && 'Kataloğunuz reddedildi.'}
            {catalog.status === 'EXPIRED' && 'Kataloğunuzun süresi doldu.'}
          </p>
          <button
            onClick={() => navigate('/uye/kataloglarim')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Kataloglarıma Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/uye/kataloglarim')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ödeme Bilgileri</h1>
          <p className="text-gray-600 mt-1">Katalog başvurunuz için ödeme yapın</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sol - Ödeme Formu */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Havale/EFT Bilgileri</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Banka Hesap Bilgileri</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Banka:</strong> Türkiye İş Bankası</p>
                <p><strong>Şube Adı:</strong> İstanbul Şubesi</p>
                <p><strong>Hesap Adı:</strong> KYSD Dernekleri</p>
                <p><strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00</p>
                <p><strong>Açıklama:</strong> Katalog - {catalog.title}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ödeme Yöntemi
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="havale">Havale</option>
                <option value="eft">EFT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banka Adı *
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ödemeyi yaptığınız banka"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gönderen Adı *
              </label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Havaleyi yapan kişi/firma adı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referans/Dekont No *
              </label>
              <input
                type="text"
                name="referenceNo"
                value={formData.referenceNo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Havale dekont numarası"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dekont/Makbuz Görseli (URL)
              </label>
              <input
                type="url"
                name="receiptUrl"
                value={formData.receiptUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/dekont.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">Ödeme dekontunuzun fotoğrafının URL adresini girin</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notlar
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Varsa ek bilgiler..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Ödeme Bilgilerini Gönder
                </>
              )}
            </button>

            <div className="text-xs text-gray-500 text-center">
              Ödeme bilgileriniz admin tarafından doğrulandıktan sonra kataloğunuz yayınlanacaktır.
            </div>
          </form>
        </div>

        {/* Sağ - Katalog Özeti */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Katalog</div>
                <div className="font-semibold text-gray-900">{catalog.title}</div>
              </div>

              <div className="border-t pt-3">
                <div className="text-gray-500 mb-1">Paket</div>
                <div className="font-medium text-gray-900">{catalog.package?.name}</div>
                <div className="text-xs text-gray-500">{catalog.package?.duration} Ay</div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Tutar</span>
                  <span className="text-2xl font-bold text-primary-600">{catalog.price} TL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Önemli Bilgi
            </h3>
            <ul className="space-y-1 text-xs text-yellow-800">
              <li>• Ödemenizi yaptıktan sonra mutlaka bu formu doldurun</li>
              <li>• Admin onayından sonra kataloğunuz yayınlanacak</li>
              <li>• Onay süreci 1-2 iş günü sürebilir</li>
              <li>• Sorun yaşarsanız bizimle iletişime geçin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
