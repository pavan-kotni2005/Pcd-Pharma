import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/Dashboard';
import RegionsPage from './pages/Regions';
import TherapiesPage from './pages/Therapies';
import PresencesPage from './pages/Presences';
import NetworkPage from './pages/Network';
import CategoriesPage from './pages/Categories';
import UsersPage from './pages/Users';
import ActivityLogPage from './pages/ActivityLog';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isVerifying } = useAppContext();

  if (isVerifying) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050B1A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }}>
        <style>{`
          @keyframes _spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={{
          width: 44,
          height: 44,
          border: '3px solid #1E293B',
          borderTop: '3px solid #3B5BFF',
          borderRadius: '50%',
          animation: '_spin 0.75s linear infinite'
        }} />
        <p style={{ color: '#64748B', fontSize: 13, margin: 0, letterSpacing: '0.05em' }}>
          Verifying session…
        </p>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="regions" element={<RegionsPage />} />
            <Route path="therapies" element={<TherapiesPage />} />
            <Route path="presences" element={<PresencesPage />} />
            <Route path="network" element={<NetworkPage />} />
            <Route path="partners" element={<Navigate to="/network" replace />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="activity" element={<ActivityLogPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
