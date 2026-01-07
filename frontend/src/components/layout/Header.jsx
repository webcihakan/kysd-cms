import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ChevronRight, Phone, Mail, ArrowRight, ExternalLink, Calculator as CalculatorIcon, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { useCurrency } from '../../hooks/useCurrency'
import Calculator from '../Calculator'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [menus, setMenus] = useState([])
  const [settings, setSettings] = useState({})
  const [showCalculator, setShowCalculator] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const currency = useCurrency()

  useEffect(() => {
    fetchMenus()
    fetchSettings()
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus')
      setMenus(response.data)
    } catch (error) {
      console.error('Menuler yuklenemedi')
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings')
      setSettings(response.data)
    } catch (error) {
      console.error('Ayarlar yuklenemedi')
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const logoUrl = settings.site_logo ? getImageUrl(settings.site_logo) : '/images/logo.jpg'
  const ctaText = settings.header_cta_text || 'Uye Ol'
  const ctaLink = settings.header_cta_link || '/uyelik-basvurusu'

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Announcement Banner */}
      {settings.header_announcement && (
        <div
          className="text-white text-center py-2 px-4 text-sm"
          style={{ backgroundColor: settings.header_announcement_bg || '#f59e0b' }}
        >
          {settings.header_announcement_link ? (
            <Link to={settings.header_announcement_link} className="hover:underline inline-flex items-center gap-2">
              {settings.header_announcement}
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            settings.header_announcement
          )}
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-primary-900 text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-xs">
          {/* Sol taraf - Döviz ve Altın Bilgileri */}
          <div className="flex items-center gap-3 divide-x divide-primary-700">
            {!currency.loading && !currency.error && (
              <>
                {currency.usd && (
                  <div className="flex items-center gap-1.5 pr-3">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                    <span className="font-medium">USD:</span>
                    <span className="text-accent-300">{currency.usd.selling?.toFixed(2)} ₺</span>
                  </div>
                )}
                {currency.eur && (
                  <div className="hidden sm:flex items-center gap-1.5 pl-3 pr-3">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                    <span className="font-medium">EUR:</span>
                    <span className="text-accent-300">{currency.eur.selling?.toFixed(2)} ₺</span>
                  </div>
                )}
                {currency.gold && (
                  <div className="hidden md:flex items-center gap-1.5 pl-3 pr-3">
                    <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-medium">Altın:</span>
                    <span className="text-accent-300">{currency.gold.selling?.toFixed(2)} ₺</span>
                  </div>
                )}
                {currency.silver && (
                  <div className="hidden lg:flex items-center gap-1.5 pl-3">
                    <TrendingUp className="w-3.5 h-3.5 text-gray-300" />
                    <span className="font-medium">Gümüş:</span>
                    <span className="text-accent-300">{currency.silver.selling?.toFixed(2)} ₺</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sağ taraf - Hesap Makinesi ve Kullanıcı Butonları */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hesap Makinesi */}
            <button
              onClick={() => setShowCalculator(true)}
              className="flex items-center gap-1.5 hover:text-accent-300 transition-colors px-2 py-1 hover:bg-primary-800 rounded"
              title="Hesap Makinesi"
            >
              <CalculatorIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hesap</span>
            </button>

            <span className="text-primary-600">|</span>

            {user ? (
              <button onClick={logout} className="hover:text-accent-300 transition-colors">
                Cikis
              </button>
            ) : (
              <>
                <Link to="/giris" className="hover:text-accent-300 transition-colors">
                  Giris
                </Link>
                <Link
                  to={ctaLink}
                  className="bg-accent-500 hover:bg-accent-600 text-white px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-colors"
                >
                  {ctaText}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <img
              src={logoUrl}
              alt={settings.site_name || 'KYSD'}
              className="h-14"
            />
            <div className="hidden sm:block border-l border-gray-200 pl-4">
              <p className="font-bold text-primary-900 text-lg tracking-tight">{settings.site_name || 'KYSD'}</p>
              <p className="text-xs text-corporate-500 tracking-wide">{settings.site_slogan || 'Konfeksiyon Yan Sanayi Dernegi'}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {menus.filter(menu => menu.url !== '/iletisim' && menu.title !== 'Iletisim').map((menu) => (
              <div key={menu.id} className="relative group">
                {menu.children && menu.children.length > 0 ? (
                  <>
                    <button className="px-4 py-2 text-corporate-700 hover:text-primary-800 font-medium flex items-center gap-1 transition-colors text-[15px]">
                      {menu.title}
                      <ChevronDown className="w-4 h-4 text-corporate-400" />
                    </button>
                    <div className="absolute top-full left-0 bg-white shadow-corporate-lg rounded-lg py-2 min-w-[280px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-gray-100">
                      {menu.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.url || '#'}
                          target={child.target === '_blank' ? '_blank' : undefined}
                          rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-3 px-4 py-2.5 text-corporate-600 hover:text-primary-800 hover:bg-primary-50 transition-colors text-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-primary-300 rounded-full"></span>
                          {child.title}
                          {child.target === '_blank' && <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={menu.url || '#'}
                    target={menu.target === '_blank' ? '_blank' : undefined}
                    rel={menu.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="px-4 py-2 text-corporate-700 hover:text-primary-800 font-medium transition-colors text-[15px] flex items-center gap-1"
                  >
                    {menu.title}
                    {menu.target === '_blank' && <ExternalLink className="w-3 h-3 text-gray-400" />}
                  </Link>
                )}
              </div>
            ))}

            {/* CTA Button */}
            <Link
              to="/iletisim"
              className="ml-6 inline-flex items-center gap-2 bg-primary-800 hover:bg-primary-900 text-white px-5 py-2.5 rounded font-medium transition-colors text-sm"
            >
              Iletisim
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-corporate-600 hover:text-primary-800 hover:bg-gray-50 rounded transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation - Overlay */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu Panel */}
            <nav className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-bold text-primary-900">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-corporate-600 hover:text-primary-800 hover:bg-gray-50 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="py-4">
                {menus.filter(menu => menu.url !== '/iletisim' && menu.title !== 'Iletisim').map((menu) => (
                  <div key={menu.id}>
                    {menu.children && menu.children.length > 0 ? (
                      <details className="group">
                        <summary className="flex items-center justify-between px-4 py-3 text-corporate-800 font-medium cursor-pointer hover:bg-gray-50">
                          {menu.title}
                          <ChevronDown className="w-4 h-4 text-corporate-400 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="bg-gray-50 py-2 ml-4 border-l-2 border-primary-200">
                          {menu.children.map((child) => (
                            <Link
                              key={child.id}
                              to={child.url || '#'}
                              target={child.target === '_blank' ? '_blank' : undefined}
                              className="flex items-center gap-2 px-4 py-2 text-corporate-600 hover:text-primary-800 text-sm"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.title}
                              {child.target === '_blank' && <ExternalLink className="w-3 h-3 text-gray-400" />}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <Link
                        to={menu.url || '#'}
                        target={menu.target === '_blank' ? '_blank' : undefined}
                        className="flex items-center gap-2 px-4 py-3 text-corporate-800 font-medium hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {menu.title}
                        {menu.target === '_blank' && <ExternalLink className="w-3 h-3 text-gray-400" />}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="p-4 border-t border-gray-100 space-y-2">
                <Link
                  to={ctaLink}
                  className="block w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded text-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {ctaText}
                </Link>
                <Link
                  to="/iletisim"
                  className="block w-full py-3 bg-primary-800 hover:bg-primary-900 text-white font-medium rounded text-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Iletisim
                </Link>
              </div>
            </nav>
          </>
        )}
      </div>

      {/* Calculator Modal */}
      <Calculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
    </header>
  )
}
