import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Upload, Trash2, GripVertical, X, Plus, Image } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CATEGORIES = [
  { value: 'events', label: 'Etkinlikler' },
  { value: 'fairs', label: 'Fuarlar' },
  { value: 'meetings', label: 'Toplantılar' },
  { value: 'trainings', label: 'Eğitimler' },
  { value: 'other', label: 'Diğer' }
]

export default function GalleryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'events',
    coverImage: '',
    eventDate: '',
    order: 0,
    isActive: true
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEdit) fetchGallery()
  }, [id])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/galleries/${id}`)
      const gallery = response.data
      setFormData({
        title: gallery.title || '',
        description: gallery.description || '',
        category: gallery.category || 'events',
        coverImage: gallery.coverImage || '',
        eventDate: gallery.eventDate ? gallery.eventDate.split('T')[0] : '',
        order: gallery.order || 0,
        isActive: gallery.isActive
      })
      setImages(gallery.images || [])
    } catch (error) {
      alert('Galeri yuklenemedi')
      navigate('/admin/galeri')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const form = new FormData()
    form.append('file', file)

    try {
      const response = await api.post('/upload/single?folder=gallery', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFormData({ ...formData, coverImage: response.data.url })
    } catch (error) {
      alert('Gorsel yuklenemedi')
    }
  }

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        const form = new FormData()
        form.append('file', file)
        const response = await api.post('/upload/single?folder=gallery', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      if (isEdit) {
        // Mevcut galeriye ekle
        const response = await api.post(`/galleries/${id}/images/bulk`, {
          images: uploadedUrls.map((url, index) => ({
            image: url,
            order: images.length + index
          }))
        })
        setImages([...images, ...response.data])
      } else {
        // Henuz kaydedilmemis, local olarak ekle
        const newImages = uploadedUrls.map((url, index) => ({
          id: `temp-${Date.now()}-${index}`,
          image: url,
          title: '',
          order: images.length + index,
          isTemp: true
        }))
        setImages([...images, ...newImages])
      }
    } catch (error) {
      alert('Resimler yuklenemedi')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageId, isTemp) => {
    if (!confirm('Bu resmi silmek istediğinize emin misiniz?')) return

    if (isTemp) {
      setImages(images.filter(img => img.id !== imageId))
    } else {
      try {
        await api.delete(`/galleries/images/${imageId}`)
        setImages(images.filter(img => img.id !== imageId))
      } catch (error) {
        alert('Resim silinemedi')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title) {
      alert('Lütfen bir başlık girin')
      return
    }

    setSaving(true)

    try {
      let galleryId = id

      if (isEdit) {
        await api.put(`/galleries/${id}`, formData)
      } else {
        const response = await api.post('/galleries', formData)
        galleryId = response.data.id

        // Gecici resimleri kaydet
        const tempImages = images.filter(img => img.isTemp)
        if (tempImages.length > 0) {
          await api.post(`/galleries/${galleryId}/images/bulk`, {
            images: tempImages.map(img => ({
              image: img.image,
              title: img.title,
              order: img.order
            }))
          })
        }
      }

      navigate('/admin/galeri')
    } catch (error) {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/galeri')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Galeri Düzenle' : 'Yeni Galeri Albümü'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Album Info */}
            <div className="card p-6 space-y-4">
              <h3 className="font-medium text-gray-800 mb-4">Albüm Bilgileri</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Albüm Başlığı *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="Örn: 2024 Genel Kurul Toplantısı"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input min-h-[100px]"
                  placeholder="Albüm hakkında kısa açıklama..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etkinlik Tarihi</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="card p-6">
              <h3 className="font-medium text-gray-800 mb-4">Kapak Görseli</h3>
              {formData.coverImage ? (
                <div className="relative inline-block">
                  <img
                    src={getImageUrl(formData.coverImage)}
                    alt="Kapak"
                    className="w-64 h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Kapak görseli yükle</span>
                  <span className="text-xs text-gray-400">Boş bırakılırsa ilk resim kullanılır</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Gallery Images */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">Galeri Resimleri ({images.length})</h3>
                <label className={`btn-primary flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  Resim Ekle
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {images.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <Image className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Henüz resim eklenmedi</p>
                  <p className="text-sm text-gray-400 mt-1">Yukarıdaki butona tıklayarak resim ekleyebilirsiniz</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={getImageUrl(img.image)}
                        alt={img.title || `Resim ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id, img.isTemp)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sıra</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Aktif</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
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

            {/* Stats */}
            {isEdit && (
              <div className="card p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">İstatistikler</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Toplam Resim:</span>
                    <span className="font-medium">{images.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
