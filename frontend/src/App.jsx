import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'

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

// Admin Pages
import Dashboard from './pages/admin/Dashboard'
import PagesList from './pages/admin/PagesList'
import PagesForm from './pages/admin/PagesForm'
import AdminNewsList from './pages/admin/NewsList'
import NewsForm from './pages/admin/NewsForm'
import AdminAnnouncementsList from './pages/admin/AnnouncementsList'
import AnnouncementsForm from './pages/admin/AnnouncementsForm'
import IndustryGroupsList from './pages/admin/IndustryGroupsList'
import IndustryGroupsForm from './pages/admin/IndustryGroupsForm'
import SlidersList from './pages/admin/SlidersList'
import SlidersForm from './pages/admin/SlidersForm'
import AdvertisementsList from './pages/admin/AdvertisementsList'
import AdvertisementsForm from './pages/admin/AdvertisementsForm'
import MenusList from './pages/admin/MenusList'
import UsersList from './pages/admin/UsersList'
import ContactsList from './pages/admin/ContactsList'
import MembershipApplicationsList from './pages/admin/MembershipApplicationsList'
import Settings from './pages/admin/Settings'
import GalleryList from './pages/admin/GalleryList'
import GalleryForm from './pages/admin/GalleryForm'
import ProjectsList from './pages/admin/ProjectsList'
import ProjectForm from './pages/admin/ProjectForm'
import TrainingsList from './pages/admin/TrainingsList'
import TrainingForm from './pages/admin/TrainingForm'
import FairsList from './pages/admin/FairsList'
import FairForm from './pages/admin/FairForm'
import LegislationsList from './pages/admin/LegislationsList'
import LegislationForm from './pages/admin/LegislationForm'
import DuesList from './pages/admin/DuesList'
import ExpensesList from './pages/admin/ExpensesList'
import AdPositionsList from './pages/admin/AdPositionsList'
import Profile from './pages/admin/Profile'
import MembersList from './pages/admin/MembersList'
import BoardMembersList from './pages/admin/BoardMembersList'
import BoardMembersForm from './pages/admin/BoardMembersForm'
import VirtualFairsList from './pages/admin/VirtualFairsList'
import VirtualFairsForm from './pages/admin/VirtualFairsForm'
import VirtualBoothApplicationsList from './pages/admin/VirtualBoothApplicationsList'
import VirtualBoothsList from './pages/admin/VirtualBoothsList'
import VirtualBoothForm from './pages/admin/VirtualBoothForm'
import TravelGuidesList from './pages/admin/TravelGuidesList'
import TravelGuideForm from './pages/admin/TravelGuideForm'
import HolidaysList from './pages/admin/HolidaysList'
import HolidayForm from './pages/admin/HolidayForm'
import MagazinesList from './pages/admin/MagazinesList'
import MagazineForm from './pages/admin/MagazineForm'
import CatalogsList from './pages/admin/CatalogsList'
import AdminCatalogDetail from './pages/admin/CatalogDetail'
import CatalogPackagesList from './pages/admin/CatalogPackagesList'
import CatalogPackageForm from './pages/admin/CatalogPackageForm'
import AdPayments from './pages/admin/AdPayments'
import VirtualFairPayments from './pages/admin/VirtualFairPayments'
import MagazinePayments from './pages/admin/MagazinePayments'
import EconomicIndicatorsList from './pages/admin/EconomicIndicatorsList'
import EconomicIndicatorForm from './pages/admin/EconomicIndicatorForm'

// Virtual Fair Public Pages
import VirtualFairs from './pages/public/VirtualFairs'
import VirtualFairDetail from './pages/public/VirtualFairDetail'
import VirtualBoothDetail from './pages/public/VirtualBoothDetail'
import VirtualBoothApplication from './pages/public/VirtualBoothApplication'

// Member Pages
import MyCatalogs from './pages/member/MyCatalogs'
import CatalogSubmit from './pages/member/CatalogSubmit'
import CatalogPayment from './pages/member/CatalogPayment'

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
        <Route path="/sanal-fuarlar" element={<VirtualFairs />} />
        <Route path="/sanal-fuar/:slug" element={<VirtualFairDetail />} />
        <Route path="/sanal-stant/:id" element={<VirtualBoothDetail />} />
        <Route path="/sanal-fuar-basvurusu/:fairId" element={<VirtualBoothApplication />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/kayit" element={<Register />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
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
      </Route>
    </Routes>
  )
}
