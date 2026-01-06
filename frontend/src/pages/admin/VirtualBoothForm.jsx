import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Save, ArrowLeft, Upload, X, Plus, Trash2, Building2,
  Package, Image, Play, FileText, DollarSign
} from 'lucide-react'
import api from '../../utils/api'

export default function VirtualBoothForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [booth, setBooth] = useState(null)
  const [products, setProducts] = useState([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    videoUrl: '',
    isActive: true,
    order: 0
  })

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    order: 0,
    isActive: true
  })

  const [files, setFiles] = useState({
    companyLogo: null,
    bannerImage: null,
    catalogFile: null
  })

  const [previews, setPreviews] = useState({
    companyLogo: null,
    bannerImage: null,
    catalogUrl: null
  })

  const [productImageFile, setProductImageFile] = useState(null)
  const [productImagePreview, setProductImagePreview] = useState(null)

  useEffect(() => {
    fetchBooth()
  }, [id])

  const fetchBooth = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/virtual-booths/admin/${id}`)
      const data = response.data
      setBooth(data)
      setFormData({
        companyName: data.companyName || '',
        description: data.description || '',
        website: data.website || '',
        email: data.email || '',
        phone: data.phone || '',
        videoUrl: data.videoUrl || '',
        isActive: data.isActive !== false,
        order: data.order || 0
      })
      setPreviews({
        companyLogo: data.companyLogo,
        bannerImage: data.bannerImage,
        catalogUrl: data.catalogUrl
      })
      setProducts(data.products || [])
    } catch (error) {
      console.error('Stant yüklenemedi:', error)
      alert('Stant yüklenemedi')
      navigate(-1)
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

  const handleFileChange = (field, e) => {
    const file = e.target.files[0]
    if (!file) return

    setFiles(prev => ({ ...prev, [field]: file }))

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [field]: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const removeFile = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }))
    setPreviews(prev => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })

      if (files.companyLogo) data.append('companyLogo', files.companyLogo)
      if (files.bannerImage) data.append('bannerImage', files.bannerImage)
      if (files.catalogFile) data.append('catalogFile', files.catalogFile)

      await api.put(`/virtual-booths/${id}`, data)
      navigate(`/admin/sanal-fuarlar/${booth.fairId}/stantlar`)
    } catch (error) {
      console.error('Stant kaydedilemedi:', error)
      alert('Stant kaydedilemedi')
    } finally {
      setSaving(false)
    }
  }

  // Ürün İşlemleri
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        order: product.order || 0,
        isActive: product.isActive !== false
      })
      setProductImagePreview(product.image)
    } else {
      setEditingProduct(null)
      setProductForm({
        name: '',
        description: '',
        price: '',
        order: 0,
        isActive: true
      })
      setProductImagePreview(null)
    }
    setProductImageFile(null)
    setShowProductModal(true)
  }

  const handleProductImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setProductImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setProductImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = new FormData()
      Object.entries(productForm).forEach(([key, value]) => {
        data.append(key, value)
      })
      if (productImageFile) {
        data.append('image', productImageFile)
      }

      if (editingProduct) {
        await api.put(`/virtual-booths/products/${editingProduct.id}`, data)
      } else {
        await api.post(`/virtual-booths/${id}/products`, data)
      }

      setShowProductModal(false)
      fetchBooth()
    } catch (error) {
      alert(error.response?.data?.error || 'Ürün kaydedilemedi')
    }
  }

  const deleteProduct = async (productId) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/virtual-booths/products/${productId}`)
      fetchBooth()
    } catch (error) {
      alert('Ürün silinemedi')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Geri Dön
        </button>
      </div>

      {/* Stant Formu */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stant Düzenle: {booth?.companyName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fuar: {booth?.fair?.title} | Tür: {booth?.boothType?.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo ve Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Firma Logosu
              </label>
              <div className="space-y-2">
                {previews.companyLogo ? (
                  <div className="relative inline-block">
                    <img
                      src={previews.companyLogo}
                      alt="Logo"
                      className="w-32 h-32 object-contain border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('companyLogo')}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
                  <Upload className="w-4 h-4" />
                  Logo Yükle
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange('companyLogo', e)} className="hidden" />
                </label>
              </div>
            </div>

            {/* Banner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Banner Görsel
              </label>
              <div className="space-y-2">
                {previews.bannerImage ? (
                  <div className="relative inline-block">
                    <img
                      src={previews.bannerImage}
                      alt="Banner"
                      className="w-full h-32 object-cover border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('bannerImage')}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
                  <Upload className="w-4 h-4" />
                  Banner Yükle
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange('bannerImage', e)} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Firma Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="https://"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Firma Açıklaması
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Firma hakkında bilgi..."
            />
          </div>

          {/* Video ve Katalog */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Play className="w-4 h-4 inline mr-1" />
                Video URL (YouTube/Vimeo)
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Katalog (PDF)
              </label>
              <div className="flex items-center gap-2">
                {previews.catalogUrl && (
                  <a href={previews.catalogUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    Mevcut Katalog
                  </a>
                )}
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
                  <Upload className="w-4 h-4" />
                  PDF Yükle
                  <input type="file" accept=".pdf" onChange={(e) => handleFileChange('catalogFile', e)} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Aktif */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aktif (Sitede göster)
            </label>
          </div>

          {/* Kaydet */}
          <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Ürünler */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ürünler</h2>
            <p className="text-sm text-gray-500 mt-1">
              Maks. {booth?.boothType?.maxProducts || 10} ürün eklenebilir ({products.length} / {booth?.boothType?.maxProducts || 10})
            </p>
          </div>
          <button
            onClick={() => openProductModal()}
            disabled={products.length >= (booth?.boothType?.maxProducts || 10)}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Ürün Ekle
          </button>
        </div>

        <div className="p-6">
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz ürün eklenmemiş</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg overflow-hidden ${!product.isActive ? 'opacity-50' : ''}`}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{product.name}</h4>
                    {product.price && (
                      <p className="text-xs text-green-600 mt-1">{product.price}</p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      >
                        <Package className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ürün Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
              </h3>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              {/* Ürün Görseli */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ürün Görseli
                </label>
                <div className="flex items-center gap-4">
                  {productImagePreview ? (
                    <img src={productImagePreview} alt="Ürün" className="w-20 h-20 object-cover rounded-lg" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <label className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Resim Seç
                    <input type="file" accept="image/*" onChange={handleProductImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fiyat
                </label>
                <input
                  type="text"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="100 TL / adet"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.isActive}
                  onChange={(e) => setProductForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Aktif</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
