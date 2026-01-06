import { useState, useEffect } from 'react'
import { CreditCard, Check, Clock, AlertTriangle, DollarSign, Building, Plus, Edit, Trash2, X, Save, Users, Mail, Loader2 } from 'lucide-react'
import api from '../../utils/api'

const statusLabels = {
  PENDING: 'Bekleniyor',
  PAID: 'Ödendi',
  OVERDUE: 'Gecikmiş',
  CANCELLED: 'İptal'
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
}

// İsmi düzgün formata çevir
const formatName = (name) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const emptyFormData = {
  memberId: '',
  year: new Date().getFullYear(),
  month: '',
  amount: '',
  status: 'PENDING',
  dueDate: new Date().toISOString().split('T')[0],
  notes: ''
}

export default function DuesList() {
  const [dues, setDues] = useState([])
  const [members, setMembers] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showPayModal, setShowPayModal] = useState(null)
  const [paymentData, setPaymentData] = useState({ paymentMethod: 'Havale', receiptNo: '' })

  // Yeni aidat ekleme/düzenleme
  const [showDueModal, setShowDueModal] = useState(false)
  const [editingDue, setEditingDue] = useState(null)
  const [formData, setFormData] = useState(emptyFormData)
  const [saving, setSaving] = useState(false)

  // Toplu aidat oluşturma
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkData, setBulkData] = useState({
    year: new Date().getFullYear(),
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    sendEmail: true
  })
  const [bulkSaving, setBulkSaving] = useState(false)
  const [bulkResult, setBulkResult] = useState(null)

  // Ayarlardan gelen yıl listesi
  const [yearsList, setYearsList] = useState([])
  const [defaultAmount, setDefaultAmount] = useState('')

  useEffect(() => {
    fetchMembers()
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings')
      const settings = response.data

      const startYear = parseInt(settings.dues_start_year) || 2015
      const endYear = parseInt(settings.dues_end_year) || new Date().getFullYear() + 5
      const defAmount = settings.dues_default_amount || ''

      // Yıl listesini oluştur
      const years = []
      for (let y = startYear; y <= endYear; y++) {
        years.push(y)
      }
      setYearsList(years)
      setDefaultAmount(defAmount)

      // Bulk data'ya varsayılan tutarı ekle
      if (defAmount) {
        setBulkData(prev => ({ ...prev, amount: defAmount }))
      }
    } catch (error) {
      // Varsayılan yılları kullan
      const years = []
      for (let y = 2015; y <= new Date().getFullYear() + 5; y++) {
        years.push(y)
      }
      setYearsList(years)
    }
  }

  useEffect(() => {
    fetchDues()
    fetchSummary()
  }, [selectedYear])

  const fetchMembers = async () => {
    try {
      const response = await api.get('/industry-members/all')
      setMembers(response.data)
    } catch (error) {
      console.error('Üyeler yüklenemedi:', error)
    }
  }

  const fetchDues = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/member-dues?year=${selectedYear}`)
      setDues(response.data)
    } catch (error) {
      console.error('Aidatlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await api.get(`/member-dues/summary?year=${selectedYear}`)
      setSummary(response.data)
    } catch (error) {
      console.error('Özet yüklenemedi:', error)
    }
  }

  const handleMarkAsPaid = async (due) => {
    try {
      await api.patch(`/member-dues/${due.id}/pay`, paymentData)
      setShowPayModal(null)
      setPaymentData({ paymentMethod: 'Havale', receiptNo: '' })
      fetchDues()
      fetchSummary()
    } catch (error) {
      console.error('Ödeme işlenemedi:', error)
      alert('Ödeme işlenemedi')
    }
  }

  const handleAddNew = () => {
    setEditingDue(null)
    setFormData({ ...emptyFormData, year: selectedYear })
    setShowDueModal(true)
  }

  const handleEdit = (due) => {
    setEditingDue(due)
    setFormData({
      memberId: due.memberId?.toString() || '',
      year: due.year,
      month: due.month?.toString() || '',
      amount: due.amount?.toString() || '',
      status: due.status,
      dueDate: due.dueDate ? new Date(due.dueDate).toISOString().split('T')[0] : '',
      notes: due.notes || ''
    })
    setShowDueModal(true)
  }

  const handleSave = async () => {
    if (!formData.memberId || !formData.amount || !formData.dueDate) {
      alert('Üye, tutar ve son ödeme tarihi zorunludur')
      return
    }

    setSaving(true)
    try {
      if (editingDue) {
        await api.put(`/member-dues/${editingDue.id}`, {
          status: formData.status,
          notes: formData.notes
        })
      } else {
        await api.post('/member-dues', formData)
      }
      setShowDueModal(false)
      fetchDues()
      fetchSummary()
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Kaydetme işlemi başarısız')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (due) => {
    if (!window.confirm(`Bu aidat kaydını silmek istediğinize emin misiniz?`)) {
      return
    }

    try {
      await api.delete(`/member-dues/${due.id}`)
      fetchDues()
      fetchSummary()
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme işlemi başarısız')
    }
  }

  const handleBulkCreate = async () => {
    if (!bulkData.amount || !bulkData.dueDate) {
      alert('Tutar ve son ödeme tarihi zorunludur')
      return
    }

    setBulkSaving(true)
    setBulkResult(null)
    try {
      const response = await api.post('/member-dues/bulk', bulkData)
      setBulkResult(response.data)

      // Mail sonucu varsa göster
      if (response.data.emailResult) {
        const { sent, failed } = response.data.emailResult
        alert(`${response.data.message}\n\nE-posta: ${sent} gönderildi, ${failed} başarısız`)
      } else {
        alert(response.data.message)
      }

      setShowBulkModal(false)
      setBulkData({
        year: new Date().getFullYear(),
        amount: '',
        dueDate: new Date().toISOString().split('T')[0],
        sendEmail: true
      })
      fetchDues()
      fetchSummary()
    } catch (error) {
      console.error('Toplu oluşturma hatası:', error)
      alert('Toplu aidat oluşturulamadı')
    } finally {
      setBulkSaving(false)
    }
  }

  const filteredDues = filter === 'all'
    ? dues
    : dues.filter(d => d.status === filter)

  const formatCurrency = (amount) => {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aidat Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedYear} yılı aidat takibi</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Yeni Aidat
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Users className="w-4 h-4" />
            Toplu Aidat Oluştur
          </button>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {yearsList.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Özet Kartları */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Aidat</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.totalAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ödenen ({summary.paidCount})</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(summary.paidAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bekleyen ({summary.pendingCount})</p>
                <p className="text-xl font-bold text-yellow-600">{formatCurrency(summary.pendingAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gecikmiş ({summary.overdueCount})</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(summary.overdueAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtreler */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'PENDING', 'PAID', 'OVERDUE'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {status === 'all' ? 'Tümü' : statusLabels[status]}
            {' '}({status === 'all' ? dues.length : dues.filter(d => d.status === status).length})
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredDues.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Aidat kaydı bulunmuyor</p>
            <button
              onClick={handleAddNew}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              İlk Aidatı Ekle
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Üye</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Dönem</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Tutar</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Durum</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">Son Ödeme</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {filteredDues.map((due) => (
                  <tr key={due.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatName(due.member?.companyName)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {due.year} {due.month ? `- ${due.month}. Ay` : '(Yıllık)'}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(due.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[due.status]}`}>
                        {statusLabels[due.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {new Date(due.dueDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {due.status !== 'PAID' && (
                          <button
                            onClick={() => setShowPayModal(due)}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                          >
                            Ödendi
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(due)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(due)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Ödeme Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ödeme Bilgileri
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              <strong>{formatName(showPayModal.member?.companyName)}</strong> - {formatCurrency(showPayModal.amount)}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ödeme Yöntemi
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Havale">Havale/EFT</option>
                  <option value="Nakit">Nakit</option>
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Çek">Çek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Makbuz No (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={paymentData.receiptNo}
                  onChange={(e) => setPaymentData({...paymentData, receiptNo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="MKB-2024-001"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPayModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                İptal
              </button>
              <button
                onClick={() => handleMarkAsPaid(showPayModal)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ödendi Olarak İşaretle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yeni/Düzenle Aidat Modal */}
      {showDueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingDue ? 'Aidat Düzenle' : 'Yeni Aidat Ekle'}
              </h3>
              <button
                onClick={() => setShowDueModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Üye Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Üye Firma *
                </label>
                <select
                  value={formData.memberId}
                  onChange={(e) => setFormData({...formData, memberId: e.target.value})}
                  disabled={editingDue}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">Üye Seçiniz</option>
                  {[...members].sort((a, b) => a.companyName.localeCompare(b.companyName, 'tr')).map(member => (
                    <option key={member.id} value={member.id}>
                      {formatName(member.companyName)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Yıl */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Yıl *
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    disabled={editingDue}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    {yearsList.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Ay (Opsiyonel) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ay (Opsiyonel)
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    disabled={editingDue}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    <option value="">Yıllık</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                      <option key={m} value={m}>{m}. Ay</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tutar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tutar (TL) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    disabled={editingDue}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    placeholder="1000"
                  />
                </div>

                {/* Son Ödeme Tarihi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Son Ödeme Tarihi *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    disabled={editingDue}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Durum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Durum
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="PENDING">Bekleniyor</option>
                  <option value="PAID">Ödendi</option>
                  <option value="OVERDUE">Gecikmiş</option>
                  <option value="CANCELLED">İptal</option>
                </select>
              </div>

              {/* Notlar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notlar
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Ek notlar..."
                />
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t dark:border-gray-700">
              <button
                onClick={() => setShowDueModal(false)}
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

      {/* Toplu Aidat Oluşturma Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Toplu Aidat Oluştur
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Bu işlem tüm aktif üyeler için seçilen yıla ait yıllık aidat kaydı oluşturur.
                  Zaten kaydı olan üyeler atlanır.
                </p>
              </div>

              {/* Yıl */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yıl *
                </label>
                <select
                  value={bulkData.year}
                  onChange={(e) => setBulkData({...bulkData, year: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {yearsList.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Tutar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aidat Tutarı (TL) *
                </label>
                <input
                  type="number"
                  value={bulkData.amount}
                  onChange={(e) => setBulkData({...bulkData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1000"
                />
              </div>

              {/* Son Ödeme Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Son Ödeme Tarihi *
                </label>
                <input
                  type="date"
                  value={bulkData.dueDate}
                  onChange={(e) => setBulkData({...bulkData, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* E-posta Bildirimi */}
            <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-b border-blue-100 dark:border-blue-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulkData.sendEmail}
                  onChange={(e) => setBulkData({...bulkData, sendEmail: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Üyelere E-posta Gönder</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Aidat bildirimi tüm üyelerin e-posta adreslerine gönderilecek
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-3 p-4 border-t dark:border-gray-700">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                İptal
              </button>
              <button
                onClick={handleBulkCreate}
                disabled={bulkSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {bulkSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {bulkData.sendEmail ? 'Oluşturuluyor ve mail gönderiliyor...' : 'Oluşturuluyor...'}
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    {bulkData.sendEmail ? 'Oluştur ve Mail Gönder' : 'Oluştur'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
