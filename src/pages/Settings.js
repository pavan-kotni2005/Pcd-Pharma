import { useEffect, useState } from 'react';
import { FiCheckCircle, FiShield, FiMonitor, FiBell, FiSave, FiRotateCcw } from 'react-icons/fi';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import Toggle from '../components/Toggle';
import { useAppContext } from '../context/AppContext';

const settingsTabs = ['General', 'Security', 'Appearance', 'Notifications'];

const Settings = () => {
  const { setActivePage, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState('General');

  // Form State
  const [general, setGeneral] = useState({ theme: 'Dark', timezone: 'UTC' });
  const [security, setSecurity] = useState({ mfa: true, sessions: true });
  const [appearance, setAppearance] = useState({ sidebar: true, compact: false });
  const [notifications, setNotifications] = useState({ email: true, sms: false });

  useEffect(() => {
    setActivePage('Settings');
  }, [setActivePage]);

  const handleSave = () => {
    showToast('Settings Saved', 'All workspace preferences updated successfully.');
  };

  const handleReset = () => {
    setGeneral({ theme: 'Dark', timezone: 'UTC' });
    setSecurity({ mfa: true, sessions: true });
    setAppearance({ sidebar: true, compact: false });
    setNotifications({ email: true, sms: false });
    showToast('Settings Reset', 'Configuration reverted to default.', 'failed');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-textSecondary font-semibold">Settings</p>
          <h1 className="mt-2 text-3xl font-bold text-white tracking-tight">System preferences</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-3xl border border-white/8 bg-surface p-6 shadow-soft space-y-6">
        <Tabs items={settingsTabs} active={activeTab} onChange={setActiveTab} />

        {/* Tab contents */}
        <div className="pt-2 min-h-[250px]">
          {activeTab === 'General' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6 rounded-2xl border border-white/6 bg-white/[0.01] p-6">
                <div className="flex items-center gap-3 text-[#3B5BFF] pb-4 border-b border-white/6">
                  <FiCheckCircle size={20} />
                  <div>
                    <h3 className="font-semibold text-white">General Parameters</h3>
                    <p className="text-xs text-textSecondary mt-0.5">Workspace locale and server parameters.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-textSecondary font-semibold">Theme Mode</label>
                    <select
                      value={general.theme}
                      onChange={(e) => setGeneral((prev) => ({ ...prev, theme: e.target.value }))}
                      className="w-full rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#3B5BFF]"
                    >
                      <option className="bg-sidebar">Dark Professional (Recommended)</option>
                      <option className="bg-sidebar">Light Minimalist</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-textSecondary font-semibold">Timezone</label>
                    <select
                      value={general.timezone}
                      onChange={(e) => setGeneral((prev) => ({ ...prev, timezone: e.target.value }))}
                      className="w-full rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#3B5BFF]"
                    >
                      <option className="bg-sidebar">UTC (Universal Time Coordinated)</option>
                      <option className="bg-sidebar">GMT (Greenwich Mean Time)</option>
                      <option className="bg-sidebar">EST (Eastern Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6 rounded-2xl border border-white/6 bg-white/[0.01] p-6">
                <div className="flex items-center gap-3 text-[#FF4D6D] pb-4 border-b border-white/6">
                  <FiShield size={20} />
                  <div>
                    <h3 className="font-semibold text-white">Security Constraints</h3>
                    <p className="text-xs text-textSecondary mt-0.5">Protect user credentials and sessions.</p>
                  </div>
                </div>

                <div className="space-y-4 divide-y divide-white/6">
                  <Toggle
                    checked={security.mfa}
                    onChange={(val) => setSecurity((prev) => ({ ...prev, mfa: val }))}
                    label="Multi-factor authentication (MFA)"
                    description="Require a confirmation code at login."
                  />
                  <div className="pt-4">
                    <Toggle
                      checked={security.sessions}
                      onChange={(val) => setSecurity((prev) => ({ ...prev, sessions: val }))}
                      label="Session Timeout Auto-lock"
                      description="Terminate active admin sessions after 15m of inactivity."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6 rounded-2xl border border-white/6 bg-white/[0.01] p-6">
                <div className="flex items-center gap-3 text-[#8E74FF] pb-4 border-b border-white/6">
                  <FiMonitor size={20} />
                  <div>
                    <h3 className="font-semibold text-white">Dashboard Appearance</h3>
                    <p className="text-xs text-textSecondary mt-0.5">Adjust scaling and navigation features.</p>
                  </div>
                </div>

                <div className="space-y-4 divide-y divide-white/6">
                  <Toggle
                    checked={appearance.sidebar}
                    onChange={(val) => setAppearance((prev) => ({ ...prev, sidebar: val }))}
                    label="Collapsible Sidebar"
                    description="Allow minimizing the sidebar menu into icon stripes."
                  />
                  <div className="pt-4">
                    <Toggle
                      checked={appearance.compact}
                      onChange={(val) => setAppearance((prev) => ({ ...prev, compact: val }))}
                      label="Dense Table Padding"
                      description="Minimize line spacing to fit more results per page."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6 rounded-2xl border border-white/6 bg-white/[0.01] p-6">
                <div className="flex items-center gap-3 text-[#27D4A0] pb-4 border-b border-white/6">
                  <FiBell size={20} />
                  <div>
                    <h3 className="font-semibold text-white">Alert Preferences</h3>
                    <p className="text-xs text-textSecondary mt-0.5">Decide how to obtain operational reports.</p>
                  </div>
                </div>

                <div className="space-y-4 divide-y divide-white/6">
                  <Toggle
                    checked={notifications.email}
                    onChange={(val) => setNotifications((prev) => ({ ...prev, email: val }))}
                    label="Email Alerts"
                    description="Deliver updates about changes to registered therapies."
                  />
                  <div className="pt-4">
                    <Toggle
                      checked={notifications.sms}
                      onChange={(val) => setNotifications((prev) => ({ ...prev, sms: val }))}
                      label="Critical SMS Notices"
                      description="Send SMS notifications for failed user auth events."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons footer */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-white/6 pt-6">
          <Button variant="secondary" onClick={handleReset} className="inline-flex items-center gap-2">
            <FiRotateCcw size={14} /> Reset Preferences
          </Button>
          <Button onClick={handleSave} className="inline-flex items-center gap-2">
            <FiSave size={14} /> Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
