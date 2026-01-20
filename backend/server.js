require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const pageRoutes = require('./src/routes/pages');
const newsRoutes = require('./src/routes/news');
const announcementRoutes = require('./src/routes/announcements');
const industryGroupRoutes = require('./src/routes/industryGroups');
const menuRoutes = require('./src/routes/menus');
const advertisementRoutes = require('./src/routes/advertisements');
const sliderRoutes = require('./src/routes/sliders');
const settingRoutes = require('./src/routes/settings');
const contactRoutes = require('./src/routes/contacts');
const uploadRoutes = require('./src/routes/upload');
const boardMemberRoutes = require('./src/routes/boardMembers');
const membershipApplicationRoutes = require('./src/routes/membershipApplications');
const galleryRoutes = require('./src/routes/gallery');
const projectRoutes = require('./src/routes/projects');
const trainingRoutes = require('./src/routes/trainings');
const fairRoutes = require('./src/routes/fairs');
const reportRoutes = require('./src/routes/reports');
const legislationRoutes = require('./src/routes/legislation');
const memberDuesRoutes = require('./src/routes/memberDues');
const membersRoutes = require('./src/routes/members');
const expenseRoutes = require('./src/routes/expenses');
const adPositionRoutes = require('./src/routes/adPositions');
const companyProfileRoutes = require('./src/routes/companyProfile');
const industryMemberRoutes = require('./src/routes/industryMembers');
const scraperRoutes = require('./src/routes/scraperRoutes');
const scraperService = require('./src/services/scraperService');
const currencyRoutes = require('./src/routes/currency');
const travelGuideRoutes = require('./src/routes/travelGuides');
const holidayRoutes = require('./src/routes/holidays');
const calendarRoutes = require('./src/routes/calendar');
const magazineRoutes = require('./src/routes/magazines');
const economicIndicatorRoutes = require('./src/routes/economicIndicators');

// Katalog Routes
const catalogRoutes = require('./src/routes/catalogs');
const catalogPackageRoutes = require('./src/routes/catalogPackages');
const catalogPaymentRoutes = require('./src/routes/catalogPayments');

// Sanal Fuar Routes
const virtualFairRoutes = require('./src/routes/virtualFairs');
const virtualBoothTypeRoutes = require('./src/routes/virtualBoothTypes');
const virtualBoothApplicationRoutes = require('./src/routes/virtualBoothApplications');
const virtualBoothRoutes = require('./src/routes/virtualBooths');

// Kariyer Routes
const jobPostingsRoutes = require('./src/routes/jobPostings');
const jobApplicationsRoutes = require('./src/routes/jobApplications');

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/industry-groups', industryGroupRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/board-members', boardMemberRoutes);
app.use('/api/membership-applications', membershipApplicationRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/fairs', fairRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/legislations', legislationRoutes);
app.use('/api/member-dues', memberDuesRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ad-positions', adPositionRoutes);
app.use('/api/company-profile', companyProfileRoutes);
app.use('/api/industry-members', industryMemberRoutes);
app.use('/api/scrapers', scraperRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/travel-guides', travelGuideRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/magazines', magazineRoutes);
app.use('/api/economic-indicators', economicIndicatorRoutes);

// Katalog Routes
app.use('/api/catalogs', catalogRoutes);
app.use('/api/catalog-packages', catalogPackageRoutes);
app.use('/api/catalog-payments', catalogPaymentRoutes);

// Sanal Fuar Routes
app.use('/api/virtual-fairs', virtualFairRoutes);
app.use('/api/virtual-booth-types', virtualBoothTypeRoutes);
app.use('/api/virtual-booth-applications', virtualBoothApplicationRoutes);
app.use('/api/virtual-booths', virtualBoothRoutes);

// Kariyer Routes
app.use('/api/job-postings', jobPostingsRoutes);
app.use('/api/job-applications', jobApplicationsRoutes);

// Cron job'lari baslat
scraperService.startCronJobs();
console.log('Otomatik veri guncelleme cron job\'lari aktif');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Sunucu hatası',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Sayfa bulunamadı' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});


