import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Eye, ArrowLeft, Share2, ExternalLink, Newspaper, Tag, Clock } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'
import AdBanner from '../../components/common/AdBanner'
import '../../styles/NewsContent.css'

const API_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000'

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

export default function NewsDetail() {
  const { slug } = useParams()
  const [news, setNews] = useState(null)
  const [recentNews, setRecentNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    fetchNews()
    fetchRecentNews()
  }, [slug])

  // İçerik yüklendikten sonra inline style'ları temizle
  useEffect(() => {
    if (contentRef.current && news) {
      // Tüm elementlerdeki color ve font-size inline style'larını kaldır
      const elements = contentRef.current.querySelectorAll('*')
      elements.forEach(el => {
        el.style.removeProperty('color')
        el.style.removeProperty('font-size')
        el.style.removeProperty('font-weight')
      })
    }
  }, [news])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/news/slug/${slug}`)
      setNews(response.data)
      setError(null)
    } catch (error) {
      setError('Haber bulunamadı')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentNews = async () => {
    try {
      const response = await api.get('/news?limit=5')
      setRecentNews(response.data.news.filter(n => n.slug !== slug))
    } catch (error) {
      console.error('Son haberler yüklenemedi:', error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        url: window.location.href
      })
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link kopyalandı!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/haberler" className="btn-primary inline-block">
            Haberlere Dön
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(news.image)

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-primary-600">Ana Sayfa</Link>
            <span>/</span>
            <Link to="/haberler" className="hover:text-primary-600">Haberler</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{news.title}</span>
          </div>
          <Link
            to="/haberler"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm Haberlere Dön
          </Link>
        </div>
      </div>

      {/* Hero Image & Title */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(news.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {news.viewCount} görüntülenme
              </div>
              {news.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {news.category}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
              {news.title}
            </h1>

            {/* Featured Image */}
            {imageUrl && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
                <img
                  src={imageUrl}
                  alt={news.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    console.error('Resim yüklenemedi:', imageUrl)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              {/* Summary if exists */}
              {news.summary && (
                <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-600">
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    {news.summary}
                  </p>
                </div>
              )}

              {/* Article Content */}
              <style>{`
                .news-article-content h2 {
                  font-size: 1.875rem !important;
                  font-weight: 700 !important;
                  color: #111827 !important;
                  margin-top: 2rem !important;
                  margin-bottom: 1rem !important;
                  line-height: 1.3 !important;
                }
                .news-article-content h3 {
                  font-size: 1.5rem !important;
                  font-weight: 700 !important;
                  color: #1F2937 !important;
                  margin-top: 1.5rem !important;
                  margin-bottom: 0.75rem !important;
                  line-height: 1.4 !important;
                }
                .news-article-content h4 {
                  font-size: 1.25rem !important;
                  font-weight: 600 !important;
                  color: #1F2937 !important;
                  margin-top: 1.25rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .news-article-content p {
                  color: #4B5563 !important;
                  margin-bottom: 1.25rem !important;
                  line-height: 1.8 !important;
                  font-size: 1.125rem !important;
                }
                .news-article-content strong,
                .news-article-content b {
                  color: #111827 !important;
                  font-weight: 600 !important;
                }
                .news-article-content a {
                  color: #0052CC !important;
                  text-decoration: underline !important;
                  font-weight: 500 !important;
                }
                .news-article-content a:hover {
                  color: #0747A6 !important;
                }
                .news-article-content .btn,
                .news-article-content .btn-primary {
                  color: white !important;
                  text-decoration: none !important;
                  background-color: #0052CC !important;
                  padding: 0.5rem 1rem !important;
                  border-radius: 0.5rem !important;
                  display: inline-block !important;
                  font-weight: 600 !important;
                }
                .news-article-content .btn-primary:hover {
                  background-color: #0747A6 !important;
                  color: white !important;
                }
                .news-article-content ul,
                .news-article-content ol {
                  margin: 1.5rem 0 !important;
                  padding-left: 1.75rem !important;
                  color: #4B5563 !important;
                }
                .news-article-content ul {
                  list-style-type: disc !important;
                }
                .news-article-content ol {
                  list-style-type: decimal !important;
                }
                .news-article-content li {
                  color: #4B5563 !important;
                  margin: 0.5rem 0 !important;
                  line-height: 1.7 !important;
                }
                .news-article-content blockquote {
                  border-left: 4px solid #0052CC !important;
                  padding-left: 1.5rem !important;
                  margin: 2rem 0 !important;
                  font-style: italic !important;
                  color: #6B7280 !important;
                }
                .news-article-content img {
                  border-radius: 0.75rem !important;
                  margin: 2rem 0 !important;
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                  width: 100% !important;
                  height: auto !important;
                }
                .news-article-content table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  margin: 1.5rem 0 !important;
                }
                .news-article-content th,
                .news-article-content td {
                  border: 1px solid #E5E7EB !important;
                  padding: 0.75rem !important;
                  text-align: left !important;
                }
                .news-article-content th {
                  background-color: #F9FAFB !important;
                  font-weight: 600 !important;
                  color: #111827 !important;
                }
                .news-article-content td {
                  color: #4B5563 !important;
                }
              `}</style>
              <div
                ref={contentRef}
                className="news-article-content"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />

              {/* Source Info */}
              {(news.source || news.sourceUrl) && (
                <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
                        <Newspaper className="w-7 h-7 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Haber Kaynağı</h3>
                      {news.source && (
                        <p className="text-gray-700 font-medium mb-3">{news.source}</p>
                      )}
                      {news.sourceUrl && (
                        <a
                          href={news.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:text-blue-700 font-semibold rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-all group shadow-sm hover:shadow"
                        >
                          <span>Kaynağa Git</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Bu haberi paylaşın:</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                      >
                        <Share2 className="w-4 h-4" />
                        Paylaş
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Son güncelleme: {formatDate(news.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-4 space-y-6">
              {/* Ad Banners */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <AdBanner code="news-sidebar" />
              </div>

              {/* Recent News */}
              {recentNews.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-primary-600" />
                    Son Haberler
                  </h3>
                  <div className="space-y-4">
                    {recentNews.map((item) => {
                      const itemImageUrl = getImageUrl(item.image)
                      return (
                        <Link
                          key={item.id}
                          to={`/haber/${item.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            {itemImageUrl && (
                              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={itemImageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                  <Link
                    to="/haberler"
                    className="block text-center mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Tüm Haberleri Gör →
                  </Link>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm p-4">
                <AdBanner code="sidebar-square" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Ad */}
      <div className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <AdBanner code="above-footer" />
        </div>
      </div>
    </div>
  )
}
