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

// Helper to determine specific therapy badge colors dynamically using a hash function
const getTherapyBadgeTheme = (name) => {
  const themes = [
    'bg-[#27D4A0]/10 text-[#27D4A0] border border-[#27D4A0]/20',
    'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20',
    'bg-[#8E74FF]/10 text-[#8E74FF] border border-[#8E74FF]/20',
    'bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/20',
    'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20',
    'bg-[#3B5BFF]/10 text-[#3B5BFF] border border-[#3B5BFF]/20',
    'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20'
  ];
  if (!name) return themes[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return themes[Math.abs(hash) % themes.length];
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
        const displayTherapies = isExpanded ? (row.therapies || []) : (row.therapies || []).slice(0, 2);

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
            {!isExpanded && (row.therapies || []).length > 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedRows({ [row.id]: true });
                }}
                className="rounded border border-white/8 bg-white/5 px-1.5 py-0.5 text-[8.5px] text-textSecondary font-semibold hover:bg-white/10 hover:text-white transition cursor-pointer select-none"
              >
                +{(row.therapies || []).length - 2}
              </button>
            )}
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedRows({});
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
            <div className="space-y-4 sm:space-y-4.5 flex-1 lg:min-h-0 overflow-y-auto pr-0.5 no-scrollbar py-1.5">
              {/* City Name input */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-textSecondary">
                  City Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  placeholder="Enter city name..."
                  className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF]"
                />
                {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
              </div>

              {/* Region and State Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">
                    Region <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.region}
                      onChange={(e) => {
                        const regName = e.target.value;
                        setFormData((prev) => ({ ...prev, region: regName, state: '' }));
                        if (errors.region) setErrors((prev) => ({ ...prev, region: null }));
                      }}
                      className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] appearance-none"
                    >
                      <option value="" disabled className="bg-sidebar">Select region...</option>
                      {regions.map((reg) => (
                        <option key={reg.id || reg._id} value={reg.name} className="bg-sidebar">
                          {reg.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-2.5 h-4 w-4 text-textSecondary/70 pointer-events-none" />
                  </div>
                  {errors.region && <p className="mt-1 text-xs text-rose-400">{errors.region}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-textSecondary">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.state}
                      disabled={!formData.region}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, state: e.target.value }));
                        if (errors.state) setErrors((prev) => ({ ...prev, state: null }));
                      }}
                      className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled className="bg-sidebar">Select state...</option>
                      {regions
                        .find((r) => r.name === formData.region)
                        ?.statesList?.map((st) => (
                          <option key={st} value={st} className="bg-sidebar">
                            {st}
                          </option>
                        )) || []}
                    </select>
                    <ChevronDown className="absolute right-4 top-2.5 h-4 w-4 text-textSecondary/70 pointer-events-none" />
                  </div>
                  {errors.state && <p className="mt-1 text-xs text-rose-400">{errors.state}</p>}
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
                    {therapies.map((t) => (
                      <option key={t.id || t._id} value={t.shortName || t.therapy} className="bg-sidebar">
                        {t.shortName || t.therapy}
                      </option>
                    ))}
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
                      {formData.therapies.slice(0, 2).map((badge) => (
                        <span key={badge} className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${getTherapyBadgeTheme(badge)}`}>
                          {badge}
                        </span>
                      ))}
                      {formData.therapies.length > 2 && (
                        <span className="rounded border border-white/8 bg-white/5 px-1 py-0.5 text-[9px] text-textSecondary font-semibold">
                          +{formData.therapies.length - 2}
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
