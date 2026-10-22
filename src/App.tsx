import React, { useState, useEffect } from 'react';
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

  // Handle URL parameters (e.g. ?view=admin or ?view=cars or ?view=book)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const carParam = params.get('car');

    if (viewParam) {
      setCurrentView(viewParam);
    }
    if (carParam) {
      navigateToCar(carParam);
    }
  }, []);

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
