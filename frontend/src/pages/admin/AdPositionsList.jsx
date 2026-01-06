import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Monitor, DollarSign, Maximize2 } from 'lucide-react'
import api from '../../utils/api'

// Görsel önizleme - maksimum genişlik 200px olacak şekilde oranlar korunur
const AdPreview = ({ width, height, name }) => {
  if (!width || !height) return null

  const maxWidth = 180
  const scale = Math.min(maxWidth / width, 60 / height)
  const scaledWidth = width * scale
  const scaledHeight = height * scale

  return (
    <div className="flex flex-col items-center">
      <div
        className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 border-2 border-dashed border-primary-400 dark:border-primary-600 rounded flex items-center justify-center"
        style={{ width: scaledWidth, height: scaledHeight, minHeight: 30 }}
      >
        <span className="text-[10px] text-primary-600 dark:text-primary-400 font-medium px-1 text-center">
          {width}x{height}
        </span>
      </div>
    </div>
  )
}

export default function AdPositionsList() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPosition, setEditingPosition] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    width: '',
    height: '',
    priceMonthly: '',
    priceQuarterly: '',
    priceYearly: '',
    isActive: true,
    order: 0
  })

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await api.get('/ad-positions/admin')
      setPositions(response.data)
    } catch (error) {
      console.error('Reklam pozisyonları yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPosition) {
        await api.put(`/ad-positions/${editingPosition.id}`, formData)
      } else {
        await api.post('/ad-positions', formData)
      }
      setShowModal(false)
      setEditingPosition(null)
      resetForm()
      fetchPositions()
    } catch (error) {
      console.error('Pozisyon kaydedilemedi:', error)
      alert('Pozisyon kaydedilemedi')
    }
  }

  const handleEdit = (position) => {
    setEditingPosition(position)
    setFormData({
      name: position.name,
      code: position.code,
      description: position.description || '',
      width: position.width || '',
      height: position.height || '',
      priceMonthly: position.priceMonthly || '',
      priceQuarterly: position.priceQuarterly || '',
      priceYearly: position.priceYearly || '',
      isActive: position.isActive,
      order: position.order
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu pozisyonu silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/ad-positions/${id}`)
      fetchPositions()
    } catch (error) {
      console.error('Pozisyon silinemedi:', error)
      alert('Pozisyon silinemedi')
    }
  }

  const toggleActive = async (id) => {
    try {
      await api.patch(`/ad-positions/${id}/toggle-active`)
      fetchPositions()
    } catch (error) {
      console.error('Durum güncellenemedi:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      width: '',
      height: '',
      priceMonthly: '',
      priceQuarterly: '',
      priceYearly: '',
      isActive: true,
      order: 0
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reklam Alanları</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Reklam pozisyonları ve fiyatlandırma</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Pozisyon
        </button>
      </div>

      {/* Özet */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Reklam Gelirleri ile Derneğe Katkı Sağlayın</h2>
        <p className="text-primary-100">
          Web sitenizdeki reklam alanlarını yönetin ve fiyatlandırın. Sponsorlar için cazip konumlar sunun.
        </p>
      </div>

      {/* Pozisyon Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {positions.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-12 text-center text-gray-500 dark:text-gray-400">
            <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Reklam pozisyonu bulunmuyor</p>
          </div>
        ) : (
          positions.map((position) => (
            <div
              key={position.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-2 transition-colors ${
                position.isActive ? 'border-transparent' : 'border-gray-200 dark:border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Monitor className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{position.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{position.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(position.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      position.isActive
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={position.isActive ? 'Pasife al' : 'Aktif yap'}
                  >
                    {position.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleEdit(position)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(position.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {position.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{position.description}</p>
              )}

              {/* Görsel Önizleme */}
              {(position.width && position.height) && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" />
                      Önizleme
                    </span>
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 px-2 py-0.5 rounded">
                      {position.width} x {position.height} px
                    </span>
                  </div>
                  <AdPreview width={position.width} height={position.height} name={position.name} />
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fiyatlandırma</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Aylık</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatCurrency(position.priceMonthly)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">3 Aylık</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatCurrency(position.priceQuarterly)}
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-2">
                    <p className="text-xs text-primary-600 dark:text-primary-400">Yıllık</p>
                    <p className="font-semibold text-primary-700 dark:text-primary-300 text-sm">
                      {formatCurrency(position.priceYearly)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingPosition ? 'Pozisyonu Düzenle' : 'Yeni Pozisyon Ekle'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pozisyon Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ana Sayfa Üst Banner"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kod</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="homepage-top"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                  placeholder="Bu alan hakkında açıklama..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genişlik (px)</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="728"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yükseklik (px)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="90"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Fiyatlandırma (TL)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Aylık</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceMonthly}
                      onChange={(e) => setFormData({...formData, priceMonthly: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">3 Aylık</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceQuarterly}
                      onChange={(e) => setFormData({...formData, priceQuarterly: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="2700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Yıllık</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceYearly}
                      onChange={(e) => setFormData({...formData, priceYearly: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="9500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Aktif</label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingPosition(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingPosition ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
