import { Link } from 'react-router-dom'
import { Award, CheckCircle, FileCheck, Shield, TrendingUp, Users, Globe, Target } from 'lucide-react'

export default function QCertificate() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Q Belgesi</span>
          </div>
        </div>
      </div>

      {/* Header - Modern ve Göz Alıcı */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 shadow-2xl">
              <Award className="w-12 h-12 md:w-14 md:h-14 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Q Belgesi
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-4 leading-relaxed">
              Kalite Standartlarınızı Belgeleyin
            </p>
            <p className="text-lg text-primary-200 max-w-2xl mx-auto">
              KYSD üyelerimize sunduğumuz Kalite Belgesi ile sektörde fark yaratın, güvenilirliğinizi artırın
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Q Belgesi Nedir - Modern Kart */}
          <section className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-8 md:p-10 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Q Belgesi Nedir?</h2>
            </div>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p className="border-l-4 border-primary-500 pl-6 py-2">
                Q Belgesi (Kalite Belgesi), konfeksiyon yan sanayi sektöründe faaliyet gösteren firmalarımızın
                kalite standartlarına uygunluğunu belgeleyen önemli bir sertifikasyon sistemidir.
              </p>
              <p>
                KYSD olarak üyelerimize, ürün ve hizmet kalitelerini artırmak, uluslararası standartlara
                uyum sağlamak ve rekabet güçlerini geliştirmek amacıyla Q Belgesi hizmetleri sunmaktayız.
              </p>

              {/* İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-1">100+</div>
                  <div className="text-sm text-blue-900 font-medium">Belgeli Firma</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-1">15+</div>
                  <div className="text-sm text-green-900 font-medium">Yıllık Tecrübe</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-1">%95</div>
                  <div className="text-sm text-purple-900 font-medium">Memnuniyet</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
                  <div className="text-sm text-orange-900 font-medium">Destek</div>
                </div>
              </div>
            </div>
          </section>

          {/* Avantajlar - Modern Grid */}
          <section className="mb-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Q Belgesi Avantajları</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Firmanıza sağlayacağı faydalar ile rekabet gücünüzü artırın
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 hover:border-primary-200">
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Güvenilirlik</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Kalite standartlarına uygunluk belgesi ile müşteri güveni kazanırsınız ve kurumsal itibarınızı artırırsınız
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 hover:border-primary-200">
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Rekabet Avantajı</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sektörde fark yaratarak rakiplerinizin önüne geçersiniz ve yeni iş fırsatlarına ulaşırsınız
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 hover:border-primary-200">
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Uluslararası Kabul</h3>
                    <p className="text-gray-600 leading-relaxed">
                      İhracat ve uluslararası iş birliklerinde belge geçerliliği ile küresel pazarlara açılın
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 hover:border-primary-200">
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Kalite İyileştirme</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sürekli iyileştirme ve kalite kontrol süreçlerinin gelişimi ile verimliliğinizi artırın
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Başvuru Süreci - Timeline Tasarımı */}
          <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-gray-200">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Başvuru Süreci</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                4 basit adımda Q Belgenize kavuşun
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              <div className="relative flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform z-10">
                    1
                  </div>
                  <div className="w-1 h-full bg-gradient-to-b from-primary-300 to-transparent absolute top-16"></div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Başvuru</h3>
                  <p className="text-gray-600 leading-relaxed">
                    KYSD üyeliği ve Q Belgesi başvuru formunu doldurun. Online başvuru sistemi ile hızlı ve kolay işlem
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform z-10">
                    2
                  </div>
                  <div className="w-1 h-full bg-gradient-to-b from-blue-300 to-transparent absolute top-16"></div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ön Değerlendirme</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Başvurunuz uzman ekibimiz tarafından incelenir ve gerekli belgeler kontrol edilir
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform z-10">
                    3
                  </div>
                  <div className="w-1 h-full bg-gradient-to-b from-green-300 to-transparent absolute top-16"></div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Denetim</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Firmanıza yerinde kalite denetimi yapılır. Profesyonel denetçilerimiz detaylı inceleme yapar
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform z-10">
                    4
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Belgelendirme</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Uygunluk durumunda Q Belgeniz düzenlenir ve törenle teslim edilir. Tebrikler!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA - Modern ve Göz Alıcı */}
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 shadow-2xl">
                <Award className="w-12 h-12 text-yellow-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Q Belgesi Başvurusu</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Firmanızın kalite standartlarını belgelendirmek ve sektörde fark yaratmak için
                hemen Q Belgesi başvurunuzu yapın
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/iletisim"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 hover:scale-105 transition-all shadow-lg"
                >
                  Başvuru İçin İletişime Geçin
                </Link>
                <Link
                  to="/uye-giris"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 hover:scale-105 transition-all"
                >
                  Üye Girişi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
