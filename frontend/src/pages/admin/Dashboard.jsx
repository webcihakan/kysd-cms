import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Newspaper, Bell, Building2, Users, Mail, Eye,
  CreditCard, Receipt, FolderOpen, GraduationCap, Building,
  DollarSign, Check, Clock, AlertTriangle, TrendingUp, TrendingDown,
  UserPlus, RefreshCw, Database, CheckCircle, XCircle, Loader2
} from 'lucide-react'
import api from '../../utils/api'

// İsmi düzgün formata çevir
const formatName = (name) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    pages: 0,
    news: 0,
    announcements: 0,
    industryGroups: 0,
    members: 0,
    users: 0,
    contacts: 0,
    unreadContacts: 0,
    projects: 0,
    trainings: 0,
    fairs: 0
  })
  const [duesStats, setDuesStats] = useState(null)
  const [expensesStats, setExpensesStats] = useState(null)
  const [membershipApplications, setMembershipApplications] = useState([])
  const [recentNews, setRecentNews] = useState([])
  const [recentContacts, setRecentContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [scraperStatus, setScraperStatus] = useState({})
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchDashboardData()
    fetchScraperStatus()
  }, [])

  const fetchScraperStatus = async () => {
    try {
      const response = await api.get('/scrapers/status')
      setScraperStatus(response.data)
    } catch (error) {
      console.error('Scraper durumu alinamadi:', error)
    }
  }

  const runDataUpdate = async (scraperName = 'all') => {
    setIsUpdating(true)
    setUpdateMessage('')

    try {
      const endpoint = scraperName === 'all' ? '/scrapers/run-all' : `/scrapers/run/${scraperName}`
      await api.post(endpoint)

      setUpdateMessage(scraperName === 'all'
        ? 'Tum veriler guncelleniyor. Bu islem birkaç dakika surebilir.'
        : `${scraperName} verileri guncelleniyor...`)

      // 5 saniye sonra durumu kontrol et
      setTimeout(() => {
        fetchScraperStatus()
        setIsUpdating(false)
        setUpdateMessage('Guncelleme tamamlandi!')
        fetchDashboardData() // Dashboard verilerini yenile
      }, 5000)
    } catch (error) {
      setUpdateMessage('Guncelleme sirasinda hata olustu: ' + error.message)
      setIsUpdating(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const [pagesRes, newsRes, announcementsRes, groupsRes, membersRes, usersRes, contactsRes, projectsRes, trainingsRes, fairsRes, duesRes, expensesRes, applicationsRes] = await Promise.all([
        api.get('/pages?all=true'),
        api.get('/news?all=true&limit=5'),
        api.get('/announcements?all=true'),
        api.get('/industry-groups?all=true'),
        api.get('/industry-members/all'),
        api.get('/users'),
        api.get('/contacts'),
        api.get('/projects'),
        api.get('/trainings'),
        api.get('/fairs'),
        api.get(`/member-dues/summary?year=${currentYear}`),
        api.get(`/expenses?year=${currentYear}`),
        api.get('/membership-applications?status=pending').catch(() => ({ data: [] }))
      ])

      setStats({
        pages: pagesRes.data.length,
        news: newsRes.data.total,
        announcements: announcementsRes.data.total,
        industryGroups: groupsRes.data.length || groupsRes.data.groups?.length || 0,
        members: membersRes.data.length,
        users: usersRes.data.total,
        contacts: contactsRes.data.total,
        unreadContacts: contactsRes.data.unreadCount,
        projects: projectsRes.data.total || projectsRes.data.length || 0,
        trainings: trainingsRes.data.total || trainingsRes.data.length || 0,
        fairs: fairsRes.data.total || fairsRes.data.length || 0
      })

      setDuesStats(duesRes.data)

      // Gider özeti hesapla
      const expenses = expensesRes.data.expenses || expensesRes.data
      const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
      const monthlyAvg = totalExpenses / 12
      setExpensesStats({
        total: totalExpenses,
        monthlyAvg: monthlyAvg,
        count: expenses.length
      })

      setRecentNews(newsRes.data.news || [])
      setRecentContacts(contactsRes.data.contacts?.slice(0, 5) || [])

      // Üyelik başvuruları
      const applications = applicationsRes.data.applications || applicationsRes.data || []
      setMembershipApplications(applications.slice(0, 5))
    } catch (error) {
      console.error('Dashboard verileri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0)
  }

  const statCards = [
    { label: 'Sayfalar', value: stats.pages, icon: FileText, color: 'bg-blue-500', link: '/admin/sayfalar' },
    { label: 'Haberler', value: stats.news, icon: Newspaper, color: 'bg-green-500', link: '/admin/haberler' },
    { label: 'Duyurular', value: stats.announcements, icon: Bell, color: 'bg-yellow-500', link: '/admin/duyurular' },
    { label: 'Sanayi Grupları', value: stats.industryGroups, icon: Building2, color: 'bg-purple-500', link: '/admin/sanayi-gruplari' },
    { label: 'Üye Firmalar', value: stats.members, icon: Users, color: 'bg-indigo-500', link: '/admin/uyeler' },
    { label: 'Mesajlar', value: stats.contacts, icon: Mail, color: 'bg-orange-500', link: '/admin/mesajlar', badge: stats.unreadContacts }
  ]

  const eventCards = [
    { label: 'Projeler', value: stats.projects, icon: FolderOpen, color: 'bg-cyan-500', link: '/admin/projeler' },
    { label: 'Eğitimler', value: stats.trainings, icon: GraduationCap, color: 'bg-teal-500', link: '/admin/egitimler' },
    { label: 'Fuarlar', value: stats.fairs, icon: Building, color: 'bg-rose-500', link: '/admin/fuarlar' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

        {/* Veri Guncelleme Butonu */}
        <div className="flex items-center gap-3">
          {updateMessage && (
            <span className={`text-sm ${updateMessage.includes('hata') ? 'text-red-600' : 'text-green-600'}`}>
              {updateMessage}
            </span>
          )}
          <button
            onClick={() => runDataUpdate('all')}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium text-sm transition-colors"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isUpdating ? 'Guncelleniyor...' : 'Verileri Guncelle'}
          </button>
        </div>
      </div>

      {/* Veri Kaynaklari Durumu */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-gray-800 dark:text-white">Otomatik Veri Kaynaklari</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { key: 'haber', label: 'Haberler', icon: Newspaper },
            { key: 'mevzuat', label: 'Mevzuat', icon: FileText },
            { key: 'tesvik', label: 'Tesvikler', icon: DollarSign },
            { key: 'rapor', label: 'Raporlar', icon: FileText },
            { key: 'egitim', label: 'Egitimler', icon: GraduationCap },
            { key: 'fuar', label: 'Fuarlar', icon: Building },
            { key: 'proje', label: 'Projeler', icon: FolderOpen }
          ].map(({ key, label, icon: Icon }) => {
            const status = scraperStatus[key]
            return (
              <button
                key={key}
                onClick={() => runDataUpdate(key)}
                disabled={isUpdating}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </div>
                {status && (
                  <div className="flex items-center gap-1 text-xs">
                    {status.status === 'success' ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : status.status === 'error' ? (
                      <XCircle className="w-3 h-3 text-red-500" />
                    ) : status.status === 'running' ? (
                      <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                    ) : (
                      <Clock className="w-3 h-3 text-gray-400" />
                    )}
                    <span className="text-gray-500 dark:text-gray-400">
                      {status.count > 0 ? `${status.count} kayit` : 'Bekliyor'}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          * Veriler her gun saat 06:00'da otomatik guncellenir. Manuel guncelleme icin butona tiklayin.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow relative"
          >
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            {card.badge > 0 && (
              <span className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {card.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Etkinlikler */}
      <div className="grid grid-cols-3 gap-4">
        {eventCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Aidat ve Gider Özeti */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Aidat Özeti */}
        <Link to="/admin/aidatlar" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-800 dark:text-white">{currentYear} Aidat Durumu</h2>
            </div>
            <span className="text-sm text-primary-600 dark:text-primary-400">Detaylar →</span>
          </div>
          {duesStats && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Toplam</p>
                    <p className="font-bold text-gray-800 dark:text-white">{formatCurrency(duesStats.totalAmount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ödenen ({duesStats.paidCount})</p>
                    <p className="font-bold text-green-600">{formatCurrency(duesStats.paidAmount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bekleyen ({duesStats.pendingCount})</p>
                    <p className="font-bold text-yellow-600">{formatCurrency(duesStats.pendingAmount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gecikmiş ({duesStats.overdueCount})</p>
                    <p className="font-bold text-red-600">{formatCurrency(duesStats.overdueAmount)}</p>
                  </div>
                </div>
              </div>
              {/* İlerleme Çubuğu */}
              {duesStats.totalAmount > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Tahsilat Oranı</span>
                    <span>{Math.round((duesStats.paidAmount / duesStats.totalAmount) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${(duesStats.paidAmount / duesStats.totalAmount) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Link>

        {/* Gider Özeti */}
        <Link to="/admin/giderler" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-red-600" />
              <h2 className="font-semibold text-gray-800 dark:text-white">{currentYear} Gider Özeti</h2>
            </div>
            <span className="text-sm text-primary-600 dark:text-primary-400">Detaylar →</span>
          </div>
          {expensesStats && (
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Toplam Gider</p>
                      <p className="text-xl font-bold text-red-600">{formatCurrency(expensesStats.total)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Kayıt Sayısı</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">{expensesStats.count}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Aylık Ortalama</p>
                    <p className="font-bold text-gray-800 dark:text-white">{formatCurrency(expensesStats.monthlyAvg)}</p>
                  </div>
                </div>
                {/* Gelir-Gider Karşılaştırması */}
                {duesStats && (
                  <div className={`p-3 rounded-lg ${duesStats.paidAmount > expensesStats.total ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gelir - Gider Farkı</p>
                    <p className={`font-bold ${duesStats.paidAmount > expensesStats.total ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(duesStats.paidAmount - expensesStats.total)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-white">Son Haberler</h2>
            <Link to="/admin/haberler" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800">
              Tümünü Gör →
            </Link>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {recentNews.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Henüz haber yok
              </div>
            ) : (
              recentNews.map((news) => (
                <Link
                  key={news.id}
                  to={`/admin/haberler/${news.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {news.image ? (
                    <img src={news.image} alt="" className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <Newspaper className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-white truncate">{news.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Eye className="w-3 h-3" />
                      {news.viewCount} görüntülenme
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Üyelik Başvuruları */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              Üyelik Başvuruları
            </h2>
            <Link to="/admin/uyelik-basvurulari" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800">
              Tümünü Gör →
            </Link>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {membershipApplications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Bekleyen başvuru yok
              </div>
            ) : (
              membershipApplications.map((app) => (
                <Link
                  key={app.id}
                  to="/admin/uyelik-basvurulari"
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 font-semibold">
                    {(app.companyName || app.name)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-white truncate">
                      {formatName(app.companyName || app.name)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {app.email} • {app.phone}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                    Bekliyor
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-white">Son Mesajlar</h2>
            <Link to="/admin/mesajlar" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800">
              Tümünü Gör →
            </Link>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {recentContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Henüz mesaj yok
              </div>
            ) : (
              recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  to="/admin/mesajlar"
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !contact.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !contact.isRead ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {contact.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-white truncate">{formatName(contact.name)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.subject || contact.message}</p>
                  </div>
                  {!contact.isRead && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
