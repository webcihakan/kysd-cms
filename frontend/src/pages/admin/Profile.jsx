import { useState, useEffect } from 'react'
import { User, Building, Mail, Phone, Globe, MapPin, FileText, Camera, Lock, CreditCard, Check, Clock, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  // Profil bilgileri
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  // Şirket bilgileri
  const [companyData, setCompanyData] = useState({
    companyName: '',
    taxNumber: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    logo: null
  })

  // Şifre değiştirme
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Aidat bilgileri
  const [dues, setDues] = useState([])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
    fetchCompanyProfile()
    fetchDues()
  }, [user])

  const fetchCompanyProfile = async () => {
    try {
      const response = await api.get('/company-profile/me')
      if (response.data) {
        setCompanyData({
          companyName: response.data.companyName || '',
          taxNumber: response.data.taxNumber || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          website: response.data.website || '',
          description: response.data.description || '',
          logo: response.data.logo || null
        })
      }
    } catch (error) {
      console.error('Şirket profili yüklenemedi:', error)
    }
  }

  const fetchDues = async () => {
    try {
      const response = await api.get('/company-profile/me/dues')
      setDues(response.data)
    } catch (error) {
      console.error('Aidatlar yüklenemedi:', error)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const response = await api.put('/users/me', profileData)
      if (updateUser) {
        updateUser(response.data)
      }
      setMessage({ type: 'success', text: 'Profil bilgileri güncellendi' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Profil güncellenemedi' })
    } finally {
      setLoading(false)
    }
  }

  const handleCompanySubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      await api.put('/company-profile/me', companyData)
      setMessage({ type: 'success', text: 'Şirket bilgileri güncellendi' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Şirket bilgileri güncellenemedi' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('logo', file)

    try {
      const response = await api.post('/company-profile/me/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setCompanyData({ ...companyData, logo: response.data.logo })
      setMessage({ type: 'success', text: 'Logo yüklendi' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Logo yüklenemedi' })
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalı' })
      return
    }

    setLoading(true)
    try {
      await api.put('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage({ type: 'success', text: 'Şifre başarıyla değiştirildi' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Şifre değiştirilemedi' })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
  }

  const getLogoUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  const tabs = [
    { id: 'profile', label: 'Kişisel Bilgiler', icon: User },
    { id: 'company', label: 'Şirket Bilgileri', icon: Building },
    { id: 'password', label: 'Şifre Değiştir', icon: Lock },
    { id: 'dues', label: 'Aidatlarım', icon: CreditCard }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profilim</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Hesap ve şirket bilgilerinizi yönetin</p>
      </div>

      {/* Mesaj */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab İçerikleri */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        {/* Kişisel Bilgiler */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                  user?.role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                  user?.role === 'EDITOR' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {user?.role === 'ADMIN' ? 'Yönetici' : user?.role === 'EDITOR' ? 'Editör' : 'Üye'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  E-posta
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefon
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0532 123 4567"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        )}

        {/* Şirket Bilgileri */}
        {activeTab === 'company' && (
          <form onSubmit={handleCompanySubmit} className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {companyData.logo ? (
                    <img src={getLogoUrl(companyData.logo)} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Building className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Şirket Logosu</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG veya GIF (max. 2MB)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Building className="w-4 h-4 inline mr-1" />
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="ABC Tekstil A.Ş."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Vergi Numarası
                </label>
                <input
                  type="text"
                  value={companyData.taxNumber}
                  onChange={(e) => setCompanyData({...companyData, taxNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Şirket Telefonu
                </label>
                <input
                  type="tel"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0212 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Web Sitesi
                </label>
                <input
                  type="url"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://www.example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Adres
                </label>
                <textarea
                  value={companyData.address}
                  onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                  placeholder="Şirket adresi..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Şirket Açıklaması
                </label>
                <textarea
                  value={companyData.description}
                  onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Şirketiniz hakkında kısa bilgi..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        )}

        {/* Şifre Değiştir */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mevcut Şifre
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Yeni Şifre
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                minLength={6}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">En az 6 karakter</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </button>
            </div>
          </form>
        )}

        {/* Aidatlarım */}
        {activeTab === 'dues' && (
          <div className="space-y-4">
            {dues.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Aidat kaydı bulunmuyor</p>
                <p className="text-sm mt-2">Üyeliğiniz onaylandığında aidatlarınızı buradan takip edebilirsiniz.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dues.map((due) => (
                  <div
                    key={due.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      due.status === 'PAID'
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                        : due.status === 'OVERDUE'
                        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                        : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        due.status === 'PAID'
                          ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300'
                          : due.status === 'OVERDUE'
                          ? 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300'
                      }`}>
                        {due.status === 'PAID' ? <Check className="w-5 h-5" /> :
                         due.status === 'OVERDUE' ? <AlertTriangle className="w-5 h-5" /> :
                         <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {due.year} {due.month ? `- ${due.month}. Ay` : 'Yıllık Aidat'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Son Ödeme: {new Date(due.dueDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(due.amount)}</p>
                      <span className={`text-sm ${
                        due.status === 'PAID' ? 'text-green-600 dark:text-green-400' :
                        due.status === 'OVERDUE' ? 'text-red-600 dark:text-red-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {due.status === 'PAID' ? 'Ödendi' :
                         due.status === 'OVERDUE' ? 'Gecikmiş' : 'Bekliyor'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
