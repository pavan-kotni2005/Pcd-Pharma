import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Phone,
  MapPin,
  Calendar,
  User,
  Activity,
  Briefcase,
  Eye
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Tabs from '../components/Tabs';
import { useAppContext } from '../context/AppContext';

const Network = () => {
  const {
    setActivePage,
    partners,
    regions,
    categories,
    showToast,
    logActivity,
    addPartner,
    editPartner,
    removePartner
  } = useAppContext();

  const [editorOpen, setEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All'); // 'All', 'Stockist', 'Retailer'
  const [page, setPage] = useState(1);

  // Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Stockist',
    contactPerson: '',
    contactRole: '',
    phone: '',
    therapy: 'Cardio',
    region: '',
    dateSinceActive: new Date().toISOString().split('T')[0],
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setActivePage('Network');
  }, [setActivePage]);

  // Filtering
  const filtered = useMemo(() => {
    return partners.filter((p) => {
      const typeLabel = (p.type === 'Distributor') ? 'Stockist' : p.type;
      
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        (p.phone || '').includes(search) ||
        (p.therapy || '').toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'All' || typeLabel === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [partners, search, roleFilter]);

  // Pagination - 6 rows per page
  const totalPages = Math.max(1, Math.ceil(filtered.length / 6));
  const pagedData = useMemo(() => {
    return filtered.slice((page - 1) * 6, page * 6);
  }, [filtered, page]);

  const openAdd = () => {
    setSelectedPartner(null);
    setErrors({});
    setViewMode(false);
    setFormData({
      name: '',
      type: 'Stockist',
      contactPerson: '',
      contactRole: '',
      phone: '',
      therapy: categories[0]?.category || 'Cardio',
      region: regions[0]?.name || 'North Region',
      dateSinceActive: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setEditorOpen(true);
  };

  const openEdit = (partner) => {
    setSelectedPartner(partner);
    setErrors({});
    setViewMode(false);
    setFormData({
      name: partner.name || '',
      type: (partner.type === 'Distributor') ? 'Stockist' : (partner.type || 'Stockist'),
      contactPerson: partner.contactPerson || '',
      contactRole: partner.contactRole || '',
      phone: partner.phone || '',
      therapy: partner.therapy || categories[0]?.category || 'Cardio',
      region: partner.region || regions[0]?.name || 'North Region',
      dateSinceActive: partner.dateSinceActive || new Date().toISOString().split('T')[0],
      status: partner.status || 'Active'
    });
    setEditorOpen(true);
  };

  const openView = (partner) => {
    setSelectedPartner(partner);
    setErrors({});
    setViewMode(true);
    setFormData({
      name: partner.name || '',
      type: (partner.type === 'Distributor') ? 'Stockist' : (partner.type || 'Stockist'),
      contactPerson: partner.contactPerson || '',
      contactRole: partner.contactRole || '',
      phone: partner.phone || '',
      therapy: partner.therapy || categories[0]?.category || 'Cardio',
      region: partner.region || regions[0]?.name || 'North Region',
      dateSinceActive: partner.dateSinceActive || new Date().toISOString().split('T')[0],
      status: partner.status || 'Active'
    });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Partner Name is required.';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact Person Name is required.';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Invalid Phone Number format.';
    }
    if (!formData.region) newErrors.region = 'Region selection is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Validation Error', 'Please complete all required fields correctly.', 'failed');
      return;
    }

    const submissionData = { ...formData };

    if (selectedPartner) {
      const ok = await editPartner(selectedPartner.id, submissionData);
      if (ok) {
        showToast('Network Partner Updated', `${formData.name} was updated successfully.`);
        logActivity(`Updated network partner ${formData.name}`, 'Network');
      } else {
        showToast('Error', 'Failed to update network partner.', 'failed');
      }
    } else {
      const ok = await addPartner(submissionData);
      if (ok) {
        showToast('Network Partner Added', `${formData.name} has been added to your network.`);
        logActivity(`Created network partner ${formData.name}`, 'Network');
      } else {
        showToast('Error', 'Failed to add network partner.', 'failed');
      }
    }

    setEditorOpen(false);
    setSelectedPartner(null);
  };

  const handleDeleteTrigger = (partner) => {
    setPartnerToDelete(partner);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!partnerToDelete) return;
    const ok = await removePartner(partnerToDelete.id);
    if (ok) {
      showToast('Partner Removed', `${partnerToDelete.name} was successfully deleted.`);
      logActivity(`Deleted network partner ${partnerToDelete.name}`, 'Network', 'Success');
    } else {
      showToast('Error', 'Failed to delete partner.', 'failed');
    }
    setDeleteModalOpen(false);
    setPartnerToDelete(null);
  };

  const columns = [
    {
      header: 'Partner Name',
      accessor: 'name',
      width: 'w-4/12',
      cell: (row) => {
        const initials = row.name
          ?.split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'PT';

        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex shrink-0 items-center justify-center rounded-xl border border-[#3B5BFF]/25 bg-[#3B5BFF]/10 text-xs font-bold text-[#3B5BFF] shadow-sm select-none h-10 w-10">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-[13px] leading-snug truncate" title={row.name}>
                {row.name}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Therapy',
      accessor: 'therapy',
      width: 'w-2/12',
      cell: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
          {row.therapy || 'Cardio'}
        </span>
      )
    },
    {
      header: 'Network Type',
      accessor: 'type',
      width: 'w-2/12',
      cell: (row) => {
        const partnerType = (row.type === 'Distributor') ? 'Stockist' : row.type;
        return (
          <span className={`inline-block text-[9.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
            partnerType === 'Stockist' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {partnerType}
          </span>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      width: 'w-2/12',
      cell: (row) => <Badge status={row.status} />
    }
  ];

  return (
    <div className="h-auto lg:h-full flex flex-col gap-2.5 overflow-visible lg:overflow-hidden pb-4 pr-1 scrollbar-custom animate-fade-in">
      
      {/* Main content body (Split screen editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1 lg:min-h-0 items-stretch">
        
        {/* Table column */}
        <div className={`${editorOpen ? 'lg:col-span-2' : 'lg:col-span-3'} flex flex-col gap-2 lg:min-h-0`}>
          
          {/* Tabs Menu Section */}
          <div className="border-b border-white/[0.04] pb-2 shrink-0">
            <Tabs
              items={['All Partners', 'Stockists', 'Retailers']}
              active={roleFilter === 'All' ? 'All Partners' : roleFilter === 'Stockist' ? 'Stockists' : 'Retailers'}
              onChange={(tab) => {
                const role = tab === 'All Partners' ? 'All' : tab === 'Stockists' ? 'Stockist' : 'Retailer';
                setRoleFilter(role);
                setPage(1);
              }}
            />
          </div>

          <div className="rounded-2xl border border-white/[0.04] bg-surface p-3 shadow-soft flex-1 lg:min-h-0 flex flex-col justify-between overflow-visible lg:overflow-hidden">
            
            {/* Table controls */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between mb-2 shrink-0">
              {/* Left Title */}
              <div>
                <h3 className="text-base font-bold text-white">
                  Network List <span className="text-xs text-textSecondary font-normal ml-1">({filtered.length})</span>
                </h3>
                <p className="text-[11px] text-textSecondary mt-0.5">Filter and manage your network stockists and retailers</p>
              </div>

              {/* Right Search and Add controls */}
              <div className="flex items-center gap-2 justify-between lg:justify-end">
                <div className="relative flex items-center rounded-xl border border-white/[0.04] bg-white/5 px-3 py-1.5 text-xs text-textSecondary w-44 sm:w-48">
                  <Search className="mr-2 h-3.5 w-3.5" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search network..."
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
                <button
                  onClick={openAdd}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] px-4 py-2 text-xs font-bold text-white shadow-glow hover:brightness-110 whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Network Partner
                </button>
              </div>
            </div>

            {/* Standard React App Table */}
            <div className="mt-1 flex-1 lg:min-h-0 overflow-x-auto lg:overflow-hidden">
              <Table
                dense
                cellPadding={editorOpen ? 'px-2 py-1.5' : 'px-5 py-2.5'}
                columns={columns}
                data={pagedData}
                actions={(row) => (
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Button */}
                    <button
                      onClick={() => openView(row)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-400 transition hover:bg-white/10"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {/* Edit Button */}
                    <button
                      onClick={() => openEdit(row)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3B5BFF] transition hover:bg-white/10"
                      title="Edit Partner"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteTrigger(row)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#FF4D6D] transition hover:bg-white/10"
                      title="Delete Partner"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Table Footer / Pagination */}
            <div className="mt-2 flex items-center justify-between border-t border-white/[0.04] pt-2 text-xs text-textSecondary shrink-0">
              <span>
                Showing {filtered.length > 0 ? (page - 1) * 6 + 1 : 0} to {Math.min(page * 6, filtered.length)} of {filtered.length} entries
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
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                        page === p
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

        {/* Side Panel Editor */}
        {editorOpen && (
          <div className="rounded-2xl border border-white/[0.04] bg-surface lg:col-span-1 p-3.5 shadow-soft flex flex-col lg:min-h-0 overflow-visible lg:overflow-hidden">
            
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.04] mb-2 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {viewMode ? 'View Partner Details' : selectedPartner ? 'Edit Network Partner' : 'Add Network Partner'}
                </h3>
                <p className="text-[10px] text-textSecondary mt-0.5">
                  {viewMode ? 'Profile of the active network partner' : 'Configure network settings and properties'}
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

            {/* Input Form Fields or Non-Editable Profile View Component */}
            <div className="flex-1 lg:min-h-0 overflow-y-auto pr-1 py-1.5 flex flex-col justify-between custom-scrollbar">
              {viewMode ? (
                /* Non-editable Profile View Component - Highly optimized two-column grid layout */
                <div className="animate-fade-in flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Visual Profile Card */}
                    <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3.5 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#3B5BFF]/30 bg-[#3B5BFF]/10 text-sm font-extrabold text-[#3B5BFF] select-none">
                        {formData.name?.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2) || 'PT'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-bold text-white leading-tight truncate">{formData.name}</h4>
                        <span className={`inline-block text-[8.5px] font-extrabold uppercase mt-1 tracking-wider px-2 py-0.5 rounded-md ${
                          formData.type === 'Stockist' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {formData.type}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 rounded-2xl border border-white/[0.04] bg-[#050B1A]/40 p-4">
                      
                      <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase size={12} className="text-textSecondary/80" />
                          <span className="text-[9.5px] text-textSecondary uppercase font-semibold tracking-wider">Partner ID</span>
                        </div>
                        <span className="font-mono text-[12.5px] text-white font-bold">{selectedPartner?.id || 'N/A'}</span>
                      </div>

                      <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity size={12} className="text-textSecondary/80" />
                          <span className="text-[9.5px] text-textSecondary uppercase font-semibold tracking-wider">Status</span>
                        </div>
                        <div className="mt-0.5"><Badge status={formData.status} /></div>
                      </div>

                      <div className="col-span-2 border-t border-white/[0.03] pt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={12} className="text-textSecondary/80" />
                          <span className="text-[9.5px] text-textSecondary uppercase font-semibold tracking-wider">Contact Representative</span>
                        </div>
                        <span className="text-xs text-white font-bold block">{formData.contactPerson}</span>
                        <span className="text-[10px] text-textSecondary mt-0.5 block">{formData.contactRole || 'Representative'}</span>
                      </div>

                      <div className="col-span-1 border-t border-white/[0.03] pt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone size={12} className="text-textSecondary/80" />
                          <span className="text-[9.5px] text-textSecondary uppercase font-semibold tracking-wider">Phone Number</span>
                        </div>
                        <span className="text-xs text-white font-bold block">{formData.phone}</span>
                      </div>

                      <div className="col-span-1 border-t border-white/[0.03] pt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity size={12} className="text-textSecondary/80" />
                          <span className="text-[9.5px] text-textSecondary uppercase font-semibold tracking-wider">Therapy</span>
                        </div>
                        <span className="inline-flex items-center text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg mt-0.5">
                          {formData.therapy}
                        </span>
                      </div>

                      <div className="col-span-1 border-t border-white/[0.03] pt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin size={12} className="text-textSecondary/80" />
                          <span className="text-[9.5px] text-textSecondary uppercase font-semibold tracking-wider">Location</span>
                        </div>
                        <span className="text-xs text-white font-bold block">{formData.region}</span>
                      </div>

                      <div className="col-span-1 border-t border-white/[0.03] pt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={12} className="text-textSecondary/80" />
                          <span className="text-[9.5px] text-textSecondary uppercase font-semibold tracking-wider">Active Since</span>
                        </div>
                        <span className="text-xs text-white font-bold block">{formData.dateSinceActive}</span>
                      </div>

                    </div>
                  </div>

                  {/* Activity Timeline to cover empty vertical space inside the view details panel */}
                  <div className="rounded-2xl border border-white/[0.04] bg-[#050B1A]/40 p-4 space-y-3 mt-4">
                    <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider">Recent Activity Logs</span>
                    </div>

                    <div className="relative pl-4 border-l border-white/5 space-y-3 text-xs text-textSecondary mt-2">
                      <div className="relative">
                        <div className="absolute -left-[20.5px] top-1 h-2.5 w-2.5 rounded-full bg-[#3B5BFF] border-2 border-surface" />
                        <span className="text-[9px] font-semibold text-textSecondary block">Today, 10:45 AM</span>
                        <span className="text-white/90 font-medium">Status verified as Active</span>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[20.5px] top-1 h-2.5 w-2.5 rounded-full bg-white/10 border-2 border-surface" />
                        <span className="text-[9px] font-semibold text-textSecondary block">Yesterday, 4:12 PM</span>
                        <span className="text-white/90 font-medium">Contact information updated by Admin</span>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[20.5px] top-1 h-2.5 w-2.5 rounded-full bg-white/10 border-2 border-surface" />
                        <span className="text-[9px] font-semibold text-textSecondary block">Joined on {formData.dateSinceActive}</span>
                        <span className="text-white/90 font-medium">Partner account activated in {formData.region}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Editable Form Fields (for Add / Edit actions) - Optimized to fit without scrolling using double columns */
                <div className="flex-1 flex flex-col justify-between py-1 h-full">
                    <div>
                      <Input
                        label={<span>Partner Name <span className="text-rose-500">*</span></span>}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                        }}
                        placeholder="Enter partner name (e.g. LifeMed)"
                        error={errors.name}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-semibold text-textSecondary uppercase tracking-wider">
                        Network Type <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Stockist', 'Retailer'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type })}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                              formData.type === type
                                ? 'border-[#3B5BFF] bg-[#3B5BFF]/10 text-white'
                                : 'border-white/[0.04] bg-white/5 text-textSecondary hover:text-white'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Input
                        label={<span>Contact Person Name <span className="text-rose-500">*</span></span>}
                        value={formData.contactPerson}
                        onChange={(e) => {
                          setFormData({ ...formData, contactPerson: e.target.value });
                          if (errors.contactPerson) setErrors((prev) => ({ ...prev, contactPerson: null }));
                        }}
                        placeholder="Enter contact name"
                        error={errors.contactPerson}
                      />
                    </div>

                    {/* Role and Phone in double columns to save vertical height */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input
                          label="Contact Person Role"
                          value={formData.contactRole}
                          onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                          placeholder="e.g. Manager"
                        />
                      </div>
                      <div>
                        <Input
                          label={<span>Phone Number <span className="text-rose-500">*</span></span>}
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                          }}
                          placeholder="e.g. 9876543210"
                          error={errors.phone}
                        />
                      </div>
                    </div>

                    {/* Therapy and Location in double columns to save vertical height */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-semibold text-textSecondary uppercase tracking-wider">
                          Therapy <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.therapy}
                          onChange={(e) => setFormData({ ...formData, therapy: e.target.value })}
                          className="w-full rounded-lg border border-white/[0.04] bg-[#091024] px-2.5 py-2 text-xs text-white outline-none transition focus:border-[#3B5BFF] focus:ring-1 focus:ring-[#3B5BFF]/20"
                        >
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <option key={cat.id || cat._id} value={cat.category}>
                                {cat.category}
                              </option>
                            ))
                          ) : (
                            ['Cardio', 'Respiratory', 'Neurology', 'Dermatology'].map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-semibold text-textSecondary uppercase tracking-wider">
                          Location <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.region}
                          onChange={(e) => {
                            setFormData({ ...formData, region: e.target.value });
                            if (errors.region) setErrors((prev) => ({ ...prev, region: null }));
                          }}
                          className="w-full rounded-lg border border-white/[0.04] bg-[#091024] px-2.5 py-2 text-xs text-white outline-none transition focus:border-[#3B5BFF] focus:ring-1 focus:ring-[#3B5BFF]/20"
                        >
                          <option value="">Select Location</option>
                          {regions.length > 0 ? (
                            regions.map((reg) => (
                              <option key={reg.id || reg._id} value={reg.name}>
                                {reg.name}
                              </option>
                            ))
                          ) : (
                            ['North Region', 'South Region', 'West Region', 'East Region', 'Central Region'].map((reg) => (
                              <option key={reg} value={reg}>{reg}</option>
                            ))
                          )}
                        </select>
                        {errors.region && <p className="mt-0.5 text-[10px] text-[#FFB3B8]">{errors.region}</p>}
                      </div>
                    </div>

                    {/* Date and Status in double columns to save vertical height */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input
                          label="Date Since Active"
                          type="date"
                          value={formData.dateSinceActive}
                          onChange={(e) => setFormData({ ...formData, dateSinceActive: e.target.value })}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider block mb-1">
                          Status <span className="text-rose-500">*</span>
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                status: formData.status === 'Active' ? 'Inactive' : 'Active'
                              })
                            }
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
                          <span className={`text-[11px] font-bold ${formData.status === 'Active' ? 'text-emerald-400' : 'text-textSecondary/70'}`}>
                            {formData.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.04] shrink-0 mt-2">
              {viewMode ? (
                <Button
                  onClick={() => setEditorOpen(false)}
                  className="px-5 py-1.5 rounded-xl bg-[#3B5BFF] text-xs font-semibold text-white shadow-glow"
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setEditorOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-white/[0.04] text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] text-xs font-semibold"
                  >
                    {selectedPartner ? 'Save Changes' : 'Save Partner'}
                  </Button>
                </>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Confirm Delete Modal */}
      <Modal
        open={deleteModalOpen}
        title="Delete Partner Account?"
        message={`Are you sure you want to remove the partner "${partnerToDelete?.name}" from your active network? This action cannot be undone.`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Network;
