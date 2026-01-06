import { useState, useEffect } from 'react'
import {
  Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube,
  Image, Palette, FileText, Code, Clock, Building, Upload, X, Check, AlertCircle,
  Settings as SettingsIcon, Link, Search, BarChart3, Shield, Bell, Type, Layout, Eye, EyeOff, CreditCard
} from 'lucide-react'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const settingGroups = [
  {
    id: 'general',
    title: 'Genel Ayarlar',
    icon: Globe,
    description: 'Site adi, aciklamasi ve temel bilgiler',
    fields: [
      { key: 'site_name', label: 'Site Adi', type: 'text', placeholder: 'KYSD' },
      { key: 'site_slogan', label: 'Site Slogani', type: 'text', placeholder: 'Konfeksiyon Yan Sanayi Dernegi' },
      { key: 'site_description', label: 'Site Aciklamasi', type: 'textarea', placeholder: 'Site hakkinda kisa aciklama...' },
      { key: 'site_keywords', label: 'Anahtar Kelimeler', type: 'text', placeholder: 'tekstil, konfeksiyon, sanayi, dernek' }
    ]
  },
  {
    id: 'logo',
    title: 'Logo ve Gorseller',
    icon: Image,
    description: 'Site logosu, favicon ve diger gorseller',
    fields: [
      { key: 'site_logo', label: 'Site Logosu', type: 'image', folder: 'settings', hint: 'Onerilen boyut: 200x60 piksel' },
      { key: 'site_logo_white', label: 'Beyaz Logo (Footer icin)', type: 'image', folder: 'settings', hint: 'Koyu arka plan icin beyaz versiyon' },
      { key: 'site_favicon', label: 'Favicon', type: 'image', folder: 'settings', hint: '32x32 veya 64x64 piksel' },
      { key: 'site_og_image', label: 'Sosyal Medya Gorseli', type: 'image', folder: 'settings', hint: '1200x630 piksel onerilen' }
    ]
  },
  {
    id: 'contact',
    title: 'Iletisim Bilgileri',
    icon: Phone,
    description: 'Telefon, e-posta, adres bilgileri',
    fields: [
      { key: 'contact_phone', label: 'Telefon', type: 'tel', placeholder: '+90 212 XXX XX XX', icon: Phone },
      { key: 'contact_phone2', label: 'Telefon 2', type: 'tel', placeholder: '+90 212 XXX XX XX', icon: Phone },
      { key: 'contact_fax', label: 'Faks', type: 'tel', placeholder: '+90 212 XXX XX XX', icon: Phone },
      { key: 'contact_email', label: 'E-posta', type: 'email', placeholder: 'info@kysd.org.tr', icon: Mail },
      { key: 'contact_email2', label: 'E-posta 2', type: 'email', placeholder: 'destek@kysd.org.tr', icon: Mail },
      { key: 'contact_address', label: 'Adres', type: 'textarea', placeholder: 'Tam adres...', icon: MapPin },
      { key: 'contact_city', label: 'Sehir', type: 'text', placeholder: 'Istanbul' },
      { key: 'contact_map_embed', label: 'Google Maps Embed Kodu', type: 'textarea', placeholder: '<iframe src="..." />', hint: 'Google Maps\'ten embed kodunu yapistin' }
    ]
  },
  {
    id: 'hours',
    title: 'Calisma Saatleri',
    icon: Clock,
    description: 'Haftalik calisma saatleri',
    fields: [
      { key: 'hours_weekdays', label: 'Hafta Ici', type: 'text', placeholder: '09:00 - 18:00' },
      { key: 'hours_saturday', label: 'Cumartesi', type: 'text', placeholder: '09:00 - 13:00 veya Kapali' },
      { key: 'hours_sunday', label: 'Pazar', type: 'text', placeholder: 'Kapali' },
      { key: 'hours_note', label: 'Ek Not', type: 'text', placeholder: 'Resmi tatillerde kapali' }
    ]
  },
  {
    id: 'social',
    title: 'Sosyal Medya',
    icon: Globe,
    description: 'Sosyal medya hesap linkleri',
    fields: [
      { key: 'social_facebook', label: 'Facebook', type: 'url', placeholder: 'https://facebook.com/kysd', icon: Facebook },
      { key: 'social_twitter', label: 'Twitter / X', type: 'url', placeholder: 'https://twitter.com/kysd', icon: Twitter },
      { key: 'social_instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/kysd', icon: Instagram },
      { key: 'social_linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/company/kysd', icon: Linkedin },
      { key: 'social_youtube', label: 'YouTube', type: 'url', placeholder: 'https://youtube.com/kysd', icon: Youtube }
    ]
  },
  {
    id: 'header',
    title: 'Header Ayarlari',
    icon: Layout,
    description: 'Ust kisim ve duyuru banner ayarlari',
    fields: [
      { key: 'header_announcement', label: 'Duyuru Metni', type: 'text', placeholder: 'Onemli duyuru veya kampanya metni...', hint: 'Bos birakirsaniz gosterilmez' },
      { key: 'header_announcement_link', label: 'Duyuru Linki', type: 'text', placeholder: '/duyuru/detay' },
      { key: 'header_announcement_bg', label: 'Duyuru Arka Plan Rengi', type: 'color', placeholder: '#f59e0b' },
      { key: 'header_cta_text', label: 'CTA Buton Metni', type: 'text', placeholder: 'Uye Ol' },
      { key: 'header_cta_link', label: 'CTA Buton Linki', type: 'text', placeholder: '/uyelik-basvurusu' }
    ]
  },
  {
    id: 'footer',
    title: 'Footer Ayarlari',
    icon: FileText,
    description: 'Alt kisim ve copyright bilgileri',
    fields: [
      { key: 'footer_about', label: 'Hakkinda Metni', type: 'textarea', placeholder: 'Dernek hakkinda kisa tanitim metni...' },
      { key: 'footer_copyright', label: 'Copyright Metni', type: 'text', placeholder: '© 2024 KYSD. Tum haklari saklidir.' },
      { key: 'footer_developer', label: 'Gelistirici Bilgisi', type: 'text', placeholder: 'Tasarim ve Yazilim: Firma Adi' },
      { key: 'footer_developer_link', label: 'Gelistirici Linki', type: 'url', placeholder: 'https://firma.com' }
    ]
  },
  {
    id: 'homepage',
    title: 'Ana Sayfa',
    icon: Layout,
    description: 'Ana sayfa bolum ayarlari',
    fields: [
      { key: 'home_hero_badge', label: 'Hero Rozet Metni', type: 'text', placeholder: '1990\'dan Beri Sektorun Yaninda' },
      { key: 'home_hero_description', label: 'Hero Aciklama Metni', type: 'textarea', placeholder: 'Ana sayfada gorunecek tanitim metni...' },
      { key: 'home_news_count', label: 'Gosterilecek Haber Sayisi', type: 'number', placeholder: '6' },
      { key: 'home_announcements_count', label: 'Gosterilecek Duyuru Sayisi', type: 'number', placeholder: '4' },
      { key: 'home_show_slider', label: 'Slider Goster', type: 'checkbox' },
      { key: 'home_show_stats', label: 'Istatistikler Goster', type: 'checkbox' },
      { key: 'home_show_members', label: 'Uyeler Bolumu Goster', type: 'checkbox' },
      { key: 'home_stats_members', label: 'Uye Sayisi (Istatistik)', type: 'number', placeholder: '150' },
      { key: 'home_stats_years', label: 'Yillik Deneyim (Istatistik)', type: 'number', placeholder: '34' },
      { key: 'home_stats_projects', label: 'Proje Sayisi (Istatistik)', type: 'number', placeholder: '50' },
      { key: 'home_stats_events', label: 'Etkinlik Sayisi (Istatistik)', type: 'number', placeholder: '200' }
    ]
  },
  {
    id: 'seo',
    title: 'SEO Ayarlari',
    icon: Search,
    description: 'Arama motoru optimizasyonu',
    fields: [
      { key: 'seo_title', label: 'Varsayilan Sayfa Basligi', type: 'text', placeholder: 'KYSD - Konfeksiyon Yan Sanayi Dernegi' },
      { key: 'seo_description', label: 'Varsayilan Meta Aciklama', type: 'textarea', placeholder: 'Site aciklamasi (160 karakter onerilen)' },
      { key: 'seo_robots', label: 'Robots Meta', type: 'select', options: ['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'] },
      { key: 'seo_canonical', label: 'Canonical URL', type: 'url', placeholder: 'https://www.kysd.org.tr' }
    ]
  },
  {
    id: 'analytics',
    title: 'Analitik & Takip',
    icon: BarChart3,
    description: 'Google Analytics ve diger takip kodlari',
    fields: [
      { key: 'analytics_ga', label: 'Google Analytics ID', type: 'text', placeholder: 'G-XXXXXXXXXX veya UA-XXXXXXXX-X' },
      { key: 'analytics_gtm', label: 'Google Tag Manager ID', type: 'text', placeholder: 'GTM-XXXXXXX' },
      { key: 'analytics_fb_pixel', label: 'Facebook Pixel ID', type: 'text', placeholder: 'XXXXXXXXXXXXXXXXX' },
      { key: 'analytics_custom_head', label: 'Ozel Head Kodu', type: 'code', placeholder: '<!-- Ozel script veya meta taglar -->' },
      { key: 'analytics_custom_body', label: 'Ozel Body Kodu', type: 'code', placeholder: '<!-- Ozel script kodlari -->' }
    ]
  },
  {
    id: 'membership',
    title: 'Uyelik Ayarlari',
    icon: Building,
    description: 'Uyelik formu ve bilgilendirme',
    fields: [
      { key: 'membership_fee_annual', label: 'Yillik Uyelik Ucreti', type: 'text', placeholder: '5.000 TL' },
      { key: 'membership_fee_entry', label: 'Giris Ucreti', type: 'text', placeholder: '2.500 TL' },
      { key: 'membership_iban', label: 'IBAN', type: 'text', placeholder: 'TR00 0000 0000 0000 0000 0000 00' },
      { key: 'membership_bank', label: 'Banka Adi', type: 'text', placeholder: 'Banka Adi - Sube' },
      { key: 'membership_notification_email', label: 'Basvuru Bildirim E-postasi', type: 'email', placeholder: 'uyelik@kysd.org.tr' }
    ]
  },
  {
    id: 'dues',
    title: 'Aidat Ayarlari',
    icon: CreditCard,
    description: 'Aidat yillari ve varsayilan degerler',
    fields: [
      { key: 'dues_start_year', label: 'Baslangic Yili', type: 'number', placeholder: '2015', hint: 'Aidat takibinin basladigi yil' },
      { key: 'dues_end_year', label: 'Bitis Yili', type: 'number', placeholder: '2030', hint: 'Aidat takibinin bittigi yil (veya bos birakin surekli devam etsin)' },
      { key: 'dues_default_amount', label: 'Varsayilan Aidat Tutari (TL)', type: 'number', placeholder: '1000', hint: 'Yeni aidat olustururken varsayilan tutar' },
      { key: 'dues_due_day', label: 'Son Odeme Gunu', type: 'number', placeholder: '15', hint: 'Her ayin kacinci gunu son odeme tarihi (1-28)' }
    ]
  },
  {
    id: 'smtp',
    title: 'E-posta Ayarlari',
    icon: Mail,
    description: 'SMTP ve e-posta bildirim ayarlari',
    fields: [
      { key: 'smtp_host', label: 'SMTP Sunucu', type: 'text', placeholder: 'smtp.gmail.com', hint: 'Gmail: smtp.gmail.com, Yandex: smtp.yandex.com' },
      { key: 'smtp_port', label: 'SMTP Port', type: 'number', placeholder: '587', hint: 'TLS: 587, SSL: 465' },
      { key: 'smtp_user', label: 'SMTP Kullanici', type: 'email', placeholder: 'bildirim@kysd.org.tr', icon: Mail },
      { key: 'smtp_pass', label: 'SMTP Sifre', type: 'password', placeholder: '********', hint: 'Gmail icin Uygulama Sifresi kullanin' },
      { key: 'smtp_secure', label: 'SSL/TLS Kullan', type: 'checkbox', hint: 'Port 465 icin aktif, 587 icin pasif' },
      { key: 'smtp_from_name', label: 'Gonderen Adi', type: 'text', placeholder: 'KYSD Bildirim' },
      { key: 'bank_name', label: 'Banka Adi', type: 'text', placeholder: 'Turkiye Is Bankasi - Merkez Subesi', hint: 'Aidat bildirimlerinde gosterilir' },
      { key: 'bank_iban', label: 'IBAN', type: 'text', placeholder: 'TR00 0000 0000 0000 0000 0000 00', hint: 'Aidat bildirimlerinde gosterilir' }
    ]
  },
  {
    id: 'advanced',
    title: 'Gelismis Ayarlar',
    icon: Shield,
    description: 'Gelismis sistem ayarlari',
    fields: [
      { key: 'maintenance_mode', label: 'Bakim Modu', type: 'checkbox', hint: 'Aktif edildiginde site ziyaretcilere kapatilir' },
      { key: 'maintenance_message', label: 'Bakim Mesaji', type: 'textarea', placeholder: 'Sitemiz bakim calismalari nedeniyle gecici olarak kapatilmistir.' },
      { key: 'cache_enabled', label: 'Onbellek Aktif', type: 'checkbox' },
      { key: 'items_per_page', label: 'Sayfa Basina Oge', type: 'number', placeholder: '10' }
    ]
  }
]

export default function Settings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [message, setMessage] = useState(null)
  const [uploading, setUploading] = useState({})
  const [showPassword, setShowPassword] = useState({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings')
      setSettings(response.data)
    } catch (error) {
      console.error('Ayarlar yuklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  const handleImageUpload = async (key, file, folder) => {
    if (!file) return

    setUploading({ ...uploading, [key]: true })

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post(`/upload/single?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      handleChange(key, response.data.url)
      showMessage('Gorsel yuklendi')
    } catch (error) {
      showMessage('Gorsel yuklenemedi', 'error')
    } finally {
      setUploading({ ...uploading, [key]: false })
    }
  }

  const handleRemoveImage = (key) => {
    handleChange(key, '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: typeof value === 'boolean' ? (value ? 'true' : 'false') : (value || ''),
        group: key.split('_')[0]
      }))

      await api.put('/settings/bulk', { settings: settingsArray })
      showMessage('Ayarlar kaydedildi')
    } catch (error) {
      showMessage('Kayit basarisiz', 'error')
    } finally {
      setSaving(false)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const renderField = (field) => {
    const FieldIcon = field.icon

    if (field.type === 'image') {
      const imageUrl = getImageUrl(settings[field.key])
      return (
        <div key={field.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
          {imageUrl ? (
            <div className="relative inline-block">
              <img src={imageUrl} alt={field.label} className="h-20 object-contain bg-gray-100 rounded-lg p-2" />
              <button
                type="button"
                onClick={() => handleRemoveImage(field.key)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              {uploading[field.key] ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Yukle</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(field.key, e.target.files[0], field.folder)}
                className="hidden"
                disabled={uploading[field.key]}
              />
            </label>
          )}
          {field.hint && <p className="text-xs text-gray-400">{field.hint}</p>}
        </div>
      )
    }

    if (field.type === 'checkbox') {
      const isChecked = settings[field.key] === 'true' || settings[field.key] === true
      return (
        <div key={field.key} className="flex items-center justify-between py-3 border-b">
          <div>
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            {field.hint && <p className="text-xs text-gray-400">{field.hint}</p>}
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => handleChange(field.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      )
    }

    if (field.type === 'select') {
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
          <select
            value={settings[field.key] || field.options[0]}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="input"
          >
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )
    }

    if (field.type === 'color') {
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings[field.key] || '#000000'}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={settings[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="input flex-1"
              placeholder={field.placeholder}
            />
          </div>
        </div>
      )
    }

    if (field.type === 'password') {
      const isVisible = showPassword[field.key]
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
          <div className="relative">
            <input
              type={isVisible ? 'text' : 'password'}
              value={settings[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="input pr-10"
              placeholder={field.placeholder}
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, [field.key]: !isVisible })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
        </div>
      )
    }

    if (field.type === 'textarea' || field.type === 'code') {
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
          <textarea
            value={settings[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            rows={field.type === 'code' ? 5 : 3}
            className={`input ${field.type === 'code' ? 'font-mono text-sm' : ''}`}
            placeholder={field.placeholder}
          />
          {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
        </div>
      )
    }

    return (
      <div key={field.key}>
        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
        <div className="relative">
          {FieldIcon && (
            <FieldIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            type={field.type}
            value={settings[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className={`input ${FieldIcon ? 'pl-10' : ''}`}
            placeholder={field.placeholder}
          />
        </div>
        {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  const activeGroup = settingGroups.find(g => g.id === activeTab)

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
          <h1 className="text-2xl font-bold text-gray-800">Site Ayarlari</h1>
          <p className="text-sm text-gray-500 mt-1">Tum site ayarlarini buradan yonetin</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Kaydet
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-2 sticky top-24">
            <div className="space-y-1">
              {settingGroups.map((group) => {
                const Icon = group.icon
                return (
                  <button
                    key={group.id}
                    onClick={() => setActiveTab(group.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === group.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{group.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  {activeGroup && <activeGroup.icon className="w-6 h-6 text-primary-600" />}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{activeGroup?.title}</h2>
                    <p className="text-sm text-gray-500">{activeGroup?.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {activeGroup?.fields.map(renderField)}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Degisiklikleri Kaydet
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
