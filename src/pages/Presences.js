import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  X,
  Building2,
  Users,
  Info,
  ChevronDown,
  ArrowRight,
  Compass,
  Milestone,
  Warehouse,
  Castle,
  Building
} from 'lucide-react';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Toggle from '../components/Toggle';
import Tabs from '../components/Tabs';
import { useAppContext } from '../context/AppContext';

const tabs = ['Regions', 'Therapies', 'Presences'];

// Sample list of Indian cities for auto-filling State & Region fields
const indianCities = [
  { name: 'Delhi', state: 'Delhi', region: 'North Region', icon: Castle, bg: 'bg-[#3B5BFF]/10', text: 'text-[#3B5BFF]', border: 'border-[#3B5BFF]/20' },
  { name: 'Mumbai', state: 'Maharashtra', region: 'West Region', icon: Building, bg: 'bg-[#8E74FF]/10', text: 'text-[#8E74FF]', border: 'border-[#8E74FF]/20' },
  { name: 'Chandigarh', state: 'Chandigarh', region: 'North Region', icon: Milestone, bg: 'bg-[#FFC700]/10', text: 'text-[#FFC700]', border: 'border-[#FFC700]/20' },
  { name: 'Ludhiana', state: 'Punjab', region: 'North Region', icon: Warehouse, bg: 'bg-[#06B6D4]/10', text: 'text-[#06B6D4]', border: 'border-[#06B6D4]/20' },
  { name: 'Jaipur', state: 'Rajasthan', region: 'North Region', icon: Compass, bg: 'bg-[#FF4D6D]/10', text: 'text-[#FF4D6D]', border: 'border-[#FF4D6D]/20' },
  { name: 'Bangalore', state: 'Karnataka', region: 'South Region', icon: Building2, bg: 'bg-[#27D4A0]/10', text: 'text-[#27D4A0]', border: 'border-[#27D4A0]/20' },
  { name: 'Chennai', state: 'Tamil Nadu', region: 'South Region', icon: Building, bg: 'bg-[#a855f7]/10', text: 'text-[#a855f7]', border: 'border-[#a855f7]/20' },
  { name: 'Kolkata', state: 'West Bengal', region: 'East Region', icon: Compass, bg: 'bg-[#eab308]/10', text: 'text-[#eab308]', border: 'border-[#eab308]/20' }
];

// Helper to determine specific therapy badge colors matching the screenshot
const getTherapyBadgeTheme = (name) => {
  switch (name) {
    case 'Antibiotics':
      return 'bg-[#27D4A0]/10 text-[#27D4A0] border border-[#27D4A0]/20';
    case 'Gastro':
      return 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20';
    case 'Multivitamins':
      return 'bg-[#8E74FF]/10 text-[#8E74FF] border border-[#8E74FF]/20';
    case 'Cardiac / Diabetic':
      return 'bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/20';
    case 'Pediatric':
      return 'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20';
    case 'Orthopedic':
      return 'bg-[#3B5BFF]/10 text-[#3B5BFF] border border-[#3B5BFF]/20';
    case 'Dermatology':
      return 'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20';
    default:
      return 'bg-white/5 text-textSecondary border border-white/10';
  }
};

const Presences = () => {
  const { setActivePage, presences, setPresences, showToast, logActivity } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Presences');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Editor side column panel visibility
  const [editorOpen, setEditorOpen] = useState(false); // Closed by default
  const [selectedPresence, setSelectedPresence] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form Field state variables — blank by default
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    region: '',
    partners: 0,
    therapies: [],
    isHq: false
  });

  const [errors, setErrors] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    setActivePage('Presences');
  }, [setActivePage]);

  // Navigate tab clicks
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'Regions') navigate('/regions');
    else if (tabName === 'Therapies') navigate('/therapies');
  };

  // Sync state/region on selecting city
  const handleCitySelect = (cityName) => {
    const city = indianCities.find((c) => c.name === cityName);
    if (city) {
      setFormData((prev) => ({
        ...prev,
        name: city.name,
        state: city.state,
        region: city.region
      }));
      if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
    }
  };

  // Handle therapy select toggling
  const handleTherapyToggle = (therapyName) => {
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
    setFormData({
      ...item,
      // Map therapies safely
      therapies: Array.isArray(item.therapies) ? item.therapies : ['Antibiotics', 'Gastro']
    });
    setEditorOpen(true);
  };

  // Perform Save
  const handleSave = () => {
    if (!formData.name) {
      setErrors({ name: 'Please select a city.' });
      showToast('Validation Error', 'City selection is required.', 'failed');
      return;
    }

    if (selectedPresence) {
      setPresences((prev) =>
        prev.map((item) => (item.id === selectedPresence.id ? { ...item, ...formData } : item))
      );
      showToast('Presence Updated', `${formData.name} was successfully updated.`);
      logActivity(`Updated presence ${formData.name}`, 'Presences');
    } else {
      const newPresence = {
        ...formData,
        id: `p${presences.length + 1}`,
        status: 'Active'
      };
      setPresences((prev) => [...prev, newPresence]);
      showToast('Presence Created', `${formData.name} has been added.`);
      logActivity(`Created presence ${formData.name}`, 'Presences');
    }

    setEditorOpen(false);
    setSelectedPresence(null);
  };

  // Trigger Delete confirmation modal
  const handleDeleteTrigger = (presence) => {
    setItemToDelete(presence);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setPresences((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    showToast('Presence Deleted', `${itemToDelete.name} was successfully removed.`);
    logActivity(`Deleted presence ${itemToDelete.name}`, 'Presences', 'Success');
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const columns = [
    {
      header: 'Location',
      accessor: 'name',
      width: 'w-5/12',
      cell: (row) => {
        const cityMatch = indianCities.find((c) => c.name === row.name) || indianCities[0];
        const CityIcon = cityMatch.icon;
        return (
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${cityMatch.bg} ${cityMatch.text} ${cityMatch.border} shadow-sm`}>
              <CityIcon size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-white text-[13.5px] leading-snug">{row.name}</p>
                {row.isHq && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[8.5px] font-bold text-emerald-400 select-none">
                    HQ
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-textSecondary mt-0.5 font-medium leading-none">
                <span>{row.state}</span>
                <span className="text-white/20">•</span>
                <span className="inline-flex items-center gap-0.5">
                  <MapPin size={10} className="text-[#3B5BFF]" />
                  {row.region}
                </span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Partners',
      accessor: 'partners',
      width: 'w-2/12',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-emerald-400 leading-snug">
            {row.partners || 0}
          </span>
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider leading-none mt-0.5">
            Partners
          </span>
        </div>
      )
    },
    {
      header: 'Therapies',
      accessor: 'therapies',
      width: 'w-5/12',
      cell: (row) => {
        const isExpanded = expandedRows[row.id];
        const displayTherapies = isExpanded ? (row.therapies || []) : (row.therapies || []).slice(0, 3);

        return (
          <div className="flex flex-wrap gap-1.5 items-center">
            {displayTherapies.map((item) => (
              <span
                key={item}
                className={`rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide ${getTherapyBadgeTheme(item)}`}
              >
                {item}
              </span>
            ))}
            {!isExpanded && (row.therapies || []).length > 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedRows((prev) => ({ ...prev, [row.id]: true }));
                }}
                className="rounded border border-white/8 bg-white/5 px-1.5 py-0.5 text-[8.5px] text-textSecondary font-semibold hover:bg-white/10 hover:text-white transition cursor-pointer select-none"
              >
                +{(row.therapies || []).length - 3}
              </button>
            )}
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedRows((prev) => ({ ...prev, [row.id]: false }));
                }}
                className="rounded border border-white/8 bg-white/5 px-1.5 py-0.5 text-[8.5px] text-textSecondary font-semibold hover:bg-white/10 hover:text-white transition cursor-pointer select-none"
              >
                see less
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="h-auto lg:h-full flex flex-col gap-2 overflow-visible lg:overflow-hidden">
      {/* Split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1 lg:min-h-0 items-stretch">
        {/* Table column */}
        <div className={`${editorOpen ? 'lg:col-span-2' : 'lg:col-span-3'} flex flex-col gap-2 lg:min-h-0`}>
          {/* Tabs Menu Section */}
          <div className="border-b border-white/[0.04] pb-2">
            <Tabs items={tabs} active={activeTab} onChange={handleTabChange} />
          </div>

          <div className="rounded-2xl border border-white/[0.04] bg-surface p-3 shadow-soft flex-1 lg:min-h-0 flex flex-col justify-between overflow-visible lg:overflow-hidden">
            {/* Table Header controls */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white">
                  Presences <span className="text-xs text-textSecondary font-normal ml-1">({filtered.length})</span>
                </h3>
                <p className="text-[11px] text-textSecondary mt-0.5">All presence locations across India</p>
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
                    placeholder="Search city, state..."
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
                {/* Filter */}
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.04] bg-white/5 text-sm text-white hover:bg-white/10"
                  title="Filter options"
                >
                  <Filter className="h-3.5 w-3.5" />
                </button>
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
            <div className="mt-1 flex-1 lg:min-h-0 overflow-x-auto lg:overflow-hidden">
              <Table
                dense
                columns={columns}
                data={pagedData}
                actions={(row) => (
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3B5BFF] transition hover:bg-white/10"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
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

        {/* Right Editor Side Panel (Add / Edit Presence) */}
        {editorOpen && (
          <div className="rounded-3xl border border-white/[0.04] bg-surface lg:col-span-1 p-3 shadow-soft flex flex-col lg:min-h-0 overflow-visible lg:overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.04] mb-2 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedPresence ? 'Edit Presence' : 'Add New Presence'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-white/5 text-textSecondary transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Inputs & Preview Scrollable Section */}
            <div className="space-y-3 flex-1 lg:min-h-0 overflow-y-auto pr-0.5 scrollbar-thin pb-1">
              {/* City Selection Dropdown */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-textSecondary">
                  City <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.name}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] appearance-none"
                  >
                    <option value="" disabled className="bg-sidebar">Search and select city...</option>
                    {indianCities.map((city) => (
                      <option key={city.name} value={city.name} className="bg-sidebar">
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-2.5 h-4 w-4 text-textSecondary/70 pointer-events-none" />
                </div>
                {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
              </div>

              {/* State & Region (Auto-filled grid) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">State</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Auto-filled"
                    value={formData.state}
                    className="w-full rounded-xl border border-white/[0.04] bg-white/[0.02] px-3.5 py-1.5 text-sm text-textSecondary outline-none select-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">Region</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Auto-filled"
                    value={formData.region}
                    className="w-full rounded-xl border border-white/[0.04] bg-white/[0.02] px-3.5 py-1.5 text-sm text-textSecondary outline-none select-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Partner Count input */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-textSecondary">
                  Partner Count <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={formData.partners}
                    onChange={(e) => setFormData({ ...formData, partners: Number(e.target.value) })}
                    placeholder="Enter partner count"
                    className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] pr-10"
                  />
                  <Users className="absolute right-4 text-textSecondary/60 h-4 w-4" />
                </div>
              </div>

              {/* Is HQ Toggle Switch */}
              <div className="flex items-center justify-between py-1 border-t border-b border-white/[0.04] my-1">
                <span className="text-xs font-semibold text-textSecondary">Is HQ?</span>
                <Toggle
                  checked={formData.isHq}
                  onChange={(checked) => setFormData({ ...formData, isHq: checked })}
                />
              </div>

              {/* Therapies Select Dropdown */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-textSecondary">
                  Therapies <span className="text-rose-500">*</span>
                </label>
                <div className="relative mb-1.5">
                  <select
                    value=""
                    onChange={(e) => handleTherapyToggle(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] appearance-none"
                  >
                    <option value="" disabled className="bg-sidebar">Select therapies</option>
                    <option value="Antibiotics" className="bg-sidebar">Antibiotics</option>
                    <option value="Gastro" className="bg-sidebar">Gastro</option>
                    <option value="Multivitamins" className="bg-sidebar">Multivitamins</option>
                    <option value="Cardiac / Diabetic" className="bg-sidebar">Cardiac / Diabetic</option>
                    <option value="Pediatric" className="bg-sidebar">Pediatric</option>
                    <option value="Orthopedic" className="bg-sidebar">Orthopedic</option>
                    <option value="Dermatology" className="bg-sidebar">Dermatology</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-2.5 h-4 w-4 text-textSecondary/70 pointer-events-none" />
                </div>

                {/* Selected therapies badges overlay */}
                <div className="flex flex-wrap gap-1">
                  {formData.therapies.map((item) => (
                    <span
                      key={item}
                      onClick={() => handleTherapyToggle(item)}
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold cursor-pointer transition hover:line-through hover:opacity-75 ${getTherapyBadgeTheme(item)}`}
                    >
                      {item} <X size={9} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="pt-1.5 border-t border-white/[0.04]">
                <p className="text-[11px] font-semibold text-textSecondary mb-1.5">Live Preview (How it will appear on frontend)</p>
                <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-3 shadow-inner">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.04] bg-white/5 text-[#3B5BFF]">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-[12px] font-bold text-white leading-snug">{formData.name || 'New City'}</h4>
                          {formData.isHq && (
                            <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.5 text-[8.5px] font-bold text-emerald-400">
                              HQ
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-textSecondary mt-0.5 leading-none">
                          {formData.state || 'State Name'} • <span className="inline-flex items-center gap-0.5"><MapPin size={9} /> {formData.region || 'North Region'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Badge list footer */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2.5 border-t border-white/[0.04]">
                    <div className="flex flex-col text-[10px] text-textSecondary font-bold select-none leading-tight mr-auto">
                      <span>Partners</span>
                      <span className="text-[12px] text-white font-bold">{formData.partners || 0}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 items-center">
                      {formData.therapies.slice(0, 3).map((badge) => (
                        <span key={badge} className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${getTherapyBadgeTheme(badge)}`}>
                          {badge}
                        </span>
                      ))}
                      {formData.therapies.length > 3 && (
                        <span className="rounded border border-white/8 bg-white/5 px-1 py-0.5 text-[9px] text-textSecondary font-semibold">
                          +{formData.therapies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.04] shrink-0 mt-2">
              <Button variant="secondary" onClick={() => setEditorOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-white/[0.04] text-xs font-semibold">
                Cancel
              </Button>
              <Button onClick={handleSave} className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] text-xs font-semibold">
                {selectedPresence ? 'Save Changes' : 'Save Presence'}
              </Button>
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
