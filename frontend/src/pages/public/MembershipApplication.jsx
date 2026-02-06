import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, User, Phone, Mail, MapPin, Globe, FileText,
  Users, Calendar, Send, CheckCircle, AlertCircle, ChevronRight, Factory,
  Award, Handshake, BookOpen, Shield, ArrowRight
} from 'lucide-react'
import api from '../../utils/api'
import { toTitleCase } from '../../utils/helpers'

const benefits = [
  { icon: Users, text: 'Güçlü sektörel temsil' },
  { icon: Handshake, text: 'İş birliği fırsatları' },
  { icon: BookOpen, text: 'Eğitim ve seminerler' },
  { icon: Globe, text: 'Fuar katılımları' },
  { icon: FileText, text: 'Sektörel raporlar' },
  { icon: Shield, text: 'Hukuki destek' }
]

export default function MembershipApplication() {
  const [industryGroups, setIndustryGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    taxNumber: '',
    taxOffice: '',
    tradeRegistry: '',
    address: '',
    city: 'İstanbul',
    district: '',
    postalCode: '',
    phone: '',
    fax: '',
    email: '',
    website: '',
    contactName: '',
    contactTitle: '',
    contactPhone: '',
    contactEmail: '',
    industryGroupId: '',
    activityArea: '',
    employeeCount: '',
    foundedYear: ''
  })

  useEffect(() => {
    fetchIndustryGroups()
  }, [])

  const fetchIndustryGroups = async () => {
    try {
      const response = await api.get('/industry-groups')
      setIndustryGroups(response.data)
    } catch (error) {
      console.error('Sanayi grupları yüklenemedi')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/membership-applications', formData)
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setError(error.response?.data?.error || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Başvurunuz Alındı!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Üyelik başvurunuz başarıyla alındı. Yönetim kurulumuz başvurunuzu inceledikten sonra
              sizinle en kısa sürede iletişime geçecektir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Ana Sayfaya Dön
              </Link>
              <Link
                to="/uyeler"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Üye Rehberini İncele
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Üyelik Başvurusu</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">KYSD'ye Katılın</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Üyelik Başvurusu
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl">
              Konfeksiyon yan sanayi sektöründe faaliyet gösteriyorsanız,
              KYSD ailesine katılarak sektördeki güçlü sesinizi duyurun.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Benefits Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent-500" />
                  Üyelik Avantajları
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-600">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-sm">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/neden-uye-olmaliyim"
                  className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium mt-4"
                >
                  Tüm avantajları gör
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Progress Steps */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Başvuru Adımları</h3>
                <div className="space-y-4">
                  {[
                    { num: 1, title: 'Firma Bilgileri', desc: 'Şirket bilgileriniz' },
                    { num: 2, title: 'İletişim', desc: 'Adres ve telefon' },
                    { num: 3, title: 'Yetkili Kişi', desc: 'İletişim kurulacak kişi' },
                    { num: 4, title: 'Faaliyet Alanı', desc: 'Sektör bilgileri' }
                  ].map((step) => (
                    <div
                      key={step.num}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                        activeSection === step.num ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                        activeSection === step.num
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {step.num}
                      </div>
                      <div>
                        <div className={`font-medium ${activeSection === step.num ? 'text-primary-900' : 'text-gray-700'}`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">Yardıma mı ihtiyacınız var?</h3>
                <p className="text-primary-200 text-sm mb-4">
                  Başvuru sürecinde sorularınız için bize ulaşın.
                </p>
                <Link
                  to="/iletisim"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  İletişime Geç
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Firma Bilgileri */}
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                onFocus={() => setActiveSection(1)}
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Firma Bilgileri</h2>
                      <p className="text-sm text-primary-100">Şirketinize ait temel bilgiler</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firma Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Firma unvanınız"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Türü
                    </label>
                    <select
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Anonim Şirket">Anonim Şirket</option>
                      <option value="Limited Şirket">Limited Şirket</option>
                      <option value="Şahıs Şirketi">Şahıs Şirketi</option>
                      <option value="Kolektif Şirket">Kolektif Şirket</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kuruluş Yılı
                    </label>
                    <input
                      type="text"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Örn: 1990"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vergi Numarası
                    </label>
                    <input
                      type="text"
                      name="taxNumber"
                      value={formData.taxNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Vergi numarası"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vergi Dairesi
                    </label>
                    <input
                      type="text"
                      name="taxOffice"
                      value={formData.taxOffice}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Vergi dairesi adı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticaret Sicil No
                    </label>
                    <input
                      type="text"
                      name="tradeRegistry"
                      value={formData.tradeRegistry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Ticaret sicil numarası"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Çalışan Sayısı
                    </label>
                    <select
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    >
                      <option value="">Seçiniz</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-250">101-250</option>
                      <option value="251-500">251-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                onFocus={() => setActiveSection(2)}
              >
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">İletişim Bilgileri</h2>
                      <p className="text-sm text-emerald-100">Firma iletişim bilgileri</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none bg-gray-50 focus:bg-white"
                      placeholder="Açık adres"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şehir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Şehir"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İlçe
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="İlçe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="0212 XXX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faks
                    </label>
                    <input
                      type="tel"
                      name="fax"
                      value={formData.fax}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="0212 XXX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="info@firmaniz.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Web Sitesi
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="www.firmaniz.com veya https://www.firmaniz.com"
                    />
                  </div>
                </div>
              </div>

              {/* Yetkili Bilgileri */}
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                onFocus={() => setActiveSection(3)}
              >
                <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Yetkili Kişi Bilgileri</h2>
                      <p className="text-sm text-violet-100">Başvuru ile ilgili iletişim kurulacak kişi</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Yetkili kişi adı soyadı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ünvan
                    </label>
                    <input
                      type="text"
                      name="contactTitle"
                      value={formData.contactTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Örn: Genel Müdür"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="0532 XXX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="yetkili@firmaniz.com"
                    />
                  </div>
                </div>
              </div>

              {/* Faaliyet Bilgileri */}
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                onFocus={() => setActiveSection(4)}
              >
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Factory className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Faaliyet Bilgileri</h2>
                      <p className="text-sm text-amber-100">Firmanızın faaliyet alanı</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanayi Grubu
                    </label>
                    <select
                      name="industryGroupId"
                      value={formData.industryGroupId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    >
                      <option value="">Sanayi grubu seçiniz</option>
                      {industryGroups.map(group => (
                        <option key={group.id} value={group.id}>
                          {toTitleCase(group.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faaliyet Alanı Açıklaması
                    </label>
                    <textarea
                      name="activityArea"
                      value={formData.activityArea}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none bg-gray-50 focus:bg-white"
                      placeholder="Firmanızın faaliyet alanını ve ürettiği ürünleri kısaca açıklayınız..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-10 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Başvuruyu Gönder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
