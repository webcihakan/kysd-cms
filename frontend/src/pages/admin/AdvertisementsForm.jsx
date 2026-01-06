import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save, Upload, Building2, CreditCard, User, Phone, Mail } from 'lucide-react'
import api from '../../utils/api'

const paymentStatusOptions = [
  { value: 'PENDING', label: 'Ödeme Bekleniyor' },
  { value: 'PAID', label: 'Ödendi' },
  { value: 'PARTIAL', label: 'Kısmi Ödeme' },
  { value: 'CANCELLED', label: 'İptal' }
]

const paymentMethods = [
  { value: 'Havale', label: 'Havale/EFT' },
  { value: 'Nakit', label: 'Nakit' },
  { value: 'Kredi Kartı', label: 'Kredi Kartı' },
  { value: 'Çek', label: 'Çek' }
]

export default function AdvertisementsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEdit = !!id

  const [positions, setPositions] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    position: searchParams.get('position') || '',
    imageDesktop: '',
    imageMobile: '',
    link: '',
    startDate: '',
    endDate: '',
    isActive: true,
    // Reklam veren bilgileri
    advertiser: '',
    advertiserContact: '',
    advertiserPhone: '',
    advertiserEmail: '',
    // Ödeme bilgileri
    price: '',
    paymentStatus: 'PENDING',
    paidAmount: '',
    paidDate: '',
    paymentMethod: '',
    invoiceNo: '',
    paymentNotes: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPositions()
    if (isEdit) fetchAd()
  }, [id])

  const fetchPositions = async () => {
    try {
      const response = await api.get('/ad-positions')
      setPositions(response.data)
    } catch (error) {
      console.error('Pozisyonlar yüklenemedi:', error)
    }
  }

  const fetchAd = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/advertisements/${id}`)
      const data = response.data
      setFormData({
        ...data,
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
        paidDate: data.paidDate ? data.paidDate.split('T')[0] : '',
        price: data.price || '',
        paidAmount: data.paidAmount || ''
      })
    } catch (error) {
      alert('Reklam yüklenemedi')
      navigate('/admin/reklamlar')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    const form = new FormData()
    form.append('file', file)

    try {
      const response = await api.post('/upload/single?folder=ads', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFormData({ ...formData, [field]: response.data.url })
    } catch (error) {
      alert('Görsel yüklenemedi')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const submitData = {
        ...formData,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        paidDate: formData.paidDate || null,
        price: formData.price ? parseFloat(formData.price) : null,
        paidAmount: formData.paidAmount ? parseFloat(formData.paidAmount) : null
      }

      if (isEdit) {
        await api.put(`/advertisements/${id}`, submitData)
      } else {
        await api.post('/advertisements', submitData)
      }
      navigate('/admin/reklamlar')
    } catch (error) {
      alert('Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  const selectedPosition = positions.find(p => p.code === formData.position)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/reklamlar')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? 'Reklam Düzenle' : 'Yeni Reklam'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Temel Bilgiler */}
            <div className="card p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Reklam Bilgileri</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reklam Adı *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Reklam adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pozisyon *</label>
                  <select name="position" value={formData.position} onChange={handleChange} required className="input">
                    <option value="">Pozisyon seçin</option>
                    {positions.map((pos) => (
                      <option key={pos.code} value={pos.code}>
                        {pos.name} ({pos.width}x{pos.height})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedPosition && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Boyut:</strong> {selectedPosition.width} x {selectedPosition.height} piksel
                    {selectedPosition.priceMonthly && (
                      <span className="ml-4"><strong>Aylık Fiyat:</strong> {formatCurrency(selectedPosition.priceMonthly)}</span>
                    )}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitiş Tarihi</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Görseller */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Görseller</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Desktop Görsel</label>
                  {formData.imageDesktop ? (
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${formData.imageDesktop}`}
                        alt=""
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageDesktop: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yükle</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageDesktop')} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobil Görsel</label>
                  {formData.imageMobile ? (
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${formData.imageMobile}`}
                        alt=""
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageMobile: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yükle</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageMobile')} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Reklam Veren Bilgileri */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Reklam Veren Bilgileri
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Firma Adı
                  </label>
                  <input
                    type="text"
                    name="advertiser"
                    value={formData.advertiser || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="Reklam veren firma adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    İletişim Kişisi
                  </label>
                  <input
                    type="text"
                    name="advertiserContact"
                    value={formData.advertiserContact || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="Yetkili kişi adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="advertiserPhone"
                    value={formData.advertiserPhone || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="0212 xxx xx xx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="advertiserEmail"
                    value={formData.advertiserEmail || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="email@firma.com"
                  />
                </div>
              </div>
            </div>

            {/* Ödeme Bilgileri */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Ödeme Bilgileri
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reklam Ücreti (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ödeme Durumu</label>
                  <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="input">
                    {paymentStatusOptions.map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ödenen Tutar (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ödeme Tarihi</label>
                  <input
                    type="date"
                    name="paidDate"
                    value={formData.paidDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ödeme Yöntemi</label>
                  <select name="paymentMethod" value={formData.paymentMethod || ''} onChange={handleChange} className="input">
                    <option value="">Seçiniz</option>
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fatura No</label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="FTR-2024-001"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ödeme Notları</label>
                <textarea
                  name="paymentNotes"
                  value={formData.paymentNotes || ''}
                  onChange={handleChange}
                  rows={3}
                  className="input"
                  placeholder="Ödeme ile ilgili notlar..."
                />
              </div>
            </div>
          </div>

          {/* Sağ Sidebar */}
          <div>
            <div className="card p-6 space-y-4 sticky top-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {formData.paymentStatus !== 'PAID' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    ⚠️ Ödeme yapılmadığı için bu reklam sitede görünmeyecektir.
                  </p>
                </div>
              )}

              {formData.paymentStatus === 'PAID' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    ✓ Ödeme tamamlandı. Reklam sitede görünür durumda.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
