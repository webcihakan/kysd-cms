import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, ArrowLeft, Share2, Pin } from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

export default function AnnouncementDetail() {
  const { slug } = useParams()
  const [announcement, setAnnouncement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnnouncement()
  }, [slug])

  const fetchAnnouncement = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/announcements/slug/${slug}`)
      setAnnouncement(response.data)
      setError(null)
    } catch (error) {
      setError('Duyuru bulunamadı')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
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
          <Link to="/duyurular" className="btn-primary mt-4 inline-block">
            Duyurulara Dön
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
            to="/duyurular"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Duyurulara Dön
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{announcement.title}</h1>
            {announcement.isPinned && (
              <span className="px-3 py-1 bg-accent-500 text-white text-sm rounded-full font-medium inline-flex items-center gap-1">
                <Pin className="w-4 h-4" />
                Sabitlenmiş
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4 text-primary-200 text-sm">
            <Calendar className="w-4 h-4" />
            {formatDate(announcement.createdAt)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {announcement.image && (
            <img
              src={announcement.image}
              alt={announcement.title}
              className="w-full h-auto rounded-xl mb-8"
            />
          )}

          <article
            className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-primary-600"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />

          {/* Share */}
          <div className="mt-8 pt-8 border-t flex items-center justify-between">
            <span className="text-gray-500">Bu duyuruyu paylaş:</span>
            <button
              onClick={handleShare}
              className="btn-outline flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Paylaş
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
