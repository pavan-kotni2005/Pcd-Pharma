import { useEffect, useMemo } from 'react';
import { FiTrendingUp, FiBarChart2, FiShield, FiMap, FiCpu, FiLayers, FiUsers, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { setActivePage, regions, therapies, presences, users, activity } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    setActivePage('Dashboard');
  }, [setActivePage]);

  // Dynamically calculate overview stats
  const summary = useMemo(() => [
    { label: 'Total Regions', value: regions.length, trend: '+12%', icon: FiMap, color: 'from-[#3B5BFF] to-[#5E4BFF]', path: '/regions' },
    { label: 'Total Therapies', value: therapies.length, trend: '+18%', icon: FiCpu, color: 'from-[#8E74FF] to-[#A28EFF]', path: '/therapies' },
    { label: 'Total Presences', value: presences.length, trend: '+8%', icon: FiLayers, color: 'from-[#27D4A0] to-[#5EE4B7]', path: '/presences' },
    { label: 'Total Users', value: users.length, trend: '+22%', icon: FiUsers, color: 'from-[#FFC700] to-[#FFE17D]', path: '/users' }
  ], [regions.length, therapies.length, presences.length, users.length]);

  // Get the 3 most recent activity log items
  const recentActivities = useMemo(() => {
    return activity.slice(0, 3);
  }, [activity]);

  // Calculate dummy representation values for the live overview chart based on actual counts
  const totalItems = regions.length + therapies.length + presences.length;
  const chartItems = useMemo(() => [
    { label: 'Regions', value: Math.round((regions.length / (totalItems || 1)) * 100), color: 'bg-[#3B5BFF]', shadow: 'shadow-[#3B5BFF]/30' },
    { label: 'Therapies', value: Math.round((therapies.length / (totalItems || 1)) * 100), color: 'bg-[#5E4BFF]', shadow: 'shadow-[#5E4BFF]/30' },
    { label: 'Presences', value: Math.round((presences.length / (totalItems || 1)) * 100), color: 'bg-[#27D4A0]', shadow: 'shadow-[#27D4A0]/30' }
  ], [regions.length, therapies.length, presences.length, totalItems]);

  return (
    <div className="space-y-6">
      {/* Upper Stats Row */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              onClick={() => {
                navigate(item.path);
                setActivePage(item.label.replace('Total ', ''));
              }}
              className="group cursor-pointer rounded-3xl border border-white/8 bg-surface p-6 shadow-soft transition-all hover:border-white/15"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-textSecondary font-semibold">{item.label}</p>
                  <p className="mt-3 text-3xl font-bold text-white tracking-tight group-hover:text-[#3B5BFF] transition-colors">{item.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-glow transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <FiTrendingUp className="animate-pulse" />
                <span>{item.trend} increase</span>
                <span className="text-textSecondary font-normal ml-1">since last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Grid of details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Activities */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-white/8 bg-surface p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-textSecondary font-semibold">Activity Stream</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Recent Updates</h3>
            </div>
            <Button variant="secondary" onClick={() => {
              navigate('/activity');
              setActivePage('Activity Log');
            }}>View all</Button>
          </div>
          <div className="mt-6 space-y-4">
            {recentActivities.map((item) => (
              <div key={item.id} className="group rounded-2xl border border-white/6 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white/95">{item.action}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-textSecondary">
                      <span className="font-medium text-[#3B5BFF]">{item.user}</span>
                      <span>•</span>
                      <span>{item.module}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-textSecondary">
                      <FiClock size={10} />
                      {item.time}
                    </span>
                    <Badge status={item.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Center Column: Live Insights Progress Chart */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="rounded-3xl border border-white/8 bg-surface p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-textSecondary font-semibold">Proportional Mix</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Entity Distribution</h3>
            </div>
            <FiBarChart2 className="text-xl text-[#3B5BFF]" />
          </div>
          <div className="mt-8 space-y-6">
            {chartItems.map((item) => (
              <div key={item.label} className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-white/90">
                  <span className="tracking-wide">{item.label}</span>
                  <span>{item.value || 0}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value || 0}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`${item.color} ${item.shadow} h-full rounded-full shadow-[0_0_10px_rgba(59,91,255,0.2)]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Right Column: Operational Health & Stable State */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className="rounded-3xl border border-white/8 bg-surface p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-textSecondary font-semibold">Operational Health</p>
              <h3 className="mt-2 text-lg font-semibold text-white">System Status</h3>
            </div>
            <Badge status="Active" />
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5E4BFF]/10 text-[#5E4BFF] shadow-inner">
                  <FiShield size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Security protocols active</p>
                  <p className="text-xs text-textSecondary mt-0.5">MFA and session locks verified.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Realtime Analytics</p>
                  <p className="text-xs text-textSecondary mt-0.5">Auto-updates synced properly.</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Synced</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Dashboard;

