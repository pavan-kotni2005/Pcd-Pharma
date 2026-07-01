import { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiFilter, FiActivity, FiUser, FiGlobe } from 'react-icons/fi';
import Pagination from '../components/Pagination';
import Badge from '../components/Badge';
import Table from '../components/Table';
import { useAppContext } from '../context/AppContext';

const modulesList = ['All Modules', 'Therapies', 'Regions', 'Presences', 'Categories', 'Users'];
const statusesList = ['All Statuses', 'Success', 'Pending', 'Failed'];
const dateRanges = ['All Time', 'Today', 'Yesterday', 'Last 7 Days'];

const ActivityLog = () => {
  const { setActivePage, activity } = useAppContext();
  
  // State for search and pagination
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  // Filter States
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateFilter, setDateFilter] = useState('All Time');

  useEffect(() => {
    setActivePage('Activity Log');
  }, [setActivePage]);

  // Apply filters
  const filtered = useMemo(() => {
    return activity.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.user.toLowerCase().includes(q) ||
        item.action.toLowerCase().includes(q) ||
        item.ip.toLowerCase().includes(q);

      const matchesModule = moduleFilter === 'All Modules' || item.module === moduleFilter;
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
      
      // Date filter mock checking
      let matchesDate = true;
      if (dateFilter === 'Today') {
        matchesDate = item.time === 'Just now' || item.time.includes('m ago');
      } else if (dateFilter === 'Yesterday') {
        matchesDate = item.time.includes('1d ago');
      } else if (dateFilter === 'Last 7 Days') {
        matchesDate = item.time === 'Just now' || item.time.includes('m ago') || item.time.includes('h ago') || parseInt(item.time) <= 7;
      }

      return matchesSearch && matchesModule && matchesStatus && matchesDate;
    });
  }, [activity, search, moduleFilter, statusFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const pagedData = useMemo(() => {
    return filtered.slice((page - 1) * 5, page * 5);
  }, [filtered, page]);

  const columns = [
    {
      header: 'Operator',
      accessor: 'user',
      cell: (row) => (
        <div className="flex items-center gap-2 text-white font-medium">
          <FiUser className="text-[#3B5BFF]" />
          <span>{row.user}</span>
        </div>
      )
    },
    { header: 'Action Performed', accessor: 'action' },
    {
      header: 'System Module',
      accessor: 'module',
      cell: (row) => (
        <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-xs text-[#8DA0D1] font-semibold border border-white/4">
          {row.module}
        </span>
      )
    },
    { header: 'Time Elapsed', accessor: 'time' },
    {
      header: 'IP Address',
      accessor: 'ip',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-textSecondary font-mono">
          <FiGlobe className="text-white/20" />
          <span>{row.ip}</span>
        </div>
      )
    },
    { header: 'Status', accessor: 'status', cell: (row) => <Badge status={row.status} /> }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-textSecondary font-semibold">Security</p>
          <h1 className="mt-2 text-3xl font-bold text-white tracking-tight">System operations log</h1>
        </div>
      </div>

      {/* Filter Options */}
      <div className="grid gap-4 rounded-3xl border border-white/8 bg-surface p-6 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-textSecondary">
          <FiSearch />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by action, user, IP..."
            className="w-full bg-transparent text-white outline-none placeholder:text-textSecondary"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white">
          <FiFilter className="text-textSecondary shrink-0" />
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-white outline-none"
          >
            {dateRanges.map((range) => (
              <option key={range} value={range} className="bg-sidebar">
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Module Filter */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white">
          <FiActivity className="text-textSecondary shrink-0" />
          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-white outline-none"
          >
            {modulesList.map((mod) => (
              <option key={mod} value={mod} className="bg-sidebar">
                {mod}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white">
          <Badge status="Active" className="shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-white outline-none"
          >
            {statusesList.map((stat) => (
              <option key={stat} value={stat} className="bg-sidebar">
                {stat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <Table columns={columns} data={pagedData} />

      {/* Pagination */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default ActivityLog;
