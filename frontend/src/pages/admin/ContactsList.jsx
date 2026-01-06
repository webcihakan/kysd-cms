import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2, Eye, X } from 'lucide-react'
import api from '../../utils/api'
import { formatDateTime } from '../../utils/helpers'

export default function ContactsList() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchContacts()
  }, [page])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/contacts?page=${page}&limit=10`)
      setContacts(response.data.contacts)
      setTotalPages(response.data.totalPages)
      setUnreadCount(response.data.unreadCount)
    } catch (error) {
      console.error('Mesajlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (contact) => {
    setSelectedContact(contact)

    if (!contact.isRead) {
      try {
        await api.put(`/contacts/${contact.id}/read`, { isRead: true })
        fetchContacts()
      } catch (error) {
        console.error('Durum güncellenemedi')
      }
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/contacts/${id}`)
      setSelectedContact(null)
      fetchContacts()
    } catch (error) {
      alert('Mesaj silinemedi')
    }
  }

  const toggleRead = async (contact, e) => {
    e.stopPropagation()

    try {
      await api.put(`/contacts/${contact.id}/read`, { isRead: !contact.isRead })
      fetchContacts()
    } catch (error) {
      alert('Durum güncellenemedi')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gelen Mesajlar</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">{unreadCount} okunmamış mesaj</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2">
          <div className="card">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Henüz mesaj bulunmuyor</div>
            ) : (
              <div className="divide-y">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleView(contact)}
                    className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !contact.isRead ? 'bg-blue-50' : ''
                    } ${selectedContact?.id === contact.id ? 'bg-primary-50' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !contact.isRead ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {contact.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${!contact.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {contact.name}
                        </span>
                        {!contact.isRead && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                      <p className={`text-sm truncate mt-1 ${!contact.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                        {contact.subject || contact.message}
                      </p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {formatDateTime(contact.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => toggleRead(contact, e)}
                        className="p-1.5 hover:bg-gray-200 rounded"
                        title={contact.isRead ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                      >
                        {contact.isRead ? (
                          <MailOpen className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Mail className="w-4 h-4 text-primary-500" />
                        )}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                        className="p-1.5 hover:bg-gray-200 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded ${page === i + 1 ? 'bg-primary-800 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div>
          {selectedContact ? (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">Mesaj Detayı</h3>
                <button onClick={() => setSelectedContact(null)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Gönderen</label>
                  <p className="font-medium text-gray-800">{selectedContact.name}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500">E-posta</label>
                  <p className="text-gray-700">
                    <a href={`mailto:${selectedContact.email}`} className="text-primary-600 hover:underline">
                      {selectedContact.email}
                    </a>
                  </p>
                </div>

                {selectedContact.phone && (
                  <div>
                    <label className="text-xs text-gray-500">Telefon</label>
                    <p className="text-gray-700">
                      <a href={`tel:${selectedContact.phone}`} className="text-primary-600 hover:underline">
                        {selectedContact.phone}
                      </a>
                    </p>
                  </div>
                )}

                {selectedContact.subject && (
                  <div>
                    <label className="text-xs text-gray-500">Konu</label>
                    <p className="text-gray-700">{selectedContact.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500">Mesaj</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Tarih</label>
                  <p className="text-gray-700">{formatDateTime(selectedContact.createdAt)}</p>
                </div>

                <div className="pt-4 flex gap-2">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'İletişim Formu'}`}
                    className="btn-primary flex-1 text-center"
                  >
                    Yanıtla
                  </a>
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="btn-secondary text-red-600"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
