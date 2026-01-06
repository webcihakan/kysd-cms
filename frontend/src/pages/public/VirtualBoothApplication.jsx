import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Monitor, Building2, User, Mail, Phone, Globe, MessageSquare,
  ChevronRight, CheckCircle2, AlertCircle, ArrowRight, Package
} from 'lucide-react'
import api from '../../utils/api'

export default function VirtualBoothApplication() {
  const { fairId } = useParams()
  const [fair, setFair] = useState(null)
  const [boothTypes, setBoothTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fairId: fairId,
    boothTypeId: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    message: ''
  })

  useEffect(() => {
    fetchData()
  }, [fairId])

  const fetchData = async () => {
    try {
      const [fairRes, typesRes] = await Promise.all([
        api.get(`/virtual-fairs/admin/${fairId}`),
        api.get(`/virtual-booth-types/fair/${fairId}`)
      ])
      setFair(fairRes.data)
      setBoothTypes(typesRes.data)

      // İlk stant türünü seç
      if (typesRes.data.length > 0) {
        setFormData(prev => ({ ...prev, boothTypeId: typesRes.data[0].id.toString() }))
      }
    } catch (error) {
      console.error('Veriler yüklenemedi')
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
    setError('')

    try {
      await api.post('/virtual-booth-applications', {
        ...formData,
        fairId: parseInt(fairId),
        boothTypeId: parseInt(formData.boothTypeId)
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Başvuru gönderilemedi')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedBoothType = boothTypes.find(bt => bt.id.toString() === formData.boothTypeId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  if (!fair) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Fuar Bulunamadı</h2>
          <Link to="/sanal-fuarlar" className="text-purple-600 hover:underline">
            Sanal Fuarlara Dön
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Başvurunuz Alındı!</h2>
          <p className="text-gray-600 mb-6">
            Stant başvurunuz başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.
          </p>
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-purple-700">
              <strong>Fuar:</strong> {fair.title}
            </p>
            <p className="text-sm text-purple-700">
              <strong>Seçilen Stant:</strong> {selectedBoothType?.name}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to={`/sanal-fuar/${fair.slug}`}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Fuara Dön
            </Link>
            <Link
              to="/sanal-fuarlar"
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tüm Fuarlar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-purple-200 mb-6">
            <Link to="/sanal-fuarlar" className="hover:text-white">Sanal Fuarlar</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/sanal-fuar/${fair.slug}`} className="hover:text-white">{fair.title}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Başvuru</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Stant Başvurusu
          </h1>
          <p className="text-purple-200">{fair.title}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Başvuru Formu</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stant Türü Seçimi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Stant Türü Seçin *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {boothTypes.map((bt) => (
                      <label
                        key={bt.id}
                        className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.boothTypeId === bt.id.toString()
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="boothTypeId"
                          value={bt.id}
                          checked={formData.boothTypeId === bt.id.toString()}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">{bt.name}</span>
                            <span className="text-purple-600 font-bold">
                              {parseFloat(bt.price).toLocaleString('tr-TR')} TL
                            </span>
                          </div>
                          {bt.description && (
                            <p className="text-sm text-gray-500">{bt.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Maks. {bt.maxProducts} ürün
                          </p>
                        </div>
                        {formData.boothTypeId === bt.id.toString() && (
                          <CheckCircle2 className="w-5 h-5 text-purple-500 absolute top-3 right-3" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Firma Bilgileri */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Firma Bilgileri</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        Firma Adı *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="ABC Tekstil Ltd. Şti."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Yetkili Adı Soyadı *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Ahmet Yılmaz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        E-posta *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="info@firma.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="+90 212 XXX XX XX"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Web Sitesi
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://www.firma.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Mesaj */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Ek Bilgi / Mesaj
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Varsa eklemek istediğiniz bilgiler..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !formData.boothTypeId}
                  className="w-full py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      Başvuruyu Gönder
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fuar Bilgisi */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Fuar Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Fuar Adı</p>
                  <p className="font-medium text-gray-900">{fair.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tarih</p>
                  <p className="font-medium text-gray-900">
                    {new Date(fair.startDate).toLocaleDateString('tr-TR')} - {new Date(fair.endDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Seçili Stant */}
            {selectedBoothType && (
              <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="font-bold text-purple-900 mb-2">Seçili Stant</h3>
                <p className="text-2xl font-bold text-purple-600 mb-2">{selectedBoothType.name}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {parseFloat(selectedBoothType.price).toLocaleString('tr-TR')} TL
                </p>
                {selectedBoothType.description && (
                  <p className="text-sm text-purple-700 mt-2">{selectedBoothType.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3 text-sm text-purple-600">
                  <Package className="w-4 h-4" />
                  <span>Maks. {selectedBoothType.maxProducts} ürün</span>
                </div>
              </div>
            )}

            {/* Bilgi Notu */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Bilgilendirme</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  Başvurunuz incelendikten sonra size dönüş yapılacaktır.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  Ödeme, başvuru onayından sonra yapılacaktır.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  Onay sonrası stant içeriğinizi düzenleyebilirsiniz.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
