import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Edit, Trash2, User, Phone, Building2, Crown, Star, Award,
  Search, RefreshCw, GripVertical, Eye, EyeOff
} from 'lucide-react'
import api from '../../utils/api'

export default function BoardMembersList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/board-members')
      setMembers(response.data)
    } catch (error) {
      console.error('Yönetim kurulu üyeleri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" üyesini silmek istediğinize emin misiniz?`)) return

    try {
      await api.delete(`/board-members/${id}`)
      fetchMembers()
    } catch (error) {
      alert('Üye silinemedi')
    }
  }

  const toggleActive = async (member) => {
    try {
      await api.put(`/board-members/${member.id}`, { ...member, isActive: !member.isActive })
      fetchMembers()
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  const getTitleIcon = (title) => {
    if (title === 'Başkan') return <Crown className="w-4 h-4 text-yellow-500" />
    if (title === 'Başkan Vekili') return <Star className="w-4 h-4 text-amber-500" />
    if (title.includes('Başkan Yardımcısı')) return <Award className="w-4 h-4 text-blue-500" />
    if (title === 'Sayman') return <Award className="w-4 h-4 text-green-500" />
    return <User className="w-4 h-4 text-gray-400" />
  }

  const getTitleBadgeClass = (title) => {
    if (title === 'Başkan') return 'bg-yellow-100 text-yellow-700'
    if (title === 'Başkan Vekili') return 'bg-amber-100 text-amber-700'
    if (title.includes('Başkan Yardımcısı')) return 'bg-blue-100 text-blue-700'
    if (title === 'Sayman') return 'bg-green-100 text-green-700'
    return 'bg-gray-100 text-gray-700'
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Grupla: Yönetim Kadrosu ve Üyeler
  const executives = filteredMembers.filter(m =>
    m.title === 'Başkan' ||
    m.title === 'Başkan Vekili' ||
    m.title.includes('Başkan Yardımcısı') ||
    m.title === 'Sayman'
  )
  const regularMembers = filteredMembers.filter(m => m.title === 'Yönetim Kurulu Üyesi')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Yönetim Kurulu</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            KYSD Yönetim Kurulu üyelerini yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMembers}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <Link
            to="/admin/yonetim-kurulu/ekle"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Üye Ekle
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{executives.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Yönetim Kadrosu</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{regularMembers.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kurul Üyesi</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{members.filter(m => m.isActive).length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Aktif</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{members.filter(m => !m.isActive).length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pasif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Üye ara (isim, unvan veya firma)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz yönetim kurulu üyesi eklenmemiş'}
            </p>
            {!searchTerm && (
              <Link to="/admin/yonetim-kurulu/ekle" className="btn-primary mt-4 inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                İlk Üyeyi Ekle
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Yönetim Kadrosu */}
          {executives.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white flex items-center gap-3">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Yönetim Kadrosu</span>
                <span className="text-sm opacity-75">({executives.length} kişi)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Üye</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Unvan</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Firma</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İletişim</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {executives.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <span className="font-medium text-gray-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTitleBadgeClass(member.title)}`}>
                            {getTitleIcon(member.title)}
                            {member.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.companyName || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.phone || member.email || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleActive(member)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              member.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {member.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {member.isActive ? 'Aktif' : 'Pasif'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/admin/yonetim-kurulu/${member.id}`}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <Edit className="w-4 h-4 text-blue-500" />
                            </Link>
                            <button
                              onClick={() => handleDelete(member.id, member.name)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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
            </div>
          )}

          {/* Yönetim Kurulu Üyeleri */}
          {regularMembers.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-3">
                <User className="w-5 h-5" />
                <span className="font-semibold">Yönetim Kurulu Üyeleri</span>
                <span className="text-sm opacity-75">({regularMembers.length} kişi)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Üye</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Firma</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İletişim</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {regularMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <span className="font-medium text-gray-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.companyName || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.phone || member.email || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleActive(member)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              member.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {member.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {member.isActive ? 'Aktif' : 'Pasif'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/admin/yonetim-kurulu/${member.id}`}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <Edit className="w-4 h-4 text-blue-500" />
                            </Link>
                            <button
                              onClick={() => handleDelete(member.id, member.name)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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
            </div>
          )}
        </div>
      )}
    </div>
  )
}
