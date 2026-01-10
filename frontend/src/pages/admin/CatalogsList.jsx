import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import api from '../../utils/api'

const statusConfig = {
  PENDING: { label: 'Ödeme Bekleniyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PAID: { label: 'Onay Bekleniyor', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  APPROVED: { label: 'Onaylandı', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800', icon: XCircle },
  EXPIRED: { label: 'Süresi Doldu', color: 'bg-gray-100 text-gray-800', icon: Clock }
}

const categoryConfig = {
  genel: 'Genel',
  tekstil: 'Tekstil',
  aksesuar: 'Aksesuar',
  makine: 'Makine',
  hammadde: 'Hammadde',
  diger: 'Diğer'
}

export default function CatalogsList() {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCatalogs()
  }, [activeTab])

  const fetchCatalogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ status: activeTab })
      const response = await api.get(`/catalogs/admin/all?${params}`)
      setCatalogs(response.data)
    } catch (error) {
      console.error('Kataloglar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCatalogs = catalogs.filter(catalog =>
    catalog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    catalog.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = catalogs.filter(c => c.status === 'PAID').length

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('tr-TR')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Katalog Yönetimi</h1>
          <p className="text-gray-600 text-sm mt-1">Üye kataloglarını görüntüleyin ve yönetin</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-gray-500 text-sm mb-1">Toplam</div>
          <div className="text-2xl font-bold text-gray-900">{catalogs.length}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-yellow-700 text-sm mb-1">Ödeme Bekleniyor</div>
          <div className="text-2xl font-bold text-yellow-900">
            {catalogs.filter(c => c.status === 'PENDING').length}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-700 text-sm mb-1">Onay Bekleniyor</div>
          <div className="text-2xl font-bold text-blue-900">{pendingCount}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-700 text-sm mb-1">Aktif</div>
          <div className="text-2xl font-bold text-green-900">
            {catalogs.filter(c => c.status === 'APPROVED').length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-700 text-sm mb-1">Reddedilen</div>
          <div className="text-2xl font-bold text-red-900">
            {catalogs.filter(c => c.status === 'REJECTED').length}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-4 px-6 overflow-x-auto">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'PENDING', label: 'Ödeme Bekleniyor' },
              { key: 'PAID', label: `Onay Bekleniyor ${pendingCount > 0 ? `(${pendingCount})` : ''}` },
              { key: 'APPROVED', label: 'Onaylananlar' },
              { key: 'REJECTED', label: 'Reddedilenler' },
              { key: 'EXPIRED', label: 'Süresi Dolanlar' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-primary-600 text-primary-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Katalog veya firma adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredCatalogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Katalog Bulunamadı</h3>
            <p className="text-gray-500">Henüz katalog başvurusu yapılmamış</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Katalog
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Firma
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Kategori
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Paket
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Tarih
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
              {filteredCatalogs.map((catalog) => {
                const StatusIcon = statusConfig[catalog.status]?.icon || Clock
                return (
                  <tr key={catalog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white/80" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{catalog.title}</div>
                          <div className="text-sm text-gray-500">{catalog.pageCount || 0} sayfa</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {catalog.companyName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {categoryConfig[catalog.category] || catalog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{catalog.package?.name}</div>
                        <div className="text-gray-500">{catalog.price} TL</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>{formatDate(catalog.startDate)}</div>
                      {catalog.endDate && (
                        <div className="text-gray-500 text-xs">{formatDate(catalog.endDate)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[catalog.status]?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[catalog.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/kataloglar/${catalog.id}`}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Görüntüle
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
