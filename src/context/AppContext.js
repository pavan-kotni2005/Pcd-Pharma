import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import usersData from '../data/users.json';
import categoriesData from '../data/categories.json';
import activityData from '../data/activity.json';
import API_BASE from '../utils/api';

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
  // True while the async /auth/me check is in-flight — prevents premature redirect
  const [isVerifying, setIsVerifying] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        if (response.status === 401) {
          // Token is invalid or expired — clear the session
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
        } else if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem('isLoggedIn');
          }
        }
        // On 5xx or unexpected errors: keep the user logged in (don't disrupt UX)
      } catch (err) {
        // Network error (server cold start / no internet) — keep session alive
        console.warn("[AUTH] Network error during verification, keeping session:", err.message);
      } finally {
        setIsVerifying(false);
      }
    };
    if (localStorage.getItem('isLoggedIn') === 'true') {
      verifyAuth();
    } else {
      setIsVerifying(false);
    }
  }, []);

  const login = async (userId, password) => {
    try {
      console.log(`[AUTH] Initiating login for: ${userId} at ${API_BASE}/auth/login`);
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, password }),
        credentials: "include"
      });
      console.log(`[AUTH] Login response status: ${response.status}`);
      const data = await response.json();
      console.log(`[AUTH] Login response body:`, data);
      if (data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("[AUTH] Login network request failed:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
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
      console.log(`[DATA] Fetching regions from: ${API_BASE}/region/get`);
      const response = await fetch(`${API_BASE}/region/get`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      console.log(`[DATA] Regions response status: ${response.status}`);
      const data = await response.json();
      console.log(`[DATA] Regions response body:`, data);
      if (data.success && data.data) {
        const mapped = data.data.map(item => ({ ...item, id: item._id }));
        setRegions(mapped);
      }
    } catch (err) {
      console.error("[DATA] Fetch regions failed:", err);
    }
  };

  const addRegion = async (regionData) => {
    try {
      const response = await fetch(`${API_BASE}/region/create`, {
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
      const response = await fetch(`${API_BASE}/region/update/${id}`, {
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
      const response = await fetch(`${API_BASE}/region/delete/${id}`, {
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
      console.log(`[DATA] Fetching therapies from: ${API_BASE}/therapy/get`);
      const response = await fetch(`${API_BASE}/therapy/get`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      console.log(`[DATA] Therapies response status: ${response.status}`);
      const data = await response.json();
      console.log(`[DATA] Therapies response body:`, data);
      if (data.success && data.data) {
        const mapped = data.data.map(item => ({ ...item, id: item._id }));
        setTherapies(mapped);
      }
    } catch (err) {
      console.error("[DATA] Fetch therapies failed:", err);
    }
  };

  const addTherapy = async (therapyData) => {
    try {
      const response = await fetch(`${API_BASE}/therapy/create`, {
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
      const response = await fetch(`${API_BASE}/therapy/update/${id}`, {
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
      const response = await fetch(`${API_BASE}/therapy/delete/${id}`, {
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
      console.log(`[DATA] Fetching presences from: ${API_BASE}/presence/get`);
      const response = await fetch(`${API_BASE}/presence/get`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      console.log(`[DATA] Presences response status: ${response.status}`);
      const data = await response.json();
      console.log(`[DATA] Presences response body:`, data);
      if (data.success && data.data) {
        const mapped = data.data.map(item => ({ ...item, id: item._id }));
        setPresences(mapped);
      }
    } catch (err) {
      console.error("[DATA] Fetch presences failed:", err);
    }
  };

  const addPresence = async (presenceData) => {
    try {
      const response = await fetch(`${API_BASE}/presence/create`, {
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
      const response = await fetch(`${API_BASE}/presence/update/${id}`, {
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
      const response = await fetch(`${API_BASE}/presence/delete/${id}`, {
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
    isVerifying,
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
    isLoggedIn, isVerifying
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
