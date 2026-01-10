import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

const statusConfig = {
  PENDING: { label: 'Ödeme Bekleniyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PAID: { label: 'Onay Bekleniyor', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  APPROVED: { label: 'Yayında', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800', icon: XCircle },
  EXPIRED: { label: 'Süresi Doldu', color: 'bg-gray-100 text-gray-800', icon: Clock }
}

export default function MyCatalogs() {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMyCatalogs()
  }, [])

  const fetchMyCatalogs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/catalogs/member/my-catalogs')
      setCatalogs(response.data)
    } catch (error) {
      console.error('Kataloglar yüklenemedi:', error)
      alert('Kataloglar yüklenemedi: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" katalogunu silmek istediğinize emin misiniz?`)) return

    try {
      await api.delete(`/catalogs/member/${id}`)
      alert('Katalog silindi')
      fetchMyCatalogs()
    } catch (error) {
      alert('Silme başarısız: ' + (error.response?.data?.error || error.message))
    }
  }

  const filteredCatalogs = activeTab === 'all'
    ? catalogs
    : catalogs.filter(c => c.status === activeTab)

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('tr-TR')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kataloglarım</h1>
          <p className="text-gray-600 mt-1">Ürün kataloglarınızı yönetin</p>
        </div>
        <Link
          to="/uye/katalog-ekle"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Yeni Katalog Ekle
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
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
          <div className="text-2xl font-bold text-blue-900">
            {catalogs.filter(c => c.status === 'PAID').length}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-700 text-sm mb-1">Yayında</div>
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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-4 px-6 overflow-x-auto">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'PENDING', label: 'Ödeme Bekleniyor' },
              { key: 'PAID', label: 'Onay Bekleniyor' },
              { key: 'APPROVED', label: 'Yayında' },
              { key: 'REJECTED', label: 'Reddedilen' },
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
      </div>

      {/* Catalogs Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredCatalogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Katalog Bulunamadı</h3>
          <p className="text-gray-500 mb-6">Henüz katalog eklememişsiniz. Hemen başlayın!</p>
          <Link
            to="/uye/katalog-ekle"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <Plus className="w-5 h-5" />
            İlk Kataloğunuzu Ekleyin
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalogs.map((catalog) => {
            const StatusIcon = statusConfig[catalog.status]?.icon || Clock
            return (
              <div key={catalog.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  {catalog.coverImage ? (
                    <img src={catalog.coverImage} alt={catalog.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-16 h-16 text-white/50" />
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{catalog.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[catalog.status]?.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[catalog.status]?.label}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Paket:</span>
                      <span className="font-medium">{catalog.package?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fiyat:</span>
                      <span className="font-semibold text-primary-600">{catalog.price} TL</span>
                    </div>
                    {catalog.startDate && (
                      <div className="flex items-center justify-between">
                        <span>Yayın:</span>
                        <span className="font-medium">{formatDate(catalog.startDate)} - {formatDate(catalog.endDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {catalog.status === 'PENDING' && (
                      <Link
                        to={`/uye/katalog-odeme/${catalog.id}`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <CreditCard className="w-4 h-4" />
                        Ödeme Yap
                      </Link>
                    )}
                    {catalog.status === 'APPROVED' && (
                      <Link
                        to={`/katalog/${catalog.slug}`}
                        target="_blank"
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Görüntüle
                      </Link>
                    )}
                    {catalog.status === 'REJECTED' && catalog.adminNotes && (
                      <div className="flex-1 text-xs text-red-600 bg-red-50 p-2 rounded">
                        <strong>Red Sebebi:</strong> {catalog.adminNotes}
                      </div>
                    )}
                    {(catalog.status === 'PENDING' || catalog.status === 'REJECTED') && (
                      <>
                        <Link
                          to={`/uye/katalog-duzenle/${catalog.id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(catalog.id, catalog.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
