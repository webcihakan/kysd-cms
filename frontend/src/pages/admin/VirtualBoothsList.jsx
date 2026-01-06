import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Package, Edit, Trash2, Eye, EyeOff, ArrowLeft, RefreshCw,
  Building2, Globe, Mail, Phone, Play, FileText
} from 'lucide-react'
import api from '../../utils/api'

export default function VirtualBoothsList() {
  const { fairId } = useParams()
  const [fair, setFair] = useState(null)
  const [booths, setBooths] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [fairId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [fairRes, boothsRes] = await Promise.all([
        api.get(`/virtual-fairs/admin/${fairId}`),
        api.get(`/virtual-booths/admin/fair/${fairId}`)
      ])
      setFair(fairRes.data)
      setBooths(boothsRes.data)
    } catch (error) {
      console.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (booth) => {
    try {
      const formData = new FormData()
      formData.append('companyName', booth.companyName)
      formData.append('description', booth.description || '')
      formData.append('website', booth.website || '')
      formData.append('email', booth.email || '')
      formData.append('phone', booth.phone || '')
      formData.append('videoUrl', booth.videoUrl || '')
      formData.append('isActive', !booth.isActive)
      formData.append('order', booth.order)

      await api.put(`/virtual-booths/${booth.id}`, formData)
      fetchData()
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  const deleteBooth = async (id, companyName) => {
    if (!confirm(`"${companyName}" stantını silmek istediğinize emin misiniz?`)) return

    try {
      await api.delete(`/virtual-booths/${id}`)
      fetchData()
    } catch (error) {
      alert('Stant silinemedi')
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/sanal-fuarlar"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Sanal Fuarlara Dön
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {fair?.title} - Stantlar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Fuar stantlarını yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
          <Link
            to={`/admin/sanal-fuarlar/${fairId}`}
            className="btn-secondary"
          >
            Fuar Ayarları
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{booths.length}</p>
              <p className="text-xs text-gray-500">Toplam Stant</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {booths.filter(b => b.isActive).length}
              </p>
              <p className="text-xs text-gray-500">Aktif Stant</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {booths.reduce((sum, b) => sum + (b.viewCount || 0), 0)}
              </p>
              <p className="text-xs text-gray-500">Toplam Görüntülenme</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {booths.reduce((sum, b) => sum + (b._count?.products || 0), 0)}
              </p>
              <p className="text-xs text-gray-500">Toplam Ürün</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {booths.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz stant yok</p>
            <p className="text-sm text-gray-400 mt-2">
              Stantlar, başvurular onaylandığında otomatik oluşturulur
            </p>
            <Link
              to="/admin/sanal-fuar-basvurulari"
              className="btn-primary mt-4 inline-block"
            >
              Başvuruları Görüntüle
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {booths.map((booth) => (
            <div
              key={booth.id}
              className={`card overflow-hidden ${!booth.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Logo */}
                <div className="md:w-40 h-32 md:h-auto bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                  {booth.companyLogo ? (
                    <img
                      src={booth.companyLogo}
                      alt={booth.companyName}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-300" />
                  )}
                </div>

                {/* İçerik */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {booth.companyName}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          {booth.boothType?.name}
                        </span>
                        {!booth.isActive && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                            Pasif
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {booth.description || 'Açıklama eklenmemiş'}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {booth.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{booth.email}</span>
                          </div>
                        )}
                        {booth.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{booth.phone}</span>
                          </div>
                        )}
                        {booth.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <a href={booth.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Web Sitesi
                            </a>
                          </div>
                        )}
                        {booth.videoUrl && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Play className="w-4 h-4" />
                            <span>Video</span>
                          </div>
                        )}
                        {booth.catalogUrl && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <FileText className="w-4 h-4" />
                            <span>Katalog</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{booth.viewCount || 0} görüntülenme</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{booth._count?.products || 0} ürün</span>
                        </div>
                      </div>
                    </div>

                    {/* Aksiyonlar */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleActive(booth)}
                        className={`p-2 rounded-lg transition-colors ${
                          booth.isActive
                            ? 'hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={booth.isActive ? 'Pasife Al' : 'Aktife Al'}
                      >
                        {booth.isActive ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <Link
                        to={`/admin/sanal-stant/${booth.id}`}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Link>
                      <button
                        onClick={() => deleteBooth(booth.id, booth.companyName)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
