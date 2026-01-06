import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, Image, Images, Calendar } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CATEGORIES = {
  events: 'Etkinlikler',
  fairs: 'Fuarlar',
  meetings: 'Toplantılar',
  trainings: 'Eğitimler',
  other: 'Diğer'
}

export default function GalleryList() {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchGalleries()
  }, [page, selectedCategory])

  const fetchGalleries = async () => {
    try {
      setLoading(true)
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''
      const response = await api.get(`/galleries?all=true&page=${page}&limit=10${categoryParam}`)
      setGalleries(response.data.galleries)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Galeriler yuklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu galeriyi silmek istediğinize emin misiniz? Tüm resimler de silinecektir.')) return

    try {
      await api.delete(`/galleries/${id}`)
      fetchGalleries()
    } catch (error) {
      alert('Galeri silinemedi')
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const getCoverImage = (gallery) => {
    if (gallery.coverImage) return getImageUrl(gallery.coverImage)
    if (gallery.images && gallery.images.length > 0) return getImageUrl(gallery.images[0].image)
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Galeri Yönetimi</h1>
        <Link to="/admin/galeri/ekle" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Albüm
        </Link>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => { setSelectedCategory('all'); setPage(1); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tümü
        </button>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setSelectedCategory(key); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === key
                ? 'bg-primary-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Images className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Henüz galeri bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Albüm</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Kategori</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Resim Sayısı</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Durum</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tarih</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {galleries.map((gallery) => (
                  <tr key={gallery.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {getCoverImage(gallery) ? (
                          <img
                            src={getCoverImage(gallery)}
                            alt=""
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            <Image className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{gallery.title}</p>
                          <p className="text-sm text-gray-500">/{gallery.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        {CATEGORIES[gallery.category] || gallery.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Images className="w-4 h-4" />
                        <span>{gallery._count?.images || 0} resim</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        gallery.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {gallery.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">
                        {gallery.eventDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(gallery.eventDate)}
                          </div>
                        ) : (
                          formatDate(gallery.createdAt)
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/galeri?album=${gallery.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </a>
                        <Link
                          to={`/admin/galeri/${gallery.id}`}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                        <button
                          onClick={() => handleDelete(gallery.id)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded ${
                  page === i + 1 ? 'bg-primary-800 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
