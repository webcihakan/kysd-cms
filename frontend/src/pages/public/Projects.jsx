import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Rocket, ChevronRight, Search, Calendar, Users, Target,
  CheckCircle2, Building2, Globe, ArrowRight, Briefcase,
  Lightbulb, MapPin, Play, BarChart3
} from 'lucide-react'
import api from '../../utils/api'
import AdBanner from '../../components/common/AdBanner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const categories = [
  { id: 'all', name: 'Tümü', icon: Briefcase },
  { id: 'ab-projesi', name: 'AB Projeleri', icon: Globe },
  { id: 'bakanlik-projesi', name: 'Bakanlık Projeleri', icon: Building2 },
  { id: 'istihdam-projesi', name: 'İstihdam Projeleri', icon: Users },
  { id: 'arge-projesi', name: 'Ar-Ge Projeleri', icon: Lightbulb },
  { id: 'ihracat-projesi', name: 'İhracat Projeleri', icon: Target }
]

const statusTypes = {
  'devam-ediyor': { label: 'Devam Ediyor', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  'planlanan': { label: 'Planlanan', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  'tamamlanan': { label: 'Tamamlanan', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' }
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data)
    } catch (error) {
      console.error('Projeler yuklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const filteredProjects = projects.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesStatus && matchesSearch
  }).sort((a, b) => {
    // Önce öne çıkan projeler
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1

    // Devam eden projeler önce
    const isOngoingA = a.status === 'devam-ediyor' || a.status === 'ongoing'
    const isOngoingB = b.status === 'devam-ediyor' || b.status === 'ongoing'
    if (isOngoingA && !isOngoingB) return -1
    if (!isOngoingA && isOngoingB) return 1

    // Planlanan projeler ikinci sırada
    const isPlannedA = a.status === 'planlanan' || a.status === 'planned'
    const isPlannedB = b.status === 'planlanan' || b.status === 'planned'
    if (isPlannedA && !isPlannedB) return -1
    if (!isPlannedA && isPlannedB) return 1

    // Tarihe göre sırala (yeni projeler üstte)
    const dateA = a.startDate ? new Date(a.startDate) : new Date(0)
    const dateB = b.startDate ? new Date(b.startDate) : new Date(0)
    return dateB - dateA
  })

  const featuredProjects = projects.filter(p => p.isFeatured)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
  }

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0]
  }

  const getCategoryColor = (categoryId) => {
    const colors = {
      'ab-projesi': 'bg-blue-500',
      'bakanlik-projesi': 'bg-green-500',
      'istihdam-projesi': 'bg-purple-500',
      'arge-projesi': 'bg-orange-500',
      'ihracat-projesi': 'bg-teal-500'
    }
    return colors[categoryId] || 'bg-gray-500'
  }

  const getCategoryBadge = (categoryId) => {
    const colors = {
      'ab-projesi': 'bg-blue-100 text-blue-700',
      'bakanlik-projesi': 'bg-green-100 text-green-700',
      'istihdam-projesi': 'bg-purple-100 text-purple-700',
      'arge-projesi': 'bg-orange-100 text-orange-700',
      'ihracat-projesi': 'bg-teal-100 text-teal-700'
    }
    return colors[categoryId] || 'bg-gray-100 text-gray-700'
  }

  const stats = {
    total: projects.length,
    ongoing: projects.filter(p => p.status === 'devam-ediyor').length,
    completed: projects.filter(p => p.status === 'tamamlanan').length,
    planned: projects.filter(p => p.status === 'planlanan').length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Projeler</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Rocket className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Sektörel Gelişim</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Projeler</h1>
            <p className="text-lg text-primary-100">
              KYSD'nin yürüttüğü ve ortak olduğu ulusal ve uluslararası projeler.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Toplam Proje</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.ongoing}</div>
              <div className="text-sm text-gray-500">Devam Eden</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
              <div className="text-sm text-gray-500">Tamamlanan</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.planned}</div>
              <div className="text-sm text-gray-500">Planlanan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Öne Çıkan Projeler</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredProjects.slice(0, 2).map((project) => {
              const catInfo = getCategoryInfo(project.category)
              const status = statusTypes[project.status] || statusTypes['devam-ediyor']
              return (
                <div
                  key={project.id}
                  className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-6 shadow-xl text-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <catInfo.icon className="w-3 h-3" />
                        {catInfo.name}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {project.status === 'devam-ediyor' && project.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white/70">İlerleme</span>
                        <span className="font-medium">%{project.progress}</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-white/70 text-sm mb-4">
                    {project.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(project.startDate)}
                      </span>
                    )}
                    {project.funder && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {project.funder}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    {project.budget && <div className="text-2xl font-bold text-accent-400">{project.budget}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Proje Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Proje adı..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Kategori</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Durum</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      selectedStatus === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="text-sm font-medium">Tümü</span>
                  </button>
                  {Object.entries(statusTypes).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStatus(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        selectedStatus === key ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${value.dot}`}></span>
                      <span className="text-sm font-medium">{value.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProjects.length}</span> proje bulundu
              </p>
              {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedStatus('all')
                    setSearchTerm('')
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const catInfo = getCategoryInfo(project.category)
                const status = statusTypes[project.status] || statusTypes['devam-ediyor']

                return (
                  <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className={`${getCategoryColor(project.category)} h-1.5`}></div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryBadge(project.category)}`}>
                          {catInfo.name}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                          {status.label}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>

                      {project.status === 'devam-ediyor' && project.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">Proje İlerlemesi</span>
                            <span className="font-semibold text-primary-600">%{project.progress}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${getCategoryColor(project.category)} rounded-full`} style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {project.startDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(project.startDate)}</span>
                          </div>
                        )}
                        {project.funder && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Building2 className="w-4 h-4" />
                            <span className="truncate">{project.funder}</span>
                          </div>
                        )}
                        {project.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{project.location}</span>
                          </div>
                        )}
                        {project.beneficiaries && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{project.beneficiaries} faydalanan</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {project.budget && <div className="text-2xl font-bold text-primary-600">{project.budget}</div>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Proje Bulunamadı</h3>
                <p className="text-gray-500 mb-4">Arama kriterlerinize uygun proje bulunamadı.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedStatus('all')
                    setSearchTerm('')
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reklam Alanı */}
      <div className="container mx-auto px-4 py-8">
        <AdBanner code="content-wide" />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Proje Ortaklığı</h2>
              <p className="text-primary-100">Sektörel projelerimize ortak olmak için iletişime geçin.</p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Proje Teklifi
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
