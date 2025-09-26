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
import AssistantModal from './components/Assistant/AssistantModal';

const ProtectedRoute: React.FC<{ adminOnly?: boolean }> = ({ adminOnly = false }) => {
  const { session, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/auth', { replace: true });
    } else if (adminOnly && user?.email !== 'kartikroyal777@gmail.com') {
      navigate('/', { replace: true });
    }
  }, [session, user, adminOnly, navigate]);

  if (!session) return null;
  if (adminOnly && user?.email !== 'kartikroyal777@gmail.com') return null;

  return <Outlet />;
};

const AppLayout = () => {
  const location = useLocation();
  const noNavRoutes = ['/auth', '/admin'];
  
  const isFullScreen = [
    '/food-scorer', 
    '/tools/translate', 
    '/tools/fare-calculator', 
    '/tools/currency-exchanger', 
    '/tools/budget-tracker', 
    '/tools/bargaining-coach'
  ].includes(location.pathname);

  const showTopNav = !noNavRoutes.some(path => location.pathname.startsWith(path)) && !isFullScreen;
  const showBottomNav = !noNavRoutes.some(path => location.pathname.startsWith(path)) && !isFullScreen;

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
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/translate" element={<TranslatePage />} />
        <Route path="/tools/fare-calculator" element={<FareCalculatorPage />} />
        <Route path="/tools/currency-exchanger" element={<CurrencyExchangerPage />} />
        <Route path="/tools/budget-tracker" element={<BudgetTrackerPage />} />
        <Route path="/tools/bargaining-coach" element={<BargainingCoachPage />} />
        <Route path="/food-scorer" element={<FoodScorerPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/planner" element={<TripPlannerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/saved-places" element={<SavedPlacesPage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="/city/:cityId" element={<CityPage />} />
        <Route path="/tehsil/:tehsilId" element={<TehsilPage />} />
        <Route path="/location/:locationId" element={<LocationDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
