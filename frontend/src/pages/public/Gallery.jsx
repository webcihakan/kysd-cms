import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Image,
  Camera,
  Calendar,
  X,
  ChevronLeft,
  ZoomIn,
  LayoutGrid
} from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '')

const categories = [
  { id: 'all', name: 'Tumu' },
  { id: 'events', name: 'Etkinlikler' },
  { id: 'fairs', name: 'Fuarlar' },
  { id: 'meetings', name: 'Toplantilar' },
  { id: 'trainings', name: 'Egitimler' },
  { id: 'other', name: 'Diger' }
]

export default function Gallery() {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [albumImages, setAlbumImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [loadingAlbum, setLoadingAlbum] = useState(false)

  useEffect(() => {
    fetchGalleries()
  }, [selectedCategory])

  const fetchGalleries = async () => {
    try {
      setLoading(true)
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''
      const response = await api.get(`/galleries?limit=50${categoryParam}`)
      setGalleries(response.data.galleries || [])
    } catch (error) {
      console.error('Galeriler yuklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const getCoverImage = (gallery) => {
    if (gallery.coverImage) return getImageUrl(gallery.coverImage)
    if (gallery.images && gallery.images.length > 0) return getImageUrl(gallery.images[0].image)
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80'
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : categoryId
  }

  const openLightbox = async (gallery, index = 0) => {
    setLoadingAlbum(true)
    try {
      const response = await api.get(`/galleries/slug/${gallery.slug}`)
      const fullGallery = response.data
      setSelectedAlbum(fullGallery)
      setAlbumImages(fullGallery.images || [])
      setLightboxIndex(index)
      setShowLightbox(true)
    } catch (error) {
      console.error('Album yuklenemedi')
    } finally {
      setLoadingAlbum(false)
    }
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    setSelectedAlbum(null)
    setAlbumImages([])
  }

  const nextImage = () => {
    if (albumImages.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % albumImages.length)
    }
  }

  const prevImage = () => {
    if (albumImages.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + albumImages.length) % albumImages.length)
    }
  }

  // Stats
  const stats = {
    total: galleries.length,
    totalImages: galleries.reduce((acc, item) => acc + (item._count?.images || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Galeri</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Camera className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Fotograf Arsivi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Galeri
            </h1>
            <p className="text-lg text-primary-100">
              KYSD etkinliklerinden, fuarlardan ve toplantilardan kareler.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">Album</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Image className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalImages}</div>
                  <div className="text-sm text-gray-500">Fotograf</div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fotograf Bulunamadi</h3>
            <p className="text-gray-500 mb-4">Bu kategoride henuz fotograf bulunmuyor.</p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Tum Fotograflari Goster
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleries.map((gallery) => (
              <div
                key={gallery.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => openLightbox(gallery)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={getCoverImage(gallery)}
                    alt={gallery.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Image className="w-3.5 h-3.5" />
                    {gallery._count?.images || 0}
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {getCategoryName(gallery.category)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="text-gray-500 text-sm line-clamp-1 mb-2">{gallery.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(gallery.eventDate || gallery.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading Album Overlay */}
      {loadingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && selectedAlbum && albumImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white/70 text-sm z-50">
            {lightboxIndex + 1} / {albumImages.length}
          </div>

          {/* Album Title */}
          <div className="absolute bottom-4 left-4 right-4 text-center z-50">
            <h3 className="text-white font-bold text-lg">{selectedAlbum.title}</h3>
            {selectedAlbum.description && (
              <p className="text-white/60 text-sm">{selectedAlbum.description}</p>
            )}
          </div>

          {/* Navigation Buttons */}
          {albumImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="max-w-5xl max-h-[80vh] px-16">
            <img
              src={getImageUrl(albumImages[lightboxIndex]?.image)}
              alt={albumImages[lightboxIndex]?.title || selectedAlbum.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          {/* Thumbnail Strip */}
          {albumImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-50 max-w-[80vw] overflow-x-auto pb-2">
              {albumImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    lightboxIndex === idx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Etkinliklerimize Katilin
              </h2>
              <p className="text-primary-100">
                KYSD uyesi olarak tum etkinliklerimize katilabilirsiniz.
              </p>
            </div>
            <Link
              to="/uyelik-basvurusu"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Uye Ol
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
