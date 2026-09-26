'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Table } from '@/types';
import { TableProperties, RefreshCw, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  Available: { label: 'Available', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)' },
  Occupied: { label: 'Occupied', color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
  Reserved: { label: 'Reserved', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
};

export default function ReceptionistTablesPage() {
  const { showToast, ToastComponent } = useToast();
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/tables');
      if (res.data.success) setTables(res.data.data);
    } catch (err) {
      showToast('Failed to load tables', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  const handleStatusChange = async (tableId: string, newStatus: string) => {
    setUpdatingId(tableId);
    try {
      await api.put(`/tables/${tableId}`, { status: newStatus });
      showToast(`Table updated to ${newStatus}`, 'success');
      fetchTables();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = statusFilter === 'All' ? tables : tables.filter(t => t.status === statusFilter);

  const availableCount = tables.filter(t => t.status === 'Available').length;
  const occupiedCount = tables.filter(t => t.status === 'Occupied').length;
  const reservedCount = tables.filter(t => t.status === 'Reserved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {ToastComponent}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            🪑 Table Management
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            Table Status
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Monitor and update dining table availability in real time.</p>
        </div>
        <button onClick={fetchTables} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Available', value: availableCount, color: '#4ADE80', icon: <CheckCircle2 size={18} /> },
          { label: 'Occupied', value: occupiedCount, color: '#F87171', icon: <AlertCircle size={18} /> },
          { label: 'Reserved', value: reservedCount, color: '#FBBF24', icon: <Clock size={18} /> },
          { label: 'Total', value: tables.length, color: 'var(--accent)', icon: <TableProperties size={18} /> },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>{isLoading ? '—' : s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['All', 'Available', 'Occupied', 'Reserved'].map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            style={{
              padding: '7px 16px', borderRadius: '8px', border: `1px solid ${statusFilter === f ? 'var(--accent)' : 'var(--border)'}`,
              backgroundColor: statusFilter === f ? 'var(--accent-glow)' : 'var(--bg-surface)',
              color: statusFilter === f ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading tables...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {filtered.map(table => {
            const statusCfg = STATUS_CONFIG[table.status] || STATUS_CONFIG['Available'];
            const isUpdating = updatingId === table._id;
            return (
              <div
                key={table._id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: `1px solid ${statusCfg.border}`,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  opacity: isUpdating ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Status bar on top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: statusCfg.color }} />

                {/* Table Number */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {table.tableNumber}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{table.location}</div>
                  </div>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: statusCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TableProperties size={18} color={statusCfg.color} />
                  </div>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Users size={13} /> {table.capacity} seats
                  </div>
                  <span style={{ padding: '2px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                    {table.status}
                  </span>
                </div>

                {/* Quick Status Buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(['Available', 'Occupied', 'Reserved'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(table._id, s)}
                      disabled={isUpdating || table.status === s}
                      style={{
                        flex: 1,
                        padding: '7px 8px',
                        borderRadius: '8px',
                        border: `1px solid ${table.status === s ? STATUS_CONFIG[s].border : 'var(--border)'}`,
                        backgroundColor: table.status === s ? STATUS_CONFIG[s].bg : 'var(--bg-elevated)',
                        color: table.status === s ? STATUS_CONFIG[s].color : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: (isUpdating || table.status === s) ? 'default' : 'pointer',
                        transition: 'all 0.15s',
                        opacity: table.status === s ? 1 : 0.8,
                      }}
                    >
                      {s === 'Available' ? '✓ Free' : s === 'Occupied' ? '● Busy' : '◷ Hold'}
                    </button>
                  ))}
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
