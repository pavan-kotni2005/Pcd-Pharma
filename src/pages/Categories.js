import { useEffect, useMemo, useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiTag } from 'react-icons/fi';
import Drawer from '../components/Drawer';
import Button from '../components/Button';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import Badge from '../components/Badge';
import Table from '../components/Table';
import Modal from '../components/Modal';
import StatusToggle from '../components/StatusToggle';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
  const { setActivePage, categories, setCategories, showToast, logActivity } = useAppContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modal delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form selected item & fields
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ category: '', description: '', status: 'Active', created: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setActivePage('Categories');
  }, [setActivePage]);

  const filtered = useMemo(() => {
    return categories.filter((item) =>
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const pagedData = useMemo(() => {
    return filtered.slice((page - 1) * 5, page * 5);
  }, [filtered, page]);

  const openAdd = () => {
    setSelectedCategory(null);
    setErrors({});
    const today = new Date().toISOString().split('T')[0];
    setFormData({ category: '', description: '', status: 'Active', created: today });
    setOpenDrawer(true);
  };

  const openEdit = (category) => {
    setSelectedCategory(category);
    setErrors({});
    setFormData(category);
    setOpenDrawer(true);
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.category.trim()) newErrors.category = 'Category Name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.created) newErrors.created = 'Created Date is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Validation Error', 'Please complete all fields.', 'failed');
      return;
    }

    if (selectedCategory) {
      setCategories((prev) => prev.map((item) => (item.id === selectedCategory.id ? { ...item, ...formData } : item)));
      showToast('Category Updated', `${formData.category} has been saved.`);
      logActivity(`Updated category ${formData.category}`, 'Categories');
    } else {
      const newCategory = { ...formData, id: `c${categories.length + 1}` };
      setCategories((prev) => [newCategory, ...prev]);
      showToast('Category Created', `${formData.category} was successfully created.`);
      logActivity(`Created category ${formData.category}`, 'Categories');
    }

    setOpenDrawer(false);
    setSelectedCategory(null);
  };

  const handleDeleteTrigger = (category) => {
    setItemToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setCategories((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    showToast('Category Deleted', `${itemToDelete.category} was deleted.`);
    logActivity(`Deleted category ${itemToDelete.category}`, 'Categories', 'Success');
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const columns = [
    { header: 'Category', accessor: 'category', cell: (row) => <div className="flex items-center gap-2.5 font-medium text-white"><FiTag className="text-[#5E4BFF]" /> {row.category}</div> },
    { header: 'Description', accessor: 'description', cell: (row) => <div className="max-w-xs truncate text-textSecondary" title={row.description}>{row.description}</div> },
    { header: 'Status', accessor: 'status', cell: (row) => <Badge status={row.status} /> },
    { header: 'Created Date', accessor: 'created' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-textSecondary font-semibold">Categories</p>
          <h1 className="mt-2 text-3xl font-bold text-white tracking-tight">Therapy groups</h1>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5BFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2e4ed6] shadow-glow"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-surface p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-textSecondary">
          <FiSearch />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search categories..."
            className="w-full bg-transparent text-white outline-none placeholder:text-textSecondary"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-5 py-3 text-sm text-white transition hover:bg-white/10">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={pagedData}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => openEdit(row)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-sm text-white transition hover:bg-white/10"
              title="Edit Category"
            >
              <FiEdit size={14} />
            </button>
            <button
              onClick={() => handleDeleteTrigger(row)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-[#FF4D6D]/10 text-sm text-[#FF4D6D] transition hover:bg-[#FF4D6D]/15"
              title="Delete Category"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* Drawer Form */}
      <Drawer
        open={openDrawer}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
        onClose={() => setOpenDrawer(false)}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setOpenDrawer(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Category</Button>
          </div>
        }
      >
        <div className="grid gap-5">
          <Input
            label="Category Name"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            error={errors.category}
          />
          <div>
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-textSecondary font-semibold">Description</span>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Provide information about the category..."
              className={`w-full rounded-2xl border ${errors.description ? 'border-rose-500' : 'border-white/8'} bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] focus:ring-2 focus:ring-[#3B5BFF]/20`}
            />
            {errors.description && <p className="mt-1 text-xs text-rose-400">{errors.description}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Created Date"
              type="date"
              value={formData.created}
              onChange={(e) => setFormData({ ...formData, created: e.target.value })}
              error={errors.created}
            />
            <div>
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-textSecondary font-semibold">Status</span>
              <StatusToggle
                checked={formData.status === 'Active'}
                onChange={(checked) => setFormData({ ...formData, status: checked ? 'Active' : 'Offline' })}
              />
            </div>
          </div>
        </div>
      </Drawer>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        title="Delete Category?"
        message={`Are you sure you want to delete the category "${itemToDelete?.category}"?`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Categories;
