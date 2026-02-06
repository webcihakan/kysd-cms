import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronRight, Clock } from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Footer() {
  const [settings, setSettings] = useState({})
  const [menus, setMenus] = useState([])
  const [industryGroups, setIndustryGroups] = useState([])

  useEffect(() => {
    fetchSettings()
    fetchMenus()
    fetchIndustryGroups()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings')
      setSettings(response.data)
    } catch (error) {
      console.error('Ayarlar yuklenemedi')
    }
  }

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus')
      setMenus(response.data)
    } catch (error) {
      console.error('Menuler yuklenemedi')
    }
  }

  const fetchIndustryGroups = async () => {
    try {
      const response = await api.get('/industry-groups')
      setIndustryGroups(response.data)
    } catch (error) {
      console.error('Sanayi gruplari yuklenemedi')
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const socialLinks = [
    { key: 'social_facebook', icon: Facebook, label: 'Facebook' },
    { key: 'social_twitter', icon: Twitter, label: 'Twitter' },
    { key: 'social_instagram', icon: Instagram, label: 'Instagram' },
    { key: 'social_linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'social_youtube', icon: Youtube, label: 'YouTube' }
  ]

  const firstHalfGroups = industryGroups.slice(0, 4)
  const secondHalfGroups = industryGroups.slice(4, 8)

  const logoUrl = settings.site_logo_white ? getImageUrl(settings.site_logo_white) :
                  settings.site_logo ? getImageUrl(settings.site_logo) : '/images/logo.jpg'

  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* About */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img
                src={logoUrl}
                alt={settings.site_name || 'KYSD - Konfeksiyon Yan Sanayicileri Derneği'}
                className="h-12 rounded"
              />
            </Link>
            <p className="text-primary-300 text-sm leading-relaxed mb-6">
              {settings.footer_about || settings.site_description || 'Konfeksiyon Yan Sanayicileri Derneği olarak sektorun gelisimi icin calisiyoruz.'}
            </p>

            {/* Working Hours */}
            {(settings.hours_weekdays || settings.hours_saturday) && (
              <div className="mb-6 p-3 bg-primary-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-accent-400 text-sm font-medium mb-2">
                  <Clock className="w-4 h-4" />
                  Calisma Saatleri
                </div>
                <div className="text-xs space-y-1 text-primary-300">
                  {settings.hours_weekdays && <p>Hafta Ici: {settings.hours_weekdays}</p>}
                  {settings.hours_saturday && <p>Cumartesi: {settings.hours_saturday}</p>}
                  {settings.hours_sunday && <p>Pazar: {settings.hours_sunday}</p>}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ key, icon: Icon, label }) => (
                settings[key] && (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-primary-800 hover:bg-accent-500 rounded flex items-center justify-center transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Kurumsal</h4>
            <ul className="space-y-3">
              {menus.slice(0, 6).map((menu) => (
                <li key={menu.id}>
                  <Link
                    to={menu.url || '#'}
                    className="text-primary-300 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 text-primary-500" />
                    {menu.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry Groups - First Column */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Sanayi Gruplari</h4>
            <ul className="space-y-3">
              {firstHalfGroups.map((group) => (
                <li key={group.id}>
                  <Link
                    to={`/sanayi-grubu/${group.slug}`}
                    className="text-primary-300 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 text-primary-500" />
                    {group.name.length > 20 ? group.name.substring(0, 20) + '...' : group.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry Groups - Second Column */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg lg:invisible">Gruplar</h4>
            <ul className="space-y-3">
              {secondHalfGroups.map((group) => (
                <li key={group.id}>
                  <Link
                    to={`/sanayi-grubu/${group.slug}`}
                    className="text-primary-300 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 text-primary-500" />
                    {group.name.length > 20 ? group.name.substring(0, 20) + '...' : group.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/sanayi-gruplari"
                  className="text-accent-400 hover:text-accent-300 transition-colors text-sm font-medium inline-flex items-center gap-1"
                >
                  Tum Gruplar
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Iletisim</h4>
            <ul className="space-y-4">
              {settings.contact_address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-300 text-sm">{settings.contact_address}</span>
                </li>
              )}
              {settings.contact_phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  <div className="text-sm">
                    <a href={`tel:${settings.contact_phone}`} className="text-primary-300 hover:text-white transition-colors block">
                      {settings.contact_phone}
                    </a>
                    {settings.contact_phone2 && (
                      <a href={`tel:${settings.contact_phone2}`} className="text-primary-300 hover:text-white transition-colors block">
                        {settings.contact_phone2}
                      </a>
                    )}
                  </div>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  <div className="text-sm">
                    <a href={`mailto:${settings.contact_email}`} className="text-primary-300 hover:text-white transition-colors block">
                      {settings.contact_email}
                    </a>
                    {settings.contact_email2 && (
                      <a href={`mailto:${settings.contact_email2}`} className="text-primary-300 hover:text-white transition-colors block">
                        {settings.contact_email2}
                      </a>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
            <p className="text-primary-400 text-center md:text-left">
              {settings.footer_copyright || (
                <>© {new Date().getFullYear()} <span className="text-white font-medium">{settings.site_name || 'KYSD'}</span><span className="hidden sm:inline"> - {settings.site_slogan || 'Konfeksiyon Yan Sanayicileri Derneği'}</span>. Tum haklari saklidir. Ata Tekstil ve Aksesuar Katkılarıyla Tasarlanmıştır.{' '}
                <a
                  href="https://www.goramedya.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
                >
                  Goramedya
                </a></>
              )}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              {settings.footer_developer && (
                <span className="text-primary-500 hidden sm:inline">
                  {settings.footer_developer_link ? (
                    <a href={settings.footer_developer_link} target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors">
                      {settings.footer_developer}
                    </a>
                  ) : settings.footer_developer}
                </span>
              )}
              <Link to="/sayfa/gizlilik-politikasi" className="text-primary-400 hover:text-white transition-colors">
                Gizlilik
              </Link>
              <Link to="/sayfa/kullanim-kosullari" className="text-primary-400 hover:text-white transition-colors">
                Kullanim Kosullari
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
