import { Link } from 'react-router-dom'
import { Award, CheckCircle, FileCheck, Shield } from 'lucide-react'

export default function QCertificate() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Q Belgesi</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Award className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Q Belgesi</h1>
          </div>
          <p className="text-primary-100 text-lg max-w-3xl">
            KYSD üyelerimize sunduğumuz Kalite Belgesi (Q Belgesi) hizmetleri hakkında bilgiler
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Q Belgesi Nedir */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Q Belgesi Nedir?</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Q Belgesi (Kalite Belgesi), konfeksiyon yan sanayi sektöründe faaliyet gösteren firmalarımızın
                kalite standartlarına uygunluğunu belgeleyen önemli bir sertifikasyon sistemidir.
              </p>
              <p className="mb-4">
                KYSD olarak üyelerimize, ürün ve hizmet kalitelerini artırmak, uluslararası standartlara
                uyum sağlamak ve rekabet güçlerini geliştirmek amacıyla Q Belgesi hizmetleri sunmaktayız.
              </p>
            </div>
          </section>

          {/* Avantajlar */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Q Belgesi Avantajları</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Güvenilirlik</h3>
                  <p className="text-gray-600">
                    Kalite standartlarına uygunluk belgesi ile müşteri güveni kazanırsınız
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Rekabet Avantajı</h3>
                  <p className="text-gray-600">
                    Sektörde fark yaratarak rakiplerinizin önüne geçersiniz
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Uluslararası Kabul</h3>
                  <p className="text-gray-600">
                    İhracat ve uluslararası iş birliklerinde belge geçerliliği
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Kalite İyileştirme</h3>
                  <p className="text-gray-600">
                    Sürekli iyileştirme ve kalite kontrol süreçlerinin gelişimi
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Başvuru Süreci */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Başvuru Süreci</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Başvuru</h3>
                  <p className="text-gray-600">
                    KYSD üyeliği ve Q Belgesi başvuru formunu doldurun
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Ön Değerlendirme</h3>
                  <p className="text-gray-600">
                    Başvurunuz incelenir ve gerekli belgeler kontrol edilir
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Denetim</h3>
                  <p className="text-gray-600">
                    Firmanıza yerinde kalite denetimi yapılır
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Belgelendirme</h3>
                  <p className="text-gray-600">
                    Uygunluk durumunda Q Belgeniz düzenlenir ve teslim edilir
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center text-white">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Q Belgesi Başvurusu</h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Firmanızın kalite standartlarını belgelendirmek ve sektörde fark yaratmak için
              hemen Q Belgesi başvurunuzu yapın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Başvuru İçin İletişime Geçin
              </Link>
              <Link
                to="/uye-giris"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Üye Girişi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
