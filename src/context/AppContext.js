import { createContext, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import therapiesData from '../data/therapies.json';
import regionsData from '../data/regions.json';
import usersData from '../data/users.json';
import categoriesData from '../data/categories.json';
import presencesData from '../data/presences.json';
import activityData from '../data/activity.json';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');

  // Centralized tables state
  const [therapies, setTherapies] = useState(therapiesData);
  const [regions, setRegions] = useState(regionsData);
  const [users, setUsers] = useState(usersData);
  const [categories, setCategories] = useState(categoriesData);
  const [presences, setPresences] = useState(presencesData);
  const [activity, setActivity] = useState(activityData);

  // Helper to trigger toast notifications
  const showToast = (title, message, type = 'success') => {
    const content = `${title}: ${message}`;
    if (type === 'failed') {
      toast.error(content);
    } else {
      toast.success(content);
    }
  };

  // Helper to log user action in real-time
  const logActivity = (action, module, status = 'Success') => {
    const newLog = {
      id: `a${activity.length + Math.floor(Math.random() * 1000)}`,
      user: 'Admin User',
      action,
      module,
      time: 'Just now',
      ip: '192.168.1.100',
      status
    };
    setActivity((prev) => [newLog, ...prev]);
  };

  const value = useMemo(() => ({
    sidebarOpen,
    setSidebarOpen,
    profileOpen,
    setProfileOpen,
    activePage,
    setActivePage,
    therapies,
    setTherapies,
    regions,
    setRegions,
    users,
    setUsers,
    categories,
    setCategories,
    presences,
    setPresences,
    activity,
    setActivity,
    showToast,
    logActivity
  }), [
    sidebarOpen,
    profileOpen,
    activePage,
    therapies,
    regions,
    users,
    categories,
    presences,
    activity
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

