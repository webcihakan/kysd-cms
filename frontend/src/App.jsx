import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout
import PublicLayout from './components/layout/PublicLayout'
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))

// Public Pages
import Home from './pages/public/Home'
import Page from './pages/public/Page'
import NewsList from './pages/public/NewsList'
import NewsDetail from './pages/public/NewsDetail'
import AnnouncementsList from './pages/public/AnnouncementsList'
import AnnouncementDetail from './pages/public/AnnouncementDetail'
import IndustryGroupList from './pages/public/IndustryGroupList'
import IndustryGroupDetail from './pages/public/IndustryGroupDetail'
import Contact from './pages/public/Contact'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import BoardMembers from './pages/public/BoardMembers'
import Members from './pages/public/Members'
import MembershipApplication from './pages/public/MembershipApplication'
import WhyJoin from './pages/public/WhyJoin'
import About from './pages/public/About'
import Statute from './pages/public/Statute'
import SectorReports from './pages/public/SectorReports'
import Legislation from './pages/public/Legislation'
import Incentives from './pages/public/Incentives'
import Trainings from './pages/public/Trainings'
import Projects from './pages/public/Projects'
import Fairs from './pages/public/Fairs'
import Gallery from './pages/public/Gallery'
import TravelGuide from './pages/public/TravelGuide'
import Calendar from './pages/public/Calendar'
import Magazines from './pages/public/Magazines'
import MagazineDetail from './pages/public/MagazineDetail'
import Catalogs from './pages/public/Catalogs'
import CatalogDetail from './pages/public/CatalogDetail'
import TurkeyReports from './pages/public/TurkeyReports'
import QCertificate from './pages/public/QCertificate'
import Careers from './pages/public/Careers'
import CareerDetail from './pages/public/CareerDetail'

// Admin Pages - Lazy loaded for performance
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const PagesList = lazy(() => import('./pages/admin/PagesList'))
const PagesForm = lazy(() => import('./pages/admin/PagesForm'))
const AdminNewsList = lazy(() => import('./pages/admin/NewsList'))
const NewsForm = lazy(() => import('./pages/admin/NewsForm'))
const AdminAnnouncementsList = lazy(() => import('./pages/admin/AnnouncementsList'))
const AnnouncementsForm = lazy(() => import('./pages/admin/AnnouncementsForm'))
const IndustryGroupsList = lazy(() => import('./pages/admin/IndustryGroupsList'))
const IndustryGroupsForm = lazy(() => import('./pages/admin/IndustryGroupsForm'))
const SlidersList = lazy(() => import('./pages/admin/SlidersList'))
const SlidersForm = lazy(() => import('./pages/admin/SlidersForm'))
const AdvertisementsList = lazy(() => import('./pages/admin/AdvertisementsList'))
const AdvertisementsForm = lazy(() => import('./pages/admin/AdvertisementsForm'))
const MenusList = lazy(() => import('./pages/admin/MenusList'))
const UsersList = lazy(() => import('./pages/admin/UsersList'))
const ContactsList = lazy(() => import('./pages/admin/ContactsList'))
const MembershipApplicationsList = lazy(() => import('./pages/admin/MembershipApplicationsList'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const GalleryList = lazy(() => import('./pages/admin/GalleryList'))
const GalleryForm = lazy(() => import('./pages/admin/GalleryForm'))
const ProjectsList = lazy(() => import('./pages/admin/ProjectsList'))
const ProjectForm = lazy(() => import('./pages/admin/ProjectForm'))
const TrainingsList = lazy(() => import('./pages/admin/TrainingsList'))
const TrainingForm = lazy(() => import('./pages/admin/TrainingForm'))
const FairsList = lazy(() => import('./pages/admin/FairsList'))
const FairForm = lazy(() => import('./pages/admin/FairForm'))
const LegislationsList = lazy(() => import('./pages/admin/LegislationsList'))
const LegislationForm = lazy(() => import('./pages/admin/LegislationForm'))
const DuesList = lazy(() => import('./pages/admin/DuesList'))
const ExpensesList = lazy(() => import('./pages/admin/ExpensesList'))
const AdPositionsList = lazy(() => import('./pages/admin/AdPositionsList'))
const Profile = lazy(() => import('./pages/admin/Profile'))
const MembersList = lazy(() => import('./pages/admin/MembersList'))
const BoardMembersList = lazy(() => import('./pages/admin/BoardMembersList'))
const BoardMembersForm = lazy(() => import('./pages/admin/BoardMembersForm'))
const VirtualFairsList = lazy(() => import('./pages/admin/VirtualFairsList'))
const VirtualFairsForm = lazy(() => import('./pages/admin/VirtualFairsForm'))
const VirtualBoothApplicationsList = lazy(() => import('./pages/admin/VirtualBoothApplicationsList'))
const VirtualBoothsList = lazy(() => import('./pages/admin/VirtualBoothsList'))
const VirtualBoothForm = lazy(() => import('./pages/admin/VirtualBoothForm'))
const TravelGuidesList = lazy(() => import('./pages/admin/TravelGuidesList'))
const TravelGuideForm = lazy(() => import('./pages/admin/TravelGuideForm'))
const HolidaysList = lazy(() => import('./pages/admin/HolidaysList'))
const HolidayForm = lazy(() => import('./pages/admin/HolidayForm'))
const MagazinesList = lazy(() => import('./pages/admin/MagazinesList'))
const MagazineForm = lazy(() => import('./pages/admin/MagazineForm'))
const CatalogsList = lazy(() => import('./pages/admin/CatalogsList'))
const AdminCatalogDetail = lazy(() => import('./pages/admin/CatalogDetail'))
const CatalogPackagesList = lazy(() => import('./pages/admin/CatalogPackagesList'))
const CatalogPackageForm = lazy(() => import('./pages/admin/CatalogPackageForm'))
const AdPayments = lazy(() => import('./pages/admin/AdPayments'))
const VirtualFairPayments = lazy(() => import('./pages/admin/VirtualFairPayments'))
const MagazinePayments = lazy(() => import('./pages/admin/MagazinePayments'))
const EconomicIndicatorsList = lazy(() => import('./pages/admin/EconomicIndicatorsList'))
const EconomicIndicatorForm = lazy(() => import('./pages/admin/EconomicIndicatorForm'))
const JobPostingsList = lazy(() => import('./pages/admin/JobPostingsList'))
const JobApplicationsList = lazy(() => import('./pages/admin/JobApplicationsList'))
const JobPostingForm = lazy(() => import('./pages/admin/JobPostingForm'))

// Virtual Fair Public Pages
import VirtualFairs from './pages/public/VirtualFairs'
import VirtualFairDetail from './pages/public/VirtualFairDetail'
import VirtualBoothDetail from './pages/public/VirtualBoothDetail'
import VirtualBoothApplication from './pages/public/VirtualBoothApplication'

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard'
import MemberProfile from './pages/member/MemberProfile'
import MemberDues from './pages/member/MemberDues'
import MyCatalogs from './pages/member/MyCatalogs'
import CatalogSubmit from './pages/member/CatalogSubmit'
import CatalogPayment from './pages/member/CatalogPayment'
import MyJobPostings from './pages/member/MyJobPostings'
import MemberJobPostingForm from './pages/member/MemberJobPostingForm'
import MemberJobApplications from './pages/member/MemberJobApplications'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
    return <Login />
  }

  return children
}

function MemberRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  if (!user || user.role !== 'MEMBER') {
    return <Login />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sayfa/:slug" element={<Page />} />
        <Route path="/haberler" element={<NewsList />} />
        <Route path="/haber/:slug" element={<NewsDetail />} />
        <Route path="/duyurular" element={<AnnouncementsList />} />
        <Route path="/duyuru/:slug" element={<AnnouncementDetail />} />
        <Route path="/sanayi-gruplari" element={<IndustryGroupList />} />
        <Route path="/sanayi-grubu/:slug" element={<IndustryGroupDetail />} />
        <Route path="/uyeler" element={<Members />} />
        <Route path="/kysd-akademi" element={<Page slug="kysd-akademi" />} />
        <Route path="/yonetim-kurulu" element={<BoardMembers />} />
        <Route path="/uyelik-basvurusu" element={<MembershipApplication />} />
        <Route path="/neden-uye-olmaliyim" element={<WhyJoin />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/tuzuk" element={<Statute />} />
        <Route path="/q-belgesi" element={<Page slug="q-belgesi" />} />
        <Route path="/sektor-raporlari" element={<SectorReports />} />
        <Route path="/mevzuat" element={<Legislation />} />
        <Route path="/tesvik-ve-destekler" element={<Incentives />} />
        <Route path="/egitimler-seminerler" element={<Trainings />} />
        <Route path="/projeler" element={<Projects />} />
        <Route path="/fuarlar" element={<Fairs />} />
        <Route path="/galeri" element={<Gallery />} />
        <Route path="/tur-rehberi" element={<TravelGuide />} />
        <Route path="/takvim" element={<Calendar />} />
        <Route path="/dergiler" element={<Magazines />} />
        <Route path="/dergiler/:slug" element={<MagazineDetail />} />
        <Route path="/katalog" element={<Catalogs />} />
        <Route path="/katalog/:slug" element={<CatalogDetail />} />
        <Route path="/turkiye-genel-raporlari" element={<TurkeyReports />} />
        <Route path="/q-belgesi" element={<QCertificate />} />
        <Route path="/sanal-fuarlar" element={<VirtualFairs />} />
        <Route path="/sanal-fuar/:slug" element={<VirtualFairDetail />} />
        <Route path="/sanal-stant/:id" element={<VirtualBoothDetail />} />
        <Route path="/sanal-fuar-basvurusu/:fairId" element={<VirtualBoothApplication />} />
        <Route path="/kariyer" element={<Careers />} />
        <Route path="/kariyer/:slug" element={<CareerDetail />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/kayit" element={<Register />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
              </div>
            }>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="sayfalar" element={<PagesList />} />
        <Route path="sayfalar/ekle" element={<PagesForm />} />
        <Route path="sayfalar/:id" element={<PagesForm />} />
        <Route path="haberler" element={<AdminNewsList />} />
        <Route path="haberler/ekle" element={<NewsForm />} />
        <Route path="haberler/:id" element={<NewsForm />} />
        <Route path="duyurular" element={<AdminAnnouncementsList />} />
        <Route path="duyurular/ekle" element={<AnnouncementsForm />} />
        <Route path="duyurular/:id" element={<AnnouncementsForm />} />
        <Route path="sanayi-gruplari" element={<IndustryGroupsList />} />
        <Route path="sanayi-gruplari/ekle" element={<IndustryGroupsForm />} />
        <Route path="sanayi-gruplari/:id" element={<IndustryGroupsForm />} />
        <Route path="slider" element={<SlidersList />} />
        <Route path="slider/ekle" element={<SlidersForm />} />
        <Route path="slider/:id" element={<SlidersForm />} />
        <Route path="reklamlar" element={<AdvertisementsList />} />
        <Route path="reklamlar/ekle" element={<AdvertisementsForm />} />
        <Route path="reklamlar/:id" element={<AdvertisementsForm />} />
        <Route path="menuler" element={<MenusList />} />
        <Route path="kullanicilar" element={<UsersList />} />
        <Route path="mesajlar" element={<ContactsList />} />
        <Route path="uyelik-basvurulari" element={<MembershipApplicationsList />} />
        <Route path="galeri" element={<GalleryList />} />
        <Route path="galeri/ekle" element={<GalleryForm />} />
        <Route path="galeri/:id" element={<GalleryForm />} />
        <Route path="projeler" element={<ProjectsList />} />
        <Route path="projeler/yeni" element={<ProjectForm />} />
        <Route path="projeler/:id" element={<ProjectForm />} />
        <Route path="egitimler" element={<TrainingsList />} />
        <Route path="egitimler/yeni" element={<TrainingForm />} />
        <Route path="egitimler/:id" element={<TrainingForm />} />
        <Route path="fuarlar" element={<FairsList />} />
        <Route path="fuarlar/yeni" element={<FairForm />} />
        <Route path="fuarlar/:id" element={<FairForm />} />
        <Route path="tur-rehberi" element={<TravelGuidesList />} />
        <Route path="tur-rehberi/yeni" element={<TravelGuideForm />} />
        <Route path="tur-rehberi/:id" element={<TravelGuideForm />} />
        <Route path="tatiller" element={<HolidaysList />} />
        <Route path="tatiller/ekle" element={<HolidayForm />} />
        <Route path="tatiller/:id" element={<HolidayForm />} />
        <Route path="dergiler" element={<MagazinesList />} />
        <Route path="dergiler/ekle" element={<MagazineForm />} />
        <Route path="dergiler/:id" element={<MagazineForm />} />
        <Route path="kataloglar" element={<CatalogsList />} />
        <Route path="kataloglar/:id" element={<AdminCatalogDetail />} />
        <Route path="katalog-paketleri" element={<CatalogPackagesList />} />
        <Route path="katalog-paketleri/ekle" element={<CatalogPackageForm />} />
        <Route path="katalog-paketleri/:id" element={<CatalogPackageForm />} />
        <Route path="reklamlar/odemeler" element={<AdPayments />} />
        <Route path="sanal-fuar-odemeler" element={<VirtualFairPayments />} />
        <Route path="dergi-odemeler" element={<MagazinePayments />} />
        <Route path="ekonomik-gostergeler" element={<EconomicIndicatorsList />} />
        <Route path="ekonomik-gostergeler/ekle" element={<EconomicIndicatorForm />} />
        <Route path="ekonomik-gostergeler/:id" element={<EconomicIndicatorForm />} />
        <Route path="kariyer/ilanlar" element={<JobPostingsList />} />
        <Route path="kariyer/ilanlar/ekle" element={<JobPostingForm />} />
        <Route path="kariyer/ilanlar/:id" element={<JobPostingForm />} />
        <Route path="kariyer/basvurular" element={<JobApplicationsList />} />
        <Route path="mevzuat" element={<LegislationsList />} />
        <Route path="mevzuat/yeni" element={<LegislationForm />} />
        <Route path="mevzuat/:id" element={<LegislationForm />} />
        <Route path="yonetim-kurulu" element={<BoardMembersList />} />
        <Route path="yonetim-kurulu/ekle" element={<BoardMembersForm />} />
        <Route path="yonetim-kurulu/:id" element={<BoardMembersForm />} />
        <Route path="sanal-fuarlar" element={<VirtualFairsList />} />
        <Route path="sanal-fuarlar/ekle" element={<VirtualFairsForm />} />
        <Route path="sanal-fuarlar/:id" element={<VirtualFairsForm />} />
        <Route path="sanal-fuarlar/:fairId/stantlar" element={<VirtualBoothsList />} />
        <Route path="sanal-fuar-basvurulari" element={<VirtualBoothApplicationsList />} />
        <Route path="sanal-stant/:id" element={<VirtualBoothForm />} />
        <Route path="aidatlar" element={<DuesList />} />
        <Route path="uyeler" element={<MembersList />} />
        <Route path="giderler" element={<ExpensesList />} />
        <Route path="reklam-alanlari" element={<AdPositionsList />} />
        <Route path="profil" element={<Profile />} />
        <Route path="ayarlar" element={<Settings />} />
      </Route>

      {/* Member Routes */}
      <Route element={<PublicLayout />}>
        <Route
          path="/uye/dashboard"
          element={
            <MemberRoute>
              <MemberDashboard />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/profil"
          element={
            <MemberRoute>
              <MemberProfile />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/aidatlar"
          element={
            <MemberRoute>
              <MemberDues />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/kataloglarim"
          element={
            <MemberRoute>
              <MyCatalogs />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/katalog-ekle"
          element={
            <MemberRoute>
              <CatalogSubmit />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/katalog-duzenle/:id"
          element={
            <MemberRoute>
              <CatalogSubmit />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/katalog-odeme/:id"
          element={
            <MemberRoute>
              <CatalogPayment />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/ilanlarim"
          element={
            <MemberRoute>
              <MyJobPostings />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/ilan-ekle"
          element={
            <MemberRoute>
              <MemberJobPostingForm />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/ilan-duzenle/:id"
          element={
            <MemberRoute>
              <MemberJobPostingForm />
            </MemberRoute>
          }
        />
        <Route
          path="/uye/basvurular"
          element={
            <MemberRoute>
              <MemberJobApplications />
            </MemberRoute>
          }
        />
      </Route>
    </Routes>
  )
}
