import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import usersData from '../data/users.json';
import categoriesData from '../data/categories.json';
import activityData from '../data/activity.json';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');

  // Centralized tables state — live from DB
  const [therapies, setTherapies] = useState([]);
  const [regions, setRegions] = useState([]);
  const [users, setUsers] = useState(usersData);
  const [categories, setCategories] = useState(categoriesData);
  const [presences, setPresences] = useState([]);
  const [activity, setActivity] = useState(activityData);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        const data = await response.json();
        if (data.success) {
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
        }
      } catch (err) {
        console.error("Auth verification error:", err);
      }
    };
    if (localStorage.getItem('isLoggedIn') === 'true') {
      verifyAuth();
    }
  }, []);

  const login = async (userId, password) => {
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, password }),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login call failed:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout call failed:", err);
    }
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // ─── Regions ───────────────────────────────────────────
  const fetchRegions = async () => {
    try {
      const response = await fetch("http://localhost:5000/region/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await response.json();
      if (data.success && data.data) {
        const mapped = data.data.map(item => ({ ...item, id: item._id }));
        setRegions(mapped);
      }
    } catch (err) {
      console.error("Fetch regions failed:", err);
    }
  };

  const addRegion = async (regionData) => {
    try {
      const response = await fetch("http://localhost:5000/region/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regionData),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchRegions(); return true; }
      return false;
    } catch (err) {
      console.error("Add region failed:", err);
      return false;
    }
  };

  const editRegion = async (id, regionData) => {
    try {
      const response = await fetch(`http://localhost:5000/region/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regionData),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchRegions(); return true; }
      return false;
    } catch (err) {
      console.error("Edit region failed:", err);
      return false;
    }
  };

  const removeRegion = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/region/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchRegions(); return true; }
      return false;
    } catch (err) {
      console.error("Remove region failed:", err);
      return false;
    }
  };

  // ─── Therapies ─────────────────────────────────────────
  const fetchTherapies = async () => {
    try {
      const response = await fetch("http://localhost:5000/therapy/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await response.json();
      if (data.success && data.data) {
        const mapped = data.data.map(item => ({ ...item, id: item._id }));
        setTherapies(mapped);
      }
    } catch (err) {
      console.error("Fetch therapies failed:", err);
    }
  };

  const addTherapy = async (therapyData) => {
    try {
      const response = await fetch("http://localhost:5000/therapy/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(therapyData),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchTherapies(); return true; }
      return false;
    } catch (err) {
      console.error("Add therapy failed:", err);
      return false;
    }
  };

  const editTherapy = async (id, therapyData) => {
    try {
      const response = await fetch(`http://localhost:5000/therapy/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(therapyData),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchTherapies(); return true; }
      return false;
    } catch (err) {
      console.error("Edit therapy failed:", err);
      return false;
    }
  };

  const removeTherapy = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/therapy/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchTherapies(); return true; }
      return false;
    } catch (err) {
      console.error("Remove therapy failed:", err);
      return false;
    }
  };

  // ─── Presences ─────────────────────────────────────────
  const fetchPresences = async () => {
    try {
      const response = await fetch("http://localhost:5000/presence/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await response.json();
      if (data.success && data.data) {
        const mapped = data.data.map(item => ({ ...item, id: item._id }));
        setPresences(mapped);
      }
    } catch (err) {
      console.error("Fetch presences failed:", err);
    }
  };

  const addPresence = async (presenceData) => {
    try {
      const response = await fetch("http://localhost:5000/presence/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presenceData),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchPresences(); return true; }
      return false;
    } catch (err) {
      console.error("Add presence failed:", err);
      return false;
    }
  };

  const editPresence = async (id, presenceData) => {
    try {
      const response = await fetch(`http://localhost:5000/presence/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presenceData),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchPresences(); return true; }
      return false;
    } catch (err) {
      console.error("Edit presence failed:", err);
      return false;
    }
  };

  const removePresence = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/presence/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) { fetchPresences(); return true; }
      return false;
    } catch (err) {
      console.error("Remove presence failed:", err);
      return false;
    }
  };

  // Fetch all on login
  useEffect(() => {
    if (isLoggedIn) {
      fetchRegions();
      fetchTherapies();
      fetchPresences();
    }
  }, [isLoggedIn]);

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
    sidebarOpen, setSidebarOpen,
    profileOpen, setProfileOpen,
    activePage, setActivePage,
    therapies, setTherapies,
    regions, setRegions,
    users, setUsers,
    categories, setCategories,
    presences, setPresences,
    activity, setActivity,
    showToast,
    logActivity,
    isLoggedIn,
    login,
    logout,
    // Regions
    addRegion, editRegion, removeRegion, fetchRegions,
    // Therapies
    addTherapy, editTherapy, removeTherapy, fetchTherapies,
    // Presences
    addPresence, editPresence, removePresence, fetchPresences
  }), [
    sidebarOpen, profileOpen, activePage,
    therapies, regions, users, categories, presences, activity,
    isLoggedIn
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
