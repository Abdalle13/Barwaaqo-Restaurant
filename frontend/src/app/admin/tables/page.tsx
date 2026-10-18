'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Table } from '@/types';
import { TableProperties, Plus, Trash2, LayoutGrid } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

type StatusFilter = 'All' | 'Available' | 'Occupied' | 'Reserved';
type LocationType = 'Main Hall' | 'Terrace' | 'VIP Room' | 'Window Side' | 'Outdoor Patio';
type StatusType = 'Available' | 'Occupied' | 'Reserved';

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Available:  { bg: 'rgba(74, 222, 128, 0.1)',  text: '#4ADE80', border: 'rgba(74, 222, 128, 0.3)' },
  Occupied:   { bg: 'rgba(248, 113, 113, 0.1)', text: '#F87171', border: 'rgba(248, 113, 113, 0.3)' },
  Reserved:   { bg: 'rgba(251, 191, 36, 0.1)',  text: '#FBBF24', border: 'rgba(251, 191, 36, 0.3)' },
};

const TOP_COLORS: Record<string, string> = {
  Available: '#4ADE80',
  Occupied:  '#F87171',
  Reserved:  '#FBBF24',
};

const STATUS_FILTERS: StatusFilter[] = ['All', 'Available', 'Occupied', 'Reserved'];
const LOCATIONS: LocationType[] = ['Main Hall', 'Terrace', 'VIP Room', 'Window Side', 'Outdoor Patio'];
const STATUSES: StatusType[] = ['Available', 'Occupied', 'Reserved'];

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'auto',
};

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [location, setLocation] = useState<LocationType>('Main Hall');
  const [status, setStatus] = useState<StatusType>('Available');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; num: string } | null>(null);
  const { showToast, ToastComponent } = useToast();

  const fetchTables = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/tables');
      if (res.data.success) setTables(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/tables', {
        tableNumber,
        capacity: Number(capacity),
        location,
        status,
      });
      if (res.data.success) {
        setTableNumber('');
        fetchTables();
        showToast(`Table ${tableNumber} added successfully`, 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create table', 'error');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/tables/${id}`, { status: newStatus });
      fetchTables();
      showToast('Table status updated', 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/tables/${deleteTarget.id}`);
      fetchTables();
      showToast(`Table ${deleteTarget.num} deleted`, 'success');
    } catch (err) {
      showToast('Failed to delete table', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredTables = statusFilter === 'All' ? tables : tables.filter(t => t.status === statusFilter);

  const counts = {
    All: tables.length,
    Available: tables.filter(t => t.status === 'Available').length,
    Occupied: tables.filter(t => t.status === 'Occupied').length,
    Reserved: tables.filter(t => t.status === 'Reserved').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <TableProperties size={22} color="var(--accent)" />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Dining Tables
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage floor layout, capacities, and real-time occupancy status
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <LayoutGrid size={15} color="var(--accent)" />
          <span>{tables.length} total tables</span>
        </div>
      </div>

      {/* Add New Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border)', padding: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Plus size={17} color="var(--accent)" />
          Add New Table
        </h3>
        <form onSubmit={handleCreateTable} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Table Code *</label>
            <input
              type="text"
              placeholder="e.g. VIP-01"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Capacity (Seats)</label>
            <input
              type="number" min={1} value={capacity}
              onChange={(e) => setCapacity(e.target.value)} required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Area / Location</label>
            <select value={location} onChange={(e: any) => setLocation(e.target.value)} style={selectStyle}>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Initial Status</label>
            <select value={status} onChange={(e: any) => setStatus(e.target.value)} style={selectStyle}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            type="submit"
            style={{
              height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent)',
              color: 'var(--bg-deep)', fontWeight: '700', fontSize: '14px',
              border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(212,165,116,0.3)',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '6px',
            }}
          >
            <Plus size={16} /> Add Table
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(filter => {
          const isActive = statusFilter === filter;
          const col = filter === 'All' ? null : STATUS_COLORS[filter];
          return (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: isActive ? (col?.border || 'var(--accent-border)') : 'var(--border)',
                backgroundColor: isActive ? (col?.bg || 'var(--accent-muted)') : 'var(--bg-surface)',
                color: isActive ? (col?.text || 'var(--accent)') : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              {filter}
              <span style={{
                backgroundColor: isActive ? (col?.text || 'var(--accent)') : 'var(--bg-muted)',
                color: isActive ? 'var(--bg-deep)' : 'var(--text-muted)',
                borderRadius: '9999px',
                padding: '1px 7px',
                fontSize: '11px',
                fontWeight: '700',
              }}>
                {counts[filter]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tables Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '14px' }} />
          <p>Loading tables...</p>
        </div>
      ) : filteredTables.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <TableProperties size={40} style={{ margin: '0 auto 14px', opacity: 0.4 }} />
          <p style={{ fontWeight: '600', fontSize: '15px' }}>No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} tables found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' }}>
          {filteredTables.map((tbl) => {
            const col = STATUS_COLORS[tbl.status] || STATUS_COLORS.Available;
            return (
              <div
                key={tbl._id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  borderTop: `4px solid ${TOP_COLORS[tbl.status] || '#4ADE80'}`,
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {tbl.tableNumber}
                  </h3>
                  <span style={{
                    padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '700',
                    textTransform: 'uppercase', backgroundColor: col.bg, color: col.text,
                    border: `1px solid ${col.border}`,
                  }}>
                    {tbl.status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p>Location: <strong style={{ color: 'var(--text-primary)' }}>{tbl.location}</strong></p>
                  <p>Capacity: <strong style={{ color: 'var(--text-primary)' }}>{tbl.capacity} seats</strong></p>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={tbl.status}
                    onChange={(e) => handleUpdateStatus(tbl._id, e.target.value)}
                    style={{
                      flex: 1, padding: '6px 10px', borderRadius: '8px',
                      border: `1px solid ${col.border}`, fontSize: '12px',
                      backgroundColor: col.bg, color: col.text,
                      cursor: 'pointer', fontWeight: '600', outline: 'none',
                    }}
                  >
                    {STATUSES.map(s => <option key={s} value={s} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => setDeleteTarget({ id: tbl._id, num: tbl.tableNumber })}
                    title="Delete table"
                    style={{
                      background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                      color: '#F87171', cursor: 'pointer', padding: '6px 8px', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', transition: 'all 0.2s',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Table"
          message={`Are you sure you want to delete table "${deleteTarget.num}"? This action cannot be undone.`}
          confirmLabel="Delete Table"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {ToastComponent}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
