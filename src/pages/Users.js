import { useEffect, useMemo, useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiUser } from 'react-icons/fi';
import Drawer from '../components/Drawer';
import Button from '../components/Button';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import Badge from '../components/Badge';
import Table from '../components/Table';
import Modal from '../components/Modal';
import StatusToggle from '../components/StatusToggle';
import { useAppContext } from '../context/AppContext';

const roles = ['Admin', 'Manager', 'Supervisor', 'Editor'];

const Users = () => {
  const { setActivePage, users, setUsers, showToast, logActivity } = useAppContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form selected item & fields
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Admin', password: '', status: 'Active' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setActivePage('Users');
  }, [setActivePage]);

  const filtered = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const pagedData = useMemo(() => {
    return filtered.slice((page - 1) * 5, page * 5);
  }, [filtered, page]);

  const openAdd = () => {
    setSelectedUser(null);
    setErrors({});
    setFormData({ name: '', email: '', role: 'Admin', password: '', status: 'Active' });
    setOpenDrawer(true);
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setErrors({});
    setFormData({ ...user, password: '' });
    setOpenDrawer(true);
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    
    // Simple Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid Email format.';
    }

    if (!selectedUser && !formData.password.trim()) {
      newErrors.password = 'Password is required for new accounts.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Validation Error', 'Please correct the highlighted inputs.', 'failed');
      return;
    }

    if (selectedUser) {
      // Retain old password if not modified
      const updatedUser = {
        ...selectedUser,
        ...formData,
        password: formData.password || selectedUser.password
      };
      setUsers((prev) => prev.map((item) => (item.id === selectedUser.id ? updatedUser : item)));
      showToast('Account Updated', `${formData.name} settings saved successfully.`);
      logActivity(`Updated user settings for ${formData.name}`, 'Users');
    } else {
      const newUser = {
        ...formData,
        id: `u${users.length + 1}`,
        lastLogin: 'Just now'
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast('Account Created', `A new profile was configured for ${formData.name}.`);
      logActivity(`Created user profile ${formData.name}`, 'Users');
    }

    setOpenDrawer(false);
    setSelectedUser(null);
  };

  const handleDeleteTrigger = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    setUsers((prev) => prev.filter((item) => item.id !== userToDelete.id));
    showToast('Account Removed', `${userToDelete.name} was deleted.`);
    logActivity(`Deleted user profile ${userToDelete.name}`, 'Users', 'Success');
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const columns = [
    {
      header: 'User Name',
      accessor: 'name',
      cell: (row) => {
        const initials = row.name
          ?.split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'US';

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B5BFF]/10 text-xs font-bold text-[#3B5BFF] border border-[#3B5BFF]/20 select-none">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-white">{row.name}</p>
              <p className="text-xs text-textSecondary">{row.email}</p>
            </div>
          </div>
        );
      }
    },
    { header: 'Role Type', accessor: 'role', cell: (row) => <span className="font-semibold text-[#8DA0D1]">{row.role}</span> },
    { header: 'Status', accessor: 'status', cell: (row) => <Badge status={row.status} /> },
    { header: 'Last Active', accessor: 'lastLogin', cell: (row) => <span className="text-xs text-textSecondary">{row.lastLogin}</span> }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-textSecondary font-semibold">Security</p>
          <h1 className="mt-2 text-3xl font-bold text-white tracking-tight">Admin accounts</h1>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5BFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2e4ed6] shadow-glow"
        >
          <FiPlus /> Add User
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
            placeholder="Search users..."
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
              title="Edit Profile"
            >
              <FiEdit size={14} />
            </button>
            <button
              onClick={() => handleDeleteTrigger(row)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-[#FF4D6D]/10 text-sm text-[#FF4D6D] transition hover:bg-[#FF4D6D]/15"
              title="Delete Account"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* Form Drawer */}
      <Drawer
        open={openDrawer}
        title={selectedUser ? 'Edit User Settings' : 'Create Admin Account'}
        onClose={() => setOpenDrawer(false)}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setOpenDrawer(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save User</Button>
          </div>
        }
      >
        <div className="grid gap-5">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-textSecondary font-semibold">User Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#3B5BFF] focus:ring-2 focus:ring-[#3B5BFF]/20"
            >
              {roles.map((role) => (
                <option key={role} value={role} className="bg-sidebar">
                  {role}
                </option>
              ))}
            </select>
          </div>
          <Input
            label={selectedUser ? 'New Password (leave blank to keep current)' : 'Account Password'}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <div>
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-textSecondary font-semibold">Account Status</span>
            <StatusToggle
              checked={formData.status === 'Active'}
              onChange={(checked) => setFormData({ ...formData, status: checked ? 'Active' : 'Offline' })}
            />
          </div>
        </div>
      </Drawer>

      {/* Delete confirm */}
      <Modal
        open={deleteModalOpen}
        title="Delete User Account?"
        message={`Are you sure you want to delete the user profile for "${userToDelete?.name}"? The user will lose access immediately.`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Users;
