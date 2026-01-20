import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Package } from 'lucide-react'
import api from '../../utils/api'

const categories = [
  { value: 'genel', label: 'Genel' },
  { value: 'tekstil', label: 'Tekstil Ürünleri' },
  { value: 'aksesuar', label: 'Aksesuar' },
  { value: 'makine', label: 'Makine & Ekipman' },
  { value: 'hammadde', label: 'Hammadde' },
  { value: 'diger', label: 'Diğer' }
]

export default function CatalogSubmit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [packages, setPackages] = useState([])
  const [formData, setFormData] = useState({
    // Katalog Bilgileri
    title: '',
    description: '',
    category: 'genel',
    tags: '',

    // Dosyalar (URL olarak - upload sistemi eklenecek)
    coverImage: '',
    pdfFile: '',
    pageCount: '',

    // Firma Bilgileri
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',

    // Paket
    packageId: ''
  })

  useEffect(() => {
    fetchPackages()
    if (isEdit) {
      fetchCatalog()
    }
  }, [id])

  const fetchPackages = async () => {
    try {
      const response = await api.get('/catalog-packages')
      setPackages(response.data)
      if (response.data.length > 0 && !isEdit) {
        setFormData(prev => ({ ...prev, packageId: response.data[0].id }))
      }
    } catch (error) {
      console.error('Paketler yüklenemedi:', error)
    }
  }

  const fetchCatalog = async () => {
    try {
      const response = await api.get(`/catalogs/member/${id}`)
      const catalog = response.data

      setFormData({
        title: catalog.title,
        description: catalog.description || '',
        category: catalog.category,
        tags: catalog.tags || '',
        coverImage: catalog.coverImage || '',
        pdfFile: catalog.pdfFile,
        pageCount: catalog.pageCount || '',
        companyName: catalog.companyName,
        contactPerson: catalog.contactPerson || '',
        phone: catalog.phone || '',
        email: catalog.email || '',
        website: catalog.website || '',
        packageId: catalog.packageId
      })
    } catch (error) {
      console.error('Katalog yüklenemedi:', error)
      alert('Katalog yüklenemedi')
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
    setSaving(true)

    try {
      const data = {
        ...formData,
        packageId: parseInt(formData.packageId),
        pageCount: formData.pageCount ? parseInt(formData.pageCount) : null
      }

      if (isEdit) {
        await api.put(`/catalogs/member/${id}`, data)
        alert('Katalog güncellendi')
      } else {
        await api.post('/catalogs/member/create', data)
        alert('Katalog başvurunuz alındı! Ödeme sayfasına yönlendiriliyorsunuz...')
      }

      navigate('/uye/kataloglarim')
    } catch (error) {
      alert('İşlem başarısız: ' + (error.response?.data?.error || error.message))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const selectedPackage = packages.find(p => p.id === parseInt(formData.packageId))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/uye/kataloglarim')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Katalog Düzenle' : 'Yeni Katalog Ekle'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Ürün kataloğunuzu sisteme yükleyin</p>
          </div>
        </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sol - Ana Bilgiler */}
          <div className="lg:col-span-2 space-y-6">
            {/* Katalog Bilgileri */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Katalog Bilgileri</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Katalog Başlığı *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Örn: 2024 Tekstil Ürünleri Kataloğu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input"
                  placeholder="Kataloğunuz hakkında kısa bir açıklama..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sayfa Sayısı
                  </label>
                  <input
                    type="number"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleChange}
                    min="1"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Etiketler
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input"
                  placeholder="tekstil, pamuk, organik (virgülle ayırın)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Virgülle ayırarak birden fazla etiket ekleyebilirsiniz</p>
              </div>
            </div>

            {/* Dosyalar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dosya Bilgileri</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PDF Katalog Dosyası (URL) *
                </label>
                <input
                  type="url"
                  name="pdfFile"
                  value={formData.pdfFile}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="https://example.com/katalog.pdf"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF dosyanızın URL adresini girin</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kapak Görseli (URL)
                </label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://example.com/kapak.jpg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Katalog kapak görselinizin URL adresini girin</p>
              </div>
            </div>

            {/* Firma Bilgileri */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Firma Bilgileri</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Firma Adı *
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yetkili Kişi
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sağ - Paket Seçimi */}
          <div className="space-y-6">
            {/* Paket Seçimi */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Paket Seçimi</h2>

              <div className="space-y-3">
                {packages.map(pkg => {
                  let features = []
                  try {
                    features = JSON.parse(pkg.features || '[]')
                  } catch {}

                  return (
                    <label
                      key={pkg.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.packageId === pkg.id
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="packageId"
                        value={pkg.id}
                        checked={formData.packageId === pkg.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{pkg.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{pkg.duration} Ay</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{pkg.price} TL</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{(parseFloat(pkg.price) / pkg.duration).toFixed(0)} TL/ay</div>
                        </div>
                      </div>
                      {features.length > 0 && (
                        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400 mt-2">
                          {features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="text-green-500 dark:text-green-400">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </label>
                  )
                })}
              </div>

              {selectedPackage && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-300">
                    <Package className="w-4 h-4" />
                    <span className="font-semibold">Seçili Paket:</span>
                  </div>
                  <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                    <div>{selectedPackage.name}</div>
                    <div className="font-bold text-lg">{selectedPackage.price} TL</div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? 'Güncelle' : 'Katalog Ekle'}
                </>
              )}
            </button>

            {!isEdit && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Katalog ekledikten sonra ödeme sayfasına yönlendirileceksiniz
              </div>
            )}
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}
