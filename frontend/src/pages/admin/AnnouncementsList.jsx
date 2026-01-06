import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, Pin } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchAnnouncements()
  }, [page])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/announcements?all=true&page=${page}&limit=10`)
      setAnnouncements(response.data.announcements)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Duyurular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/announcements/${id}`)
      fetchAnnouncements()
    } catch (error) {
      alert('Duyuru silinemedi')
    }
  }

  const togglePinned = async (item) => {
    try {
      await api.put(`/announcements/${item.id}`, { ...item, isPinned: !item.isPinned })
      fetchAnnouncements()
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Duyurular</h1>
        <Link to="/admin/duyurular/ekle" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Duyuru
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">Henüz duyuru bulunmuyor</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Duyuru</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Durum</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Tarih</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">/{item.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                        <button
                          onClick={() => togglePinned(item)}
                          className={`p-1 rounded ${item.isPinned ? 'text-accent-500' : 'text-gray-300'}`}
                          title="Sabitle"
                        >
                          <Pin className="w-4 h-4" fill={item.isPinned ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/duyuru/${item.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </a>
                        <Link to={`/admin/duyurular/${item.id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
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
          <div className="flex items-center justify-center gap-2 p-4 border-t dark:border-gray-700">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded ${page === i + 1 ? 'bg-primary-800 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
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
