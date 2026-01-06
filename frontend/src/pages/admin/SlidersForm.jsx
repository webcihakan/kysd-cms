import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import api from '../../utils/api'

export default function SlidersForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    mobileImage: '',
    link: '',
    buttonText: '',
    order: 0,
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) fetchSlider()
  }, [id])

  const fetchSlider = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/sliders/${id}`)
      setFormData(response.data)
    } catch (error) {
      alert('Slider yüklenemedi')
      navigate('/admin/slider')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    const form = new FormData()
    form.append('file', file)

    try {
      const response = await api.post('/upload/single?folder=sliders', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFormData({ ...formData, [field]: response.data.url })
    } catch (error) {
      alert('Görsel yüklenemedi')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.image) {
      alert('Lütfen bir görsel yükleyin')
      return
    }

    setSaving(true)

    try {
      if (isEdit) {
        await api.put(`/sliders/${id}`, formData)
      } else {
        await api.post('/sliders', formData)
      }
      navigate('/admin/slider')
    } catch (error) {
      alert('Kayıt başarısız')
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
        <button onClick={() => navigate('/admin/slider')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Slider Düzenle' : 'Yeni Slider'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="card p-6">
              <h3 className="font-medium text-gray-800 mb-4">Görseller</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Görsel *</label>
                  {formData.image ? (
                    <div className="relative">
                      <img src={formData.image} alt="" className="w-full h-40 object-cover rounded-lg" />
                      <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded">×</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">1920x600 önerilen</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobil Görsel</label>
                  {formData.mobileImage ? (
                    <div className="relative">
                      <img src={formData.mobileImage} alt="" className="w-full h-40 object-cover rounded-lg" />
                      <button type="button" onClick={() => setFormData({ ...formData, mobileImage: '' })} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded">×</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">768x400 önerilen</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'mobileImage')} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="card p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="Slider başlığı" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                  <input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleChange} className="input" placeholder="Alt başlık" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input type="text" name="link" value={formData.link || ''} onChange={handleChange} className="input" placeholder="/sayfa veya https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buton Metni</label>
                  <input type="text" name="buttonText" value={formData.buttonText || ''} onChange={handleChange} className="input" placeholder="Daha Fazla" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sıra</label>
                <input type="number" name="order" value={formData.order} onChange={handleChange} className="input" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Aktif</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save className="w-5 h-5" />Kaydet</>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
