import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, BookOpen, Eye, Download, Search } from 'lucide-react'
import api from '../../utils/api'

const categoryConfig = {
  general: 'Genel',
  industry: 'Sanayi',
  technology: 'Teknoloji',
  economy: 'Ekonomi'
}

export default function MagazinesList() {
  const [magazines, setMagazines] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchMagazines()
  }, [selectedCategory])

  const fetchMagazines = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await api.get(`/magazines/admin/all?${params}`)
      setMagazines(response.data || [])
    } catch (error) {
      console.error('Dergiler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu dergiyi silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      await api.delete(`/magazines/${id}`)
      setMagazines(magazines.filter(m => m.id !== id))
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Dergi silinirken hata oluştu')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('tr-TR')
  }

  const filteredMagazines = magazines.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.publisher?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sektörel Dergiler</h1>
          <p className="text-gray-600 mt-1">Dergi yönetimi ve PDF yüklemeleri</p>
        </div>
        <Link
          to="/admin/dergiler/ekle"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yeni Dergi Ekle
        </Link>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Dergi ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tüm Kategoriler</option>
            {Object.entries(categoryConfig).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredMagazines.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dergi Bulunamadı</h3>
            <p className="text-gray-500 mb-4">Henüz dergi eklenmemiş</p>
            <Link
              to="/admin/dergiler/ekle"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" />
              İlk Dergiyi Ekle
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Dergi
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Yayıncı
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Kategori
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Yayın Tarihi
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  İstatistikler
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Durum
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMagazines.map((magazine) => (
                <tr key={magazine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {magazine.coverImage && magazine.coverImage.includes('http') ? (
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-12 h-16 rounded flex items-center justify-center ${
                          magazine.category === 'industry' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                          magazine.category === 'technology' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                          magazine.category === 'economy' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                          'bg-gradient-to-br from-blue-500 to-blue-700'
                        }`}
                        style={{ display: magazine.coverImage && magazine.coverImage.includes('http') ? 'none' : 'flex' }}
                      >
                        <BookOpen className="w-6 h-6 text-white/80" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{magazine.title}</div>
                        {magazine.issueNumber && (
                          <div className="text-sm text-gray-500">{magazine.issueNumber}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {magazine.publisher || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {categoryConfig[magazine.category] || magazine.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(magazine.publishDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {magazine.viewCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {magazine.downloadCount}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-sm font-medium ${
                      magazine.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {magazine.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/dergiler/${magazine.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Düzenle"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(magazine.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Toplam {filteredMagazines.length} dergi
      </div>
    </div>
  )
}
