import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Building2, Globe, Mail, Phone, FileText, Package,
  ChevronRight, ArrowLeft, Eye, Download, ExternalLink, Box, View
} from 'lucide-react'
import api from '../../utils/api'
import ARBoothViewer from '../../components/ar/ARBoothViewer'

export default function VirtualBoothDetail() {
  const { id } = useParams()
  const [booth, setBooth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    fetchBooth()
  }, [id])

  const fetchBooth = async () => {
    try {
      const response = await api.get(`/virtual-booths/${id}`)
      setBooth(response.data)
    } catch (error) {
      console.error('Stant yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  if (!booth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stant Bulunamadı</h2>
          <Link to="/sanal-fuarlar" className="text-purple-600 hover:underline">
            Sanal Fuarlara Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Banner Image */}
        <div className="h-64 md:h-80">
          {booth.bannerImage ? (
            <img
              src={booth.bannerImage}
              alt={booth.companyName}
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-700 to-indigo-800"></div>
          )}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-purple-200 mb-4">
              <Link to="/sanal-fuarlar" className="hover:text-white">Sanal Fuarlar</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/sanal-fuar/${booth.fair?.slug}`} className="hover:text-white">{booth.fair?.title}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{booth.companyName}</span>
            </nav>

            <div className="flex items-end gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl shadow-xl p-3 flex-shrink-0">
                {booth.companyLogo ? (
                  <img
                    src={booth.companyLogo}
                    alt={booth.companyName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                    {booth.boothType?.name}
                  </span>
                  <span className="flex items-center gap-1 text-purple-200 text-sm">
                    <Eye className="w-4 h-4" />
                    {booth.viewCount || 0} görüntülenme
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white truncate">
                  {booth.companyName}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 3D AR Stant Görünümü */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-500" />
                3D Sanal Stant
                <span className="ml-auto flex items-center gap-1 text-xs font-normal text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <View className="w-3 h-3" />
                  AR Destekli
                </span>
              </h2>
              <ARBoothViewer
                companyName={booth.companyName}
                posterUrl={booth.bannerImage}
              />
              <p className="text-sm text-gray-500 mt-4 text-center">
                Fare ile 360° döndürün • Mobil cihazlarda AR butonuna tıklayarak gerçek ortamda görüntüleyin
              </p>
            </div>

            {/* Açıklama */}
            {booth.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hakkında</h2>
                <p className="text-gray-600 whitespace-pre-line">{booth.description}</p>
              </div>
            )}

            
            {/* Ürünler */}
            {booth.products?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-500" />
                  Ürünler ({booth.products.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {booth.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-10 h-10 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm group-hover:text-purple-600">
                        {product.name}
                      </h3>
                      {product.price && (
                        <p className="text-sm text-green-600 font-medium">{product.price}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* İletişim */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">İletişim</h2>
              <div className="space-y-3">
                {booth.email && (
                  <a
                    href={`mailto:${booth.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-gray-700 group-hover:text-purple-600">{booth.email}</span>
                  </a>
                )}
                {booth.phone && (
                  <a
                    href={`tel:${booth.phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors group"
                  >
                    <Phone className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-gray-700 group-hover:text-purple-600">{booth.phone}</span>
                  </a>
                )}
                {booth.website && (
                  <a
                    href={booth.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors group"
                  >
                    <Globe className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-gray-700 group-hover:text-purple-600 truncate">Web Sitesi</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                )}
              </div>
            </div>

            {/* Katalog */}
            {booth.catalogUrl && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Katalog</h2>
                <a
                  href={booth.catalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Ürün Kataloğu</p>
                    <p className="text-sm text-gray-500">PDF İndir</p>
                  </div>
                  <Download className="w-5 h-5 text-orange-500" />
                </a>
              </div>
            )}

            {/* Fuar Bilgisi */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold mb-2">{booth.fair?.title}</h2>
              <p className="text-purple-100 text-sm mb-4">Bu stant yukarıdaki sanal fuarda yer almaktadır.</p>
              <Link
                to={`/sanal-fuar/${booth.fair?.slug}`}
                className="inline-flex items-center gap-2 text-sm text-white hover:underline"
              >
                Tüm Stantları Gör
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedProduct.image && (
              <div className="aspect-video bg-gray-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
              {selectedProduct.price && (
                <p className="text-xl text-green-600 font-semibold mb-4">{selectedProduct.price}</p>
              )}
              {selectedProduct.description && (
                <p className="text-gray-600">{selectedProduct.description}</p>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-6 w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
