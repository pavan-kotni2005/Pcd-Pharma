import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Filter, Plus, Edit, Trash2, X, ChevronDown, Info } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import Table from '../components/Table';
import Modal from '../components/Modal';
import StatusToggle from '../components/StatusToggle';
import Tabs from '../components/Tabs';
import { useAppContext } from '../context/AppContext';

const tabs = ['Regions', 'Therapies', 'Presences'];

const Regions = () => {
  const { setActivePage, regions, setRegions, showToast, logActivity, addRegion, editRegion, removeRegion } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Regions');
  const [editorOpen, setEditorOpen] = useState(false); // Closed by default
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState(null);

  // Form State
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    statesList: [],
    presences: 0,
    distributors: 0,
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  const [newStateName, setNewStateName] = useState('');

  const handleAddState = (e) => {
    e.preventDefault();
    if (!newStateName.trim()) return;
    const cleanName = newStateName.trim();
    setFormData((prev) => {
      const list = prev.statesList || [];
      if (list.includes(cleanName)) return prev;
      return { ...prev, statesList: [...list, cleanName] };
    });
    setNewStateName('');
  };

  const handleRemoveState = (stateName) => {
    setFormData((prev) => ({
      ...prev,
      statesList: (prev.statesList || []).filter((s) => s !== stateName)
    }));
  };

  useEffect(() => {
    setActivePage('Regions');
  }, [setActivePage]);

  // Navigate on tab clicking
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'Therapies') navigate('/therapies');
    else if (tabName === 'Presences') navigate('/presences');
  };

  // Synchronize Slug from Name
  const handleNameChange = (val) => {
    const slugged = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, name: val, slug: slugged }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
  };

  const filtered = useMemo(() => {
    return regions.filter((region) => 
      region.name.toLowerCase().includes(search.toLowerCase()) || 
      (region.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [regions, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const pagedData = useMemo(() => {
    return filtered.slice((page - 1) * 5, page * 5);
  }, [filtered, page]);

  const openAdd = () => {
    setSelectedRegion(null);
    setErrors({});
    setFormData({
      name: '',
      description: '',
      statesList: [],
      presences: 0,
      distributors: 0,
      status: 'Active'
    });
    setEditorOpen(true);
  };

  const openEdit = (region) => {
    setSelectedRegion(region);
    setErrors({});
    setFormData({
      name: region.name || '',
      description: region.description || '',
      statesList: region.statesList || [],
      presences: region.presences || 0,
      distributors: region.distributors || 0,
      status: region.status || 'Active'
    });
    setEditorOpen(true);
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Region Name is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Validation Error', 'Please complete all required fields.', 'failed');
      return;
    }

    const payload = {
      ...formData,
      statesList: formData.statesList || [],
      statesCount: (formData.statesList || []).length
    };

    if (selectedRegion) {
      editRegion(selectedRegion.id, payload).then(success => {
        if (success) {
          showToast('Region Updated', `${formData.name} was updated successfully.`);
          logActivity(`Updated region ${formData.name}`, 'Regions');
        } else {
          showToast('Error', 'Failed to update region.', 'failed');
        }
      });
    } else {
      addRegion(payload).then(success => {
        if (success) {
          showToast('Region Added', `${formData.name} has been added.`);
          logActivity(`Created region ${formData.name}`, 'Regions');
        } else {
          showToast('Error', 'Failed to add region.', 'failed');
        }
      });
    }

    setEditorOpen(false);
    setSelectedRegion(null);
  };

  const handleDeleteTrigger = (region) => {
    setRegionToDelete(region);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!regionToDelete) return;
    removeRegion(regionToDelete.id).then(success => {
      if (success) {
        showToast('Region Removed', `${regionToDelete.name} was deleted successfully.`);
        logActivity(`Deleted region ${regionToDelete.name}`, 'Regions', 'Success');
      } else {
        showToast('Error', 'Failed to delete region.', 'failed');
      }
      setDeleteModalOpen(false);
      setRegionToDelete(null);
    });
  };

  const columns = [
    {
      header: 'Region Name',
      accessor: 'name',
      width: 'w-4/12',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3B5BFF]/20 bg-[#3B5BFF]/10 text-[#3B5BFF] shadow-sm">
            <MapPin size={16} />
          </div>
          <div>
            <p className="font-bold text-white text-[13px] leading-snug">{row.name}</p>
            <p className="text-[10px] text-textSecondary leading-snug line-clamp-1 mt-0.5">{row.description || 'No description provided.'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'States',
      accessor: 'statesCount',
      width: 'w-2/12',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-white leading-snug">
            {row.statesList ? row.statesList.length : (row.statesCount || 0)}
          </span>
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider leading-none mt-0.5">
            States
          </span>
        </div>
      )
    },
    {
      header: 'Presences',
      accessor: 'presences',
      width: 'w-2/12',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-white leading-snug">
            {row.presences || 0}
          </span>
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider leading-none mt-0.5">
            Cities
          </span>
        </div>
      )
    },
    {
      header: 'Distributors',
      accessor: 'distributors',
      width: 'w-2/12',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-white leading-snug">
            {row.distributors || 0}
          </span>
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider leading-none mt-0.5">
            Distributors
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      width: 'w-1/12',
      cell: (row) => <Badge status={row.status} />
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
                  Regions <span className="text-xs text-textSecondary font-normal ml-1">({filtered.length})</span>
                </h3>
                <p className="text-[11px] text-textSecondary mt-0.5">Manage regions used across your network</p>
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
                    placeholder="Search regions..."
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
                  onClick={openAdd}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] px-4 py-2 text-xs font-bold text-white shadow-glow hover:brightness-110"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Region
                </button>
              </div>
            </div>

            {/* Custom Table Wrapper */}
            <div className="mt-1 flex-1 lg:min-h-0 overflow-x-auto lg:overflow-hidden">
              <Table
                dense
                cellPadding={editorOpen ? 'px-4 py-3' : 'px-6 py-3'}
                columns={columns}
                data={pagedData}
                actions={(row) => (
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(row)}
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
                Showing {filtered.length > 0 ? (page - 1) * 5 + 1 : 0} to {Math.min(page * 5, filtered.length)} of {filtered.length} regions
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
          <div className="rounded-3xl border border-white/[0.04] bg-surface lg:col-span-1 p-3 shadow-soft flex flex-col lg:min-h-0 overflow-visible lg:overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.04] mb-2 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedRegion ? 'Edit Region' : 'Add New Region'}
                </h3>
                <p className="text-[10px] text-textSecondary mt-0.5">Create a new region and manage states</p>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-white/5 text-textSecondary transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Inputs Section */}
            <div className="space-y-4 sm:space-y-4.5 flex-1 lg:min-h-0 overflow-y-auto pr-0.5 scrollbar-thin py-1.5">
              <div>
                <Input
                  label={<span>Region Name <span className="text-rose-500">*</span></span>}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter region name"
                  error={errors.name}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider">Description (Optional)</label>
                  <span className="text-[9px] text-textSecondary font-semibold">{(formData.description || '').length}/200</span>
                </div>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={200}
                  rows={2}
                  placeholder="Enter description..."
                  className="w-full rounded-lg border border-white/[0.04] bg-white/5 px-2.5 py-1.5 text-xs text-white outline-none transition focus:border-[#3B5BFF] resize-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-textSecondary uppercase tracking-wider">States (Optional)</label>
                <div className="flex gap-2 mb-1.5">
                  <input
                    type="text"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    placeholder="Enter state name (e.g. Goa)..."
                    className="flex-1 rounded-xl border border-white/[0.04] bg-white/5 px-3 py-1.5 text-xs text-white outline-none transition focus:border-[#3B5BFF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddState}
                    className="rounded-xl bg-[#3B5BFF]/10 border border-[#3B5BFF]/20 px-3 py-1.5 text-xs font-bold text-[#3B5BFF] hover:bg-[#3B5BFF]/20 transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {/* Badges of selected states */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {(formData.statesList || []).map((state) => (
                    <span
                      key={state}
                      onClick={() => handleRemoveState(state)}
                      className="inline-flex items-center gap-1 rounded bg-[#3B5BFF]/10 border border-[#3B5BFF]/20 px-1.5 py-0.5 text-[9px] font-semibold text-[#3B5BFF] cursor-pointer hover:line-through hover:opacity-75 transition-all"
                    >
                      {state} <X size={9} />
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Input
                  label={<span>Active Presences</span>}
                  type="number"
                  value={formData.presences}
                  onChange={(e) => setFormData({ ...formData, presences: Number(e.target.value) })}
                />
              </div>

              <div>
                <Input
                  label={<span>Distributors</span>}
                  type="number"
                  value={formData.distributors}
                  onChange={(e) => setFormData({ ...formData, distributors: Number(e.target.value) })}
                />
              </div>

              <div className="flex flex-col gap-1 border-t border-white/[0.04] pt-2 mt-1">
                <span className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider">Status <span className="text-rose-500">*</span></span>
                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active' })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.status === 'Active' ? 'bg-[#10B981]' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.status === 'Active' ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <div className="flex flex-col text-[11px] leading-tight font-medium">
                    <span className={formData.status === 'Active' ? 'text-emerald-400 font-bold' : 'text-textSecondary'}>Active</span>
                    <span className={formData.status !== 'Active' ? 'text-textSecondary/70 font-bold' : 'text-textSecondary/40'}>Inactive</span>
                  </div>
                </div>
              </div>

              {/* Bottom Information Warning Box */}
              <div className="flex items-start gap-2.5 rounded-xl border border-[#3B5BFF]/15 bg-[#3B5BFF]/5 p-2.5 text-[10px] text-textSecondary leading-snug">
                <Info className="h-4 w-4 text-[#3B5BFF] shrink-0 mt-0.5" />
                <p>This region will be available for mapping presences and therapies.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.04] shrink-0 mt-2">
              <Button variant="secondary" onClick={() => setEditorOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-white/[0.04] text-xs font-semibold">
                Cancel
              </Button>
              <Button onClick={handleSave} className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] text-xs font-semibold">
                {selectedRegion ? 'Save Changes' : 'Save Region'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal
        open={deleteModalOpen}
        title="Delete Region?"
        message={`Are you sure you want to delete the region "${regionToDelete?.name}"? All related locations might be impacted.`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Regions;
