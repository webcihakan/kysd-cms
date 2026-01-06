import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Eye, ArrowLeft, Share2 } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'
import AdBanner from '../../components/common/AdBanner'

export default function NewsDetail() {
  const { slug } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [slug])

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        url: window.location.href
      })
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
          <p className="text-gray-600">{error}</p>
          <Link to="/haberler" className="btn-primary mt-4 inline-block">
            Haberlere Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-primary-800 py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/haberler"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Haberlere Dön
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{news.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-primary-200 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(news.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {news.viewCount} görüntülenme
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {news.image && (
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-auto rounded-xl mb-8"
            />
          )}

          <article
            className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-primary-600"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Share */}
          <div className="mt-8 pt-8 border-t flex items-center justify-between">
            <span className="text-gray-500">Bu haberi paylaş:</span>
            <button
              onClick={handleShare}
              className="btn-outline flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Paylaş
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <AdBanner code="news-sidebar" />
          <AdBanner code="sidebar-square" />
        </div>
        </div>
      </div>

      {/* Footer Üstü Reklam */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdBanner code="above-footer" />
        </div>
      </div>
    </div>
  )
}
