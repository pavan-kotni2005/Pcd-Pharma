import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  X,
  Users,
  Search,
  Eye
} from 'lucide-react';
import Button from '../components/Button';
import Table from '../components/Table';
import Toggle from '../components/Toggle';
import Modal from '../components/Modal';
import Tabs from '../components/Tabs';
import { useAppContext } from '../context/AppContext';

const tabs = ['Regions', 'Therapies', 'Presences'];

// Dictionary of Indian cities with regions and states
const citySuggestions = [
  { name: 'Mumbai', state: 'Maharashtra', region: 'West Region' },
  { name: 'Pune', state: 'Maharashtra', region: 'West Region' },
  { name: 'Nagpur', state: 'Maharashtra', region: 'West Region' },
  { name: 'Thane', state: 'Maharashtra', region: 'West Region' },
  { name: 'Nashik', state: 'Maharashtra', region: 'West Region' },
  { name: 'Aurangabad', state: 'Maharashtra', region: 'West Region' },
  { name: 'Solapur', state: 'Maharashtra', region: 'West Region' },
  
  { name: 'Delhi', state: 'Delhi', region: 'North Region' },
  { name: 'New Delhi', state: 'Delhi', region: 'North Region' },
  { name: 'Gurgaon', state: 'Haryana', region: 'North Region' },
  { name: 'Noida', state: 'Uttar Pradesh', region: 'North Region' },
  { name: 'Lucknow', state: 'Uttar Pradesh', region: 'North Region' },
  { name: 'Kanpur', state: 'Uttar Pradesh', region: 'North Region' },
  { name: 'Chandigarh', state: 'Punjab', region: 'North Region' },
  { name: 'Jaipur', state: 'Rajasthan', region: 'North Region' },
  { name: 'Amritsar', state: 'Punjab', region: 'North Region' },
  { name: 'Ludhiana', state: 'Punjab', region: 'North Region' },
  
  { name: 'Bangalore', state: 'Karnataka', region: 'South Region' },
  { name: 'Bengaluru', state: 'Karnataka', region: 'South Region' },
  { name: 'Mysore', state: 'Karnataka', region: 'South Region' },
  { name: 'Hubli', state: 'Karnataka', region: 'South Region' },
  { name: 'Hyderabad', state: 'Telangana', region: 'South Region' },
  { name: 'Secunderabad', state: 'Telangana', region: 'South Region' },
  { name: 'Warangal', state: 'Telangana', region: 'South Region' },
  { name: 'Chennai', state: 'Tamil Nadu', region: 'South Region' },
  { name: 'Coimbatore', state: 'Tamil Nadu', region: 'South Region' },
  { name: 'Madurai', state: 'Tamil Nadu', region: 'South Region' },
  { name: 'Kochi', state: 'Kerala', region: 'South Region' },
  { name: 'Trivandrum', state: 'Kerala', region: 'South Region' },
  
  { name: 'Kolkata', state: 'West Bengal', region: 'East Region' },
  { name: 'Howrah', state: 'West Bengal', region: 'East Region' },
  { name: 'Patna', state: 'Bihar', region: 'East Region' },
  { name: 'Gaya', state: 'Bihar', region: 'East Region' },
  { name: 'Bhubaneswar', state: 'Odisha', region: 'East Region' },
  { name: 'Cuttack', state: 'Odisha', region: 'East Region' },
  { name: 'Guwahati', state: 'Assam', region: 'East Region' },
  { name: 'Ranchi', state: 'Jharkhand', region: 'East Region' },
  { name: 'Jamshedpur', state: 'Jharkhand', region: 'East Region' },

  { name: 'Ahmedabad', state: 'Gujarat', region: 'West Region' },
  { name: 'Surat', state: 'Gujarat', region: 'West Region' },
  { name: 'Vadodara', state: 'Gujarat', region: 'West Region' },
  { name: 'Rajkot', state: 'Gujarat', region: 'West Region' },

  { name: 'Indore', state: 'Madhya Pradesh', region: 'Central Region' },
  { name: 'Bhopal', state: 'Madhya Pradesh', region: 'Central Region' },
  { name: 'Gwalior', state: 'Madhya Pradesh', region: 'Central Region' },
  { name: 'Raipur', state: 'Chhattisgarh', region: 'Central Region' },
  { name: 'Bilaspur', state: 'Chhattisgarh', region: 'Central Region' }
];

// Helper method to retrieve tailwind styling classes for specific therapy badges
const getTherapyBadgeTheme = (t) => {
  const norm = (t || '').toLowerCase();
  if (norm.includes('cardio')) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (norm.includes('resp')) return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  if (norm.includes('neuro')) return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
  if (norm.includes('gastro')) return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
  if (norm.includes('pedia')) return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
  return 'bg-white/5 text-textSecondary border border-white/8';
};

const Presences = () => {
  const {
    setActivePage,
    presences,
    regions,
    therapies,
    showToast,
    logActivity,
    addPresence,
    editPresence,
    removePresence
  } = useAppContext();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Presences');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Editor side panel configuration
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedPresence, setSelectedPresence] = useState(null);

  // Deletion modal confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Auto-complete suggestion state
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    region: '',
    partners: 0,
    therapies: [],
    isHq: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setActivePage('Presences');
  }, [setActivePage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Regions') navigate('/regions');
    if (tab === 'Therapies') navigate('/therapies');
  };

  // Handle therapy select toggling
  const handleTherapyToggle = (therapyName) => {
    if (viewMode) return;
    setFormData((prev) => {
      const exists = prev.therapies.includes(therapyName);
      const updated = exists
        ? prev.therapies.filter((t) => t !== therapyName)
        : [...prev.therapies, therapyName];
      return { ...prev, therapies: updated };
    });
  };

  // Filter list
  const filtered = useMemo(() => {
    return presences.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.state.toLowerCase().includes(search.toLowerCase()) ||
      item.region.toLowerCase().includes(search.toLowerCase())
    );
  }, [presences, search]);

  const pagedData = useMemo(() => {
    return filtered.slice((page - 1) * 5, page * 5);
  }, [filtered, page]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / 5));
  }, [filtered]);

  // Trigger Add panel
  const handleAddClick = () => {
    setSelectedPresence(null);
    setErrors({});
    setViewMode(false);
    setFormData({
      name: '',
      state: '',
      region: '',
      partners: 0,
      therapies: [],
      isHq: false
    });
    setEditorOpen(true);
  };

  // Trigger Edit panel
  const handleEditClick = (item) => {
    setSelectedPresence(item);
    setErrors({});
    setViewMode(false);
    setFormData({
      ...item,
      therapies: Array.isArray(item.therapies) ? item.therapies : []
    });
    setEditorOpen(true);
  };

  // Trigger View panel
  const handleViewClick = (item) => {
    setSelectedPresence(item);
    setErrors({});
    setViewMode(true);
    setFormData({
      ...item,
      therapies: Array.isArray(item.therapies) ? item.therapies : []
    });
    setEditorOpen(true);
  };

  // Perform Save
  const handleSave = async () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'City Name is required.';
    if (!formData.region) newErrors.region = 'Region is required.';
    if (!formData.state) newErrors.state = 'State is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Validation Error', 'Please complete all required fields.', 'failed');
      return;
    }

    if (selectedPresence) {
      const ok = await editPresence(selectedPresence.id, formData);
      if (ok) {
        showToast('Presence Updated', `${formData.name} was successfully updated.`);
        logActivity(`Updated presence ${formData.name}`, 'Presences');
      } else {
        showToast('Error', 'Failed to update presence.', 'failed');
        return;
      }
    } else {
      const ok = await addPresence({ ...formData, status: 'Active' });
      if (ok) {
        showToast('Presence Created', `${formData.name} has been added.`);
        logActivity(`Created presence ${formData.name}`, 'Presences');
      } else {
        showToast('Error', 'Failed to create presence.', 'failed');
        return;
      }
    }

    setEditorOpen(false);
    setSelectedPresence(null);
  };

  // Trigger Delete confirmation modal
  const handleDeleteTrigger = (presence) => {
    setItemToDelete(presence);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const ok = await removePresence(itemToDelete.id);
    if (ok) {
      showToast('Presence Deleted', `${itemToDelete.name} was successfully removed.`);
      logActivity(`Deleted presence ${itemToDelete.name}`, 'Presences');
    } else {
      showToast('Error', 'Failed to delete presence.', 'failed');
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const columns = [
    {
      header: 'Location',
      accessor: 'name',
      width: 'w-5/12',
      cell: (row) => {
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3B5BFF]/20 bg-[#3B5BFF]/10 text-[#3B5BFF] shadow-sm">
              <Building2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-[13px] font-bold text-white leading-tight">{row.name}</h4>
                {row.isHq && (
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.5 text-[8.5px] font-bold text-emerald-400 tracking-wide select-none">
                    HQ
                  </span>
                )}
              </div>
              <p className="text-[11px] text-textSecondary mt-0.5 leading-snug">
                {row.state} • <span className="font-semibold text-textSecondary">{row.region}</span>
              </p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Network',
      accessor: 'partners',
      width: 'w-2/12',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-emerald-400 leading-snug">
            {row.partners || 0}
          </span>
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider leading-none mt-0.5">
            Network
          </span>
        </div>
      )
    },
    {
      header: 'Therapies',
      accessor: 'therapies',
      width: 'w-3/12',
      cell: (row) => {
        const therapyList = Array.isArray(row.therapies) ? row.therapies : [];
        if (therapyList.length === 0) {
          return <span className="text-textSecondary/50 text-[11px] font-medium italic">None mapped</span>;
        }

        return (
          <div className="flex flex-wrap gap-1 items-center max-w-[200px]">
            {therapyList.slice(0, 2).map((t) => (
              <span
                key={t}
                className={`rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide ${getTherapyBadgeTheme(t)}`}
              >
                {t}
              </span>
            ))}
            {therapyList.length > 2 && (
              <span className="rounded border border-white/8 bg-white/5 px-1 py-0.5 text-[9px] text-textSecondary font-semibold select-none">
                +{therapyList.length - 2}
              </span>
            )}
          </div>
        );
      }
    }
  ];

  // Helper function to extract states list including the selected one dynamically
  const getRegionStatesList = () => {
    const selectedReg = regions.find((r) => r.name === formData.region);
    if (!selectedReg) return [];
    const list = [...(selectedReg.statesList || [])];
    if (formData.state && !list.includes(formData.state)) {
      list.push(formData.state);
    }
    return list;
  };

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1 min-h-0 items-stretch">
        {/* Table column */}
        <div className={`${editorOpen ? 'lg:col-span-2' : 'lg:col-span-3'} flex flex-col gap-2 min-h-0`}>
          {/* Tabs Menu Section */}
          <div className="border-b border-white/[0.04] pb-2">
            <Tabs items={tabs} active={activeTab} onChange={handleTabChange} />
          </div>

          <div className="rounded-2xl border border-white/[0.04] bg-surface p-3 shadow-soft flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            {/* Table Header controls */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white">
                  Presences <span className="text-xs text-textSecondary font-normal ml-1">({filtered.length})</span>
                </h3>
                <p className="text-[11px] text-textSecondary mt-0.5">Cities and logistics hubs where you have operations</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative flex items-center rounded-xl border border-white/[0.04] bg-white/5 px-3 py-1.5 text-xs text-textSecondary w-48">
                  <Search className="mr-2 h-3.5 w-3.5" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search cities..."
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
                {/* Add Trigger */}
                <button
                  onClick={handleAddClick}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] px-4 py-2 text-xs font-bold text-white shadow-glow hover:brightness-110"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Presence
                </button>
              </div>
            </div>

            {/* Custom Table Wrapper */}
            <div className="mt-1 flex-1 min-h-0 overflow-hidden">
              <Table
                dense
                columns={columns}
                data={pagedData}
                actions={(row) => (
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Button */}
                    <button
                      onClick={() => handleViewClick(row)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-400 transition hover:bg-white/10"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditClick(row)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3B5BFF] transition hover:bg-white/10"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteTrigger(row)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#FF4D6D] transition hover:bg-white/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Table Footer */}
            <div className="mt-1.5 flex items-center justify-between border-t border-white/[0.04] pt-1.5 text-xs text-textSecondary shrink-0">
              <span>
                Showing {filtered.length > 0 ? (page - 1) * 5 + 1 : 0} to {Math.min(page * 5, filtered.length)} of {filtered.length} presences
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.04] bg-white/5 hover:bg-white/10 text-white/65 disabled:opacity-30 transition-all text-xs"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${page === p
                        ? 'bg-[#3B5BFF] text-white shadow-[0_0_10px_rgba(59,91,255,0.35)]'
                        : 'border border-white/[0.04] bg-white/5 hover:bg-white/10 text-textSecondary hover:text-white'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.04] bg-white/5 hover:bg-white/10 text-white/65 disabled:opacity-30 transition-all text-xs"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Editor Side Panel */}
        {editorOpen && (
          <div className="rounded-3xl border border-white/[0.04] bg-surface lg:col-span-1 p-3 shadow-soft flex flex-col min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.04] mb-2 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {viewMode ? 'View Presence Details' : selectedPresence ? 'Edit Presence' : 'Add Presence'}
                </h3>
                <p className="text-[10px] text-textSecondary mt-0.5">
                  {viewMode ? 'Properties of the selected presence' : 'Configure regional operations and hubs'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-white/5 text-textSecondary transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Inputs Section - Render with distributed spacing to fill height */}
            <div className="flex-1 overflow-y-auto pr-1 py-1.5 custom-scrollbar min-h-0">
              <div className="flex-1 flex flex-col justify-between py-1 h-full">
                {/* City Name with suggestions and autofill */}
                <div className="relative">
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">
                    City Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled={viewMode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, name: val });
                      if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                      
                      if (val.trim()) {
                        const matched = citySuggestions.filter(c => 
                          c.name.toLowerCase().includes(val.toLowerCase())
                        );
                        setFilteredSuggestions(matched);
                        setShowSuggestions(true);
                      } else {
                        setFilteredSuggestions([]);
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (formData.name.trim()) {
                        const matched = citySuggestions.filter(c => 
                          c.name.toLowerCase().includes(formData.name.toLowerCase())
                        );
                        setFilteredSuggestions(matched);
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowSuggestions(false), 250);
                    }}
                    placeholder="Enter city name..."
                    className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}

                  {/* Floating Suggestions List */}
                  {showSuggestions && filteredSuggestions.length > 0 && !viewMode && (
                    <div className="absolute z-[100] left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-[#0a0f1d] shadow-2xl custom-scrollbar">
                      {filteredSuggestions.map((item) => (
                        <div
                          key={item.name}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              name: item.name,
                              region: item.region,
                              state: item.state
                            }));
                            setShowSuggestions(false);
                          }}
                          className="cursor-pointer px-3.5 py-2 text-xs text-textSecondary hover:bg-[#3B5BFF]/10 hover:text-white transition-all border-b border-white/[0.02]"
                        >
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-[10px] text-[#8DA0D1] ml-2">({item.state}, {item.region})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Region Field (Full-width vertical stack) */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">
                    Region <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.region}
                      disabled={viewMode}
                      onChange={(e) => {
                        const regName = e.target.value;
                        setFormData((prev) => ({ ...prev, region: regName, state: '' }));
                        if (errors.region) setErrors((prev) => ({ ...prev, region: null }));
                      }}
                      className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] appearance-none disabled:opacity-72 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled className="bg-sidebar">Select region...</option>
                      {regions.map((reg) => (
                        <option key={reg.id || reg._id} value={reg.name} className="bg-sidebar">
                          {reg.name}
                        </option>
                      ))}
                    </select>
                    {!viewMode && <ChevronDown className="absolute right-4 top-2.5 h-4 w-4 text-textSecondary/70 pointer-events-none" />}
                  </div>
                  {errors.region && <p className="mt-1 text-xs text-rose-400">{errors.region}</p>}
                </div>

                {/* State Field (Full-width vertical stack) */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.state}
                      disabled={viewMode || !formData.region}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, state: e.target.value }));
                        if (errors.state) setErrors((prev) => ({ ...prev, state: null }));
                      }}
                      className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled className="bg-sidebar">Select state...</option>
                      {getRegionStatesList().map((st) => (
                        <option key={st} value={st} className="bg-sidebar">
                          {st}
                        </option>
                      ))}
                    </select>
                    {!viewMode && <ChevronDown className="absolute right-4 top-2.5 h-4 w-4 text-textSecondary/70 pointer-events-none" />}
                  </div>
                  {errors.state && <p className="mt-1 text-xs text-rose-400">{errors.state}</p>}
                </div>

                {/* Network Partners (Full-width vertical stack) */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">
                    Network Partners <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={formData.partners}
                      disabled={viewMode}
                      onChange={(e) => setFormData({ ...formData, partners: Number(e.target.value) })}
                      placeholder="Partners"
                      className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] pr-8 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                    <Users className="absolute right-3 text-textSecondary/60 h-3.5 w-3.5" />
                  </div>
                </div>

                {/* HQ Toggle Switch (Full-width vertical stack) */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Is HQ?</span>
                  <div className="h-8 flex items-center">
                    <Toggle
                      checked={formData.isHq}
                      disabled={viewMode}
                      onChange={(checked) => !viewMode && setFormData({ ...formData, isHq: checked })}
                    />
                  </div>
                </div>

                {/* Therapies Select Dropdown */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">
                    Therapies <span className="text-rose-500">*</span>
                  </label>
                  {!viewMode && (
                    <div className="relative mb-1.5">
                      <select
                        value=""
                        onChange={(e) => handleTherapyToggle(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] appearance-none"
                      >
                        <option value="" disabled className="bg-sidebar">Select therapies</option>
                        {therapies.map((t) => (
                          <option key={t.id || t._id} value={t.shortName || t.therapy} className="bg-sidebar">
                            {t.shortName || t.therapy}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-2.5 h-4 w-4 text-textSecondary/70 pointer-events-none" />
                    </div>
                  )}

                  {/* Selected therapies badges overlay */}
                  <div className="flex flex-wrap gap-1">
                    {formData.therapies.map((item) => (
                      <span
                        key={item}
                        onClick={() => !viewMode && handleTherapyToggle(item)}
                        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold transition ${
                          viewMode ? 'cursor-default' : 'cursor-pointer hover:line-through hover:opacity-75'
                        } ${getTherapyBadgeTheme(item)}`}
                      >
                        {item} {!viewMode && <X size={9} />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.04] shrink-0 mt-2">
              {viewMode ? (
                <Button
                  onClick={() => setEditorOpen(false)}
                  className="px-5 py-1.5 rounded-xl bg-[#3B5BFF] text-xs font-semibold text-white"
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => setEditorOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-white/[0.04] text-xs font-semibold">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] text-xs font-semibold">
                    {selectedPresence ? 'Save Changes' : 'Save Presence'}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete modal confirmation */}
      <Modal
        open={deleteModalOpen}
        title="Delete Presence Hub?"
        message={`Are you sure you want to delete the presence hub "${itemToDelete?.name}"?`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Presences;
