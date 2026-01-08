import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Phone, Globe, Clock, X, ChevronLeft, ChevronRight, Landmark, Church, UtensilsCrossed, ShoppingBag, Navigation } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Kategori renkleri ve iconları
const categoryConfig = {
  historical: {
    label: 'Tarihi Yerler & Müzeler',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Landmark
  },
  religious: {
    label: 'Dini Yapılar',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Church
  },
  restaurant: {
    label: 'Restoranlar & Kafeler',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: UtensilsCrossed
  },
  shopping: {
    label: 'Alışveriş & Oteller',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: ShoppingBag
  }
}

export default function TravelGuide() {
  const [searchParams] = useSearchParams()
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [guides, setGuides] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    fetchCountries()
    // URL'den country parametresini al
    const countryParam = searchParams.get('country')
    if (countryParam) {
      setSelectedCountry(decodeURIComponent(countryParam))
    }
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      fetchGuides()
    }
  }, [selectedCountry, selectedCategory])

  const fetchCountries = async () => {
    try {
      const response = await api.get('/travel-guides/countries')
      setCountries(response.data)
      // İlk açılışta tüm ülkeleri göster
      fetchAllGuides()
    } catch (error) {
      console.error('Ülkeler yüklenemedi:', error)
    }
  }

  const fetchGuides = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedCategory) params.category = selectedCategory

      let response
      if (selectedCountry) {
        response = await api.get(`/travel-guides/country/${selectedCountry}`, { params })
      } else {
        // Tüm ülkeleri getir
        response = await api.get('/travel-guides/all', { params })
      }
      setGuides(response.data)
    } catch (error) {
      console.error('Rehberler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllGuides = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedCategory) params.category = selectedCategory
      const response = await api.get('/travel-guides/all', { params })
      setGuides(response.data)
    } catch (error) {
      console.error('Tüm rehberler yüklenemedi:', error)
      setGuides([])
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return '/images/placeholder.jpg'
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openLightbox = (guide, index) => {
    setLightboxImage(guide)
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    setLightboxIndex(0)
  }

  const nextImage = () => {
    if (lightboxImage && lightboxIndex < lightboxImage.images.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  const prevImage = () => {
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tur Rehberi</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            Fuar düzenlenen ülkelerdeki gezilecek yerler, restoranlar ve önemli noktalar
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 space-y-6">
              {/* Ülke Seçici */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ülke Seçin
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Tüm Ülkeler</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Arama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ara
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Yer adı, şehir..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Kategori Filtreleri */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Kategoriler
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedCategory === ''
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">Tümü</span>
                  </button>
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedCategory === key
                            ? config.color + ' border-current'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{config.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sonuç Sayısı */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-semibold text-primary-600">{filteredGuides.length}</span> sonuç bulundu
                </p>
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'Arama kriterlerinize uygun yer bulunamadı'
                    : 'Bu ülke için henüz rehber eklenmemiş'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGuides.map((guide) => {
                  const config = categoryConfig[guide.category] || {}
                  const Icon = config.icon || MapPin
                  const coverImage = guide.images?.[0]?.image || null

                  return (
                    <div
                      key={guide.id}
                      onClick={() => setSelectedGuide(guide)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                    >
                      {/* Resim */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {coverImage ? (
                          <img
                            src={getImageUrl(coverImage)}
                            alt={guide.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Icon className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        {/* Kategori Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color} border-2`}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                      </div>

                      {/* İçerik */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                          {guide.name}
                        </h3>
                        {guide.city && (
                          <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {guide.city}, {guide.country}
                          </p>
                        )}
                        {guide.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {guide.description}
                          </p>
                        )}

                        {/* Bilgi İkonları */}
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {guide.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              Telefon
                            </span>
                          )}
                          {guide.website && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              Website
                            </span>
                          )}
                          {guide.openingHours && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Açılış Saatleri
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detay Modal */}
      {selectedGuide && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedGuide(null)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-800">{selectedGuide.name}</h2>
              <button
                onClick={() => setSelectedGuide(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* İçerik */}
            <div className="p-6">
              {/* Resim Galerisi */}
              {selectedGuide.images && selectedGuide.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2">
                    {selectedGuide.images.slice(0, 3).map((image, index) => (
                      <div
                        key={image.id}
                        onClick={() => openLightbox(selectedGuide, index)}
                        className="relative h-40 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={getImageUrl(image.image)}
                          alt={image.title || selectedGuide.name}
                          className="w-full h-full object-cover"
                        />
                        {index === 2 && selectedGuide.images.length > 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              +{selectedGuide.images.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kategori ve Konum */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedGuide.category && (() => {
                  const config = categoryConfig[selectedGuide.category] || {}
                  const CategoryIcon = config.icon || MapPin
                  return (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color} border-2`}>
                      <CategoryIcon className="w-4 h-4" />
                      {config.label}
                    </span>
                  )
                })()}
              </div>

              {/* Açıklama */}
              {selectedGuide.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Açıklama</h3>
                  <p className="text-gray-600 whitespace-pre-line">{selectedGuide.description}</p>
                </div>
              )}

              {/* İletişim Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedGuide.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Adres</p>
                      <p className="text-sm text-gray-600">{selectedGuide.address}</p>
                    </div>
                  </div>
                )}
                {selectedGuide.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Telefon</p>
                      <a href={`tel:${selectedGuide.phone}`} className="text-sm text-primary-600 hover:underline">
                        {selectedGuide.phone}
                      </a>
                    </div>
                  </div>
                )}
                {selectedGuide.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Website</p>
                      <a
                        href={selectedGuide.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline break-all"
                      >
                        {selectedGuide.website}
                      </a>
                    </div>
                  </div>
                )}
                {selectedGuide.openingHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Açılış Saatleri</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{selectedGuide.openingHours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Yol Tarifi Butonu */}
              {(selectedGuide.latitude && selectedGuide.longitude) || selectedGuide.address ? (
                <div className="mb-6">
                  <a
                    href={
                      selectedGuide.latitude && selectedGuide.longitude
                        ? `https://www.google.com/maps/dir/?api=1&destination=${selectedGuide.latitude},${selectedGuide.longitude}`
                        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedGuide.address)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Navigation className="w-5 h-5" />
                    Yol Tarifi Al
                  </a>
                </div>
              ) : null}

              {/* Google Maps */}
              {selectedGuide.googleMapsEmbed && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Konum</h3>
                  <div
                    className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: selectedGuide.googleMapsEmbed }}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Lightbox */}
      {lightboxImage && lightboxImage.images && (
        <>
          <div
            className="fixed inset-0 bg-black/90 z-[60]"
            onClick={closeLightbox}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            {lightboxIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            {lightboxIndex < lightboxImage.images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image */}
            <div className="max-w-6xl max-h-full flex flex-col items-center">
              <img
                src={getImageUrl(lightboxImage.images[lightboxIndex].image)}
                alt={lightboxImage.images[lightboxIndex].title || lightboxImage.name}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              {lightboxImage.images[lightboxIndex].title && (
                <p className="text-white text-center mt-4 text-lg font-medium">
                  {lightboxImage.images[lightboxIndex].title}
                </p>
              )}
              <p className="text-white/60 text-sm mt-2">
                {lightboxIndex + 1} / {lightboxImage.images.length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
