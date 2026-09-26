'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Reservation, Table } from '@/types';
import { CalendarCheck, Clock, Users, Phone, Mail, RefreshCw, CheckCircle2, XCircle, Search } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Pending: { color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  Confirmed: { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)' },
  Completed: { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
  Cancelled: { color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
};

export default function ReceptionistReservationsPage() {
  const { showToast, ToastComponent } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter ? `/reservations?status=${statusFilter}` : '/reservations';
      const [resRes, tblRes] = await Promise.all([api.get(url), api.get('/tables')]);
      if (resRes.data.success) setReservations(resRes.data.data);
      if (tblRes.data.success) setTables(tblRes.data.data);
    } catch (err) {
      showToast('Failed to load reservations', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string, tableId?: string) => {
    setUpdatingId(id);
    try {
      await api.put(`/reservations/${id}/status`, { status: newStatus, table: tableId || undefined });
      showToast(`Reservation ${newStatus.toLowerCase()}!`, 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = reservations.filter(r => {
    const q = searchQuery.toLowerCase();
    return !q || r.customerName.toLowerCase().includes(q) || r.customerPhone?.toLowerCase().includes(q) || r.customerEmail?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {ToastComponent}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            📅 Table Reservations
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            Reservations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Confirm, assign tables, and manage guest bookings.</p>
        </div>
        <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone..."
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading reservations...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <CalendarCheck size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>No Reservations Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Guest bookings will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(res => {
            const statusCfg = STATUS_CONFIG[res.status] || STATUS_CONFIG['Pending'];
            const isUpdating = updatingId === res._id;
            return (
              <div key={res._id} style={{ backgroundColor: 'var(--bg-surface)', border: `1px solid ${res.status === 'Pending' ? statusCfg.border : 'var(--border)'}`, borderRadius: '16px', overflow: 'hidden', opacity: isUpdating ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                <div style={{ padding: '16px 20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {/* Left: Guest Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>{res.customerName}</span>
                      <span style={{ padding: '2px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                        {res.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Users size={13} /> {res.guests} guests
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} /> {new Date(res.reservationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {res.reservationTime}
                      </span>
                      <a href={`tel:${res.customerPhone}`} style={{ fontSize: '13px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', fontWeight: '600' }}>
                        <Phone size={13} /> {res.customerPhone}
                      </a>
                    </div>
                    {res.specialRequests && (
                      <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '12px', color: '#FBBF24', fontStyle: 'italic' }}>"{res.specialRequests}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Table + Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', flexShrink: 0 }}>
                    <select
                      value={res.table?._id || ''}
                      onChange={e => handleUpdateStatus(res._id, res.status, e.target.value)}
                      disabled={isUpdating}
                      style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Unassigned Table</option>
                      {tables.map(t => (
                        <option key={t._id} value={t._id}>{t.tableNumber} ({t.location}) — {t.status}</option>
                      ))}
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {res.status !== 'Confirmed' && res.status !== 'Completed' && res.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(res._id, 'Confirmed')}
                          disabled={isUpdating}
                          style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: isUpdating ? 'not-allowed' : 'pointer', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <CheckCircle2 size={14} /> Confirm
                        </button>
                      )}
                      {res.status !== 'Cancelled' && res.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(res._id, 'Cancelled')}
                          disabled={isUpdating}
                          style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.25)', cursor: isUpdating ? 'not-allowed' : 'pointer', backgroundColor: 'rgba(248, 113, 113, 0.08)', color: '#F87171', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                      {res.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(res._id, 'Completed')}
                          disabled={isUpdating}
                          style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: isUpdating ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, var(--accent) 0%, #D47151 100%)', color: 'white', fontWeight: '700', fontSize: '13px', boxShadow: '0 3px 10px var(--accent-glow)' }}
                        >
                          Mark Seated ✓
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
