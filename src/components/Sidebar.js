import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  FiHome,
  FiMap,
  FiCpu,
  FiLayers,
  FiUsers,
  FiActivity,
  FiSettings,
  FiTag,
  FiChevronRight,
  FiX,
  FiBriefcase
} from 'react-icons/fi';

const mainMenuItems = [
  { label: 'Dashboard', icon: FiHome, path: '/' },
  { label: 'Regions', icon: FiMap, path: '/regions' },
  { label: 'Therapies', icon: FiCpu, path: '/therapies' },
  { label: 'Presences', icon: FiLayers, path: '/presences' },
  { label: 'Network', icon: FiBriefcase, path: '/network' }
];

const settingsMenuItems = [
  { label: 'Categories', icon: FiTag, path: '/categories' },
  { label: 'Users', icon: FiUsers, path: '/users' },
  { label: 'Activity Log', icon: FiActivity, path: '/activity' },
  { label: 'Settings', icon: FiSettings, path: '/settings' }
];

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, setActivePage } = useAppContext();
  const location = useLocation();

  // Close sidebar on mobile after clicking link
  const handleLinkClick = (label) => {
    setActivePage(label);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderNavList = (items) => {
    return (
      <nav className="space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => handleLinkClick(item.label)}
              className={`group relative flex items-center gap-3 py-3 px-4 text-sm transition-all duration-150 ${
                active
                  ? 'bg-[#3B5BFF]/10 text-white border-l-4 border-[#3B5BFF] rounded-r-xl shadow-[inset_10px_0_20px_rgba(59,91,255,0.05)]'
                  : 'text-textSecondary hover:bg-white/[0.02] hover:text-white border-l-4 border-transparent'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${
                active ? 'bg-[#3B5BFF]/20 text-[#3B5BFF]' : 'bg-white/5 text-textSecondary group-hover:text-white'
              }`}>
                <Icon size={16} />
              </span>
              {sidebarOpen && (
                <span className="font-semibold tracking-wide truncate">{item.label}</span>
              )}
              {sidebarOpen && active && <FiChevronRight className="ml-auto text-[#3B5BFF] shrink-0" />}
            </Link>
          );
        })}
      </nav>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-[#050B1A]/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        animate={{
          width: sidebarOpen ? 288 : 80,
          x: sidebarOpen ? 0 : (window.innerWidth < 1024 ? -288 : 0)
        }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className={`fixed left-0 top-0 z-40 h-full bg-sidebar shadow-soft flex flex-col py-6 px-4`}
      >
        {/* Top: Logo Header */}
        <div className="shrink-0 mb-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${sidebarOpen ? 'w-full' : 'w-10 justify-center'}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B5BFF]/10 to-[#5E4BFF]/5 border border-white/10 text-white shadow-lg select-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transform rotate-[315deg]">
                  <rect x="5" y="8" width="14" height="8" rx="4" fill="url(#sidebar-pill-grad)" />
                  <path d="M12 8V16" stroke="#050B1A" strokeWidth="1.5" />
                  <defs>
                    <linearGradient id="sidebar-pill-grad" x1="5" y1="8" x2="19" y2="16" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B5BFF" />
                      <stop offset="1" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white tracking-tight">PCD Pharma</p>
                  <p className="text-[10px] uppercase tracking-wider text-textSecondary font-semibold">Admin Dashboard</p>
                </div>
              )}
            </div>

            {/* Mobile close toggle */}
            {sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-textSecondary transition hover:bg-white/10 hover:text-white lg:hidden"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Middle: Scrollable Nav Links */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0 scrollbar-custom mb-6 space-y-6">
          {/* Main Menu Links */}
          <div>
            {sidebarOpen && (
              <div className="px-4 mb-2.5 text-[10px] uppercase font-bold tracking-[0.2em] text-[#8DA0D1]/60">
                Main Menu
              </div>
            )}
            {renderNavList(mainMenuItems)}
          </div>

          {/* Settings Links */}
          <div>
            {sidebarOpen && (
              <div className="px-4 mb-2.5 text-[10px] uppercase font-bold tracking-[0.2em] text-[#8DA0D1]/60">
                Settings
              </div>
            )}
            {renderNavList(settingsMenuItems)}
          </div>
        </div>




      </motion.aside>
    </>
  );
};

export default Sidebar;
