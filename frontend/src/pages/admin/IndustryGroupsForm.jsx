import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react'
import api from '../../utils/api'

export default function IndustryGroupsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    order: 0,
    isActive: true
  })
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) fetchGroup()
  }, [id])

  const fetchGroup = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/industry-groups/${id}`)
      const { members: groupMembers, ...groupData } = response.data
      setFormData(groupData)
      setMembers(groupMembers || [])
    } catch (error) {
      alert('Grup yüklenemedi')
      navigate('/admin/sanayi-gruplari')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleMemberChange = (index, field, value) => {
    const updated = [...members]
    updated[index] = { ...updated[index], [field]: value }
    setMembers(updated)
  }

  const addMember = () => {
    setMembers([...members, {
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      isActive: true,
      isNew: true
    }])
  }

  const removeMember = async (index) => {
    const member = members[index]
    if (member.id && !confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return

    if (member.id) {
      try {
        await api.delete(`/industry-groups/members/${member.id}`)
      } catch (error) {
        alert('Üye silinemedi')
        return
      }
    }

    setMembers(members.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let groupId = id

      if (isEdit) {
        await api.put(`/industry-groups/${id}`, formData)
      } else {
        const response = await api.post('/industry-groups', formData)
        groupId = response.data.id
      }

      // Save members
      for (const member of members) {
        if (member.isNew) {
          delete member.isNew
          await api.post(`/industry-groups/${groupId}/members`, member)
        } else if (member.id) {
          await api.put(`/industry-groups/members/${member.id}`, member)
        }
      }

      navigate('/admin/sanayi-gruplari')
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
        <button onClick={() => navigate('/admin/sanayi-gruplari')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Sanayi Grubu Düzenle' : 'Yeni Sanayi Grubu'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Group Info */}
          <div className="card p-6">
            <h3 className="font-medium text-gray-800 mb-4">Grup Bilgileri</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grup Adı *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Sanayi grubu adı"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sıra</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="input"
                  placeholder="Grup hakkında kısa açıklama"
                />
              </div>
            </div>
          </div>

          {/* Members */}
          {isEdit && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">Üye Firmalar ({members.length})</h3>
                <button type="button" onClick={addMember} className="btn-secondary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Üye Ekle
                </button>
              </div>

              {members.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Henüz üye firma bulunmuyor</p>
              ) : (
                <div className="space-y-4">
                  {members.map((member, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-700">Üye #{index + 1}</span>
                        <button type="button" onClick={() => removeMember(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={member.companyName}
                          onChange={(e) => handleMemberChange(index, 'companyName', e.target.value)}
                          className="input"
                          placeholder="Firma Adı *"
                          required
                        />
                        <input
                          type="text"
                          value={member.contactPerson || ''}
                          onChange={(e) => handleMemberChange(index, 'contactPerson', e.target.value)}
                          className="input"
                          placeholder="Yetkili Kişi"
                        />
                        <input
                          type="tel"
                          value={member.phone || ''}
                          onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                          className="input"
                          placeholder="Telefon"
                        />
                        <input
                          type="email"
                          value={member.email || ''}
                          onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                          className="input"
                          placeholder="E-posta"
                        />
                        <input
                          type="url"
                          value={member.website || ''}
                          onChange={(e) => handleMemberChange(index, 'website', e.target.value)}
                          className="input"
                          placeholder="Web Sitesi"
                        />
                        <input
                          type="text"
                          value={member.address || ''}
                          onChange={(e) => handleMemberChange(index, 'address', e.target.value)}
                          className="input"
                          placeholder="Adres"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save className="w-5 h-5" />Kaydet</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
