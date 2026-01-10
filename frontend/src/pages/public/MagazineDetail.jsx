import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  BookOpen, Download, Eye, Calendar, Building2, ChevronRight,
  FileText, Tag, ArrowLeft, Share2
} from 'lucide-react'
import api from '../../utils/api'

const categoryConfig = {
  general: { name: 'Genel', color: 'bg-blue-500' },
  industry: { name: 'Sanayi', color: 'bg-orange-500' },
  technology: { name: 'Teknoloji', color: 'bg-purple-500' },
  economy: { name: 'Ekonomi', color: 'bg-green-500' }
}

export default function MagazineDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [magazine, setMagazine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedMagazines, setRelatedMagazines] = useState([])

  useEffect(() => {
    fetchMagazine()
  }, [slug])

  const fetchMagazine = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/magazines/${slug}`)
      setMagazine(response.data)

      // İlgili dergileri getir (aynı kategori)
      if (response.data.category) {
        const relatedResponse = await api.get(`/magazines?category=${response.data.category}&limit=4`)
        setRelatedMagazines(
          relatedResponse.data.magazines.filter(m => m.id !== response.data.id).slice(0, 3)
        )
      }
    } catch (error) {
      console.error('Dergi yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!magazine) return

    try {
      await api.post(`/magazines/${magazine.id}/download`)

      // PDF indirme
      const link = document.createElement('a')
      link.href = magazine.pdfFile
      link.download = `${magazine.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('İndirme hatası:', error)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!magazine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dergi Bulunamadı</h2>
          <Link to="/dergiler" className="text-primary-600 hover:underline">
            Dergilere Dön
          </Link>
        </div>
      </div>
    )
  }

  const tags = magazine.tags ? magazine.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <Link to="/dergiler" className="text-primary-200 hover:text-white transition-colors">
              Dergiler
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium truncate">{magazine.title}</span>
          </nav>

          <button
            onClick={() => navigate('/dergiler')}
            className="flex items-center gap-2 text-white hover:text-primary-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Dergilere Dön</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Kapak ve Bilgiler */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-4">
              {/* Kapak Görseli */}
              <div className="relative aspect-[3/4]">
                {magazine.coverImage && magazine.coverImage.includes('http') ? (
                  <img
                    src={magazine.coverImage}
                    alt={magazine.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}

                {/* Fallback - Kategoriye göre renkli kapak */}
                <div
                  className={`w-full h-full flex flex-col items-center justify-center p-8 text-center ${
                    magazine.category === 'industry' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                    magazine.category === 'technology' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                    magazine.category === 'economy' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                    'bg-gradient-to-br from-blue-500 to-blue-700'
                  }`}
                  style={{ display: magazine.coverImage && magazine.coverImage.includes('http') ? 'none' : 'flex' }}
                >
                  <BookOpen className="w-20 h-20 text-white/80 mb-4" />
                  <h4 className="text-white font-bold text-xl line-clamp-4">
                    {magazine.title}
                  </h4>
                  {magazine.issueNumber && (
                    <p className="text-white/80 mt-3">
                      {magazine.issueNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Dergi Bilgileri */}
              <div className="p-6 space-y-4">
                {magazine.publisher && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Yayıncı</div>
                      <div className="font-medium text-gray-900">{magazine.publisher}</div>
                    </div>
                  </div>
                )}

                {magazine.publishDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Yayın Tarihi</div>
                      <div className="font-medium text-gray-900">{formatDate(magazine.publishDate)}</div>
                    </div>
                  </div>
                )}

                {magazine.pageCount && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Sayfa Sayısı</div>
                      <div className="font-medium text-gray-900">{magazine.pageCount} sayfa</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {magazine.viewCount} görüntülenme
                  </div>
                  {magazine.downloadCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {magazine.downloadCount}
                    </div>
                  )}
                </div>

                {/* İndir Butonu */}
                <button
                  onClick={handleDownload}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  PDF İndir
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Başlık ve Kategori */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  {magazine.category && (
                    <span className={`inline-flex ${categoryConfig[magazine.category]?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-semibold mb-3`}>
                      {categoryConfig[magazine.category]?.name || magazine.category}
                    </span>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {magazine.title}
                  </h1>
                  {magazine.issueNumber && (
                    <p className="text-lg text-gray-600">{magazine.issueNumber}</p>
                  )}
                </div>
              </div>

              {magazine.description && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{magazine.description}</p>
                </div>
              )}

              {/* Etiketler */}
              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-gray-100">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* PDF Görüntüleyici */}
            {magazine.pdfFile && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                  Dergi Önizleme
                </h2>
                <div className="aspect-[3/4] lg:aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <iframe
                    src={`${magazine.pdfFile}#toolbar=0`}
                    className="w-full h-full"
                    title={magazine.title}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  PDF tam ekran görüntüleme için üstteki "PDF İndir" butonunu kullanın
                </p>
              </div>
            )}

            {/* İlgili Dergiler */}
            {relatedMagazines.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">İlgili Dergiler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedMagazines.map((related) => (
                    <Link
                      key={related.id}
                      to={`/dergiler/${related.slug}`}
                      className="group"
                    >
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-2">
                        {related.coverImage ? (
                          <img
                            src={related.coverImage}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors text-sm">
                        {related.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
