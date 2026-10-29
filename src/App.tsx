import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/public/Header.tsx';
import { Footer } from './components/public/Footer.tsx';
import { AnnouncementBar } from './components/public/AnnouncementBar.tsx';
import { FloatingWhatsApp } from './components/public/FloatingWhatsApp.tsx';
import { HomeView } from './components/public/HomeView.tsx';
import { FleetView } from './components/public/FleetView.tsx';
import { CarDetailView } from './components/public/CarDetailView.tsx';
import { BookingWizard } from './components/public/BookingWizard.tsx';
import { BookingSuccessView } from './components/public/BookingSuccessView.tsx';
import { BookingStatusView } from './components/public/BookingStatusView.tsx';
import { ServicesView } from './components/public/ServicesView.tsx';
import { RatesView } from './components/public/RatesView.tsx';
import { AboutView } from './components/public/AboutView.tsx';
import { ContactView } from './components/public/ContactView.tsx';
import { LegalView } from './components/public/LegalView.tsx';

// Admin Components
import { AdminShell } from './components/admin/AdminShell.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { AdminBookings } from './components/admin/AdminBookings.tsx';
import { AdminCalendar } from './components/admin/AdminCalendar.tsx';
import { AdminVehicles } from './components/admin/AdminVehicles.tsx';
import { AdminCMS } from './components/admin/AdminCMS.tsx';
import { AdminPricing } from './components/admin/AdminPricing.tsx';
import { AdminEnquiries } from './components/admin/AdminEnquiries.tsx';
import { AdminReviews } from './components/admin/AdminReviews.tsx';
import { AdminTheme } from './components/admin/AdminTheme.tsx';
import { AdminSettings } from './components/admin/AdminSettings.tsx';
import { AdminAudit } from './components/admin/AdminAudit.tsx';
import { AdminNavigation } from './components/admin/AdminNavigation.tsx';
import { AdminMediaLibrary } from './components/admin/AdminMediaLibrary.tsx';
import { AdminTranslations } from './components/admin/AdminTranslations.tsx';
import { AdminFormBuilder } from './components/admin/AdminFormBuilder.tsx';
import { AdminReports } from './components/admin/AdminReports.tsx';
import { AdminTeam } from './components/admin/AdminTeam.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';

function MainAppContent() {
  const { currentView, setCurrentView, navigateToCar, isAdminAuthenticated } = useApp();
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Detect whether current URL or path points to /admin/panel
  const checkIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase().replace(/\/+$/, '');
    const search = window.location.search.toLowerCase();
    const params = new URLSearchParams(window.location.search);

    return (
      path === '/admin/panel' ||
      path.endsWith('/admin/panel') ||
      path === '/admin' ||
      hash.includes('/admin/panel') ||
      hash === '#admin/panel' ||
      hash === '#/admin' ||
      hash === '#admin' ||
      params.get('view') === 'admin' ||
      params.get('admin') === 'panel' ||
      search.includes('/admin/panel')
    );
  };

  // Synchronize route from URL on mount and history navigation (popstate / hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const carParam = params.get('car');

      if (checkIsAdminRoute()) {
        setCurrentView('admin');
      } else if (viewParam) {
        setCurrentView(viewParam);
      }

      if (carParam) {
        navigateToCar(carParam);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Sync browser URL bar with currentView (keeps admin hidden unless actively on /admin/panel)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (currentView === 'admin') {
      const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (currentPath !== '/admin/panel' && currentPath !== '/admin') {
        window.history.replaceState(null, '', '/admin/panel');
      }
    } else {
      const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (currentPath === '/admin/panel' || currentPath === '/admin') {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [currentView]);

  // Stealth keyboard shortcut for administrator (Ctrl+Shift+A or Cmd+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (currentView === 'admin') {
          window.history.pushState(null, '', '/');
          setCurrentView('home');
        } else {
          window.history.pushState(null, '', '/admin/panel');
          setCurrentView('admin');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Admin Portal View
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return <AdminLogin />;
    }

    return (
      <AdminShell currentTab={adminTab} setCurrentTab={setAdminTab}>
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={tab => setAdminTab(tab)}
            onOpenNewBookingModal={() => setAdminTab('bookings')}
          />
        )}
        {adminTab === 'bookings' && <AdminBookings />}
        {adminTab === 'calendar' && <AdminCalendar />}
        {adminTab === 'vehicles' && <AdminVehicles />}
        {adminTab === 'cms' && <AdminCMS />}
        {adminTab === 'navigation' && <AdminNavigation />}
        {adminTab === 'pricing' && <AdminPricing />}
        {adminTab === 'enquiries' && <AdminEnquiries />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'media' && <AdminMediaLibrary />}
        {adminTab === 'translations' && <AdminTranslations />}
        {adminTab === 'formbuilder' && <AdminFormBuilder />}
        {adminTab === 'reports' && <AdminReports />}
        {adminTab === 'theme' && <AdminTheme />}
        {adminTab === 'team' && <AdminTeam />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'audit' && <AdminAudit />}
      </AdminShell>
    );
  }

  // Public Experience Views
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {currentView === 'home' && <HomeView />}
            {currentView === 'cars' && <FleetView />}
            {currentView === 'car-detail' && <CarDetailView />}
            {currentView === 'book' && <BookingWizard />}
            {currentView === 'booking-success' && <BookingSuccessView />}
            {currentView === 'status' && <BookingStatusView />}
            {currentView === 'services' && <ServicesView />}
            {currentView === 'rates' && <RatesView />}
            {currentView === 'about' && <AboutView />}
            {currentView === 'contact' && <ContactView />}
            {currentView === 'legal' && <LegalView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
