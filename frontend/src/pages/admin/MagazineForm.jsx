import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Save, ArrowLeft, Upload, X } from 'lucide-react'
import api from '../../utils/api'

const categoryOptions = [
  { value: 'general', label: 'Genel' },
  { value: 'industry', label: 'Sanayi' },
  { value: 'technology', label: 'Teknoloji' },
  { value: 'economy', label: 'Ekonomi' }
]

export default function MagazineForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    publisher: '',
    issueNumber: '',
    publishDate: '',
    category: 'general',
    coverImage: '',
    pdfFile: '',
    pageCount: '',
    price: '',
    isPaid: false,
    isActive: true,
    isFeatured: false,
    order: 0,
    tags: ''
  })

  useEffect(() => {
    if (isEdit) {
      fetchMagazine()
    }
  }, [id])

  const fetchMagazine = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/magazines/${id}`)
      const data = response.data

      // Tarihi format'la
      if (data.publishDate) {
        data.publishDate = new Date(data.publishDate).toISOString().split('T')[0]
      }

      setFormData(data)
    } catch (error) {
      console.error('Dergi yüklenemedi:', error)
      alert('Dergi yüklenirken hata oluştu')
      navigate('/admin/dergiler')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Dosya tipi kontrolü
    if (fieldName === 'pdfFile' && file.type !== 'application/pdf') {
      alert('Sadece PDF dosyası yükleyebilirsiniz')
      return
    }

    if (fieldName === 'coverImage' && !file.type.startsWith('image/')) {
      alert('Sadece resim dosyası yükleyebilirsiniz')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setFormData(prev => ({
        ...prev,
        [fieldName]: response.data.url
      }))
    } catch (error) {
      console.error('Dosya yükleme hatası:', error)
      alert('Dosya yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        await api.put(`/magazines/${id}`, formData)
      } else {
        await api.post('/magazines', formData)
      }

      navigate('/admin/dergiler')
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Dergi kaydedilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/dergiler"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Dergi Düzenle' : 'Yeni Dergi Ekle'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Dergi bilgilerini güncelleyin' : 'Yeni dergi bilgilerini girin'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dergi Başlığı *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yayıncı
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sayı Numarası
              </label>
              <input
                type="text"
                name="issueNumber"
                value={formData.issueNumber}
                onChange={handleChange}
                placeholder="Örn: Sayı 42, 2024/01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yayın Tarihi
              </label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sayfa Sayısı
              </label>
              <input
                type="number"
                name="pageCount"
                value={formData.pageCount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiketler
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Virgülle ayırın: teknoloji, sanayi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Dosyalar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dosyalar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapak Görseli
              </label>
              {formData.coverImage && (
                <div className="mb-2">
                  <img
                    src={formData.coverImage}
                    alt="Kapak"
                    className="w-32 h-48 object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Kaldır
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'coverImage')}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Dosyası *
              </label>
              {formData.pdfFile && (
                <div className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate">{formData.pdfFile}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, pdfFile: '' }))}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e, 'pdfFile')}
                required={!isEdit && !formData.pdfFile}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Ayarlar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ayarlar</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-gray-700">Aktif</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-gray-700">Öne Çıkan</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPaid"
                checked={formData.isPaid}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-gray-700">Ücretli Dergi</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ücret Bilgisi
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Örn: 50 TL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıra
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex justify-end gap-4">
          <Link
            to="/admin/dergiler"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isEdit ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
