import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, MapPin, Image, Landmark, Church, UtensilsCrossed, ShoppingBag } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Kategori konfigürasyonu
const categoryConfig = {
  historical: { label: 'Tarihi Yerler', icon: Landmark, color: 'bg-blue-100 text-blue-700' },
  religious: { label: 'Dini Yapılar', icon: Church, color: 'bg-purple-100 text-purple-700' },
  restaurant: { label: 'Restoran/Kafe', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-700' },
  shopping: { label: 'Alışveriş/Otel', icon: ShoppingBag, color: 'bg-green-100 text-green-700' }
}

export default function TravelGuidesList() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetchGuides()
  }, [])

  useEffect(() => {
    // Benzersiz ülkeleri çıkar
    const uniqueCountries = [...new Set(guides.map(g => g.country))].sort()
    setCountries(uniqueCountries)
  }, [guides])

  const fetchGuides = async () => {
    try {
      const response = await api.get('/travel-guides/admin')
      setGuides(response.data)
    } catch (error) {
      console.error('Rehberler yuklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu rehberi silmek istediginize emin misiniz? Tüm resimleri de silinecektir.')) return

    try {
      await api.delete(`/travel-guides/${id}`)
      setGuides(guides.filter(g => g.id !== id))
    } catch (error) {
      console.error('Rehber silinemedi:', error)
      alert('Rehber silinemedi')
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/travel-guides/${id}`, { isActive: (!currentStatus).toString() })
      setGuides(guides.map(g =>
        g.id === id ? { ...g, isActive: !currentStatus } : g
      ))
    } catch (error) {
      console.error('Durum guncellenemedi:', error)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  // Filtreleme
  let filteredGuides = guides

  if (filter !== 'all') {
    filteredGuides = filteredGuides.filter(g => g.category === filter)
  }

  if (countryFilter !== 'all') {
    filteredGuides = filteredGuides.filter(g => g.country === countryFilter)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tur Rehberi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Toplam {guides.length} rehber</p>
        </div>
        <Link
          to="/admin/tur-rehberi/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Rehber
        </Link>
      </div>

      {/* Filtreler */}
      <div className="space-y-3">
        {/* Kategori Filtreleri */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Tümü ({guides.length})
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon
            const count = guides.filter(g => g.category === key).length
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Ülke Filtresi */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ülke:
          </label>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tüm Ülkeler</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rehber Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredGuides.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Henüz rehber bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Yer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Ülke/Şehir
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Resimler
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredGuides.map((guide) => {
                  const config = categoryConfig[guide.category] || {}
                  const Icon = config.icon || MapPin
                  const coverImage = guide.images?.[0]?.image

                  return (
                    <tr key={guide.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                            {coverImage ? (
                              <img
                                src={getImageUrl(coverImage)}
                                alt={guide.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          {/* İsim */}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {guide.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {guide.viewCount || 0} görüntülenme
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <div>
                            <p className="font-medium">{guide.country}</p>
                            {guide.city && (
                              <p className="text-xs text-gray-500">{guide.city}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                          <Image className="w-4 h-4" />
                          {guide.images?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          guide.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {guide.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => toggleActive(guide.id, guide.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              guide.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={guide.isActive ? 'Pasife al' : 'Aktif yap'}
                          >
                            {guide.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </button>
                          <Link
                            to={`/admin/tur-rehberi/${guide.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(guide.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
