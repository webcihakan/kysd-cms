import { useState, useEffect } from 'react'
import {
  Plus, Edit, Trash2, ChevronRight, ChevronDown, GripVertical, Save, X,
  ExternalLink, Link as LinkIcon, FileText, ArrowUp, ArrowDown, Eye, EyeOff,
  Menu, FolderPlus, Check, AlertCircle
} from 'lucide-react'
import api from '../../utils/api'

export default function MenusList() {
  const [menus, setMenus] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingMenu, setEditingMenu] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    pageId: null,
    isActive: true,
    parentId: null,
    target: '_self',
    order: 0
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchMenus()
    fetchPages()
  }, [])

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus?all=true')
      setMenus(response.data)
      // Tum ana menuleri varsayilan olarak ac
      const expanded = {}
      response.data.forEach(menu => {
        expanded[menu.id] = true
      })
      setExpandedMenus(expanded)
    } catch (error) {
      console.error('Menuler yuklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages?all=true&limit=100')
      setPages(response.data.pages || [])
    } catch (error) {
      console.error('Sayfalar yuklenemedi')
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showMessage('Baslik zorunludur', 'error')
      return
    }

    setSaving(true)

    try {
      const dataToSend = {
        ...formData,
        url: formData.pageId ? `/sayfa/${pages.find(p => p.id === formData.pageId)?.slug}` : formData.url,
        pageId: formData.pageId || null,
        parentId: formData.parentId || null
      }

      if (editingMenu) {
        await api.put(`/menus/${editingMenu.id}`, dataToSend)
        showMessage('Menu guncellendi')
      } else {
        await api.post('/menus', dataToSend)
        showMessage('Menu eklendi')
      }
      resetForm()
      fetchMenus()
    } catch (error) {
      showMessage('Islem basarisiz', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (menu) => {
    setEditingMenu(menu)
    setFormData({
      title: menu.title,
      url: menu.url || '',
      pageId: menu.pageId,
      isActive: menu.isActive,
      parentId: menu.parentId,
      target: menu.target || '_self',
      order: menu.order || 0
    })
    setShowForm(true)
  }

  const handleAddChild = (parentMenu) => {
    resetForm()
    setFormData(prev => ({
      ...prev,
      parentId: parentMenu.id
    }))
    setShowForm(true)
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" menusu ve alt menuleri silinecek. Emin misiniz?`)) return

    try {
      await api.delete(`/menus/${id}`)
      showMessage('Menu silindi')
      fetchMenus()
    } catch (error) {
      showMessage('Menu silinemedi', 'error')
    }
  }

  const toggleActive = async (menu) => {
    try {
      await api.put(`/menus/${menu.id}`, { ...menu, isActive: !menu.isActive })
      showMessage(menu.isActive ? 'Menu pasif yapildi' : 'Menu aktif yapildi')
      fetchMenus()
    } catch (error) {
      showMessage('Durum guncellenemedi', 'error')
    }
  }

  const moveMenu = async (menu, direction) => {
    const siblings = menu.parentId
      ? menus.find(m => m.id === menu.parentId)?.children || []
      : menus

    const currentIndex = siblings.findIndex(m => m.id === menu.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= siblings.length) return

    const targetMenu = siblings[targetIndex]

    try {
      await Promise.all([
        api.put(`/menus/${menu.id}`, { ...menu, order: targetMenu.order }),
        api.put(`/menus/${targetMenu.id}`, { ...targetMenu, order: menu.order })
      ])
      fetchMenus()
    } catch (error) {
      showMessage('Siralama guncellenemedi', 'error')
    }
  }

  const resetForm = () => {
    setEditingMenu(null)
    setFormData({
      title: '',
      url: '',
      pageId: null,
      isActive: true,
      parentId: null,
      target: '_self',
      order: 0
    })
    setShowForm(false)
  }

  const toggleExpand = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }

  const getParentTitle = (parentId) => {
    const parent = menus.find(m => m.id === parentId)
    return parent ? parent.title : 'Ana Menu'
  }

  const renderMenu = (menu, level = 0, siblings = []) => {
    const currentIndex = siblings.findIndex(m => m.id === menu.id)
    const isFirst = currentIndex === 0
    const isLast = currentIndex === siblings.length - 1
    const hasChildren = menu.children?.length > 0
    const isExpanded = expandedMenus[menu.id]

    return (
      <div key={menu.id}>
        <div
          className={`flex items-center gap-2 p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            level > 0 ? 'bg-gray-50/50 dark:bg-gray-700/50' : ''
          } ${!menu.isActive ? 'opacity-60' : ''}`}
          style={{ paddingLeft: `${level * 28 + 12}px` }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(menu.id)}
            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${!hasChildren ? 'invisible' : ''}`}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Menu Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${menu.isActive ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {menu.title}
              </span>
              {menu.target === '_blank' && (
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
            {menu.url && (
              <span className="text-xs text-gray-400 truncate block">{menu.url}</span>
            )}
          </div>

          {/* Status */}
          <button
            onClick={() => toggleActive(menu)}
            className={`p-1.5 rounded transition-colors ${
              menu.isActive
                ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={menu.isActive ? 'Pasif Yap' : 'Aktif Yap'}
          >
            {menu.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Move Buttons */}
          <div className="flex items-center">
            <button
              onClick={() => moveMenu(menu, 'up')}
              disabled={isFirst}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Yukari Tasi"
            >
              <ArrowUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={() => moveMenu(menu, 'down')}
              disabled={isLast}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Asagi Tasi"
            >
              <ArrowDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 border-l dark:border-gray-600 pl-2 ml-1">
            <button
              onClick={() => handleAddChild(menu)}
              className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400"
              title="Alt Menu Ekle"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(menu)}
              className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400"
              title="Duzenle"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(menu.id, menu.title)}
              className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400"
              title="Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {menu.children.map((child) => renderMenu(child, level + 1, menu.children))}
          </div>
        )}
      </div>
    )
  }

  // Hazir link secenekleri
  const quickLinks = [
    { label: 'Ana Sayfa', url: '/' },
    { label: 'Haberler', url: '/haberler' },
    { label: 'Duyurular', url: '/duyurular' },
    { label: 'Galeri', url: '/galeri' },
    { label: 'Iletisim', url: '/iletisim' },
    { label: 'Hakkimizda', url: '/hakkimizda' },
    { label: 'Yonetim Kurulu', url: '/yonetim-kurulu' },
    { label: 'Tuzuk', url: '/tuzuk' },
    { label: 'Uyelik Basvurusu', url: '/uyelik-basvurusu' },
    { label: 'Neden Uye Olmaliyim', url: '/neden-uye-olmaliyim' },
    { label: 'Uyeler', url: '/uyeler' },
    { label: 'Sektor Raporlari', url: '/sektor-raporlari' },
    { label: 'Mevzuat', url: '/mevzuat' },
    { label: 'Tesvik ve Destekler', url: '/tesvik-ve-destekler' },
    { label: 'Egitimler & Seminerler', url: '/egitimler-seminerler' },
    { label: 'Projeler', url: '/projeler' },
    { label: 'Fuarlar', url: '/fuarlar' },
    { label: 'Sanayi Gruplari', url: '/sanayi-gruplari' }
  ]

  return (
    <div>
      {/* Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Menu Yonetimi</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Site menulerinizi buradan yonetin</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yeni Menu
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Menu List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Menu className="w-4 h-4" />
                <span className="font-medium">Menu Yapisi</span>
                <span className="text-gray-400">({menus.length} ana menu)</span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
              </div>
            ) : menus.length === 0 ? (
              <div className="text-center py-12">
                <Menu className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Henuz menu bulunmuyor</p>
                <button
                  onClick={() => { resetForm(); setShowForm(true); }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ilk menuyu ekleyin
                </button>
              </div>
            ) : (
              <div>{menus.map((menu) => renderMenu(menu, 0, menus))}</div>
            )}
          </div>

          {/* Bilgi */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Ipuclari:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
              <li>URL bos birakirsaniz menu sadece baslik olarak gorunur (dropdown menu icin)</li>
              <li>Alt menu eklemek icin ilgili menunun yanindaki <FolderPlus className="w-3 h-3 inline" /> ikonuna tiklayin</li>
              <li>Siralama icin ok tuslarini kullanin</li>
              <li>Goz ikonuyla menuleri aktif/pasif yapabilirsiniz</li>
            </ul>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div>
          {showForm ? (
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {editingMenu ? 'Menu Duzenle' : 'Yeni Menu Ekle'}
                </h3>
                <button onClick={resetForm} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {formData.parentId && (
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-medium">{getParentTitle(formData.parentId)}</span> altina ekleniyor
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Baslik *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="Menu basligi"
                  />
                </div>

                {/* Quick Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hizli Link Sec</label>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        const selected = quickLinks.find(l => l.url === e.target.value)
                        setFormData({
                          ...formData,
                          url: e.target.value,
                          title: formData.title || selected?.label || '',
                          pageId: null
                        })
                      }
                    }}
                    className="input"
                  >
                    <option value="">-- Hazir linklerden sec --</option>
                    {quickLinks.map((link) => (
                      <option key={link.url} value={link.url}>{link.label} ({link.url})</option>
                    ))}
                  </select>
                </div>

                {/* Page Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">veya Sayfa Sec</label>
                  <select
                    value={formData.pageId || ''}
                    onChange={(e) => {
                      const pageId = e.target.value ? parseInt(e.target.value) : null
                      const page = pages.find(p => p.id === pageId)
                      setFormData({
                        ...formData,
                        pageId,
                        url: page ? `/sayfa/${page.slug}` : formData.url,
                        title: formData.title || page?.title || ''
                      })
                    }}
                    className="input"
                  >
                    <option value="">-- Sayfalardan sec --</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>{page.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    veya Ozel URL
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value, pageId: null })}
                    className="input"
                    placeholder="/sayfa veya https://..."
                  />
                  <p className="text-xs text-gray-400 mt-1">Bos birakirsaniz dropdown menu olarak calisir</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ust Menu</label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      parentId: e.target.value ? parseInt(e.target.value) : null
                    })}
                    className="input"
                  >
                    <option value="">Ana Menu (Ust seviye)</option>
                    {menus.map((menu) => (
                      <option key={menu.id} value={menu.id} disabled={editingMenu?.id === menu.id}>
                        {menu.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Hedefi</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="target"
                        value="_self"
                        checked={formData.target === '_self'}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className="text-primary-600"
                      />
                      <span className="text-sm">Ayni sekmede ac</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="target"
                        value="_blank"
                        checked={formData.target === '_blank'}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className="text-primary-600"
                      />
                      <span className="text-sm">Yeni sekmede ac</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sira</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="input w-24"
                    min="0"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                  <span className="text-sm text-gray-700">Aktif</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingMenu ? 'Guncelle' : 'Ekle'}
                      </>
                    )}
                  </button>
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    Iptal
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <Menu className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Menu eklemek veya duzenlemek icin butonu kullanin</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Yeni Menu Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
