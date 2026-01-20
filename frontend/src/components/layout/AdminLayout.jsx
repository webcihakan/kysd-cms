import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Newspaper, Bell, Building2, Image, Images,
  Megaphone, Menu as MenuIcon, Users, Mail, Settings, LogOut,
  ChevronLeft, ChevronRight, X, ClipboardList, FolderOpen, GraduationCap, Building,
  Sun, Moon, User, ChevronDown, ExternalLink, Scale, CreditCard, Receipt, Monitor, Crown, MapPin, PartyPopper, BookOpen, Package, BarChart3, Briefcase
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

// Menü grupları
const menuGroups = [
  {
    title: null, // Ana menü
    icon: null,
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' }
    ]
  },
  {
    title: 'İçerik Yönetimi',
    icon: FileText,
    items: [
      { path: '/admin/sayfalar', icon: FileText, label: 'Sayfalar' },
      { path: '/admin/haberler', icon: Newspaper, label: 'Haberler' },
      { path: '/admin/duyurular', icon: Bell, label: 'Duyurular' },
      { path: '/admin/mevzuat', icon: Scale, label: 'Mevzuat' },
      { path: '/admin/ekonomik-gostergeler', icon: BarChart3, label: 'Ekonomik Göstergeler' },
      { path: '/admin/yonetim-kurulu', icon: Crown, label: 'Yönetim Kurulu' }
    ]
  },
  {
    title: 'Sektör & Üyeler',
    icon: Building2,
    items: [
      { path: '/admin/sanayi-gruplari', icon: Building2, label: 'Sanayi Grupları' },
      { path: '/admin/uyeler', icon: Users, label: 'Üye Firmalar' },
      { path: '/admin/uyelik-basvurulari', icon: ClipboardList, label: 'Üyelik Başvuruları' }
    ]
  },
  {
    title: 'Etkinlikler',
    icon: FolderOpen,
    items: [
      { path: '/admin/projeler', icon: FolderOpen, label: 'Projeler' },
      { path: '/admin/egitimler', icon: GraduationCap, label: 'Eğitimler' },
      { path: '/admin/fuarlar', icon: Building, label: 'Fuarlar' },
      { path: '/admin/tur-rehberi', icon: MapPin, label: 'Tur Rehberi' },
      { path: '/admin/tatiller', icon: PartyPopper, label: 'Tatiller' }
    ]
  },
  {
    title: 'Sanal Fuar',
    icon: Monitor,
    items: [
      { path: '/admin/sanal-fuarlar', icon: Monitor, label: 'Sanal Fuarlar' },
      { path: '/admin/sanal-fuar-basvurulari', icon: ClipboardList, label: 'Stant Başvuruları' }
    ]
  },
  {
    title: 'Medya & Reklam',
    icon: Image,
    items: [
      { path: '/admin/slider', icon: Image, label: 'Slider' },
      { path: '/admin/galeri', icon: Images, label: 'Galeri' },
      { path: '/admin/dergiler', icon: BookOpen, label: 'Sektörel Dergiler' },
      { path: '/admin/katalog-paketleri', icon: Package, label: 'Katalog Paketleri' },
      { path: '/admin/reklamlar', icon: Megaphone, label: 'Reklamlar' },
      { path: '/admin/reklam-alanlari', icon: Monitor, label: 'Reklam Alanları' }
    ]
  },
  {
    title: 'Kariyer',
    icon: Briefcase,
    items: [
      { path: '/admin/kariyer/ilanlar', icon: Briefcase, label: 'İş İlanları' },
      { path: '/admin/kariyer/basvurular', icon: Users, label: 'Başvurular' }
    ]
  },
  {
    title: 'Finans',
    icon: Receipt,
    items: [
      { path: '/admin/aidatlar', icon: CreditCard, label: 'Aidat Takibi' },
      { path: '/admin/giderler', icon: Receipt, label: 'Aylık Giderler' },
      { path: '/admin/kataloglar', icon: BookOpen, label: 'Katalog Ödemeleri' },
      { path: '/admin/reklamlar/odemeler', icon: Megaphone, label: 'Reklam Ödemeleri' },
      { path: '/admin/sanal-fuar-odemeler', icon: Monitor, label: 'Sanal Fuar Ödemeleri' },
      { path: '/admin/dergi-odemeler', icon: FileText, label: 'Dergi Ödemeleri' }
    ]
  },
  {
    title: 'Sistem',
    icon: Settings,
    items: [
      { path: '/admin/menuler', icon: MenuIcon, label: 'Menüler' },
      { path: '/admin/kullanicilar', icon: Users, label: 'Kullanıcılar' },
      { path: '/admin/mesajlar', icon: Mail, label: 'Mesajlar' },
      { path: '/admin/ayarlar', icon: Settings, label: 'Ayarlar' }
    ]
  }
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState([])
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = (title) => {
    setOpenMenus(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/giris')
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return { text: 'Yönetici', color: 'bg-red-500' }
      case 'EDITOR':
        return { text: 'Editör', color: 'bg-blue-500' }
      case 'MEMBER':
        return { text: 'Üye', color: 'bg-green-500' }
      default:
        return { text: role, color: 'bg-gray-500' }
    }
  }

  const roleBadge = getRoleBadge(user?.role)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300
          ${darkMode ? 'bg-gray-800 text-white' : 'bg-primary-900 text-white'}
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center justify-between px-4 border-b ${darkMode ? 'border-gray-700' : 'border-primary-800'}`}>
          {sidebarOpen && (
            <Link to="/admin" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${darkMode ? 'bg-blue-500 text-white' : 'bg-white text-primary-900'}`}>
                K
              </div>
              <span className="font-bold">KYSD Admin</span>
            </Link>
          )}
          <button
            className={`lg:hidden p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-primary-800'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <button
            className={`hidden lg:block p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-primary-800'}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="py-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          {menuGroups.map((group, groupIndex) => {
            const isOpen = !group.title || openMenus.includes(group.title)
            const hasActiveItem = group.items.some(item =>
              location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            )

            return (
              <div key={groupIndex} className="mb-1">
                {/* Grup Başlığı - Dashboard gibi ikon + metin */}
                {group.title && group.icon && (
                  <button
                    onClick={() => toggleMenu(group.title)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-primary-300 hover:text-white hover:bg-primary-800'
                    } ${hasActiveItem ? (darkMode ? 'text-blue-400' : 'text-white') : ''}`}
                    title={!sidebarOpen ? group.title : undefined}
                  >
                    <group.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left">{group.title}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                )}
                {/* Grup Öğeleri - Açılır/Kapanır */}
                <div className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path ||
                      (item.path !== '/admin' && location.pathname.startsWith(item.path))

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                          group.title && sidebarOpen ? 'pl-6' : ''
                        } ${
                          isActive
                            ? darkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-primary-800 text-white'
                            : darkMode
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                        }`}
                        title={!sidebarOpen ? item.label : undefined}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="text-sm">{item.label}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className={`h-16 shadow-sm flex items-center justify-between px-4 lg:px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <button
            className={`lg:hidden p-2 rounded ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`relative p-2 rounded-lg transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={darkMode ? 'Gündüz Modu' : 'Gece Modu'}
            >
              <div className="relative w-6 h-6">
                <Sun className={`w-6 h-6 absolute transition-all duration-300 ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <Moon className={`w-6 h-6 absolute transition-all duration-300 ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
              </div>
            </button>

            {/* User Dropdown - Sağ Üst */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-700 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${darkMode ? 'bg-blue-500' : 'bg-primary-600'}`}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className={`hidden sm:block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  {user?.name}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-20 py-2 ${
                    darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                  }`}>
                    {/* User Info */}
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium text-white ${roleBadge.color}`}>
                        {roleBadge.text}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/"
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${
                          darkMode
                            ? 'text-blue-400 hover:bg-gray-600'
                            : 'text-primary-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Siteyi Görüntüle
                      </Link>
                      <Link
                        to="/admin/profil"
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${
                          darkMode
                            ? 'text-gray-300 hover:bg-gray-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profilim
                      </Link>
                      <Link
                        to="/admin/ayarlar"
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${
                          darkMode
                            ? 'text-gray-300 hover:bg-gray-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Ayarlar
                      </Link>
                    </div>

                    {/* Theme Toggle */}
                    <div className={`border-t py-1 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <button
                        onClick={() => {
                          toggleDarkMode()
                          setUserMenuOpen(false)
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                          darkMode
                            ? 'text-gray-300 hover:bg-gray-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {darkMode ? 'Gündüz Modu' : 'Gece Modu'}
                      </button>
                    </div>

                    {/* Logout */}
                    <div className={`border-t py-1 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          handleLogout()
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`p-4 lg:p-6 ${darkMode ? 'text-white' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
