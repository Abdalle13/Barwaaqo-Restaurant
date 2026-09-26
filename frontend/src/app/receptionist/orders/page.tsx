'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Order } from '@/types';
import { ShoppingBag, Search, RefreshCw, Clock, CheckCircle2, ChefHat, Truck, XCircle, Eye, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  Pending: { color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', icon: <Clock size={13} /> },
  Processing: { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', icon: <ChefHat size={13} /> },
  'Out for Delivery': { color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', icon: <Truck size={13} /> },
  Completed: { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', icon: <CheckCircle2 size={13} /> },
  Cancelled: { color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', icon: <XCircle size={13} /> },
};

export default function ReceptionistOrdersPage() {
  const { showToast, ToastComponent } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
      const res = await api.get(url);
      if (res.data.success) setOrders(res.data.data || []);
    } catch (err) {
      if (!silent) showToast('Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filtered = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const customer = typeof o.user === 'object' ? o.user : null;
    const matchesSearch = !q || o.orderId.toLowerCase().includes(q) || (customer && (customer.name.toLowerCase().includes(q) || customer.phone?.toLowerCase().includes(q)));
    const matchesType = !typeFilter || o.orderType === typeFilter;
    return matchesSearch && matchesType;
  });

  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const dineInToday = todayOrders.filter(o => o.orderType === 'DINE_IN').length;
  const takeawayToday = todayOrders.filter(o => o.orderType === 'TAKEAWAY').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {ToastComponent}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            🛍️ Order Monitoring
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            Today's Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Monitor dine-in and takeaway orders. Auto-refreshes every 30 seconds.</p>
        </div>
        <button onClick={() => fetchOrders()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Total Today', value: todayOrders.length, color: 'var(--accent)' },
          { label: 'Dine-In Today', value: dineInToday, color: '#60A5FA' },
          { label: 'Takeaway', value: takeawayToday, color: 'var(--accent)' },
          { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: '#FBBF24' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: s.color }}>{isLoading ? '—' : s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
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
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
          <option value="">All Types</option>
          <option value="DINE_IN">Dine-In</option>
          <option value="TAKEAWAY">Takeaway</option>
          <option value="DELIVERY">Delivery</option>
        </select>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <ShoppingBag size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Orders will appear here once customers place them.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(order => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
            const customer = typeof order.user === 'object' ? order.user : null;
            const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={order._id}
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', cursor: 'pointer' }}
                onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: statusCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusCfg.color, flexShrink: 0 }}>
                    {statusCfg.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                      {order.orderId}
                      <span style={{ marginLeft: '8px', padding: '1px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                        {order.orderType || 'DELIVERY'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {customer?.name} · {formattedTime} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      {order.table && typeof order.table === 'object' && ` · Table ${order.table.tableNumber}`}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                    {order.status}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>${order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-in order detail panel */}
      {selectedOrder && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>
              Order Details — {selectedOrder.orderId}
            </h3>
            <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>

          {/* Customer info */}
          {typeof selectedOrder.user === 'object' && (
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '160px', backgroundColor: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px 14px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Customer</p>
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selectedOrder.user.name}</p>
                {selectedOrder.user.phone && (
                  <a href={`tel:${selectedOrder.user.phone}`} style={{ fontSize: '13px', color: '#4ADE80', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: '600' }}>
                    <Phone size={12} /> {selectedOrder.user.phone}
                  </a>
                )}
              </div>
              {selectedOrder.shippingAddress && (
                <div style={{ flex: 1, minWidth: '160px', backgroundColor: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px 14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Location</p>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px', display: 'flex', gap: '4px' }}>
                    <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }} /> {selectedOrder.shippingAddress}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Items */}
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Items Ordered</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedOrder.items.map((item, idx) => {
                const foodName = typeof item.food === 'object' ? item.food.name : item.name || 'Item';
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>× {item.quantity} {foodName}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid var(--border)', marginTop: '4px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Total</span>
                <span style={{ fontWeight: '700', color: 'var(--accent)' }}>${selectedOrder.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {selectedOrder.notes && (
            <p style={{ fontSize: '13px', color: '#FBBF24', fontStyle: 'italic', padding: '8px 12px', backgroundColor: 'rgba(251,191,36,0.08)', borderRadius: '8px', border: '1px solid rgba(251,191,36,0.2)' }}>
              📝 {selectedOrder.notes}
            </p>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
