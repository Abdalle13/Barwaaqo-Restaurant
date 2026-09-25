'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Bike,
  Package,
  Calendar,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Pending: { color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  Processing: { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
  'Out for Delivery': { color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
  Completed: { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)' },
  Cancelled: { color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
};

export default function DeliveryHistoryPage() {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.data.success) {
        const all: Order[] = res.data.data || [];
        const mine = all.filter((o) => {
          const assigned = o.assignedDeliveryBoy;
          const assignedId = typeof assigned === 'object' ? assigned?._id : assigned;
          return assignedId === user?._id || o.orderType === 'DELIVERY';
        });
        // Show only completed/cancelled in history
        setOrders(mine.filter(o => ['Completed', 'Cancelled'].includes(o.status)));
      }
    } catch (err) {
      showToast('Failed to load history', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user?._id, showToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filtered = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || o.orderId.toLowerCase().includes(q) ||
      (typeof o.user === 'object' && (o.user.name.toLowerCase().includes(q) || o.user.phone?.toLowerCase().includes(q)));
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {ToastComponent}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            📋 Delivery History
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            Past Deliveries
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your completed and cancelled delivery orders.</p>
        </div>
        <button
          onClick={fetchHistory}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Delivered', value: orders.filter(o => o.status === 'Completed').length, color: '#4ADE80', icon: <CheckCircle2 size={18} /> },
          { label: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, color: '#F87171', icon: <XCircle size={18} /> },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'var(--accent)', icon: <Package size={18} /> },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by order ID or customer..."
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="ALL">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <History size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>No History Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your completed deliveries will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(order => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
            const customer = typeof order.user === 'object' ? order.user : null;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={order._id} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {order.status === 'Completed' ? <CheckCircle2 size={18} color="#4ADE80" /> : <XCircle size={18} color="#F87171" />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{order.orderId}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {customer?.name} • {formattedDate} {formattedTime}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                      📍 {order.shippingAddress}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                    {order.status}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>
                    ${order.totalAmount?.toFixed(2)}
                  </span>
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
