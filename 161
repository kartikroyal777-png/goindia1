import React, { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavBar from './components/Layout/TopNavBar';
import BottomNavBar from './components/Layout/BottomNavBar';
import HomePage from './components/Home/HomePage';
import FoodScorerPage from './components/FoodScorer/FoodScorerPage';
import TripPlannerPage from './components/TripPlanner/TripPlannerPage';
import ProfilePage from './components/Profile/ProfilePage';
import CityPage from './components/City/CityPage';
import TehsilPage from './components/Tehsil/TehsilPage';
import LocationDetailPage from './components/Location/LocationDetailPage';
import AuthPage from './pages/AuthPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import MyTripsPage from './pages/MyTripsPage';
import SavedPlacesPage from './pages/SavedPlacesPage';
import { useAuth } from './contexts/AuthContext';
import ToolsPage from './pages/ToolsPage';
import FareCalculatorPage from './pages/tools/FareCalculatorPage';
import CurrencyExchangerPage from './pages/tools/CurrencyExchangerPage';
import BudgetTrackerPage from './pages/tools/BudgetTrackerPage';
import BargainingCoachPage from './pages/tools/BargainingCoachPage';
import TranslatePage from './pages/TranslatePage';
import AppSettingsPage from './pages/AppSettingsPage';
import AboutUsPage from './pages/AboutUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PricingPage from './pages/PricingPage';
import UpgradeModal from './components/Layout/UpgradeModal';
import FullScreenLoader from './components/Layout/FullScreenLoader';
import { AlertTriangle } from 'lucide-react';

const AppInitError: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-gray-100 z-[100] flex flex-col items-center justify-center text-center p-4">
    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
    <h2 className="text-xl font-semibold text-gray-800">Application Error</h2>
    <p className="text-gray-600 mt-2">Could not load the application. Please try refreshing the page.</p>
    <p className="text-xs text-gray-500 mt-4 bg-gray-200 p-2 rounded-md font-mono max-w-lg">{message}</p>
  </div>
);

const ProtectedRoute: React.FC<{ adminOnly?: boolean }> = ({ adminOnly = false }) => {
  const { session, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate('/auth', { replace: true });
    } else if (adminOnly && user?.email !== 'kartikroyal777@gmail.com') {
      navigate('/', { replace: true });
    }
  }, [session, user, adminOnly, navigate, loading]);

  if (loading) return <FullScreenLoader />;
  if (!session) return null;
  if (adminOnly && user?.email !== 'kartikroyal777@gmail.com') return null;

  return <Outlet />;
};

const AppLayout = () => {
  const location = useLocation();
  const noNavRoutes = ['/auth', '/admin'];
  
  const isFullScreen = [
    '/food-scorer',
    '/pricing',
  ].includes(location.pathname);

  const isToolPage = location.pathname.startsWith('/tools/');

  const showTopNav = !noNavRoutes.some(path => location.pathname.startsWith(path)) && !isFullScreen && !isToolPage;
  const showBottomNav = !noNavRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showTopNav && <TopNavBar />}
      
      <main className={`flex-grow ${showTopNav ? 'pt-16' : ''} ${showBottomNav ? 'pb-20' : ''} flex flex-col`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {showBottomNav && <BottomNavBar />}
      <UpgradeModal />
    </div>
  );
};

function App() {
  const { loading, error } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <AppInitError message={error} />;
  }
  
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/food-scorer" element={<FoodScorerPage />} />
          <Route path="/planner" element={<TripPlannerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/saved-places" element={<SavedPlacesPage />} />
          <Route path="/settings/app" element={<AppSettingsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="/city/:cityId" element={<CityPage />} />
        <Route path="/tehsil/:tehsilId" element={<TehsilPage />} />
        <Route path="/location/:locationId" element={<LocationDetailPage />} />
      </Route>
      
      {/* Tool routes outside main layout for fullscreen */}
      <Route path="/tools/translate" element={<TranslatePage />} />
      <Route path="/tools/fare-calculator" element={<FareCalculatorPage />} />
      <Route path="/tools/currency-exchanger" element={<CurrencyExchangerPage />} />
      <Route path="/tools/budget-tracker" element={<BudgetTrackerPage />} />
      <Route path="/tools/bargaining-coach" element={<BargainingCoachPage />} />
    </Routes>
  );
}

export default App;
