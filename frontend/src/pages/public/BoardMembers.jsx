import { useState, useEffect } from 'react'
import { User, Phone, MapPin, Building2, Crown, Star, Award } from 'lucide-react'
import api from '../../utils/api'

export default function BoardMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await api.get('/board-members')
      setMembers(response.data)
    } catch (error) {
      console.error('Yönetim kurulu üyeleri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const getTitleIcon = (title) => {
    if (title === 'Başkan') return <Crown className="w-5 h-5 text-yellow-500" />
    if (title === 'Başkan Vekili') return <Star className="w-5 h-5 text-amber-500" />
    if (title.includes('Başkan Yardımcısı')) return <Award className="w-5 h-5 text-blue-500" />
    if (title === 'Sayman') return <Award className="w-5 h-5 text-green-500" />
    return null
  }

  const getTitleClass = (title) => {
    if (title === 'Başkan') return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
    if (title === 'Başkan Vekili') return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
    if (title.includes('Başkan Yardımcısı')) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    if (title === 'Sayman') return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
    return 'bg-gray-100 text-gray-700'
  }

  // Başkan ve yönetim üst kademesi
  const executives = members.filter(m =>
    m.title === 'Başkan' ||
    m.title === 'Başkan Vekili' ||
    m.title.includes('Başkan Yardımcısı') ||
    m.title === 'Sayman'
  )

  // Diğer yönetim kurulu üyeleri
  const regularMembers = members.filter(m => m.title === 'Yönetim Kurulu Üyesi')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">KYSD Yönetim Kurulu</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            Konfeksiyon Yan Sanayi Derneği yönetim kurulu üyelerimiz
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Yönetim Kadrosu */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Yönetim Kadrosu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executives.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`px-6 py-4 ${getTitleClass(member.title)}`}>
                  <div className="flex items-center gap-2">
                    {getTitleIcon(member.title)}
                    <span className="font-semibold">{member.title}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                      {member.companyName && (
                        <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{member.companyName}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.address && (
                        <div className="flex items-start gap-2 mt-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{member.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yönetim Kurulu Üyeleri */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Yönetim Kurulu Üyeleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {regularMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm">{member.name}</h3>
                    {member.companyName && (
                      <p className="text-xs text-gray-600 mt-1 truncate" title={member.companyName}>
                        {member.companyName}
                      </p>
                    )}
                    {member.phone && (
                      <p className="text-xs text-gray-500 mt-1">{member.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
