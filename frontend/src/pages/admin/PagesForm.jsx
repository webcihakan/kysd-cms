import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Save, Upload, Eye, Trash2, Image as ImageIcon,
  FileText, Globe, Settings, Info, ExternalLink, AlertCircle
} from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import api from '../../utils/api'

// Quill editör ayarları
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ]
}

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet', 'indent',
  'direction', 'align',
  'blockquote', 'code-block',
  'link', 'image', 'video'
]

// Slug'a göre frontend URL'i döndür
const getPageUrl = (slug) => {
  const urlMap = {
    'hakkimizda': '/hakkimizda',
    'yonetim-kurulu': '/yonetim-kurulu',
    'tuzuk': '/tuzuk',
    'neden-uye-olmaliyim': '/neden-uye-olmaliyim',
    'uyelik-basvurusu': '/uyelik-basvurusu',
    'uyeler': '/uyeler',
    'sanayi-gruplari': '/sanayi-gruplari',
    'sektor-raporlari': '/sektor-raporlari',
    'mevzuat': '/mevzuat',
    'tesvik-destekler': '/tesvik-ve-destekler',
    'kysd-akademi': '/kysd-akademi',
    'egitimler': '/egitimler-seminerler',
    'fuarlar': '/fuarlar',
    'projeler': '/projeler',
    'galeri': '/galeri',
    'gizlilik-politikasi': '/sayfa/gizlilik-politikasi',
    'kullanim-kosullari': '/sayfa/kullanim-kosullari'
  }
  return urlMap[slug] || `/sayfa/${slug}`
}

export default function PagesForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    isActive: true,
    metaTitle: '',
    metaDesc: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [hasChanges, setHasChanges] = useState(false)
  const [originalData, setOriginalData] = useState(null)

  useEffect(() => {
    if (isEdit) {
      fetchPage()
    }
  }, [id])

  // Değişiklikleri izle
  useEffect(() => {
    if (originalData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalData)
      setHasChanges(changed)
    }
  }, [formData, originalData])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/pages/${id}`)
      setFormData(response.data)
      setOriginalData(response.data)
    } catch (error) {
      alert('Sayfa yüklenemedi')
      navigate('/admin/sayfalar')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const form = new FormData()
    form.append('file', file)

    try {
      const response = await api.post('/upload/single?folder=pages', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFormData({ ...formData, image: response.data.url })
    } catch (error) {
      alert('Görsel yüklenemedi')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isEdit) {
        await api.put(`/pages/${id}`, formData)
      } else {
        await api.post('/pages', formData)
      }
      navigate('/admin/sayfalar')
    } catch (error) {
      alert('Kayıt başarısız: ' + (error.response?.data?.error || error.message))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
          <p className="mt-4 text-gray-500">Sayfa yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/sayfalar')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Sayfa Düzenle' : 'Yeni Sayfa'}
            </h1>
            {isEdit && formData.slug && (
              <a
                href={getPageUrl(formData.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
              >
                {getPageUrl(formData.slug)}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Kaydedilmemiş değişiklikler
            </span>
          )}
          {isEdit && formData.slug && (
            <a
              href={getPageUrl(formData.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Önizle
            </a>
          )}
          <button
            type="submit"
            form="page-form"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Kaydet
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'content', label: 'İçerik', icon: FileText },
            { id: 'media', label: 'Medya', icon: ImageIcon },
            { id: 'seo', label: 'SEO', icon: Globe },
            { id: 'settings', label: 'Ayarlar', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <form id="page-form" onSubmit={handleSubmit}>
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayfa Başlığı *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input text-lg"
                    placeholder="Sayfa başlığını girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kısa Açıklama (Excerpt)
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt || ''}
                    onChange={handleChange}
                    rows={3}
                    className="input"
                    placeholder="Sayfanın kısa açıklaması (listelemelerde görünür)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayfa İçeriği *
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-white"
                      style={{ minHeight: '400px' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Zengin metin editörü ile içeriğinizi biçimlendirin. Resim, video ve link ekleyebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="card p-6">
            <h3 className="font-medium text-gray-800 mb-4">Sayfa Görseli</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu görsel sayfa başlığının yanında veya listemelerde gösterilir.
            </p>

            {formData.image ? (
              <div className="relative max-w-md">
                <img
                  src={formData.image}
                  alt=""
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <label className="p-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 max-w-md border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">Görsel yüklemek için tıklayın</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">SEO Ayarları</p>
                  <p className="text-blue-600 mt-1">
                    Bu ayarlar arama motorlarında sayfanızın nasıl görüneceğini belirler.
                    Boş bırakırsanız sayfa başlığı ve açıklaması kullanılır.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Başlık
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder={formData.title || 'SEO için özel başlık'}
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.metaTitle || '').length}/60 karakter
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Açıklama
                  </label>
                  <textarea
                    name="metaDesc"
                    value={formData.metaDesc || ''}
                    onChange={handleChange}
                    rows={3}
                    className="input"
                    placeholder={formData.excerpt || 'Arama motorlarında görünecek açıklama'}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.metaDesc || '').length}/160 karakter
                  </p>
                </div>

                {/* SEO Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google'da Önizleme
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {formData.metaTitle || formData.title || 'Sayfa Başlığı'}
                    </p>
                    <p className="text-green-700 text-sm">
                      kysd.org.tr{formData.slug ? getPageUrl(formData.slug) : '/sayfa/...'}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {formData.metaDesc || formData.excerpt || 'Sayfa açıklaması burada görünecek...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-medium text-gray-800 mb-4">Sayfa Ayarları</h3>

              <div className="space-y-6">
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">/sayfa/</span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug || ''}
                      onChange={handleChange}
                      className="input flex-1"
                      placeholder="sayfa-url"
                      disabled={isEdit}
                    />
                  </div>
                  {isEdit && (
                    <p className="text-xs text-amber-600 mt-1">
                      Not: URL slug değiştirilmesi önerilmez, mevcut linkler bozulabilir.
                    </p>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Sayfa Durumu</p>
                    <p className="text-sm text-gray-500">
                      Pasif sayfalar sitede görünmez
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </label>
                </div>

                {/* Info */}
                {isEdit && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Sayfa Bilgileri</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">ID:</span>
                        <span className="ml-2 text-gray-700">{formData.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Oluşturulma:</span>
                        <span className="ml-2 text-gray-700">
                          {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString('tr-TR') : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Son Güncelleme:</span>
                        <span className="ml-2 text-gray-700">
                          {formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString('tr-TR') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
