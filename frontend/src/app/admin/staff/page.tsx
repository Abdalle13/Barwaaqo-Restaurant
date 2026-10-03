'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Shield,
  Search,
  RefreshCw,
  Calendar,
  AlertCircle,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import StaffModal from '@/components/admin/StaffModal';

interface StaffRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status?: 'active' | 'blocked';
  role?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { showToast, ToastComponent } = useToast();

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/staff');
      if (res.data.success) {
        setStaffList(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load staff list', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filteredStaff = staffList.filter((staff) => {
    const q = searchQuery.toLowerCase();
    const roleName = staff.role?.name || 'DELIVERY';
    const status = staff.status || 'active';

    const matchesSearch =
      staff.name.toLowerCase().includes(q) ||
      staff.email.toLowerCase().includes(q) ||
      (staff.phone && staff.phone.toLowerCase().includes(q));

    const matchesRole = roleFilter === 'all' || roleName.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalCount = staffList.length;
  const adminCount = staffList.filter((s) => s.role?.name === 'ADMIN').length;
  const deliveryCount = staffList.filter((s) => s.role?.name === 'DELIVERY').length;
  const receptionistCount = staffList.filter((s) => s.role?.name === 'RECEPTIONIST').length;
  const activeCount = staffList.filter((s) => (s.status || 'active') === 'active').length;

  const handleSaveStaff = async (data: any) => {
    try {
      if (editingStaff) {
        await api.put(`/staff/${editingStaff._id}`, data);
        showToast('Staff member updated successfully', 'success');
      } else {
        await api.post('/staff', data);
        showToast('Staff member added successfully', 'success');
      }
      setIsStaffModalOpen(false);
      setEditingStaff(null);
      fetchStaff();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/staff/${deleteTarget.id}`);
      showToast(`Staff member "${deleteTarget.name}" deleted`, 'success');
      fetchStaff();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openEditModal = (staff: StaffRecord) => {
    setEditingStaff(staff);
    setIsStaffModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingStaff(null);
    setIsStaffModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Staff Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage administrators, receptionists, and delivery personnel.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent)',
            border: 'none',
            color: 'var(--bg-deep)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3)',
          }}
        >
          <Plus size={18} />
          <span>Add Staff</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'rgba(212, 165, 116, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <Users size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Total Staff</p>
            <h3 style={{ margin: '6px 0 0', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{totalCount}</h3>
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'rgba(212, 165, 116, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <Shield size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Admins</p>
            <h3 style={{ margin: '6px 0 0', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{adminCount}</h3>
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'rgba(96, 165, 250, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
            <Phone size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Delivery</p>
            <h3 style={{ margin: '6px 0 0', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{deliveryCount}</h3>
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'rgba(224, 138, 101, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <Calendar size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Receptionists</p>
            <h3 style={{ margin: '6px 0 0', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{receptionistCount}</h3>
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'rgba(74, 222, 128, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Active</p>
            <h3 style={{ margin: '6px 0 0', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{activeCount}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1, minWidth: '240px', backgroundColor: 'var(--bg-deep)', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or phone..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13.5px', width: '100%' }}
          />
        </div>

        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '10px', backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer' }}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="delivery">Delivery</option>
          <option value="receptionist">Receptionist</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '10px', backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.015)', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                <th style={{ padding: '16px 20px' }}>Staff</th>
                <th style={{ padding: '16px 20px' }}>Contact</th>
                <th style={{ padding: '16px 20px' }}>Role</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px' }}>Joined</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
                    Loading staff list...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
                    No staff members found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const roleName = staff.role?.name || 'DELIVERY';
                  const status = staff.status || 'active';
                  const isAdmin = roleName.toUpperCase() === 'ADMIN';
                  const isBlocked = status === 'blocked';
                  const initials = staff.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  const joinedDate = staff.createdAt ? new Date(staff.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

                  return (
                    <tr key={staff._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: isAdmin ? 'rgba(212, 165, 116, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: isAdmin ? 'var(--accent)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', border: isAdmin ? '1px solid rgba(212, 165, 116, 0.4)' : '1px solid var(--border)', flexShrink: 0 }}>
                            {initials || 'S'}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{staff.name}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{staff.email}</p>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>
                          <Phone size={13} color="var(--text-secondary)" />
                          <span>{staff.phone || 'N/A'}</span>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', backgroundColor: isAdmin ? 'rgba(212, 165, 116, 0.15)' : 'rgba(96, 165, 250, 0.12)', color: isAdmin ? 'var(--accent)' : '#60A5FA', border: isAdmin ? '1px solid rgba(212, 165, 116, 0.3)' : '1px solid rgba(96, 165, 250, 0.2)' }}>
                          <Shield size={12} />
                          {roleName}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', backgroundColor: isBlocked ? 'rgba(248, 113, 113, 0.12)' : 'rgba(74, 222, 128, 0.12)', color: isBlocked ? 'var(--danger)' : 'var(--success)' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isBlocked ? 'var(--danger)' : 'var(--success)' }} />
                          {isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          <Calendar size={13} />
                          <span>{joinedDate}</span>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => openEditModal(staff)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }} title="Edit Staff">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteTarget({ id: staff._id, name: staff.name })} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }} title="Delete Staff">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StaffModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} onSave={handleSaveStaff} staff={editingStaff} />

      {!!deleteTarget && (
        <ConfirmModal
          title="Delete Staff Member"
          message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
          confirmLabel="Delete"
          danger={true}
        />
      )}

      {ToastComponent}
    </div>
  );
}
