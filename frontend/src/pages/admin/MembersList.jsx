import { useState, useEffect } from 'react'
import { Building2, Search, Download, Phone, Mail, Globe, MapPin, ChevronDown, ChevronUp, Edit, Trash2, Plus, X, Save } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// İsmi düzgün formata çevir (Her kelimenin ilk harfi büyük, gerisi küçük)
const formatName = (name) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const emptyFormData = {
  companyName: '',
  contactPerson: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  description: '',
  groupId: ''
}

export default function MembersList() {
  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [expandedMember, setExpandedMember] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState(emptyFormData)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchGroups()
    fetchMembers()
  }, [selectedGroup])

  const fetchGroups = async () => {
    try {
      const response = await api.get('/industry-groups')
      setGroups(response.data.groups || response.data)
    } catch (error) {
      console.error('Gruplar yüklenemedi:', error)
    }
  }

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedGroup) params.append('groupId', selectedGroup)

      const response = await api.get(`/industry-members/all?${params.toString()}`)
      setMembers(response.data)
    } catch (error) {
      console.error('Üyeler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams()
      if (selectedGroup) params.append('groupId', selectedGroup)
      if (search) params.append('search', search)

      const response = await api.get(`/industry-members/export?${params.toString()}`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `uye-listesi.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export hatası:', error)
      alert('Excel dosyası oluşturulamadı')
    } finally {
      setExporting(false)
    }
  }

  const handleAddNew = () => {
    setEditingMember(null)
    setFormData(emptyFormData)
    setShowModal(true)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setFormData({
      companyName: member.companyName || '',
      contactPerson: member.contactPerson || '',
      phone: member.phone || '',
      email: member.email || '',
      website: member.website || '',
      address: member.address || '',
      description: member.description || '',
      groupId: member.groupId?.toString() || ''
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.companyName || !formData.groupId) {
      alert('Firma adı ve sanayi grubu zorunludur')
      return
    }

    setSaving(true)
    try {
      if (editingMember) {
        await api.put(`/industry-members/${editingMember.id}`, formData)
      } else {
        await api.post('/industry-members', formData)
      }
      setShowModal(false)
      fetchMembers()
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Kaydetme işlemi başarısız')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`"${member.companyName}" firmasını silmek istediğinize emin misiniz?`)) {
      return
    }

    try {
      await api.delete(`/industry-members/${member.id}`)
      fetchMembers()
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme işlemi başarısız')
    }
  }

  // Filtreleme ve A-Z sıralama
  const filteredMembers = members
    .filter(member => {
      const matchesSearch = !search ||
        member.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        member.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
        member.email?.toLowerCase().includes(search.toLowerCase()) ||
        member.phone?.includes(search)

      return matchesSearch
    })
    .sort((a, b) => (a.companyName || '').localeCompare(b.companyName || '', 'tr'))

  // Gruplara göre sayılar
  const groupCounts = {}
  members.forEach(m => {
    const gId = m.groupId
    groupCounts[gId] = (groupCounts[gId] || 0) + 1
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Üye Firmalar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Toplam {members.length} üye firma
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Yeni Ekle
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'İndiriliyor...' : 'Excel İndir'}
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Arama */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Firma adı, yetkili, telefon veya e-posta ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Sanayi Grubu */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[250px]"
          >
            <option value="">Tüm Sanayi Grupları ({members.length})</option>
            {[...groups].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'tr')).map(group => (
              <option key={group.id} value={group.id}>
                {formatName(group.name)} ({group._count?.members || groupCounts[group.id] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Üye Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Üye bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">#</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Firma</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Yetkili</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Telefon</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">E-posta</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Sanayi Grubu</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {filteredMembers.map((member, index) => {
                  const isExpanded = expandedMember === member.id

                  return (
                    <>
                      <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {member.logo ? (
                              <img src={`${API_URL}${member.logo}`} alt="" className="w-8 h-8 rounded object-contain bg-gray-100" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">{formatName(member.companyName)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {formatName(member.contactPerson) || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {member.phone || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {member.email ? (
                            <a href={`mailto:${member.email.split(';')[0]}`} className="text-primary-600 hover:underline">
                              {member.email.split(';')[0]}
                            </a>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{formatName(member.group?.name) || '-'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEdit(member)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              title="Düzenle"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(member)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              title="Detay"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Detay Satırı */}
                      {isExpanded && (
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Firma Bilgileri */}
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Firma Bilgileri</h4>
                                <div className="space-y-2 text-sm">
                                  {member.address && (
                                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      <span>{member.address}</span>
                                    </div>
                                  )}
                                  {member.website && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                      <Globe className="w-4 h-4" />
                                      <a href={member.website.startsWith('http') ? member.website : `https://${member.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                        {member.website}
                                      </a>
                                    </div>
                                  )}
                                  {member.email && (
                                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                      <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      <span>{member.email}</span>
                                    </div>
                                  )}
                                  {member.phone && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                      <Phone className="w-4 h-4" />
                                      <span>{member.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Ek Bilgiler */}
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Ek Bilgiler</h4>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  <p><strong>Sanayi Grubu:</strong> {formatName(member.group?.name) || 'Belirtilmemiş'}</p>
                                  <p><strong>Yetkili Kişi:</strong> {formatName(member.contactPerson) || 'Belirtilmemiş'}</p>
                                  {member.description && (
                                    <p><strong>Açıklama:</strong> {member.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Düzenleme/Ekleme Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingMember ? 'Firma Düzenle' : 'Yeni Firma Ekle'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Firma Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Firma Adı *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Firma adı girin"
                />
              </div>

              {/* Sanayi Grubu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sanayi Grubu *
                </label>
                <select
                  value={formData.groupId}
                  onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Seçiniz</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {formatName(group.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Yetkili Kişi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yetkili Kişi
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Yetkili kişi adı"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Telefon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0212 123 45 67"
                  />
                </div>

                {/* E-posta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="info@firma.com"
                  />
                </div>
              </div>

              {/* Web Sitesi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Web Sitesi
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="www.firma.com"
                />
              </div>

              {/* Adres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adres
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Firma adresi"
                />
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Firma hakkında kısa açıklama"
                />
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t dark:border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
