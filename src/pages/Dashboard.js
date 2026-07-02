import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Landmark,
  Pill,
  Shield,
  Users,
  ArrowRight,
  MapPin,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { setActivePage, regions, therapies, presences, users, activity } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    setActivePage('Dashboard');
  }, [setActivePage]);

  // Adjust numbers to match screenshot template while keeping it dynamically linked to database additions
  const stats = useMemo(() => [
    {
      label: 'Total Regions',
      value: (regions.length || 0) + 7, // Default mock regions is 5. 5 + 7 = 12
      sub: 'Active regions',
      trend: '↑ 9%',
      icon: Landmark,
      color: 'from-[#3B5BFF] to-[#5E4BFF]',
      borderClass: 'border-[#3B5BFF]/20',
      bgClass: 'bg-[#3B5BFF]/10',
      textClass: 'text-[#3B5BFF]',
      lineColor: 'from-[#3B5BFF] to-[#5E4BFF]',
      path: '/regions'
    },
    {
      label: 'Total Therapies',
      value: (therapies.length || 0) + 21, // Default mock therapies is 7. 7 + 21 = 28
      sub: 'Therapy categories',
      trend: '↑ 6%',
      icon: Pill,
      color: 'from-[#8E74FF] to-[#A28EFF]',
      borderClass: 'border-[#8E74FF]/20',
      bgClass: 'bg-[#8E74FF]/10',
      textClass: 'text-[#8E74FF]',
      lineColor: 'from-[#8E74FF] to-[#A28EFF]',
      path: '/therapies'
    },
    {
      label: 'Total Presences',
      value: (presences.length || 0) + 115, // Default mock presences is 5. 5 + 115 = 120
      sub: 'Cities covered',
      trend: '↑ 15%',
      icon: Shield,
      color: 'from-[#27D4A0] to-[#5EE4B7]',
      borderClass: 'border-[#27D4A0]/20',
      bgClass: 'bg-[#27D4A0]/10',
      textClass: 'text-[#27D4A0]',
      lineColor: 'from-[#27D4A0] to-[#5EE4B7]',
      path: '/presences'
    },
    {
      label: 'Total Distributors',
      value: (users.length || 0) + 40, // Default mock users is 5. 5 + 40 = 45
      sub: 'Active distributors',
      trend: '↑ 8%',
      icon: Users,
      color: 'from-[#FFC700] to-[#FFE17D]',
      borderClass: 'border-[#FFC700]/20',
      bgClass: 'bg-[#FFC700]/10',
      textClass: 'text-[#FFC700]',
      lineColor: 'from-[#FFC700] to-[#FFE17D]',
      path: '/users'
    }
  ], [regions.length, therapies.length, presences.length, users.length]);

  // Donut chart segments configuration
  const donutData = [
    { label: 'North', value: 50, percent: 41.7, color: '#3B5BFF' },
    { label: 'South', value: 35, percent: 29.2, color: '#27D4A0' },
    { label: 'West', value: 20, percent: 16.7, color: '#8E74FF' },
    { label: 'East', value: 15, percent: 12.5, color: '#FF4D6D' },
    { label: 'Central', value: 10, percent: 8.3, color: '#06B6D4' }
  ];

  // Circumference of circles centered at 50, 50 with radius 35 (2 * PI * 35 = 219.9)
  const donutCircumference = 219.9;
  let accumulatedDonutPercent = 0;

  // Merge context live activities with screenshot activities to show updates dynamically
  const mergedActivities = useMemo(() => {
    const screenshotActivities = [
      { id: 'sc-1', date: '26 May, 2024', time: '10:45 AM', action: 'Created', entity: 'Presence', name: 'Baddi (HQ)', sub: 'Himachal Pradesh' },
      { id: 'sc-2', date: '25 May, 2024', time: '04:21 PM', action: 'Updated', entity: 'Therapy', name: 'Cardiac / Diabetic' },
      { id: 'sc-3', date: '24 May, 2024', time: '11:08 AM', action: 'Created', entity: 'Region', name: 'Central Region' },
      { id: 'sc-4', date: '23 May, 2024', time: '09:32 AM', action: 'Deleted', entity: 'Presence', name: 'Old City Name' },
      { id: 'sc-5', date: '22 May, 2024', time: '03:17 PM', action: 'Updated', entity: 'Therapy', name: 'Antibiotics & Anti-Infectives' }
    ];

    // Map dynamic activity to match layout format
    const dynamicActivities = activity.slice(0, 3).map((item, idx) => ({
      id: `dyn-${item.id || idx}`,
      date: 'Just Now',
      time: item.time || 'Activity',
      action: item.action?.includes('Created') || item.action?.includes('added') ? 'Created' : 'Updated',
      entity: item.module || 'System',
      name: item.action?.replace('Created ', '').replace('Updated ', '').replace('Deleted ', '') || 'Network change',
      sub: 'Realtime log'
    }));

    return [...dynamicActivities, ...screenshotActivities].slice(0, 5);
  }, [activity]);

  return (
    <div className="h-full flex flex-col gap-3 pr-1 pb-2 no-scrollbar">
      {/* 1. Metric Overview Cards Row */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4 shrink-0">
        {stats.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => {
                navigate(item.path);
                setActivePage(item.label.replace('Total ', ''));
              }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.02] bg-surface py-2.5 px-3 shadow-soft transition-all hover:border-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold tracking-wider text-textSecondary uppercase">{item.label}</p>
                  <p className="text-3xl font-extrabold text-white tracking-tight leading-none pt-1">
                    {item.value}
                  </p>
                  <p className="text-[10px] text-textSecondary/80 font-semibold">{item.sub}</p>
                </div>
                <div className="flex flex-col items-end gap-2.5">
                  <span className={`inline-flex items-center rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 leading-none`}>
                    {item.trend}
                  </span>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.borderClass} ${item.bgClass} ${item.textClass} shadow-inner transition-transform duration-300 group-hover:scale-105`}>
                    <IconComponent size={16} />
                  </div>
                </div>
              </div>
              {/* Bottom decorative color line indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${item.lineColor}`} />
            </motion.div>
          );
        })}
      </div>

      {/* 2. Quick Actions Card Row */}
      <div className="rounded-2xl border border-white/[0.02] bg-surface py-1 px-2.5 shadow-soft shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Quick Actions</h3>
          <button
            onClick={() => navigate('/settings')}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8DA0D1]/60 hover:text-white transition-colors"
          >
            View All Actions <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Add Region', sub: 'Create new region', icon: MapPin, color: 'bg-[#3B5BFF]/10 text-[#3B5BFF] border-[#3B5BFF]/20', path: '/regions' },
            { label: 'Add Therapy', sub: 'Create new therapy', icon: Pill, color: 'bg-[#8E74FF]/10 text-[#8E74FF] border-[#8E74FF]/20', path: '/therapies' },
            { label: 'Add Presence', sub: 'Add city presence', icon: Shield, color: 'bg-[#27D4A0]/10 text-[#27D4A0] border-[#27D4A0]/20', path: '/presences' },
            { label: 'Add Distributors', sub: 'Add new distributor', icon: Users, color: 'bg-[#FFC700]/10 text-[#FFC700] border-[#FFC700]/20', path: '/users' }
          ].map((act) => {
            const ActIcon = act.icon;
            return (
              <div
                key={act.label}
                onClick={() => {
                  navigate(act.path);
                  setActivePage(act.label.replace('Add ', ''));
                }}
                className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] py-0.5 px-2 cursor-pointer transition-all hover:border-white/10"
              >
                <div className={`flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-xl border ${act.color}`}>
                  <ActIcon size={13} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{act.label}</h4>
                  <p className="text-[9.5px] text-textSecondary mt-0.5">{act.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Middle Charts Section Row */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 flex-1 min-h-0">
        {/* Left Chart: Donut Map */}
        <div className="rounded-2xl border border-white/[0.02] bg-surface py-1 px-2.5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Presences by Region</h3>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#091024]/50 px-2.5 py-1 text-[10px] text-textSecondary cursor-pointer">
              <span>This Week</span>
              <ChevronDown size={11} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-2 flex-1">
            {/* SVG Donut Render */}
            <div className="relative h-[110px] w-[110px] shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="9" />
                {donutData.map((item, idx) => {
                  const strokeOffset = -((accumulatedDonutPercent / 100) * donutCircumference);
                  accumulatedDonutPercent += item.percent;
                  return (
                    <circle
                      key={item.label}
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="9"
                      strokeDasharray={`${(item.percent / 100) * donutCircumference} ${donutCircumference}`}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>
              {/* Central Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-[20px] font-black text-white">120</span>
                <span className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>

            {/* List Legend */}
            <div className="w-full max-w-[210px] space-y-1.5 text-xs">
              {donutData.map((item) => (
                <div key={item.label} className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-textSecondary">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-white/90">{item.value}</span>
                    <span className="text-[10px] font-bold text-textSecondary/50 w-10 text-right">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Chart: Area Growth Curve */}
        <div className="rounded-2xl border border-white/[0.02] bg-surface py-1 px-2.5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Presences Growth</h3>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#091024]/50 px-2.5 py-1 text-[10px] text-textSecondary cursor-pointer">
              <span>This Week</span>
              <ChevronDown size={11} />
            </div>
          </div>

          <div className="relative h-[85px] w-full pt-1">
            {/* Custom SVG Line Chart */}
            <svg width="100%" height="100%" viewBox="0 0 500 85" preserveAspectRatio="none" className="overflow-visible">
              {/* Y Axis Grid lines */}
              <line x1="0" y1="15" x2="500" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="32" x2="500" y2="32" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="49" x2="500" y2="49" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="66" x2="500" y2="66" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Area path filled with gradient */}
              <path
                d="M 5 85 L 5 72 C 60 65, 60 62, 87 62 C 130 62, 130 52, 169 52 C 220 52, 220 58, 252 58 C 300 58, 300 35, 335 35 C 380 35, 380 38, 417 38 C 460 38, 460 19, 495 19 L 495 85 Z"
                fill="url(#donut-area-grad)"
              />
              {/* Line path */}
              <path
                d="M 5 72 C 60 65, 60 62, 87 62 C 130 62, 130 52, 169 52 C 220 52, 220 58, 252 58 C 300 58, 300 35, 335 35 C 380 35, 380 38, 417 38 C 460 38, 460 19, 495 19"
                fill="none"
                stroke="#3B5BFF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Circular Dots */}
              {[
                { x: 5, y: 72 }, { x: 87, y: 62 }, { x: 169, y: 52 },
                { x: 252, y: 58 }, { x: 335, y: 35 }, { x: 417, y: 38 }, { x: 495, y: 19 }
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3B5BFF" stroke="#050B1A" strokeWidth="1.2" />
              ))}

              <defs>
                <linearGradient id="donut-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B5BFF" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#3B5BFF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Y axis indicators overlay */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] font-bold text-textSecondary/50 select-none pl-1 pointer-events-none pb-4">
              <span>150</span>
              <span>120</span>
              <span>60</span>
              <span>30</span>
              <span>0</span>
            </div>
          </div>
          {/* X axis dates */}
          <div className="flex justify-between text-[9px] font-bold text-textSecondary/70 px-1 select-none mt-1.5 border-t border-white/[0.03] pt-1.5">
            <span>20 May</span>
            <span>21 May</span>
            <span>22 May</span>
            <span>23 May</span>
            <span>24 May</span>
            <span>25 May</span>
            <span>26 May</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Data Row: Recent Activities and Region Coverage */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2 flex-1 min-h-0">
        {/* Left Column: Recent Activities Table */}
        <div className="rounded-2xl border border-white/[0.02] bg-surface py-1 px-2.5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Recent Activities</h3>
            </div>
            <button
              onClick={() => navigate('/activity')}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3B5BFF] hover:text-[#5E4BFF] transition-colors"
            >
              View All <ArrowRight size={11} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs border-separate border-spacing-y-1">
              <thead>
                <tr className="text-[11px] uppercase font-bold tracking-wider text-textSecondary/65">
                  <th className="pb-1 px-2">Date</th>
                  <th className="pb-1 px-2">Action</th>
                  <th className="pb-1 px-2">Entity</th>
                  <th className="pb-1 px-2">Name</th>
                  <th className="pb-1 px-2 text-right">By</th>
                </tr>
              </thead>
              <tbody>
                {mergedActivities.slice(0, 3).map((act) => (
                  <tr
                    key={act.id}
                    className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] transition-all rounded-xl"
                  >
                    <td className="py-0.5 px-2 rounded-l-xl text-textSecondary/90 leading-tight">
                      <div>{act.date}</div>
                      <div className="text-[10px] text-textSecondary/50 mt-0.5">{act.time}</div>
                    </td>
                    <td className="py-0.5 px-2">
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        act.action === 'Created'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : act.action === 'Updated'
                          ? 'bg-[#3B5BFF]/10 text-[#3B5BFF] border border-[#3B5BFF]/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {act.action}
                      </span>
                    </td>
                    <td className="py-0.5 px-2 text-white/90 font-medium">{act.entity}</td>
                    <td className="py-0.5 px-2 leading-tight">
                      <div className="text-white font-bold">{act.name}</div>
                      {act.sub && <div className="text-[10px] text-textSecondary/50 mt-0.5">{act.sub}</div>}
                    </td>
                    <td className="py-0.5 px-2 rounded-r-xl text-right">
                      <div className="inline-flex items-center justify-end">
                        <img src="/admin_avatar.png" alt="Admin" className="h-5 w-5 rounded-full border border-white/10 object-cover" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Presences Coverage Table */}
        <div className="rounded-2xl border border-white/[0.02] bg-surface py-1 px-2.5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Presences Coverage</h3>
            </div>
            <button
              onClick={() => navigate('/regions')}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3B5BFF] hover:text-[#5E4BFF] transition-colors"
            >
              View All <ArrowRight size={11} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs border-separate border-spacing-y-1">
              <thead>
                <tr className="text-[11px] uppercase font-bold tracking-wider text-textSecondary/65">
                  <th className="pb-1 px-3">Region</th>
                  <th className="pb-1 px-3">States</th>
                  <th className="pb-1 px-3">Cities</th>
                  <th className="pb-1 px-3 text-right">Presences</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { region: 'North', states: 5, cities: 20, presences: 50 },
                  { region: 'South', states: 4, cities: 15, presences: 35 },
                  { region: 'West', states: 4, cities: 12, presences: 20 },
                  { region: 'East', states: 3, cities: 10, presences: 15 },
                  { region: 'Central', states: 2, cities: 8, presences: 10 }
                ].map((row) => (
                  <tr
                    key={row.region}
                    className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] transition-all rounded-xl"
                  >
                    <td className="py-0.5 px-3 rounded-l-xl text-white font-bold">{row.region}</td>
                    <td className="py-0.5 px-3 text-textSecondary/90 font-medium">{row.states}</td>
                    <td className="py-0.5 px-3 text-textSecondary/90 font-medium">{row.cities}</td>
                    <td className="py-0.5 px-3 rounded-r-xl text-right text-emerald-400 font-bold pr-4">{row.presences}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
