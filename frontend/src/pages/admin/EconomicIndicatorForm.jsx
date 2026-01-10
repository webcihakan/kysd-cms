import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, TrendingUp } from 'lucide-react'
import api from '../../utils/api'

export default function EconomicIndicatorForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'ihracat',
    year: new Date().getFullYear(),
    month: '',
    value: '',
    unit: 'Milyar Dolar',
    changePercent: '',
    source: '',
    sourceUrl: '',
    description: '',
    isActive: true
  })

  useEffect(() => {
    if (isEdit) {
      fetchIndicator()
    }
  }, [id])

  const fetchIndicator = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/economic-indicators/${id}`)
      const data = response.data
      setFormData({
        title: data.title,
        category: data.category,
        year: data.year,
        month: data.month || '',
        value: data.value,
        unit: data.unit,
        changePercent: data.changePercent || '',
        source: data.source || '',
        sourceUrl: data.sourceUrl || '',
        description: data.description || '',
        isActive: data.isActive
      })
    } catch (error) {
      console.error('Gösterge yüklenemedi:', error)
      alert('Gösterge yüklenirken hata oluştu')
      navigate('/admin/ekonomik-gostergeler')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      alert('Başlık gereklidir')
      return
    }
    if (!formData.value) {
      alert('Değer gereklidir')
      return
    }

    try {
      setLoading(true)

      // Prepare data
      const data = {
        ...formData,
        month: formData.month ? parseInt(formData.month) : null,
        year: parseInt(formData.year),
        value: parseFloat(formData.value),
        changePercent: formData.changePercent ? parseFloat(formData.changePercent) : null
      }

      if (isEdit) {
        await api.put(`/economic-indicators/${id}`, data)
        alert('Gösterge başarıyla güncellendi')
      } else {
        await api.post('/economic-indicators', data)
        alert('Gösterge başarıyla eklendi')
      }

      navigate('/admin/ekonomik-gostergeler')
    } catch (error) {
      console.error('Gösterge kaydedilemedi:', error)
      alert(error.response?.data?.error || 'Gösterge kaydedilirken hata oluştu')
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/ekonomik-gostergeler')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-7 h-7" />
          {isEdit ? 'Gösterge Düzenle' : 'Yeni Gösterge Ekle'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? 'Ekonomik göstergeyi güncelleyin' : 'Yeni ekonomik gösterge ekleyin'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Başlık */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="örn: 2024 Yılı Toplam İhracat"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="ihracat">İhracat</option>
              <option value="ithalat">İthalat</option>
              <option value="asgari_ucret">Asgari Ücret</option>
              <option value="emekli_maasi">Emekli Maaşı</option>
              <option value="kira_artis">Kira Artışı</option>
              <option value="enflasyon">Enflasyon</option>
              <option value="dolar">Dolar</option>
              <option value="euro">Euro</option>
              <option value="altin">Altın</option>
            </select>
          </div>

          {/* Yıl */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yıl <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2000"
              max="2100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Ay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ay (Opsiyonel)
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Yıllık</option>
              <option value="1">Ocak</option>
              <option value="2">Şubat</option>
              <option value="3">Mart</option>
              <option value="4">Nisan</option>
              <option value="5">Mayıs</option>
              <option value="6">Haziran</option>
              <option value="7">Temmuz</option>
              <option value="8">Ağustos</option>
              <option value="9">Eylül</option>
              <option value="10">Ekim</option>
              <option value="11">Kasım</option>
              <option value="12">Aralık</option>
            </select>
          </div>

          {/* Değer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Değer <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="örn: 255.8"
              required
            />
          </div>

          {/* Birim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birim <span className="text-red-500">*</span>
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="Milyar Dolar">Milyar Dolar</option>
              <option value="Milyon Dolar">Milyon Dolar</option>
              <option value="TL">TL</option>
              <option value="%">%</option>
              <option value="Milyar TL">Milyar TL</option>
              <option value="Milyon TL">Milyon TL</option>
            </select>
          </div>

          {/* Değişim Yüzdesi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Değişim Yüzdesi (Opsiyonel)
            </label>
            <input
              type="number"
              name="changePercent"
              value={formData.changePercent}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="örn: 5.5 veya -3.2"
            />
          </div>

          {/* Kaynak */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kaynak (Opsiyonel)
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="örn: TÜİK, TCMB, Hazine"
            />
          </div>

          {/* Kaynak URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kaynak URL (Opsiyonel)
            </label>
            <input
              type="url"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          {/* Açıklama */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama (Opsiyonel)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Gösterge hakkında ek bilgi..."
            />
          </div>

          {/* Durum */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/ekonomik-gostergeler')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-2"
            disabled={loading}
          >
            <Save className="w-5 h-5" />
            {loading ? 'Kaydediliyor...' : (isEdit ? 'Güncelle' : 'Kaydet')}
          </button>
        </div>
      </form>
    </div>
  )
}
