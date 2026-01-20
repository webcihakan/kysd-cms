import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronRight, MapPin, Clock, Briefcase, Building2,
  Calendar, Users, Upload, CheckCircle
} from 'lucide-react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const jobTypeLabels = {
  FULL_TIME: 'Tam Zamanlı',
  PART_TIME: 'Yarı Zamanlı',
  REMOTE: 'Uzaktan',
  HYBRID: 'Hibrit',
  INTERNSHIP: 'Staj',
  CONTRACT: 'Sözleşmeli'
}

const experienceLevelLabels = {
  ENTRY: 'Giriş Seviyesi',
  JUNIOR: 'Junior',
  MID: 'Orta Seviye',
  SENIOR: 'Kıdemli',
  LEAD: 'Lider',
  EXECUTIVE: 'Yönetici'
}

export default function CareerDetail() {
  const { slug } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cvFile, setCvFile] = useState(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    educationLevel: '',
    experienceYears: '',
    coverLetter: ''
  })

  useEffect(() => {
    fetchJob()
  }, [slug])

  const fetchJob = async () => {
    try {
      const response = await api.get(`/job-postings/slug/${slug}`)
      setJob(response.data)
    } catch (error) {
      console.error('İlan yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('jobPostingId', job.id)
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key])
      })
      if (cvFile) data.append('cvFile', cvFile)

      await api.post('/job-applications', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess(true)
    } catch (error) {
      console.error('Başvuru gönderilemedi:', error)
      alert(error.response?.data?.error || 'Başvuru gönderilemedi')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan Bulunamadı</h2>
          <Link to="/kariyer" className="text-primary-600 hover:text-primary-700">
            İlan listesine dön
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Başvurunuz Alındı!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Başvurunuz başarıyla gönderildi. İlgili firma sizinle en kısa sürede iletişime geçecektir.
            </p>
            <Link
              to="/kariyer"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              İlan Listesine Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/kariyer" className="text-gray-500 hover:text-gray-700">Kariyer</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">İlan Detayı</span>
          </nav>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{job.companyName}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {jobTypeLabels[job.jobType]}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {experienceLevelLabels[job.experienceLevel]}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(job.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {job.applicationCount} Başvuru
                </span>
              </div>
            </div>

            {job.showSalary && job.salaryMin && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {job.salaryMin.toLocaleString('tr-TR')} - {job.salaryMax?.toLocaleString('tr-TR')} TL
                </div>
                <div className="text-sm text-gray-500">Maaş Aralığı</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İş Tanımı</h2>
              <div
                className="prose prose-primary max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              {job.requirements && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Aranan Nitelikler</h2>
                  <div
                    className="prose prose-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </>
              )}

              {job.responsibilities && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Sorumluluklar</h2>
                  <div
                    className="prose prose-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                  />
                </>
              )}

              {job.benefits && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Yan Haklar</h2>
                  <div
                    className="prose prose-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.benefits }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Hızlı Başvuru</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şehir *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eğitim Seviyesi *
                  </label>
                  <select
                    required
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Lise">Lise</option>
                    <option value="Ön Lisans">Ön Lisans</option>
                    <option value="Lisans">Lisans</option>
                    <option value="Yüksek Lisans">Yüksek Lisans</option>
                    <option value="Doktora">Doktora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deneyim *
                  </label>
                  <select
                    required
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    <option value="0-1">0-1 yıl</option>
                    <option value="1-3">1-3 yıl</option>
                    <option value="3-5">3-5 yıl</option>
                    <option value="5-10">5-10 yıl</option>
                    <option value="10+">10+ yıl</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CV Yükle (PDF/Word, Max 5MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="flex items-center gap-2 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {cvFile ? cvFile.name : 'Dosya Seç'}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ön Yazı
                  </label>
                  <textarea
                    rows="4"
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Neden bu pozisyon için uygun olduğunuzu açıklayın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {submitting ? 'Gönderiliyor...' : 'Başvuru Yap'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
