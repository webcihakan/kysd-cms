import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Monitor, Calendar, Building2, Package, ArrowRight,
  ChevronRight, Globe, Mail, Phone, Play, FileText, Eye
} from 'lucide-react'
import api from '../../utils/api'

export default function VirtualFairDetail() {
  const { slug } = useParams()
  const [fair, setFair] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFair()
  }, [slug])

  const fetchFair = async () => {
    try {
      const response = await api.get(`/virtual-fairs/slug/${slug}`)
      setFair(response.data)
    } catch (error) {
      console.error('Fuar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getFairStatus = () => {
    if (!fair) return null
    const now = new Date()
    const start = new Date(fair.startDate)
    const end = new Date(fair.endDate)

    if (now < start) return { text: 'Yaklaşan', color: 'bg-blue-500' }
    if (now > end) return { text: 'Sona Erdi', color: 'bg-gray-500' }
    return { text: 'Devam Ediyor', color: 'bg-green-500' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  if (!fair) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Fuar Bulunamadı</h2>
          <Link to="/sanal-fuarlar" className="text-purple-600 hover:underline">
            Tüm Fuarlara Dön
          </Link>
        </div>
      </div>
    )
  }

  const status = getFairStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        {fair.coverImage && (
          <div className="absolute inset-0">
            <img src={fair.coverImage} alt="" className="w-full h-full object-cover opacity-20" />
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-purple-200 mb-6">
            <Link to="/" className="hover:text-white">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/sanal-fuarlar" className="hover:text-white">Sanal Fuarlar</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{fair.title}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${status.color}`}>
                {status.text}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {fair.title}
            </h1>

            <p className="text-lg text-purple-100 mb-6 max-w-2xl">
              {fair.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-purple-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(fair.startDate)} - {formatDate(fair.endDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>{fair.booths?.length || 0} Katılımcı</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>{fair.boothTypes?.length || 0} Stant Türü</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stant Türleri */}
      {fair.boothTypes?.length > 0 && (
        <div className="container mx-auto px-4 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Stant Seçenekleri</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {fair.boothTypes.map((bt) => (
                <div key={bt.id} className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900">{bt.name}</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {parseFloat(bt.price).toLocaleString('tr-TR')} TL
                  </p>
                  {bt.description && (
                    <p className="text-sm text-gray-500 mt-2">{bt.description}</p>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    Maks. {bt.maxProducts} ürün
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                to={`/sanal-fuar-basvurusu/${fair.id}`}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                Stant Başvurusu Yap
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stantlar */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Katılımcı Firmalar ({fair.booths?.length || 0})
        </h2>

        {fair.booths?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz katılımcı firma bulunmuyor</p>
            <Link
              to={`/sanal-fuar-basvurusu/${fair.id}`}
              className="inline-flex items-center gap-2 text-purple-600 hover:underline mt-4"
            >
              İlk katılımcı olun
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fair.booths.map((booth) => (
              <Link
                key={booth.id}
                to={`/sanal-stant/${booth.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Banner/Logo */}
                <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                  {booth.bannerImage ? (
                    <img
                      src={booth.bannerImage}
                      alt={booth.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : booth.companyLogo ? (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <img
                        src={booth.companyLogo}
                        alt={booth.companyName}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gray-300" />
                    </div>
                  )}

                  {/* Stant Türü Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                      {booth.boothType?.name}
                    </span>
                  </div>

                  {/* İçerik İkonları */}
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    {booth.videoUrl && (
                      <span className="p-1.5 bg-white/90 rounded-full" title="Video">
                        <Play className="w-3 h-3 text-green-600" />
                      </span>
                    )}
                    {booth.catalogUrl && (
                      <span className="p-1.5 bg-white/90 rounded-full" title="Katalog">
                        <FileText className="w-3 h-3 text-orange-600" />
                      </span>
                    )}
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {booth.companyName}
                  </h3>

                  {booth.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {booth.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-500">
                      {booth.products?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {booth.products.length} ürün
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {booth.viewCount || 0}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siz de Yerinizi Alın
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Bu sanal fuarda firmanızı tanıtın, potansiyel müşterilerinize ulaşın.
          </p>
          <Link
            to={`/sanal-fuar-basvurusu/${fair.id}`}
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Stant Başvurusu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
