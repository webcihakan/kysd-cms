import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import api from '../../utils/api'

const jobTypes = [
  { value: 'FULL_TIME', label: 'Tam Zamanlı' },
  { value: 'PART_TIME', label: 'Yarı Zamanlı' },
  { value: 'REMOTE', label: 'Uzaktan' },
  { value: 'HYBRID', label: 'Hibrit' },
  { value: 'INTERNSHIP', label: 'Staj' },
  { value: 'CONTRACT', label: 'Sözleşmeli' }
]

const experienceLevels = [
  { value: 'ENTRY', label: 'Giriş Seviyesi' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Orta Seviye' },
  { value: 'SENIOR', label: 'Kıdemli' },
  { value: 'LEAD', label: 'Lider' },
  { value: 'EXECUTIVE', label: 'Yönetici' }
]

const statusOptions = [
  { value: 'DRAFT', label: 'Taslak' },
  { value: 'PENDING', label: 'Beklemede' },
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'PAUSED', label: 'Duraklatıldı' },
  { value: 'CLOSED', label: 'Kapandı' }
]

export default function JobPostingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    city: '',
    district: '',
    isRemote: false,
    salaryMin: '',
    salaryMax: '',
    showSalary: false,
    applicationDeadline: '',
    positions: 1,
    companyId: '',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: false
  })

  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCompanies()
    if (isEdit) fetchJob()
  }, [id])

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/industry-members?membershipStatus=ACTIVE')
      // UserCompanyProfiles'ı getir (KYSD üyesi olanlar)
      const profilesResponse = await api.get('/users') // Tüm kullanıcıları al
      setCompanies(profilesResponse.data.users || [])
    } catch (error) {
      console.error('Firmalar yüklenemedi')
    }
  }

  const fetchJob = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/job-postings/admin/${id}`)
      const job = response.data

      setFormData({
        ...job,
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || ''
      })
    } catch (error) {
      alert('İlan yüklenemedi')
      navigate('/admin/kariyer/ilanlar')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const data = {
        ...formData,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        positions: parseInt(formData.positions),
        companyId: parseInt(formData.companyId),
        applicationDeadline: formData.applicationDeadline || null
      }

      if (isEdit) {
        await api.put(`/job-postings/admin/${id}`, data)
      } else {
        await api.post('/job-postings/admin', data)
      }
      navigate('/admin/kariyer/ilanlar')
    } catch (error) {
      alert(error.response?.data?.error || 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/kariyer/ilanlar')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? 'İlan Düzenle' : 'Yeni İş İlanı'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Temel Bilgiler */}
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Temel Bilgiler</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pozisyon Adı *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Örn: Kıdemli Yazılım Geliştirici"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İş Tanımı *</label>
                <ReactQuill
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  theme="snow"
                  className="bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aranan Nitelikler</label>
                <ReactQuill
                  value={formData.requirements || ''}
                  onChange={(value) => setFormData({ ...formData, requirements: value })}
                  theme="snow"
                  className="bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sorumluluklar</label>
                <ReactQuill
                  value={formData.responsibilities || ''}
                  onChange={(value) => setFormData({ ...formData, responsibilities: value })}
                  theme="snow"
                  className="bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yan Haklar</label>
                <textarea
                  name="benefits"
                  value={formData.benefits || ''}
                  onChange={handleChange}
                  rows="4"
                  className="input"
                  placeholder="Örn: Özel sağlık sigortası, yemek kartı, esnek çalışma..."
                />
              </div>
            </div>

            {/* Pozisyon Detayları */}
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pozisyon Detayları</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Çalışma Tipi *</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deneyim Seviyesi *</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Şehir *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="İstanbul"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İlçe</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="Bağcılar"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isRemote"
                    checked={formData.isRemote}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uzaktan Çalışma</span>
                </label>
              </div>
            </div>

            {/* Maaş ve Başvuru */}
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Maaş ve Başvuru Bilgileri</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min. Maaş (TL)</label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    className="input"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max. Maaş (TL)</label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    className="input"
                    placeholder="35000"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="showSalary"
                    checked={formData.showSalary}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maaşı İlanda Göster</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açık Pozisyon Sayısı</label>
                  <input
                    type="number"
                    name="positions"
                    value={formData.positions}
                    onChange={handleChange}
                    min="1"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Son Başvuru Tarihi</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Firma Seçimi */}
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Firma Bilgileri</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Firma *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Firma Adı"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  İlan sahibi firma adını girin
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Firma ID (Opsiyonel)</label>
                <input
                  type="number"
                  name="companyId"
                  value={formData.companyId || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Eğer firma sistemde kayıtlıysa ID'sini girin
                </p>
              </div>
            </div>

            {/* Durum */}
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Yayın Durumu</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Öne Çıkar</span>
                </label>
              </div>
            </div>

            {/* Kaydet */}
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Kaydediliyor...' : (isEdit ? 'Güncelle' : 'Kaydet')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
