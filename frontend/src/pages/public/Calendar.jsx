import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, List, Grid,
  Building, GraduationCap, Target, PartyPopper, MapPin, Clock,
  ChevronRight as ChevronRightIcon, Filter, X
} from 'lucide-react'
import api from '../../utils/api'

const eventTypeConfig = {
  fair: {
    name: 'Fuar',
    icon: Building,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  training: {
    name: 'Eğitim',
    icon: GraduationCap,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  project: {
    name: 'Proje',
    icon: Target,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  holiday: {
    name: 'Tatil',
    icon: PartyPopper,
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  }
}

export default function Calendar() {
  const [viewMode, setViewMode] = useState('calendar')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTypes, setSelectedTypes] = useState(['fair', 'training', 'project', 'holiday'])
  const [summary, setSummary] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const response = await api.get(`/calendar/events?year=${year}&month=${month}`)
      setEvents(response.data.events || [])
      setSummary(response.data.summary)
    } catch (error) {
      console.error('Etkinlikler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getEventsForDate = (date) => {
    if (!date) return []

    return events.filter(event => {
      if (!selectedTypes.includes(event.type)) return false

      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const filteredEvents = events.filter(e => selectedTypes.includes(e.type))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

  const handleDayClick = (date) => {
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length > 0) {
      setSelectedDate({ date, events: dayEvents })
    }
  }

  const handleEventClick = (event, e) => {
    e.stopPropagation()
    setSelectedEvent(event)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-primary-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-primary-400" />
            <span className="text-white font-medium">Takvim</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <CalendarIcon className="w-5 h-5 text-accent-400" />
              <span className="text-white/90 text-sm font-medium">Etkinlik Takvimi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Etkinlik Takvimi</h1>
            <p className="text-lg text-primary-100">
              Fuarlar, eğitimler, projeler ve önemli günleri tek bir takvimde takip edin.
            </p>
          </div>
        </div>
      </div>

      {/* Özet İstatistikler */}
      {summary && (
        <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
                <div className="text-sm text-gray-500">Toplam Etkinlik</div>
              </div>
              {Object.entries(eventTypeConfig).map(([type, config]) => (
                <div key={type} className="text-center">
                  <div className={`w-12 h-12 ${config.lightColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <config.icon className={`w-6 h-6 ${config.textColor}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{summary[type + 's'] || 0}</div>
                  <div className="text-sm text-gray-500">{config.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8">
        {/* Kontroller */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Ay Navigasyonu */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 min-w-[180px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Görünüm Modu */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-sm font-medium">Takvim</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">Liste</span>
              </button>
            </div>
          </div>

          {/* Filtreler */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filtrele:</span>
            </div>
            {Object.entries(eventTypeConfig).map(([type, config]) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTypes.includes(type)
                    ? `${config.color} text-white`
                    : `${config.lightColor} ${config.textColor}`
                  }`}
              >
                <config.icon className="w-4 h-4" />
                {config.name}
                {!selectedTypes.includes(type) && <X className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Takvim veya Liste Görünümü */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : viewMode === 'calendar' ? (
          /* TAKVIM GÖRÜNÜMÜ */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Gün başlıkları */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Takvim günleri */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-200">
              {getDaysInMonth(currentDate).map((date, index) => {
                const dayEvents = date ? getEventsForDate(date) : []
                const isToday = date && date.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={index}
                    onClick={() => date && handleDayClick(date)}
                    className={`min-h-[120px] p-2 ${date ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                      } transition-colors`}
                  >
                    {date && (
                      <>
                        <div className={`text-right mb-2 ${isToday ? 'font-bold text-primary-600' : 'text-gray-700'
                          }`}>
                          {isToday && (
                            <span className="inline-block w-6 h-6 bg-primary-600 text-white rounded-full text-xs leading-6 text-center">
                              {date.getDate()}
                            </span>
                          )}
                          {!isToday && date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event, idx) => {
                            const config = eventTypeConfig[event.type]
                            return (
                              <div
                                key={idx}
                                onClick={(e) => handleEventClick(event, e)}
                                className={`${config.lightColor} ${config.textColor} ${config.borderColor} border-l-2 px-1.5 py-0.5 text-xs rounded cursor-pointer hover:shadow-sm transition-shadow`}
                                title={event.title}
                              >
                                <div className="flex items-center gap-1">
                                  <config.icon className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{event.title}</span>
                                </div>
                              </div>
                            )
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 pl-1">
                              +{dayEvents.length - 2} daha
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* LİSTE GÖRÜNÜMÜ */
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Etkinlik Bulunamadı</h3>
                <p className="text-gray-500">Seçilen filtreler için etkinlik bulunamadı.</p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const config = eventTypeConfig[event.type]
                return (
                  <div
                    key={`${event.type}-${event.id}`}
                    onClick={() => setSelectedEvent(event)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Tarih Kutusu */}
                      <div className={`md:w-32 ${config.color} text-white p-4 flex flex-col items-center justify-center`}>
                        <div className="text-3xl font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-sm opacity-90">
                          {monthNames[new Date(event.date).getMonth()]}
                        </div>
                        <div className="text-xs opacity-75">
                          {new Date(event.date).getFullYear()}
                        </div>
                      </div>

                      {/* Etkinlik Bilgileri */}
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.lightColor} ${config.textColor}`}>
                            <config.icon className="w-4 h-4" />
                            {config.name}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        {event.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          {event.eventTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{event.eventTime}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Etkinlik Detay Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const config = eventTypeConfig[selectedEvent.type]
              return (
                <>
                  {/* Modal Header */}
                  <div className={`${config.color} text-white p-6`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <config.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm opacity-90 mb-1">{config.name}</div>
                          <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-6">
                    {/* Tarih ve Yer Bilgileri */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${config.lightColor} ${config.borderColor} border-l-4 p-4 rounded-lg`}>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Tarih</span>
                        </div>
                        <div className={`font-semibold ${config.textColor}`}>
                          {formatDate(selectedEvent.date)}
                        </div>
                        {selectedEvent.endDate && (
                          <div className="text-sm text-gray-600 mt-1">
                            - {formatDate(selectedEvent.endDate)}
                          </div>
                        )}
                      </div>

                      {selectedEvent.eventTime && (
                        <div className={`${config.lightColor} ${config.borderColor} border-l-4 p-4 rounded-lg`}>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Clock className="w-4 h-4" />
                            <span>Saat</span>
                          </div>
                          <div className={`font-semibold ${config.textColor}`}>
                            {selectedEvent.eventTime}
                          </div>
                        </div>
                      )}

                      {selectedEvent.location && (
                        <div className={`${config.lightColor} ${config.borderColor} border-l-4 p-4 rounded-lg md:col-span-2`}>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <MapPin className="w-4 h-4" />
                            <span>Konum</span>
                          </div>
                          <div className={`font-semibold ${config.textColor}`}>
                            {selectedEvent.location}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Açıklama */}
                    {selectedEvent.description && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Açıklama</h3>
                        <div className="prose prose-sm max-w-none text-gray-600">
                          {selectedEvent.description}
                        </div>
                      </div>
                    )}

                    {/* Ek Bilgiler */}
                    {selectedEvent.type === 'holiday' && selectedEvent.holidayType && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tatil Türü</h3>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${config.lightColor} ${config.textColor}`}>
                          {selectedEvent.holidayType === 'national' && 'Ulusal Bayram'}
                          {selectedEvent.holidayType === 'religious' && 'Dini Bayram'}
                          {selectedEvent.holidayType === 'official' && 'Resmi Tatil'}
                        </span>
                      </div>
                    )}

                    {selectedEvent.type === 'fair' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedEvent.deadline && (
                          <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Başvuru Deadline</h3>
                            <div className="text-gray-900">{formatDate(selectedEvent.deadline)}</div>
                          </div>
                        )}
                        {selectedEvent.websiteUrl && (
                          <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Website</h3>
                            <a
                              href={selectedEvent.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {selectedEvent.websiteUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Gün Detay Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-1">Günün Etkinlikleri</div>
                  <h2 className="text-2xl font-bold">
                    {selectedDate.date.toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      weekday: 'long'
                    })}
                  </h2>
                  <div className="text-sm opacity-90 mt-2">
                    {selectedDate.events.length} etkinlik
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3">
              {selectedDate.events.map((event, idx) => {
                const config = eventTypeConfig[event.type]
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDate(null)
                      setSelectedEvent(event)
                    }}
                    className={`${config.lightColor} ${config.borderColor} border-l-4 p-4 rounded-lg cursor-pointer hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <config.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.color} text-white`}>
                            {config.name}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          {event.eventTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.eventTime}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
