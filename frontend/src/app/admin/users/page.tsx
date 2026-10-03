'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Search,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'blocked';
  role?: {
    _id: string;
    name: string;
  };
  profileImage?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users');
      if (res.data.success) {
        const customersOnly = (res.data.data || []).filter((user: UserData) => {
          const roleName = (user.role?.name || '').toUpperCase();
          return roleName === 'CUSTOMER';
        });
        setUsers(customersOnly);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (targetUser: UserData) => {
    if (currentUser && currentUser._id === targetUser._id) {
      setToastMessage('You cannot change your own account status.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    const willBlock = targetUser.status === 'active';
    const confirmText = willBlock
      ? `Are you sure you want to block ${targetUser.name}? They will not be able to log in or place orders.`
      : `Restore login access for ${targetUser.name}?`;

    if (!window.confirm(confirmText)) return;

    setActionLoadingId(targetUser._id);
    try {
      const res = await api.put(`/users/toggle-status/${targetUser._id}`);
      if (res.data.success) {
        setToastMessage(`Account status updated for ${targetUser.name}.`);
        setTimeout(() => setToastMessage(null), 3000);
        // Refresh local state
        setUsers((prev) =>
          prev.map((u) =>
            u._id === targetUser._id
              ? { ...u, status: willBlock ? 'blocked' : 'active' }
              : u
          )
        );
      }
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
      const msg = err.response?.data?.message || 'Failed to update user status.';
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.toLowerCase().includes(q));

    const roleName = u.role?.name || 'Customer';
    const matchesRole =
      roleFilter === 'all' ||
      roleName.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Metrics
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const blockedCount = users.filter((u) => u.status === 'blocked').length;
  const adminCount = users.filter((u) => u.role?.name === 'Admin').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--accent)',
            color: 'var(--text-primary)',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          <AlertCircle size={18} color="var(--accent)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            Customer Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage customer accounts, admin access, and account status across the platform
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <RefreshCw
            size={15}
            style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 165, 116, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Users
            </p>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {totalCount}
            </h3>
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(74, 222, 128, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)',
            }}
          >
            <UserCheck size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Accounts
            </p>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {activeCount}
            </h3>
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 165, 116, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Admins
            </p>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {adminCount}
            </h3>
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(248, 113, 113, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger)',
            }}
          >
            <UserX size={22} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Blocked
            </p>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {blockedCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '16px 20px',
          borderRadius: '14px',
          border: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexGrow: 1,
            minWidth: '240px',
            backgroundColor: 'var(--bg-deep)',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
          }}
        >
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              width: '100%',
            }}
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '9px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Roles</option>
          <option value="Customer">Customer Only</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '9px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="blocked">Blocked Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: 'rgba(255,255,255,0.015)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                <th style={{ padding: '16px 20px' }}>User</th>
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
                    Loading users list...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleName = u.role?.name || 'Customer';
                  const isAdmin = roleName.toLowerCase() === 'admin';
                  const isBlocked = u.status === 'blocked';
                  const isCurrent = currentUser?._id === u._id;
                  const isPending = actionLoadingId === u._id;

                  // Initials for avatar
                  const initials = u.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  const formattedDate = new Date(u.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* User Info */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              backgroundColor: isAdmin
                                ? 'rgba(212, 165, 116, 0.2)'
                                : 'rgba(255, 255, 255, 0.05)',
                              color: isAdmin ? 'var(--accent)' : 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '13px',
                              border: isAdmin
                                ? '1px solid rgba(212, 165, 116, 0.4)'
                                : '1px solid var(--border)',
                              flexShrink: 0,
                            }}
                          >
                            {initials || 'U'}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                                {u.name}
                              </p>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(212, 165, 116, 0.15)',
                                    color: 'var(--accent)',
                                  }}
                                >
                                  YOU
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>
                          <Phone size={13} color="var(--text-secondary)" />
                          <span>{u.phone || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: isAdmin
                              ? 'rgba(212, 165, 116, 0.15)'
                              : 'rgba(96, 165, 250, 0.12)',
                            color: isAdmin ? 'var(--accent)' : 'var(--info)',
                            border: isAdmin
                              ? '1px solid rgba(212, 165, 116, 0.3)'
                              : '1px solid rgba(96, 165, 250, 0.2)',
                          }}
                        >
                          {isAdmin && <ShieldCheck size={12} />}
                          {roleName}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: isBlocked
                              ? 'rgba(248, 113, 113, 0.12)'
                              : 'rgba(74, 222, 128, 0.12)',
                            color: isBlocked ? 'var(--danger)' : 'var(--success)',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isBlocked ? 'var(--danger)' : 'var(--success)',
                            }}
                          />
                          {isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          <Calendar size={13} />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        {isCurrent ? (
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            Current Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isPending}
                            title={isBlocked ? 'Unblock user' : 'Block user'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: isPending ? 'not-allowed' : 'pointer',
                              border: isBlocked
                                ? '1px solid rgba(74, 222, 128, 0.3)'
                                : '1px solid rgba(248, 113, 113, 0.3)',
                              backgroundColor: isBlocked
                                ? 'rgba(74, 222, 128, 0.08)'
                                : 'rgba(248, 113, 113, 0.08)',
                              color: isBlocked ? 'var(--success)' : 'var(--danger)',
                              transition: 'all 0.2s ease',
                              opacity: isPending ? 0.6 : 1,
                            }}
                          >
                            {isBlocked ? (
                              <>
                                <Unlock size={13} />
                                <span>Unblock</span>
                              </>
                            ) : (
                              <>
                                <Lock size={13} />
                                <span>Block User</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
