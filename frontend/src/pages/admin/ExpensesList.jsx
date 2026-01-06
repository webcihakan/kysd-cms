import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Check, Receipt, TrendingDown, Building, Zap, Users, Calendar, Briefcase, Plane, Scale, Shield, MoreHorizontal, Download } from 'lucide-react'
import api from '../../utils/api'

const categoryLabels = {
  RENT: 'Kira',
  UTILITIES: 'Faturalar',
  SALARY: 'Maaşlar',
  OFFICE: 'Ofis Giderleri',
  EVENTS: 'Etkinlikler',
  MARKETING: 'Pazarlama',
  TRAVEL: 'Seyahat',
  LEGAL: 'Hukuk',
  TAX: 'Vergiler',
  INSURANCE: 'Sigorta',
  OTHER: 'Diğer'
}

const categoryIcons = {
  RENT: Building,
  UTILITIES: Zap,
  SALARY: Users,
  OFFICE: Briefcase,
  EVENTS: Calendar,
  MARKETING: TrendingDown,
  TRAVEL: Plane,
  LEGAL: Scale,
  TAX: Receipt,
  INSURANCE: Shield,
  OTHER: MoreHorizontal
}

const categoryColors = {
  RENT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  UTILITIES: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  SALARY: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  OFFICE: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
  EVENTS: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  MARKETING: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  TRAVEL: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  LEGAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  TAX: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  INSURANCE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  OTHER: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
}

const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    category: 'OFFICE',
    description: '',
    amount: '',
    vendor: '',
    invoiceNo: '',
    isPaid: false,
    dueDate: ''
  })
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchExpenses()
    fetchSummary()
  }, [selectedYear, selectedMonth])

  const fetchExpenses = async () => {
    try {
      let url = `/expenses?year=${selectedYear}`
      if (selectedMonth) url += `&month=${selectedMonth}`
      const response = await api.get(url)
      setExpenses(response.data)
    } catch (error) {
      console.error('Giderler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      let url = `/expenses/summary?year=${selectedYear}`
      if (selectedMonth) url += `&month=${selectedMonth}`
      const response = await api.get(url)
      setSummary(response.data)
    } catch (error) {
      console.error('Özet yüklenemedi:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, formData)
      } else {
        await api.post('/expenses', formData)
      }
      setShowModal(false)
      setEditingExpense(null)
      resetForm()
      fetchExpenses()
      fetchSummary()
    } catch (error) {
      console.error('Gider kaydedilemedi:', error)
      alert('Gider kaydedilemedi')
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormData({
      year: expense.year,
      month: expense.month,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      vendor: expense.vendor || '',
      invoiceNo: expense.invoiceNo || '',
      isPaid: expense.isPaid,
      dueDate: expense.dueDate ? expense.dueDate.split('T')[0] : ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu gideri silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/expenses/${id}`)
      fetchExpenses()
      fetchSummary()
    } catch (error) {
      console.error('Gider silinemedi:', error)
      alert('Gider silinemedi')
    }
  }

  const handleMarkAsPaid = async (id) => {
    try {
      await api.patch(`/expenses/${id}/pay`)
      fetchExpenses()
      fetchSummary()
    } catch (error) {
      console.error('Ödeme işlenemedi:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      year: selectedYear,
      month: selectedMonth || new Date().getMonth() + 1,
      category: 'OFFICE',
      description: '',
      amount: '',
      vendor: '',
      invoiceNo: '',
      isPaid: false,
      dueDate: ''
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await api.get(`/expenses/export?year=${selectedYear}`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `giderler-${selectedYear}.xlsx`)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aylık Giderler</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Dernek gider takibi</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {exporting ? 'İndiriliyor...' : 'Excel İndir'}
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Gider
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          value={selectedMonth || ''}
          onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">Tüm Aylar</option>
          {months.map((month, idx) => (
            <option key={idx} value={idx + 1}>{month}</option>
          ))}
        </select>
      </div>

      {/* Özet Kartları */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Gider</p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Ödenen</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(summary.paidAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <TrendingDown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bekleyen</p>
                <p className="text-xl font-bold text-yellow-600">{formatCurrency(summary.pendingAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gider Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {expenses.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Gider kaydı bulunmuyor</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {expenses.map((expense) => {
              const Icon = categoryIcons[expense.category] || MoreHorizontal
              return (
                <div key={expense.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${categoryColors[expense.category]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">{expense.description}</h3>
                        {expense.isPaid ? (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                            Ödendi
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs">
                            Bekliyor
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>{months[expense.month - 1]} {expense.year}</span>
                        <span>{categoryLabels[expense.category]}</span>
                        {expense.vendor && <span>{expense.vendor}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</p>
                      {expense.invoiceNo && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{expense.invoiceNo}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {!expense.isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(expense.id)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Ödendi İşaretle"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingExpense ? 'Gideri Düzenle' : 'Yeni Gider Ekle'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yıl</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ay</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {months.map((month, idx) => (
                      <option key={idx} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Gider açıklaması"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tutar (TL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tedarikçi</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Firma adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fatura No</label>
                  <input
                    type="text"
                    value={formData.invoiceNo}
                    onChange={(e) => setFormData({...formData, invoiceNo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="FTR-001"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={formData.isPaid}
                  onChange={(e) => setFormData({...formData, isPaid: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="isPaid" className="text-sm text-gray-700 dark:text-gray-300">Ödendi</label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingExpense(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingExpense ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
