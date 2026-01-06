import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Users } from 'lucide-react'
import api from '../../utils/api'

export default function IndustryGroupsList() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.get('/industry-groups?all=true')
      setGroups(response.data)
    } catch (error) {
      console.error('Gruplar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu grubu ve tüm üyelerini silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/industry-groups/${id}`)
      fetchGroups()
    } catch (error) {
      alert('Grup silinemedi')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sanayi Grupları</h1>
        <Link to="/admin/sanayi-gruplari/ekle" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Grup
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Henüz sanayi grubu bulunmuyor</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Grup Adı</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Üye Sayısı</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Durum</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Sıra</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{group.name}</p>
                      <p className="text-sm text-gray-500">/{group.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {group._count?.members || group.members?.length || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        group.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {group.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{group.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/sanayi-gruplari/${group.id}`} className="p-2 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                        <button onClick={() => handleDelete(group.id)} className="p-2 hover:bg-gray-100 rounded">
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
      </div>
    </div>
  )
}
