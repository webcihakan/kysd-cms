import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2, Phone, Mail, Globe, MapPin, Users, ChevronRight, Search, Factory, ExternalLink } from 'lucide-react'
import api from '../../utils/api'
import { toTitleCase } from '../../utils/helpers'

export default function IndustryGroupDetail() {
  const { slug } = useParams()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchGroup()
  }, [slug])

  const fetchGroup = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/industry-groups/slug/${slug}`)
      setGroup(response.data)
      setError(null)
    } catch (error) {
      setError('Sanayi grubu bulunamadı')
    } finally {
      setLoading(false)
    }
  }

  // Uyeleri A-Z sirala ve filtrele
  const filteredMembers = (group?.members || [])
    .filter(member =>
      member.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.contactPerson && member.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.companyName.localeCompare(b.companyName, 'tr', { sensitivity: 'base' }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Factory className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-5xl font-bold text-gray-200 mb-4">404</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/sanayi-gruplari" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Sanayi Gruplarına Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12 md:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <Link to="/sanayi-gruplari" className="text-primary-200 hover:text-white transition-colors">
              Sanayi Grupları
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">{toTitleCase(group.name)}</span>
          </nav>

          {/* Back Button */}
          <Link
            to="/sanayi-gruplari"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Tüm Sanayi Grupları</span>
          </Link>

          {/* Title */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Building2 className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Sanayi Grubu</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {toTitleCase(group.name)}
            </h1>
            {group.description && (
              <p className="text-lg text-primary-100 max-w-2xl">
                {group.description}
              </p>
            )}

            {/* Stats Badge */}
            <div className="inline-flex items-center gap-2 mt-6 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
              <Users className="w-5 h-5 text-accent-400" />
              <span className="text-white font-semibold">{group.members?.length || 0}</span>
              <span className="text-primary-200">Üye Firma</span>
            </div>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {group.members && group.members.length > 0 ? (
          <>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Firma veya yetkili ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{filteredMembers.length}</span>
                  <span>firma listeleniyor</span>
                </div>
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-5">
                      {member.logo ? (
                        <img
                          src={member.logo}
                          alt={member.companyName}
                          className="w-16 h-16 object-contain rounded-xl border border-gray-100 p-1 bg-white"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-8 h-8 text-primary-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
                          {member.companyName}
                        </h3>
                        {member.contactPerson && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                            {member.contactPerson}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {member.description && (
                      <p className="text-sm text-gray-600 mb-5 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                        {member.description}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-3">
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group/item"
                        >
                          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
                            <Phone className="w-4 h-4 text-blue-500" />
                          </div>
                          <span>{member.phone}</span>
                        </a>
                      )}

                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group/item"
                        >
                          <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center group-hover/item:bg-emerald-100 transition-colors">
                            <Mail className="w-4 h-4 text-emerald-500" />
                          </div>
                          <span className="truncate">{member.email}</span>
                        </a>
                      )}

                      {member.website && (
                        <a
                          href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group/item"
                        >
                          <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center group-hover/item:bg-purple-100 transition-colors">
                            <Globe className="w-4 h-4 text-purple-500" />
                          </div>
                          <span className="flex items-center gap-1">
                            Web Sitesi
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </a>
                      )}

                      {member.address && (
                        <div className="flex items-start gap-3 text-sm text-gray-600">
                          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-amber-500" />
                          </div>
                          <span className="line-clamp-2">{member.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredMembers.length === 0 && searchTerm && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-500">"{searchTerm}" için sonuç bulunamadı.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Aramayı Temizle
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz Üye Firma Bulunmuyor</h3>
            <p className="text-gray-500 mb-6">Bu grupta henüz üye firma eklenmemiştir.</p>
            <Link
              to="/sanayi-gruplari"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Diğer Sanayi Gruplarını İncele
            </Link>
          </div>
        )}
      </div>

      {/* Other Groups Section */}
      <div className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Diğer Sanayi Gruplarını Keşfedin</h3>
          <p className="text-gray-500 mb-6">KYSD bünyesinde yer alan tüm sanayi gruplarını inceleyebilirsiniz.</p>
          <Link
            to="/sanayi-gruplari"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
          >
            Tüm Sanayi Grupları
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
