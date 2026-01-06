import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Users, ArrowRight, Factory, Sparkles } from 'lucide-react'
import api from '../../utils/api'
import { toTitleCase } from '../../utils/helpers'
import AdBanner from '../../components/common/AdBanner'

// Her grup için farklı renk teması
const groupColors = [
  { bg: 'bg-blue-100', icon: 'bg-blue-500', hover: 'group-hover:bg-blue-600', text: 'text-blue-600' },
  { bg: 'bg-emerald-100', icon: 'bg-emerald-500', hover: 'group-hover:bg-emerald-600', text: 'text-emerald-600' },
  { bg: 'bg-purple-100', icon: 'bg-purple-500', hover: 'group-hover:bg-purple-600', text: 'text-purple-600' },
  { bg: 'bg-amber-100', icon: 'bg-amber-500', hover: 'group-hover:bg-amber-600', text: 'text-amber-600' },
  { bg: 'bg-rose-100', icon: 'bg-rose-500', hover: 'group-hover:bg-rose-600', text: 'text-rose-600' },
  { bg: 'bg-cyan-100', icon: 'bg-cyan-500', hover: 'group-hover:bg-cyan-600', text: 'text-cyan-600' },
  { bg: 'bg-indigo-100', icon: 'bg-indigo-500', hover: 'group-hover:bg-indigo-600', text: 'text-indigo-600' },
  { bg: 'bg-teal-100', icon: 'bg-teal-500', hover: 'group-hover:bg-teal-600', text: 'text-teal-600' },
]

export default function IndustryGroupList() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalMembers, setTotalMembers] = useState(0)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.get('/industry-groups')
      // A-Z sirala (Turkce karakterleri destekle)
      const sortedGroups = [...response.data].sort((a, b) =>
        a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' })
      )
      setGroups(sortedGroups)
      // Toplam üye sayısını hesapla
      const total = response.data.reduce((acc, group) => {
        return acc + (group._count?.members || group.members?.length || 0)
      }, 0)
      setTotalMembers(total)
    } catch (error) {
      console.error('Sanayi grupları yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const getColorScheme = (index) => {
    return groupColors[index % groupColors.length]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Factory className="w-5 h-5 text-accent-400" />
                <span className="text-white/90 text-sm font-medium">KYSD Üye Firmalar</span>
              </div>
              <Link
                to="/uyeler"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors"
              >
                <Users className="w-4 h-4" />
                Tüm Üyeleri Listele
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Sanayi Grupları ve Üyeler
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
              Konfeksiyon yan sanayi sektöründe faaliyet gösteren üye firmalarımızı keşfedin
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{groups.length}</div>
                <div className="text-primary-200 text-sm">Sanayi Grubu</div>
              </div>
              <div className="w-px h-12 bg-primary-400/30"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent-400">{totalMembers}</div>
                <div className="text-primary-200 text-sm">Üye Firma</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500">Gruplar yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* Groups Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groups.map((group, index) => {
                const colors = getColorScheme(index)
                const memberCount = group._count?.members || group.members?.length || 0

                return (
                  <Link
                    key={group.id}
                    to={`/sanayi-grubu/${group.slug}`}
                    className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      {/* Icon */}
                      <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <Building2 className={`w-7 h-7 ${colors.text}`} />
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {toTitleCase(group.name)}
                      </h3>

                      {/* Description */}
                      {group.description && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                          {group.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center`}>
                            <Users className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {memberCount} Üye
                          </span>
                        </div>

                        <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center group-hover:${colors.icon} transition-colors`}>
                          <ArrowRight className={`w-4 h-4 ${colors.text} group-hover:translate-x-0.5 transition-transform`} />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Empty State */}
            {groups.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Factory className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz sanayi grubu bulunmuyor</h3>
                <p className="text-gray-500">Sanayi grupları eklendiğinde burada görünecektir.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sanayi Grupları Arası Reklam */}
      <div className="container mx-auto px-4 py-8">
        <AdBanner code="industry-between" />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-10 h-10 text-accent-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            KYSD'ye Üye Olmak İster misiniz?
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Konfeksiyon yan sanayi sektöründe yer alıyorsanız, KYSD ailesine katılarak avantajlardan yararlanın.
          </p>
          <Link
            to="/iletisim"
            className="inline-flex items-center gap-2 bg-white text-primary-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Bize Ulaşın
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
