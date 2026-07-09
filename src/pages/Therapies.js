import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Heart,
  Bone,
  Baby,
  Pill,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Eye
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Toggle from '../components/Toggle';
import AvatarGroup from '../components/AvatarGroup';
import Tabs from '../components/Tabs';
import { useAppContext } from '../context/AppContext';

const tabs = ['Regions', 'Therapies', 'Presences'];

// Custom Medical SVG Icons for domains not covered by standard Lucide
const StomachIcon = ({ size, ...props }) => {
  const s = size || 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3c-1.5 2.5-3 3-5 3.5-2.5.6-4.5 2.5-4.5 5.5 0 4.5 4 8.5 9 8.5s9-4 9-8.5c0-3-2-5.5-5-6-1.5-.2-2.5-.8-3-1.5C13 3.3 12.5 3 12 3Z" />
      <path d="M12 3v3.5" />
    </svg>
  );
};

const DermatologyIcon = ({ size, ...props }) => {
  const s = size || 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 18c3-1 6-1 9 0s6 1 9 0" />
      <path d="M3 14c3-1 6-1 9 0s6 1 9 0" />
      <path d="M12 4c1.2 1.6 2.4 2.8 2.4 4a2.4 2.4 0 1 1-4.8 0c0-1.2 1.2-2.4 2.4-4Z" />
    </svg>
  );
};

const LungsIcon = ({ size, ...props }) => {
  const s = size || 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v7" />
      <path d="M12 10c-1.5.8-3 2.5-3 4" />
      <path d="M12 10c1.5.8 3 2.5 3 4" />
      <path d="M9 11c-2.5 0-4.5 2-4.5 5.5S7 21 9.5 21c2 0 2.5-1.5 2.5-3.5v-4.5c0-1-1.5-2-3-2Z" />
      <path d="M15 11c2.5 0 4.5 2 4.5 5.5S17 21 14.5 21c-2 0-2.5-1.5-2.5-3.5v-4.5c0-1 1.5-2 3-2Z" />
    </svg>
  );
};

// Preset definitions mapping to Lucide React icons and styling configurations
const iconPresets = [
  { name: 'Shield', icon: Shield, text: 'text-[#27D4A0]', bg: 'bg-[#27D4A0]/10', border: 'border-[#27D4A0]/20' },
  { name: 'Activity', icon: StomachIcon, text: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/20' },
  { name: 'Heart', icon: Heart, text: 'text-[#FF4D6D]', bg: 'bg-[#FF4D6D]/10', border: 'border-[#FF4D6D]/20' },
  { name: 'Wind', icon: LungsIcon, text: 'text-[#8E74FF]', bg: 'bg-[#8E74FF]/10', border: 'border-[#8E74FF]/20' },
  { name: 'Layers', icon: Bone, text: 'text-[#3B5BFF]', bg: 'bg-[#3B5BFF]/10', border: 'border-[#3B5BFF]/20' },
  { name: 'Smile', icon: Baby, text: 'text-[#FFC700]', bg: 'bg-[#FFC700]/10', border: 'border-[#FFC700]/20' },
  { name: 'Cpu', icon: Pill, text: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10', border: 'border-[#a855f7]/20' },
  { name: 'Sun', icon: DermatologyIcon, text: 'text-[#eab308]', bg: 'bg-[#eab308]/10', border: 'border-[#eab308]/20' }
];

const Therapies = () => {
  const {
    setActivePage,
    showToast,
    logActivity,
    therapies,
    addTherapy,
    editTherapy,
    removeTherapy
  } = useAppContext();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Therapies');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Editor side panel configuration
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  // Deletion modal confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [therapyToDelete, setTherapyToDelete] = useState(null);

  const [formData, setFormData] = useState({
    therapy: '',
    shortName: '',
    slug: '',
    icon: 'Heart',
    description: '',
    presences: 0,
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setActivePage('Therapies');
  }, [setActivePage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Regions') navigate('/regions');
    if (tab === 'Presences') navigate('/presences');
  };

  const handleNameChange = (val) => {
    if (viewMode) return;
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    setFormData((prev) => ({
      ...prev,
      therapy: val,
      slug: slugified,
      shortName: val.slice(0, 15)
    }));

    if (errors.therapy) setErrors((prev) => ({ ...prev, therapy: null }));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: null }));
    if (errors.shortName) setErrors((prev) => ({ ...prev, shortName: null }));
  };

  const filtered = useMemo(() => {
    return therapies.filter((t) =>
      t.therapy.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [therapies, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const pagedTherapies = useMemo(() => {
    return filtered.slice((page - 1) * 5, page * 5);
  }, [filtered, page]);

  const handleAddClick = () => {
    setSelectedTherapy(null);
    setErrors({});
    setViewMode(false);
    setFormData({
      therapy: '',
      shortName: '',
      slug: '',
      icon: 'Heart',
      description: '',
      presences: 0,
      status: 'Active'
    });
    setEditorOpen(true);
  };

  const handleEditClick = (therapy) => {
    setSelectedTherapy(therapy);
    setErrors({});
    setViewMode(false);
    setFormData({
      therapy: therapy.therapy || '',
      shortName: therapy.shortName || '',
      slug: therapy.slug || '',
      icon: therapy.icon || 'Heart',
      description: therapy.description || '',
      presences: therapy.presences || 0,
      status: therapy.status || 'Active'
    });
    setEditorOpen(true);
  };

  const handleViewClick = (therapy) => {
    setSelectedTherapy(therapy);
    setErrors({});
    setViewMode(true);
    setFormData({
      therapy: therapy.therapy || '',
      shortName: therapy.shortName || '',
      slug: therapy.slug || '',
      icon: therapy.icon || 'Heart',
      description: therapy.description || '',
      presences: therapy.presences || 0,
      status: therapy.status || 'Active'
    });
    setEditorOpen(true);
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.therapy.trim()) newErrors.therapy = 'Therapy Name is required.';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required.';
    if (!formData.shortName.trim()) newErrors.shortName = 'Short Name is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Validation Error', 'Please complete all required fields.', 'failed');
      return;
    }

    if (selectedTherapy) {
      editTherapy(selectedTherapy.id, formData).then((success) => {
        if (success) {
          showToast('Therapy Updated', `${formData.therapy} has been successfully updated.`);
          logActivity(`Updated therapy ${formData.therapy}`, 'Therapies');
        } else {
          showToast('Error', 'Failed to update therapy.', 'failed');
        }
      });
    } else {
      addTherapy(formData).then((success) => {
        if (success) {
          showToast('Therapy Added', `${formData.therapy} has been added to your catalog.`);
          logActivity(`Created therapy ${formData.therapy}`, 'Therapies');
        } else {
          showToast('Error', 'Failed to add therapy.', 'failed');
        }
      });
    }

    setEditorOpen(false);
    setSelectedTherapy(null);
  };

  const handleDeleteClick = (therapy) => {
    setTherapyToDelete(therapy);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!therapyToDelete) return;
    removeTherapy(therapyToDelete.id).then((success) => {
      if (success) {
        showToast('Therapy Deleted', `Therapy ${therapyToDelete.therapy} was successfully deleted.`);
        logActivity(`Deleted therapy ${therapyToDelete.therapy}`, 'Therapies', 'Success');
      } else {
        showToast('Error', 'Failed to delete therapy.', 'failed');
      }
      setDeleteModalOpen(false);
      setTherapyToDelete(null);
    });
  };

  const columns = [
    {
      header: 'Therapy',
      accessor: 'therapy',
      width: 'w-5/12',
      cell: (row) => {
        const preset = iconPresets.find((ip) => ip.name === row.icon) || iconPresets[0];
        const Icon = preset.icon;

        return (
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${preset.bg} ${preset.text} ${preset.border} shadow-sm`}>
              <Icon size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-[13.5px] leading-snug">{row.therapy}</p>
              <p className="text-[11.5px] text-textSecondary mt-0.5 leading-snug line-clamp-1">{row.description}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Slug',
      accessor: 'slug',
      width: 'w-2/12',
      cell: (row) => (
        <span className="inline-flex items-center rounded-md border border-[#3B5BFF]/30 bg-[#3B5BFF]/5 px-2 py-0.5 text-[11px] font-semibold text-[#8DA0D1]">
          {row.slug}
        </span>
      )
    },
    {
      header: 'Used In',
      accessor: 'usedIn',
      width: 'w-2/12',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-emerald-400 leading-snug">
            {row.presences || 0}
          </span>
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider leading-none mt-0.5">
            Presences
          </span>
        </div>
      )
    },
    {
      header: 'Presences',
      accessor: 'presences',
      width: 'w-1/12',
      cell: (row) => {
        const mockUsers = Array.from({ length: row.presences || 0 }, (_, i) => `Hub Spot ${i + 1}`);
        return <AvatarGroup users={mockUsers} max={3} size="xs" />;
      }
    }
  ];

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
                  Therapies <span className="text-xs text-textSecondary font-normal ml-1">({filtered.length})</span>
                </h3>
                <p className="text-[11px] text-textSecondary mt-0.5">All therapy categories used in your network</p>
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
                    placeholder="Search therapy..."
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
                {/* Add Trigger */}
                <button
                  onClick={handleAddClick}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] px-4 py-2 text-xs font-bold text-white shadow-glow hover:brightness-110"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Therapy
                </button>
              </div>
            </div>

            {/* Custom Table Wrapper */}
            <div className="mt-1 flex-1 min-h-0 overflow-hidden">
              <Table
                dense
                columns={columns}
                data={pagedTherapies}
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
                      onClick={() => handleDeleteClick(row)}
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
                Showing {filtered.length > 0 ? (page - 1) * 5 + 1 : 0} to {Math.min(page * 5, filtered.length)} of {filtered.length} therapies
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

        {/* Right Editor Pane */}
        {editorOpen && (
          <div className="rounded-3xl border border-white/[0.04] bg-surface lg:col-span-1 p-3 shadow-soft flex flex-col min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.04] mb-2 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {viewMode ? 'View Therapy Details' : selectedTherapy ? 'Edit Therapy' : 'Add New Therapy'}
                </h3>
                <p className="text-[10px] text-textSecondary mt-0.5">
                  {viewMode ? 'Properties of the selected therapy' : 'Create or edit therapy groups'}
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

            {/* Inputs Section - Non-scrollable layout optimized to fill height */}
            <div className="flex-1 min-h-0 overflow-y-visible py-1.5 flex flex-col justify-between">
              <div className="flex-1 flex flex-col justify-between py-1">
                {/* Presets Grid */}
                <div>
                  <label className="mb-1 block text-[10px] font-semibold text-textSecondary uppercase tracking-wider">Icon</label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {iconPresets.map((ip) => {
                      const PresetIcon = ip.icon;
                      const active = formData.icon === ip.name;

                      return (
                        <button
                          type="button"
                          key={ip.name}
                          disabled={viewMode}
                          onClick={() => setFormData({ ...formData, icon: ip.name })}
                          className={`flex h-7 w-7 items-center justify-center rounded-xl border transition ${active
                            ? 'bg-[#3B5BFF]/15 border-[#3B5BFF] text-[#3B5BFF] shadow-[0_0_10px_rgba(59,91,255,0.25)]'
                            : 'bg-white/5 border-white/6 text-textSecondary hover:bg-white/10 hover:text-white'
                            } ${viewMode ? 'opacity-70 cursor-default' : ''}`}
                        >
                          <PresetIcon size={13} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Input
                    label={<span>Name <span className="text-rose-500">*</span></span>}
                    value={formData.therapy}
                    onChange={(e) => handleNameChange(e.target.value)}
                    error={errors.therapy}
                    disabled={viewMode}
                    placeholder="Enter therapy name (e.g. Cardiology)"
                  />
                </div>

                {/* Placed Short Name and Slug vertically instead of side-by-side */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider">
                      Short Name <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[9px] text-textSecondary font-semibold">
                      {formData.shortName.length}/20
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={20}
                    value={formData.shortName}
                    disabled={viewMode}
                    placeholder="Enter short name"
                    onChange={(e) => {
                      setFormData({ ...formData, shortName: e.target.value });
                      if (errors.shortName) setErrors((prev) => ({ ...prev, shortName: null }));
                    }}
                    className={`w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] disabled:opacity-75 disabled:cursor-not-allowed`}
                  />
                  {errors.shortName && <p className="mt-1 text-xs text-rose-400">{errors.shortName}</p>}
                </div>

                <div>
                  <Input
                    label={<span>Slug <span className="text-rose-500">*</span></span>}
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    error={errors.slug}
                    disabled={viewMode}
                    placeholder="Enter url slug (e.g. cardiology)"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider">Description</label>
                    <span className="text-[10px] text-textSecondary font-semibold">
                      {formData.description.length}/200
                    </span>
                  </div>
                  <textarea
                    value={formData.description}
                    disabled={viewMode}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    maxLength={200}
                    rows={2}
                    placeholder="Enter description..."
                    className="w-full rounded-xl border border-white/[0.04] bg-white/5 px-3.5 py-1.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Status */}
                <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-xs font-semibold text-textSecondary">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{formData.status === 'Active' ? 'Active' : 'Offline'}</span>
                    <Toggle
                      disabled={viewMode}
                      checked={formData.status === 'Active'}
                      onChange={(checked) => setFormData({ ...formData, status: checked ? 'Active' : 'Offline' })}
                    />
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
                    Save Therapy
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        title="Delete Therapy?"
        message={`Are you sure you want to delete the therapy "${therapyToDelete?.therapy}"? This action cannot be undone and will update the system counters.`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Therapies;