import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Phone, Mail, Globe, MapPin, Search, Filter, Users,
  ChevronDown, X, Factory, ExternalLink, ArrowRight, List, LayoutGrid,
  SortAsc, ChevronRight as ChevronRightIcon
} from 'lucide-react'
import api from '../../utils/api'
import { toTitleCase } from '../../utils/helpers'

export default function Members() {
  const [groups, setGroups] = useState([])
  const [allMembers, setAllMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await api.get('/industry-groups')
      setGroups(response.data)

      const members = []
      response.data.forEach(group => {
        if (group.members) {
          group.members.forEach(member => {
            members.push({
              ...member,
              groupName: toTitleCase(group.name),
              groupSlug: group.slug
            })
          })
        }
      })
      setAllMembers(members)
    } catch (error) {
      console.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = useMemo(() => {
    let filtered = allMembers.filter(member => {
      const matchesSearch =
        member.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.contactPerson && member.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesGroup = !selectedGroup || member.groupSlug === selectedGroup

      return matchesSearch && matchesGroup
    })

    // Sıralama
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.companyName.localeCompare(b.companyName, 'tr'))
    } else if (sortBy === 'group') {
      filtered.sort((a, b) => a.groupName.localeCompare(b.groupName, 'tr'))
    }

    return filtered
  }, [allMembers, searchTerm, selectedGroup, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedGroup('')
  }

  const hasActiveFilters = searchTerm || selectedGroup

  // Grup bazlı üye sayısı
  const getGroupMemberCount = (slug) => {
    return allMembers.filter(m => m.groupSlug === slug).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Üye Rehberi</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">KYSD Üye Rehberi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Üye Firmalar
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl mb-8">
              Konfeksiyon yan sanayi sektöründe faaliyet gösteren tüm üye firmalarımızı
              arayabilir ve iletişim bilgilerine ulaşabilirsiniz.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{allMembers.length}</div>
                  <div className="text-primary-200 text-xs">Üye Firma</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
                <div className="w-10 h-10 bg-accent-500/30 rounded-lg flex items-center justify-center">
                  <Factory className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-400">{groups.length}</div>
                  <div className="text-primary-200 text-xs">Sanayi Grubu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary-500" />
                  Firma Ara
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Firma adı yazın..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Industry Groups */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Factory className="w-5 h-5 text-primary-500" />
                  Sanayi Grupları
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedGroup('')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      !selectedGroup
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Tüm Gruplar</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      !selectedGroup ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {allMembers.length}
                    </span>
                  </button>
                  {groups.map(group => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedGroup === group.slug
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate pr-2">{toTitleCase(group.name)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        selectedGroup === group.slug ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getGroupMemberCount(group.slug)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">Üye Olmak İster misiniz?</h3>
                <p className="text-white/80 text-sm mb-4">
                  KYSD ailesine katılın, sektörün gücünden yararlanın.
                </p>
                <Link
                  to="/uyelik-basvurusu"
                  className="inline-flex items-center gap-2 bg-white text-accent-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Başvuru Yap
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-500">Üyeler yükleniyor...</p>
              </div>
            ) : (
              <>
                {/* Toolbar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">{filteredMembers.length}</span> firma
                        {hasActiveFilters && ` (${allMembers.length} toplam)`}
                      </span>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                          Filtreleri Temizle
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Sort */}
                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4 text-gray-400" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="text-sm border-0 bg-transparent text-gray-600 focus:ring-0 cursor-pointer"
                        >
                          <option value="name">İsme Göre</option>
                          <option value="group">Gruba Göre</option>
                        </select>
                      </div>

                      {/* View Toggle */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-md transition-colors ${
                            viewMode === 'grid'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-md transition-colors ${
                            viewMode === 'list'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Members Grid/List */}
                {filteredMembers.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300"
                        >
                          <div className="h-1.5 bg-gradient-to-r from-primary-600 to-primary-400"></div>
                          <div className="p-5">
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                              {member.logo ? (
                                <img
                                  src={member.logo}
                                  alt={member.companyName}
                                  className="w-12 h-12 object-contain rounded-xl border border-gray-100 p-1 bg-white flex-shrink-0 group-hover:scale-110 transition-transform"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                  <Building2 className="w-6 h-6 text-primary-500" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-sm leading-tight">
                                  {member.companyName}
                                </h3>
                                <Link
                                  to={`/sanayi-grubu/${member.groupSlug}`}
                                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-1"
                                >
                                  <Factory className="w-3 h-3" />
                                  <span className="truncate">{member.groupName}</span>
                                </Link>
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 pt-4 border-t border-gray-100">
                              {member.phone && (
                                <a
                                  href={`tel:${member.phone}`}
                                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                                  </div>
                                  <span className="truncate">{member.phone}</span>
                                </a>
                              )}
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                  <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                                  </div>
                                  <span className="truncate">{member.email}</span>
                                </a>
                              )}
                              {member.website && (
                                <a
                                  href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                  <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Globe className="w-3.5 h-3.5 text-purple-500" />
                                  </div>
                                  <span>Web Sitesi</span>
                                  <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                                </a>
                              )}
                              {!member.phone && !member.email && !member.website && (
                                <p className="text-sm text-gray-400 italic">İletişim bilgisi bulunmuyor</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                        <div className="col-span-5">Firma</div>
                        <div className="col-span-3">İletişim</div>
                        <div className="col-span-3">Sanayi Grubu</div>
                        <div className="col-span-1">Web</div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {filteredMembers.map((member) => (
                          <div
                            key={member.id}
                            className="group grid md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="md:col-span-5 flex items-center gap-3">
                              {member.logo ? (
                                <img
                                  src={member.logo}
                                  alt={member.companyName}
                                  className="w-10 h-10 object-contain rounded-lg border border-gray-100 p-1 bg-white flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Building2 className="w-5 h-5 text-primary-500" />
                                </div>
                              )}
                              <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                                {member.companyName}
                              </span>
                            </div>
                            <div className="md:col-span-3 flex flex-col justify-center gap-1">
                              {member.phone && (
                                <a href={`tel:${member.phone}`} className="text-sm text-gray-600 hover:text-primary-600 flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5" />
                                  {member.phone}
                                </a>
                              )}
                              {member.email && (
                                <a href={`mailto:${member.email}`} className="text-sm text-gray-600 hover:text-primary-600 flex items-center gap-1 truncate">
                                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate">{member.email}</span>
                                </a>
                              )}
                            </div>
                            <div className="md:col-span-3 flex items-center">
                              <Link
                                to={`/sanayi-grubu/${member.groupSlug}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium hover:bg-primary-100 transition-colors"
                              >
                                <Factory className="w-3 h-3" />
                                <span className="truncate max-w-[120px]">{member.groupName}</span>
                              </Link>
                            </div>
                            <div className="md:col-span-1 flex items-center">
                              {member.website && (
                                <a
                                  href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Sonuç Bulunamadı</h3>
                    <p className="text-gray-500 mb-6">
                      {hasActiveFilters
                        ? 'Arama kriterlerinize uygun üye bulunamadı.'
                        : 'Henüz üye firma bulunmuyor.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Filtreleri Temizle
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
