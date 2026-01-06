import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import api from '../../utils/api'

export default function SlidersList() {
  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    try {
      const response = await api.get('/sliders?all=true')
      setSliders(response.data)
    } catch (error) {
      console.error('Sliderlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu slider\'ı silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/sliders/${id}`)
      fetchSliders()
    } catch (error) {
      alert('Slider silinemedi')
    }
  }

  const toggleActive = async (slider) => {
    try {
      await api.put(`/sliders/${slider.id}`, { ...slider, isActive: !slider.isActive })
      fetchSliders()
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Slider Yönetimi</h1>
        <Link to="/admin/slider/ekle" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Slider
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        ) : sliders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Henüz slider bulunmuyor</div>
        ) : (
          <div className="divide-y">
            {sliders.map((slider) => (
              <div key={slider.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />

                <img
                  src={slider.image}
                  alt={slider.title || 'Slider'}
                  className="w-32 h-20 object-cover rounded-lg"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{slider.title || 'Başlıksız'}</p>
                  {slider.subtitle && (
                    <p className="text-sm text-gray-500 truncate">{slider.subtitle}</p>
                  )}
                  {slider.link && (
                    <p className="text-xs text-primary-600 truncate">{slider.link}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(slider)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      slider.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {slider.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                  <span className="text-sm text-gray-400">#{slider.order}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Link to={`/admin/slider/${slider.id}`} className="p-2 hover:bg-gray-100 rounded">
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Link>
                  <button onClick={() => handleDelete(slider.id)} className="p-2 hover:bg-gray-100 rounded">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
