import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Edit, Trash2, Eye, Search, Filter,
  FileText, Building2, Users, BookOpen, Scale,
  GraduationCap, Calendar, FolderOpen, Shield,
  ExternalLink, ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

// Sayfa kategorileri ve URL eşlemeleri
const PAGE_CATEGORIES = {
  kurumsal: {
    label: 'Kurumsal',
    icon: Building2,
    color: 'bg-blue-100 text-blue-700',
    slugs: ['hakkimizda', 'yonetim-kurulu', 'tuzuk']
  },
  uyelik: {
    label: 'Üyelik',
    icon: Users,
    color: 'bg-emerald-100 text-emerald-700',
    slugs: ['neden-uye-olmaliyim', 'uyelik-basvurusu', 'uyeler', 'sanayi-gruplari']
  },
  bilgi: {
    label: 'Bilgi & Kaynaklar',
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-700',
    slugs: ['sektor-raporlari', 'mevzuat', 'tesvik-destekler', 'kysd-akademi']
  },
  etkinlik: {
    label: 'Etkinlikler',
    icon: Calendar,
    color: 'bg-amber-100 text-amber-700',
    slugs: ['egitimler', 'fuarlar', 'projeler', 'galeri']
  },
  yasal: {
    label: 'Yasal',
    icon: Shield,
    color: 'bg-gray-100 text-gray-700',
    slugs: ['gizlilik-politikasi', 'kullanim-kosullari']
  },
  diger: {
    label: 'Diğer',
    icon: FolderOpen,
    color: 'bg-slate-100 text-slate-700',
    slugs: []
  }
}

// Slug'a göre frontend URL'i döndür
const getPageUrl = (slug) => {
  const urlMap = {
    'hakkimizda': '/hakkimizda',
    'yonetim-kurulu': '/yonetim-kurulu',
    'tuzuk': '/tuzuk',
    'neden-uye-olmaliyim': '/neden-uye-olmaliyim',
    'uyelik-basvurusu': '/uyelik-basvurusu',
    'uyeler': '/uyeler',
    'sanayi-gruplari': '/sanayi-gruplari',
    'sektor-raporlari': '/sektor-raporlari',
    'mevzuat': '/mevzuat',
    'tesvik-destekler': '/tesvik-ve-destekler',
    'kysd-akademi': '/kysd-akademi',
    'egitimler': '/egitimler-seminerler',
    'fuarlar': '/fuarlar',
    'projeler': '/projeler',
    'galeri': '/galeri',
    'gizlilik-politikasi': '/sayfa/gizlilik-politikasi',
    'kullanim-kosullari': '/sayfa/kullanim-kosullari'
  }
  return urlMap[slug] || `/sayfa/${slug}`
}

// Sayfa kategorisini bul
const getPageCategory = (slug) => {
  for (const [key, cat] of Object.entries(PAGE_CATEGORIES)) {
    if (cat.slugs.includes(slug)) return key
  }
  return 'diger'
}

export default function PagesList() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const response = await api.get('/pages?all=true')
      setPages(response.data)
    } catch (error) {
      console.error('Sayfalar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" sayfasını silmek istediğinize emin misiniz?`)) return

    try {
      await api.delete(`/pages/${id}`)
      fetchPages()
    } catch (error) {
      alert('Sayfa silinemedi')
    }
  }

  const toggleActive = async (page) => {
    setUpdating(page.id)
    try {
      await api.put(`/pages/${page.id}`, { ...page, isActive: !page.isActive })
      fetchPages()
    } catch (error) {
      alert('Durum güncellenemedi')
    } finally {
      setUpdating(null)
    }
  }

  // Filtreleme
  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || getPageCategory(page.slug) === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Kategoriye göre grupla
  const groupedPages = filteredPages.reduce((acc, page) => {
    const category = getPageCategory(page.slug)
    if (!acc[category]) acc[category] = []
    acc[category].push(page)
    return acc
  }, {})

  // Kategori istatistikleri
  const categoryStats = Object.entries(PAGE_CATEGORIES).map(([key, cat]) => ({
    key,
    ...cat,
    count: pages.filter(p => cat.slugs.includes(p.slug)).length
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sayfa Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Frontend sayfalarının içeriklerini düzenleyin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPages}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
          <Link
            to="/admin/sayfalar/ekle"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Sayfa
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedCategory === 'all'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-800">{pages.length}</p>
              <p className="text-xs text-gray-500">Tümü</p>
            </div>
          </div>
        </button>

        {categoryStats.slice(0, 5).map(cat => {
          const Icon = cat.icon
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === cat.key
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-800">{cat.count}</p>
                  <p className="text-xs text-gray-500 truncate">{cat.label}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Sayfa ara (başlık veya slug)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz sayfa bulunmuyor'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPages).map(([categoryKey, categoryPages]) => {
            const category = PAGE_CATEGORIES[categoryKey]
            const Icon = category.icon

            return (
              <div key={categoryKey} className="card overflow-hidden">
                {/* Category Header */}
                <div className={`px-6 py-4 ${category.color} border-b flex items-center gap-3`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{category.label}</span>
                  <span className="text-sm opacity-75">({categoryPages.length} sayfa)</span>
                </div>

                {/* Pages Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Sayfa
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Son Güncelleme
                        </th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {categoryPages.map((page) => (
                        <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {page.image ? (
                                <img
                                  src={page.image}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{page.title}</p>
                                <p className="text-xs text-gray-500">/{page.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={getPageUrl(page.slug)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700"
                            >
                              {getPageUrl(page.slug)}
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => toggleActive(page)}
                              disabled={updating === page.id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                page.isActive
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {updating === page.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : page.isActive ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                              {page.isActive ? 'Aktif' : 'Pasif'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">
                              {formatDate(page.updatedAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={getPageUrl(page.slug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Sayfayı Görüntüle"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                              </a>
                              <Link
                                to={`/admin/sayfalar/${page.id}`}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Düzenle"
                              >
                                <Edit className="w-4 h-4 text-blue-500" />
                              </Link>
                              <button
                                onClick={() => handleDelete(page.id, page.title)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Sayfa İçerik Yönetimi</p>
            <p className="text-blue-600">
              Her sayfa için başlık, içerik, görsel ve SEO ayarlarını düzenleyebilirsiniz.
              Sayfalar kategorilere göre gruplandırılmıştır. Düzenlemek için kalem ikonuna tıklayın.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
