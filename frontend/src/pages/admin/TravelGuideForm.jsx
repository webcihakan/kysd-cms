import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Upload, Trash2, X, Landmark, Church, UtensilsCrossed, ShoppingBag, Info, Map } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CATEGORIES = [
  { value: 'historical', label: 'Tarihi Yerler & Müzeler', icon: Landmark },
  { value: 'religious', label: 'Dini Yapılar', icon: Church },
  { value: 'restaurant', label: 'Restoranlar & Kafeler', icon: UtensilsCrossed },
  { value: 'shopping', label: 'Alışveriş & Oteller', icon: ShoppingBag }
]

const PRICE_RANGES = [
  { value: '$', label: '$ - Ekonomik' },
  { value: '$$', label: '$$ - Orta' },
  { value: '$$$', label: '$$$ - Üst Segment' },
  { value: '$$$$', label: '$$$$ - Lüks' }
]

export default function TravelGuideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    country: '',
    city: '',
    name: '',
    description: '',
    category: 'historical',
    address: '',
    googleMapsEmbed: '',
    phone: '',
    website: '',
    openingHours: '',
    priceRange: '',
    order: 0,
    isActive: true
  })

  const [images, setImages] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCountries()
    if (isEdit) fetchGuide()
  }, [id])

  const fetchCountries = async () => {
    try {
      const response = await api.get('/travel-guides/countries')
      setCountries(response.data)
    } catch (error) {
      console.error('Ülkeler yüklenemedi:', error)
    }
  }

  const fetchGuide = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/travel-guides/${id}`)
      const guide = response.data
      setFormData({
        country: guide.country || '',
        city: guide.city || '',
        name: guide.name || '',
        description: guide.description || '',
        category: guide.category || 'historical',
        address: guide.address || '',
        googleMapsEmbed: guide.googleMapsEmbed || '',
        phone: guide.phone || '',
        website: guide.website || '',
        openingHours: guide.openingHours || '',
        priceRange: guide.priceRange || '',
        order: guide.order || 0,
        isActive: guide.isActive
      })
      setImages(guide.images || [])
    } catch (error) {
      alert('Rehber yuklenemedi')
      navigate('/admin/tur-rehberi')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    if (!isEdit) {
      alert('Önce rehberi kaydetmelisiniz, sonra resim ekleyebilirsiniz')
      return
    }

    setUploading(true)

    try {
      const uploadPromises = files.map(async (file, index) => {
        const form = new FormData()
        form.append('image', file)
        form.append('order', images.length + index)

        const response = await api.post(`/travel-guides/${id}/images`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
      })

      const uploadedImages = await Promise.all(uploadPromises)
      setImages([...images, ...uploadedImages])
    } catch (error) {
      console.error('Resimler yuklenemedi:', error)
      alert('Resimler yuklenemedi')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Bu resmi silmek istediginize emin misiniz?')) return

    try {
      await api.delete(`/travel-guides/images/${imageId}`)
      setImages(images.filter(img => img.id !== imageId))
    } catch (error) {
      console.error('Resim silinemedi:', error)
      alert('Resim silinemedi')
    }
  }

  const handleUpdateImage = async (imageId, field, value) => {
    try {
      await api.put(`/travel-guides/images/${imageId}`, { [field]: value })
      setImages(images.map(img =>
        img.id === imageId ? { ...img, [field]: value } : img
      ))
    } catch (error) {
      console.error('Resim guncellenemedi:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name) {
      alert('Lutfen yer adini girin')
      return
    }

    if (!formData.country) {
      alert('Lutfen ulke secin')
      return
    }

    if (!formData.category) {
      alert('Lutfen kategori secin')
      return
    }

    setSaving(true)

    try {
      if (isEdit) {
        await api.put(`/travel-guides/${id}`, formData)
        alert('Rehber guncellendi')
      } else {
        const response = await api.post('/travel-guides', formData)
        alert('Rehber olusturuldu')
        navigate(`/admin/tur-rehberi/${response.data.id}`)
      }
    } catch (error) {
      console.error('Kayit basarisiz:', error)
      alert('Kayit basarisiz')
    } finally {
      setSaving(false)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const selectedCategory = CATEGORIES.find(c => c.value === formData.category)
  const CategoryIcon = selectedCategory?.icon || Landmark

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/tur-rehberi"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Rehber Duzenle' : 'Yeni Rehber'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Tur rehberi bilgilerini giriniz
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CategoryIcon className="w-5 h-5" />
            Temel Bilgiler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ülke */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ülke <span className="text-red-500">*</span>
              </label>
              {countries.length > 0 ? (
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Ülke seçin</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Ülke adı"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              )}
            </div>

            {/* Şehir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şehir
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Şehir adı"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Yer Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Yer Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Örn: Ayasofya Camii"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon
                return (
                  <label
                    key={cat.value}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.category === cat.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Yer hakkında detaylı bilgi..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* İletişim ve Detaylar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            İletişim ve Detaylar
          </h2>

          {/* Adres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adres
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              placeholder="Tam adres..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Telefon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+90 212 123 4567"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Açılış Saatleri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açılış Saatleri
              </label>
              <textarea
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                rows="3"
                placeholder="Örn:&#10;Pzt-Cum: 09:00-18:00&#10;C.tesi: 10:00-16:00&#10;Pazar: Kapalı"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Fiyat Aralığı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fiyat Aralığı
              </label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Seçiniz</option>
                {PRICE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-start gap-2">
            <Map className="w-5 h-5 text-primary-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Google Maps
              </h2>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Harita Embed Kodu Nasıl Alınır?</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Google Maps'te yeri arayın</li>
                    <li>"Paylaş" butonuna tıklayın</li>
                    <li>"Haritayı yerleştir" sekmesine geçin</li>
                    <li>Embed kodunu kopyalayın ve aşağı yapıştırın</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Embed Kodu (iframe)
            </label>
            <textarea
              name="googleMapsEmbed"
              value={formData.googleMapsEmbed}
              onChange={handleChange}
              rows="4"
              placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" ...></iframe>'
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
            />
          </div>

          {/* Harita Önizleme */}
          {formData.googleMapsEmbed && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Önizleme:</p>
              <div
                className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: formData.googleMapsEmbed }}
              />
            </div>
          )}
        </div>

        {/* Resimler */}
        {isEdit && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Resimler ({images.length})
              </h2>
              <label className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                {uploading ? 'Yukleniyor...' : 'Resim Ekle'}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Henüz resim eklenmemiş</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(image.image)}
                        alt={image.title || `Resim ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        Sıra: {image.order}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={image.title || ''}
                        onChange={(e) => handleUpdateImage(image.id, 'title', e.target.value)}
                        onBlur={(e) => handleUpdateImage(image.id, 'title', e.target.value)}
                        placeholder="Resim başlığı"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                      <textarea
                        value={image.description || ''}
                        onChange={(e) => handleUpdateImage(image.id, 'description', e.target.value)}
                        onBlur={(e) => handleUpdateImage(image.id, 'description', e.target.value)}
                        placeholder="Resim açıklaması"
                        rows="2"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="number"
                        value={image.order}
                        onChange={(e) => handleUpdateImage(image.id, 'order', parseInt(e.target.value) || 0)}
                        onBlur={(e) => handleUpdateImage(image.id, 'order', parseInt(e.target.value) || 0)}
                        placeholder="Sıra"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ayarlar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ayarlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sıra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sıra
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Aktif/Pasif */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aktif (Sitede göster)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button (Mobile) */}
        <div className="lg:hidden">
          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
