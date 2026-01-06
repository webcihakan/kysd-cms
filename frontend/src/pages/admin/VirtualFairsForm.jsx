import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Save, ArrowLeft, Upload, X, Plus, Trash2, Monitor,
  DollarSign, Package, Settings
} from 'lucide-react'
import api from '../../utils/api'

export default function VirtualFairsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [boothTypes, setBoothTypes] = useState([])
  const [showBoothTypeModal, setShowBoothTypeModal] = useState(false)
  const [editingBoothType, setEditingBoothType] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true
  })

  const [boothTypeForm, setBoothTypeForm] = useState({
    name: '',
    description: '',
    price: '',
    features: '',
    maxProducts: 10,
    order: 0,
    isActive: true
  })

  useEffect(() => {
    if (isEdit) {
      fetchFair()
    }
  }, [id])

  const fetchFair = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/virtual-fairs/admin/${id}`)
      const fair = response.data
      setFormData({
        title: fair.title || '',
        description: fair.description || '',
        startDate: fair.startDate ? fair.startDate.split('T')[0] : '',
        endDate: fair.endDate ? fair.endDate.split('T')[0] : '',
        isActive: fair.isActive !== false
      })
      if (fair.coverImage) {
        setImagePreview(fair.coverImage)
      }
      if (fair.boothTypes) {
        setBoothTypes(fair.boothTypes)
      }
    } catch (error) {
      console.error('Fuar yüklenemedi:', error)
      alert('Fuar yüklenemedi')
      navigate('/admin/sanal-fuarlar')
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('startDate', formData.startDate)
      data.append('endDate', formData.endDate)
      data.append('isActive', formData.isActive)

      if (imageFile) {
        data.append('coverImage', imageFile)
      }

      if (isEdit) {
        await api.put(`/virtual-fairs/${id}`, data)
      } else {
        const response = await api.post('/virtual-fairs', data)
        // Yeni fuar oluşturulduysa düzenleme sayfasına yönlendir
        navigate(`/admin/sanal-fuarlar/${response.data.id}`)
        return
      }

      navigate('/admin/sanal-fuarlar')
    } catch (error) {
      console.error('Fuar kaydedilemedi:', error)
      alert('Fuar kaydedilemedi')
    } finally {
      setSaving(false)
    }
  }

  // Stant Türü İşlemleri
  const openBoothTypeModal = (boothType = null) => {
    if (boothType) {
      setEditingBoothType(boothType)
      setBoothTypeForm({
        name: boothType.name || '',
        description: boothType.description || '',
        price: boothType.price || '',
        features: boothType.features || '',
        maxProducts: boothType.maxProducts || 10,
        order: boothType.order || 0,
        isActive: boothType.isActive !== false
      })
    } else {
      setEditingBoothType(null)
      setBoothTypeForm({
        name: '',
        description: '',
        price: '',
        features: '',
        maxProducts: 10,
        order: 0,
        isActive: true
      })
    }
    setShowBoothTypeModal(true)
  }

  const handleBoothTypeSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingBoothType) {
        await api.put(`/virtual-booth-types/${editingBoothType.id}`, boothTypeForm)
      } else {
        await api.post('/virtual-booth-types', {
          ...boothTypeForm,
          fairId: id
        })
      }

      setShowBoothTypeModal(false)
      fetchFair()
    } catch (error) {
      console.error('Stant türü kaydedilemedi:', error)
      alert('Stant türü kaydedilemedi')
    }
  }

  const deleteBoothType = async (boothTypeId) => {
    if (!confirm('Bu stant türünü silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/virtual-booth-types/${boothTypeId}`)
      fetchFair()
    } catch (error) {
      alert(error.response?.data?.error || 'Stant türü silinemedi')
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
          onClick={() => navigate('/admin/sanal-fuarlar')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Sanal Fuarlara Geri Dön
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Sanal Fuar Düzenle' : 'Yeni Sanal Fuar'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Kapak Resmi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kapak Resmi
            </label>
            <div className="flex items-start gap-6">
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Önizleme"
                      className="w-48 h-32 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-48 h-32 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <Monitor className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  Resim Yükle
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  PNG, JPG veya WEBP. Önerilen: 1200x400px
                </p>
              </div>
            </div>
          </div>

          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fuar Adı *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="2025 Sanal Konfeksiyon Fuarı"
            />
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
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Fuar hakkında detaylı bilgi..."
            />
          </div>

          {/* Tarihler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Başlangıç Tarihi *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bitiş Tarihi *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Aktif */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aktif (Sitede göster)
            </label>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/admin/sanal-fuarlar')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
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

      {/* Stant Türleri (Sadece düzenleme modunda) */}
      {isEdit && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stant Türleri</h2>
              <p className="text-sm text-gray-500 mt-1">Bu fuar için kiralık stant türlerini ve fiyatlarını belirleyin</p>
            </div>
            <button
              onClick={() => openBoothTypeModal()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Stant Türü Ekle
            </button>
          </div>

          <div className="p-6">
            {boothTypes.length === 0 ? (
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Henüz stant türü eklenmemiş</p>
                <button
                  onClick={() => openBoothTypeModal()}
                  className="btn-primary mt-4 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  İlk Stant Türünü Ekle
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {boothTypes.map((bt) => (
                  <div
                    key={bt.id}
                    className={`p-4 rounded-lg border ${
                      bt.isActive
                        ? 'border-gray-200 dark:border-gray-700'
                        : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{bt.name}</h3>
                          {!bt.isActive && (
                            <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">Pasif</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{bt.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            {parseFloat(bt.price).toLocaleString('tr-TR')} TL
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Package className="w-4 h-4" />
                            Maks. {bt.maxProducts} ürün
                          </span>
                          <span className="text-gray-400">
                            {bt._count?.booths || 0} aktif stant
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openBoothTypeModal(bt)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => deleteBoothType(bt.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
      )}

      {/* Stant Türü Modal */}
      {showBoothTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingBoothType ? 'Stant Türü Düzenle' : 'Yeni Stant Türü'}
              </h3>
            </div>

            <form onSubmit={handleBoothTypeSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stant Türü Adı *
                </label>
                <input
                  type="text"
                  value={boothTypeForm.name}
                  onChange={(e) => setBoothTypeForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Premium Stand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={boothTypeForm.description}
                  onChange={(e) => setBoothTypeForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Stant türünün özellikleri..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fiyat (TL) *
                  </label>
                  <input
                    type="number"
                    value={boothTypeForm.price}
                    onChange={(e) => setBoothTypeForm(prev => ({ ...prev, price: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maks. Ürün Sayısı
                  </label>
                  <input
                    type="number"
                    value={boothTypeForm.maxProducts}
                    onChange={(e) => setBoothTypeForm(prev => ({ ...prev, maxProducts: parseInt(e.target.value) || 10 }))}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Özellikler (JSON)
                </label>
                <textarea
                  value={boothTypeForm.features}
                  onChange={(e) => setBoothTypeForm(prev => ({ ...prev, features: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder='["Logo", "Video", "Katalog", "Canlı Chat"]'
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={boothTypeForm.isActive}
                  onChange={(e) => setBoothTypeForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowBoothTypeModal(false)}
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
