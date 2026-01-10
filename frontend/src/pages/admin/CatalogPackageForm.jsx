import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import api from '../../utils/api'

export default function CatalogPackageForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    duration: 1,
    price: '',
    description: '',
    features: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    if (isEdit) {
      fetchPackage()
    }
  }, [id])

  const fetchPackage = async () => {
    try {
      const response = await api.get(`/catalog-packages/${id}`)
      const pkg = response.data

      // Features JSON'dan string'e çevir
      let featuresStr = ''
      if (pkg.features) {
        try {
          const featuresArr = JSON.parse(pkg.features)
          featuresStr = featuresArr.join('\n')
        } catch {
          featuresStr = pkg.features
        }
      }

      setFormData({
        name: pkg.name,
        duration: pkg.duration,
        price: pkg.price,
        description: pkg.description || '',
        features: featuresStr,
        order: pkg.order,
        isActive: pkg.isActive
      })
    } catch (error) {
      console.error('Paket yüklenemedi:', error)
      alert('Paket yüklenemedi')
      navigate('/admin/katalog-paketleri')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Features string'i JSON array'e çevir
      const featuresArr = formData.features
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)

      const data = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        order: parseInt(formData.order),
        features: JSON.stringify(featuresArr)
      }

      if (isEdit) {
        await api.put(`/catalog-packages/admin/${id}`, data)
      } else {
        await api.post('/catalog-packages/admin', data)
      }

      alert(isEdit ? 'Paket güncellendi' : 'Paket oluşturuldu')
      navigate('/admin/katalog-paketleri')
    } catch (error) {
      alert('Kayıt başarısız: ' + (error.response?.data?.error || error.message))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/katalog-paketleri')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Paket Düzenle' : 'Yeni Paket'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paket Adı *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Örn: 3 Aylık Premium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Süre (Ay) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (TL) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                  placeholder="Paket hakkında kısa açıklama..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özellikler (Her satıra bir özellik)
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows="6"
                  className="input font-mono text-sm"
                  placeholder={'PDF Katalog Yükleme\nKapak Görseli\nFirma İletişim Bilgileri\n3 Ay Yayın Süresi'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Her satıra bir özellik yazın. Boş satırlar atlanır.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="input"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm font-medium text-gray-700">Aktif</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEdit ? 'Güncelle' : 'Oluştur'}
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
