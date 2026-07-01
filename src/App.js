import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/Dashboard';
import RegionsPage from './pages/Regions';
import TherapiesPage from './pages/Therapies';
import PresencesPage from './pages/Presences';
import CategoriesPage from './pages/Categories';
import UsersPage from './pages/Users';
import ActivityLogPage from './pages/ActivityLog';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="regions" element={<RegionsPage />} />
            <Route path="therapies" element={<TherapiesPage />} />
            <Route path="presences" element={<PresencesPage />} />
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
