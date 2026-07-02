import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { FiChevronDown, FiSearch, FiMenu, FiUser, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const {
    activePage,
    profileOpen,
    setProfileOpen,
    sidebarOpen,
    setSidebarOpen,
    showToast,
    logout
  } = useAppContext();

  const dropdownRef = useRef(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setProfileOpen]);

  const handleDropdownOption = (option) => {
    setProfileOpen(false);
    if (option === 'Sign Out') {
      logout();
      showToast('Logged Out', 'You have been logged out successfully.');
    } else {
      showToast(`${option} Triggered`, `Simulated navigation to admin ${option.toLowerCase()}.`);
    }
  };

  const getHeaderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return {
          title: 'Welcome back, Admin! 👋',
          subtitle: "Here's what's happening with your network today."
        };
      case 'Regions':
        return {
          title: 'Data management for regions, therapies, and presences',
          subtitle: 'Manage geographic regions and territory network distribution'
        };
      case 'Therapies':
        return {
          title: 'Data management for regions, therapies, and presences',
          subtitle: 'Manage therapies used across all presences'
        };
      case 'Presences':
        return {
          title: 'Data management for regions, therapies, and presences',
          subtitle: 'Manage presence locations and their therapy associations'
        };
      case 'Categories':
        return {
          title: 'Categories Management',
          subtitle: 'Organize and categorize your therapeutic fields'
        };
      case 'Users':
        return {
          title: 'Admin Accounts',
          subtitle: 'Professional user management and permission layers'
        };
      case 'Activity Log':
        return {
          title: 'System Operations Log',
          subtitle: 'Track user changes, elapsed time, and IP addresses'
        };
      case 'Settings':
        return {
          title: 'System Preferences',
          subtitle: 'Configure your admin environment parameters'
        };
      default:
        return {
          title: activePage,
          subtitle: 'Manage your PCD pharma ecosystem with insights and controls.'
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="flex flex-col gap-2 px-6 pt-1.5 pb-1 sm:flex-row sm:items-center sm:justify-between">
      {/* Title block with hamburger trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-textSecondary transition hover:bg-white/10 hover:text-white"
          title={sidebarOpen ? 'Collapse menu' : 'Expand menu'}
        >
          <FiMenu size={18} />
        </button>
        <div>
          <motion.h1
            key={activePage}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[21px] font-bold tracking-tight text-white"
          >
            {headerContent.title}
          </motion.h1>
          <p className="hidden text-xs text-textSecondary sm:block mt-0.5 font-medium">
            {headerContent.subtitle}
          </p>
        </div>
      </div>

      {/* Right panel: Search, widgets, and profile */}
      <div className="flex items-center gap-3.5">
        {/* Render Datepicker and Notification bell only on Dashboard */}
        {activePage === 'Dashboard' ? (
          <>
            {/* Date range picker dropdown */}
            <div className="relative hidden sm:flex items-center gap-2 rounded-xl border border-white/8 bg-[#091024]/50 px-3.5 py-2 text-xs text-textSecondary cursor-pointer hover:bg-white/[0.08] hover:border-white/12 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-textSecondary"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span className="font-semibold text-white/90">20 May 2024 - 26 May 2024</span>
              <FiChevronDown className="text-textSecondary shrink-0" size={13} />
            </div>

            {/* Notification bell */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-textSecondary transition hover:bg-white/10 hover:text-white border border-white/5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8.5px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.4)] border border-[#050B1A]">
                5
              </span>
            </button>
          </>
        ) : (
          /* Search box for other pages */
          <div className="relative hidden items-center rounded-2xl border border-white/8 bg-white/5 px-4 py-2.5 text-xs text-textSecondary shadow-soft focus-within:border-white/15 focus-within:bg-white/[0.08] md:flex w-60 transition-all">
            <FiSearch className="mr-2 text-sm shrink-0" />
            <input
              type="search"
              placeholder="Quick search..."
              className="w-full bg-transparent text-white outline-none placeholder:text-textSecondary"
            />
          </div>
        )}

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 rounded-2xl border border-white/[0.04] bg-white/5 p-1 pr-3.5 text-left transition hover:border-white/15 hover:bg-white/[0.06] h-[40px] shadow-sm"
          >
            <img src="/admin_avatar.png" alt="Admin Avatar" className="h-8 w-8 rounded-xl object-cover border border-white/10" />
            <div className="hidden min-w-0 sm:block leading-none">
              <p className="text-[11.5px] font-bold text-white">Admin User</p>
              <p className="text-[9px] text-[#8DA0D1]/60 font-semibold mt-1">Super Admin</p>
            </div>
            <FiChevronDown className="text-textSecondary shrink-0 transition-transform duration-200" style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }} size={13} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-white/8 bg-sidebar p-2 shadow-soft z-50"
              >
                <div className="px-3 py-2 border-b border-white/6 mb-1">
                  <p className="text-xs font-bold text-white">System Profile</p>
                  <p className="text-[10px] text-textSecondary truncate mt-0.5">admin.user@pcdpharma.com</p>
                </div>
                
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleDropdownOption('Profile Settings')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-textSecondary hover:bg-white/5 hover:text-white transition"
                  >
                    <FiUser size={14} className="text-[#3B5BFF]" />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => handleDropdownOption('Billing')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-textSecondary hover:bg-white/5 hover:text-white transition"
                  >
                    <FiCreditCard size={14} className="text-[#5E4BFF]" />
                    <span>Billing Details</span>
                  </button>
                  <button
                    onClick={() => handleDropdownOption('Sign Out')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-[#FF4D6D] hover:bg-[#FF4D6D]/10 transition"
                  >
                    <FiLogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Header;
