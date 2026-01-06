import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  ChevronRight,
  Clock,
  MessageCircle,
  Building2,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  User,
  FileText
} from 'lucide-react'
import api from '../../utils/api'
import AdBanner from '../../components/common/AdBanner'

export default function Contact() {
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings')
      setSettings(response.data)
    } catch (error) {
      console.error('Ayarlar yüklenemedi')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/contacts', formData)
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      setError(error.response?.data?.error || 'Mesaj gönderilemedi')
    } finally {
      setLoading(false)
    }
  }

  const subjectOptions = [
    'Genel Bilgi',
    'Üyelik Başvurusu',
    'Reklam Başvurusu',
    'Fuar Katılımı',
    'Eğitim ve Seminerler',
    'Proje İşbirliği',
    'Şikayet / Öneri',
    'Diğer'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">İletişim</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MessageCircle className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Bize Ulaşın</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              İletişim
            </h1>
            <p className="text-lg text-primary-100">
              Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Address Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Adres</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {settings.contact_address || 'İstanbul, Türkiye'}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.contact_address || 'İstanbul')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium mt-4 hover:text-primary-700"
            >
              Haritada Göster
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Telefon</h3>
            <a
              href={`tel:${settings.contact_phone}`}
              className="text-gray-600 text-sm hover:text-primary-600 block"
            >
              {settings.contact_phone || '+90 212 XXX XX XX'}
            </a>
            <p className="text-gray-400 text-xs mt-2">Hafta içi 09:00 - 18:00</p>
            <a
              href={`tel:${settings.contact_phone}`}
              className="inline-flex items-center gap-1 text-green-600 text-sm font-medium mt-4 hover:text-green-700"
            >
              Hemen Ara
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">E-posta</h3>
            <a
              href={`mailto:${settings.contact_email}`}
              className="text-gray-600 text-sm hover:text-primary-600 block"
            >
              {settings.contact_email || 'info@kysd.org.tr'}
            </a>
            <p className="text-gray-400 text-xs mt-2">24 saat içinde yanıt</p>
            <a
              href={`mailto:${settings.contact_email}`}
              className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium mt-4 hover:text-blue-700"
            >
              E-posta Gönder
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Working Hours */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-bold text-gray-900">Çalışma Saatleri</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pazartesi - Cuma</span>
                  <span className="font-medium text-gray-900">{settings.hours_weekdays || '09:00 - 18:00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cumartesi</span>
                  <span className="font-medium text-gray-900">{settings.hours_saturday || 'Kapalı'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pazar</span>
                  <span className="font-medium text-red-500">{settings.hours_sunday || 'Kapalı'}</span>
                </div>
                {settings.hours_note && (
                  <p className="text-xs text-gray-400 pt-2 border-t">{settings.hours_note}</p>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Hızlı Bağlantılar</h3>
              <div className="space-y-3">
                <Link
                  to="/uyelik-basvurusu"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <User className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                  <span className="text-sm text-gray-600 group-hover:text-primary-600">Üyelik Başvurusu</span>
                </Link>
                <Link
                  to="/fuarlar"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <Globe className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                  <span className="text-sm text-gray-600 group-hover:text-primary-600">Fuar Katılımı</span>
                </Link>
                <Link
                  to="/egitimler-seminerler"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                  <span className="text-sm text-gray-600 group-hover:text-primary-600">Eğitim Programları</span>
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-4">Sosyal Medya</h3>
              <p className="text-primary-100 text-sm mb-4">
                Bizi sosyal medyada takip edin, sektördeki gelişmelerden haberdar olun.
              </p>
              <div className="flex gap-3">
                {settings.social_facebook && (
                  <a
                    href={settings.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings.social_twitter && (
                  <a
                    href={settings.social_twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {settings.social_linkedin && (
                  <a
                    href={settings.social_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {settings.social_instagram && (
                  <a
                    href={settings.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">İletişim Formu</h2>
                  <p className="text-gray-500 text-sm">Bize mesaj gönderin, en kısa sürede dönüş yapalım.</p>
                </div>
              </div>

              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Mesajınız Gönderildi!</h3>
                  <p className="text-gray-600 mb-6">En kısa sürede size dönüş yapacağız.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Yeni Mesaj Gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adınız Soyadınız *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta Adresi *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon Numarası
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="+90 5XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konu
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      >
                        <option value="">Konu Seçiniz</option>
                        {subjectOptions.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesajınız *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">* Zorunlu alanlar</p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Mesaj Gönder
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Konum</h3>
                <p className="text-gray-500 text-sm">{settings.contact_address || 'İstanbul, Türkiye'}</p>
              </div>
            </div>
          </div>
          <div className="aspect-[21/9] bg-gray-100">
            {settings.contact_map_embed ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: settings.contact_map_embed }}
              />
            ) : (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.9024543!2d28.87445!3d41.0421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb7b1e4b1a93%3A0x4ce7c6b67f0e4c27!2sGiyimkent%20Sitesi%2C%20Esenler%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1703672400000!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KYSD Konum - Giyimkent Sitesi 11. Sokak No:33 Esenler"
              ></iframe>
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
              <h2 className="text-2xl font-bold text-white mb-2">
                KYSD Ailesine Katılın
              </h2>
              <p className="text-primary-100">
                Üye olarak tüm avantajlardan yararlanın.
              </p>
            </div>
            <Link
              to="/uyelik-basvurusu"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Üyelik Başvurusu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
