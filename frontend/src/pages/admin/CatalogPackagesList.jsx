import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Plus, Edit, Trash2 } from 'lucide-react'
import api from '../../utils/api'

export default function CatalogPackagesList() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await api.get('/catalog-packages/admin/all')
      setPackages(response.data)
    } catch (error) {
      console.error('Paketler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" paketini silmek istediğinize emin misiniz?`)) return

    try {
      await api.delete(`/catalog-packages/admin/${id}`)
      alert('Paket silindi')
      fetchPackages()
    } catch (error) {
      alert('Silme başarısız: ' + (error.response?.data?.error || error.message))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Katalog Paketleri</h1>
          <p className="text-gray-600 text-sm mt-1">Fiyatlandırma paketlerini yönetin</p>
        </div>
        <Link
          to="/admin/katalog-paketleri/ekle"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yeni Paket
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paket Bulunamadı</h3>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Paket Adı
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Süre
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Fiyat
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Kullanım
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
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{pkg.name}</div>
                    {pkg.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">{pkg.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {pkg.duration} ay
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-primary-600">{pkg.price} TL</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {pkg._count?.catalogs || 0} katalog
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      pkg.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/katalog-paketleri/${pkg.id}`}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
