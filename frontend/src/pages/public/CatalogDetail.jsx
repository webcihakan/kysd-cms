import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Download, Eye, Building2, Phone, Mail,
  Globe, FileText, ChevronRight, ExternalLink, BookOpen
} from 'lucide-react'
import api from '../../utils/api'

const categoryConfig = {
  genel: { name: 'Genel', color: 'bg-blue-500', icon: '📄' },
  tekstil: { name: 'Tekstil Ürünleri', color: 'bg-purple-500', icon: '🧵' },
  aksesuar: { name: 'Aksesuar', color: 'bg-pink-500', icon: '👔' },
  makine: { name: 'Makine & Ekipman', color: 'bg-orange-500', icon: '⚙️' },
  hammadde: { name: 'Hammadde', color: 'bg-green-500', icon: '🏭' },
  diger: { name: 'Diğer', color: 'bg-gray-500', icon: '📦' }
}

export default function CatalogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCatalog()
  }, [slug])

  const fetchCatalog = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/catalogs/${slug}`)
      setCatalog(response.data)
    } catch (error) {
      console.error('Katalog yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!catalog) return

    // İndirme sayısını artır
    try {
      await api.post(`/catalogs/${catalog.id}/download`)
    } catch (error) {
      console.error('İndirme kaydedilemedi:', error)
    }

    // PDF'i aç
    window.open(catalog.pdfFile, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Katalog Bulunamadı</h2>
          <Link to="/katalog" className="text-primary-600 hover:underline">
            Kataloglara Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-800 py-8">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <Link to="/katalog" className="text-primary-200 hover:text-white transition-colors">
              Katalog
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium truncate">{catalog.title}</span>
          </nav>

          <button
            onClick={() => navigate('/katalog')}
            className="flex items-center gap-2 text-white hover:text-primary-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kataloglara Dön</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-white">{catalog.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol - Bilgiler */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-4">
              {/* Kapak */}
              <div className="relative aspect-[3/4]">
                {catalog.coverImage && catalog.coverImage.includes('http') ? (
                  <img
                    src={catalog.coverImage}
                    alt={catalog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}

                <div
                  className={`w-full h-full flex flex-col items-center justify-center p-8 text-center ${
                    catalog.category === 'tekstil' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                    catalog.category === 'aksesuar' ? 'bg-gradient-to-br from-pink-500 to-pink-700' :
                    catalog.category === 'makine' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                    catalog.category === 'hammadde' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                    'bg-gradient-to-br from-blue-500 to-blue-700'
                  }`}
                  style={{ display: catalog.coverImage && catalog.coverImage.includes('http') ? 'none' : 'flex' }}
                >
                  <BookOpen className="w-20 h-20 text-white/80 mb-4" />
                  <h4 className="text-white font-bold text-xl line-clamp-4">
                    {catalog.title}
                  </h4>
                  {catalog.pageCount && (
                    <p className="text-white/80 mt-3">
                      {catalog.pageCount} sayfa
                    </p>
                  )}
                </div>
              </div>

              {/* Firma Bilgileri */}
              <div className="p-6 space-y-4">
                <div>
                  <div className={`inline-flex items-center gap-2 ${categoryConfig[catalog.category]?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-semibold mb-4`}>
                    <span>{categoryConfig[catalog.category]?.icon}</span>
                    <span>{categoryConfig[catalog.category]?.name || catalog.category}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Firma</div>
                    <div className="font-semibold text-gray-900">{catalog.companyName}</div>
                  </div>
                </div>

                {catalog.contactPerson && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-gray-400">👤</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Yetkili</div>
                      <div className="text-gray-900">{catalog.contactPerson}</div>
                    </div>
                  </div>
                )}

                {catalog.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Telefon</div>
                      <a href={`tel:${catalog.phone}`} className="text-primary-600 hover:text-primary-700">
                        {catalog.phone}
                      </a>
                    </div>
                  </div>
                )}

                {catalog.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">E-posta</div>
                      <a href={`mailto:${catalog.email}`} className="text-primary-600 hover:text-primary-700 break-all">
                        {catalog.email}
                      </a>
                    </div>
                  </div>
                )}

                {catalog.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Website</div>
                      <a
                        href={catalog.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 flex items-center gap-1 break-all"
                      >
                        {catalog.website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* İstatistikler */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{catalog.viewCount}</div>
                      <div className="text-xs text-gray-500">Görüntülenme</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                        <Download className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{catalog.downloadCount}</div>
                      <div className="text-xs text-gray-500">İndirme</div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  PDF İndir
                </button>
              </div>
            </div>
          </div>

          {/* Sağ - PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Katalog Önizleme</h2>

              {catalog.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{catalog.description}</p>
                </div>
              )}

              {/* PDF Viewer */}
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`${catalog.pdfFile}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full"
                  title={catalog.title}
                />
              </div>

              {catalog.pageCount && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  {catalog.pageCount} sayfa
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
