import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Save, ArrowLeft, Upload, X } from 'lucide-react'
import api from '../../utils/api'

export default function MemberProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoFile, setLogoFile] = useState(null)

  const [formData, setFormData] = useState({
    companyName: '',
    tradeName: '',
    taxOffice: '',
    taxNumber: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    phone: '',
    fax: '',
    email: '',
    website: '',
    foundedYear: '',
    employeeCount: '',
    sector: '',
    description: '',
    logo: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/auth/me')
      const profile = response.data.companyProfile

      if (profile) {
        setFormData({
          companyName: profile.companyName || '',
          tradeName: profile.tradeName || '',
          taxOffice: profile.taxOffice || '',
          taxNumber: profile.taxNumber || '',
          address: profile.address || '',
          city: profile.city || '',
          district: profile.district || '',
          postalCode: profile.postalCode || '',
          phone: profile.phone || '',
          fax: profile.fax || '',
          email: profile.email || '',
          website: profile.website || '',
          foundedYear: profile.foundedYear || '',
          employeeCount: profile.employeeCount || '',
          sector: profile.sector || '',
          description: profile.description || '',
          logo: profile.logo || ''
        })

        if (profile.logo) {
          setLogoPreview(`${import.meta.env.VITE_API_URL}${profile.logo}`)
        }
      }
    } catch (error) {
      console.error('Profil yüklenemedi:', error)
      alert('Profil yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo dosyası en fazla 2MB olabilir')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Sadece resim dosyası yükleyebilirsiniz')
        return
      }

      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setFormData({ ...formData, logo: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const submitData = new FormData()

      // Tüm form verilerini ekle
      Object.keys(formData).forEach(key => {
        if (key !== 'logo' && formData[key]) {
          submitData.append(key, formData[key])
        }
      })

      // Logo varsa ekle
      if (logoFile) {
        submitData.append('logo', logoFile)
      }

      await api.put('/members/profile', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('Profil başarıyla güncellendi')
      fetchProfile() // Güncel verileri al
    } catch (error) {
      console.error('Güncelleme hatası:', error)
      alert(error.response?.data?.error || 'Profil güncellenemedi')
    } finally {
      setSaving(false)
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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/uye/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Building2 className="w-7 h-7" />
              Firma Profili
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Firma bilgilerinizi görüntüleyin ve güncelleyin
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Firma Logosu</h2>

            <div className="flex items-center gap-6">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-32 h-32 object-contain border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="flex-1">
                <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Logo Yükle
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  PNG, JPG veya JPEG formatında, maksimum 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Temel Bilgiler */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Temel Bilgiler</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Firma Ünvanı *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ticari Ünvan
                </label>
                <input
                  type="text"
                  name="tradeName"
                  value={formData.tradeName}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vergi Dairesi
                </label>
                <input
                  type="text"
                  name="taxOffice"
                  value={formData.taxOffice}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vergi Numarası
                </label>
                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">İletişim Bilgileri</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adres
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şehir *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İlçe
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Posta Kodu
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="+90 (212) 555 55 55"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Faks
                </label>
                <input
                  type="tel"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Web Sitesi
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          {/* Firma Detayları */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Firma Detayları</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kuruluş Yılı
                </label>
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  className="input"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Çalışan Sayısı
                </label>
                <input
                  type="number"
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="input"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sektör
                </label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="input"
                  placeholder="Örn: Tekstil"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Firma Açıklaması
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input"
                placeholder="Firmanız hakkında kısa bir açıklama..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/uye/dashboard')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
