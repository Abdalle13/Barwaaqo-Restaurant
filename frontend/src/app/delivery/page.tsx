'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import {
  Bike,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  RefreshCw,
  Navigation,
  Package,
  Sparkles,
  AlertCircle,
  Smartphone,
  User,
  Hash,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Pending: { label: 'Pending', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  Processing: { label: 'Processing', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
  'Out for Delivery': { label: 'Out for Delivery', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
  Completed: { label: 'Completed', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)' },
  Cancelled: { label: 'Cancelled', color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  evc_plus: '📱 EVC Plus (Hormuud)',
  edahab: '📱 eDahab (Dahabshiil)',
  pay_on_delivery: '💳 Pay on Delivery',
};

export default function DeliveryPage() {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ active: 0, completed: 0, totalToday: 0 });

  const fetchMyDeliveries = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.data.success) {
        const all: Order[] = res.data.data || [];
        // Filter orders assigned to this delivery person OR Out for Delivery orders
        const mine = all.filter((o) => {
          const assigned = o.assignedDeliveryBoy;
          const assignedId = typeof assigned === 'object' ? assigned?._id : assigned;
          return assignedId === user?._id || o.orderType === 'DELIVERY';
        });
        setMyOrders(mine);

        const today = new Date().toDateString();
        const active = mine.filter(o => o.status === 'Out for Delivery' || o.status === 'Processing').length;
        const completed = mine.filter(o => o.status === 'Completed').length;
        const totalToday = mine.filter(o => new Date(o.createdAt).toDateString() === today).length;
        setStats({ active, completed, totalToday });
      }
    } catch (err) {
      if (!silent) showToast('Failed to load deliveries', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user?._id, showToast]);

  useEffect(() => {
    fetchMyDeliveries();
    const interval = setInterval(() => fetchMyDeliveries(true), 30000);
    return () => clearInterval(interval);
  }, [fetchMyDeliveries]);

  const handleMarkDelivered = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: 'Completed' });
      if (res.data.success) {
        showToast('✅ Order marked as delivered!', 'success');
        fetchMyDeliveries(true);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update order', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkOutForDelivery = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: 'Out for Delivery' });
      if (res.data.success) {
        showToast('🛵 Status updated to Out for Delivery!', 'success');
        fetchMyDeliveries(true);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update order', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const activeOrders = myOrders.filter(o => !['Completed', 'Cancelled'].includes(o.status));
  const completedOrders = myOrders.filter(o => o.status === 'Completed');

  const renderOrderCard = (order: Order, isActive = true) => {
    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
    const isExpanded = expandedOrderId === order._id;
    const isUpdating = updatingId === order._id;
    const customer = typeof order.user === 'object' ? order.user : null;
    const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
      <div
        key={order._id}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: `1px solid ${isActive ? statusCfg.border : 'var(--border)'}`,
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.2s',
          opacity: isUpdating ? 0.7 : 1,
        }}
      >
        {/* Card Header */}
        <div
          onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          {/* Order Icon */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
            background: isActive ? 'linear-gradient(135deg, var(--accent) 0%, #D47151 100%)' : 'var(--bg-elevated)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isActive ? '0 3px 12px var(--accent-glow)' : 'none',
          }}>
            {isActive ? <Bike size={20} color="white" /> : <CheckCircle2 size={20} color="#4ADE80" />}
          </div>

          {/* Order Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                {order.orderId}
              </span>
              <span style={{
                padding: '2px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                backgroundColor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}`,
              }}>
                {statusCfg.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {formattedDate} {formattedTime}
              </span>
              {customer && (
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} /> {customer.name}
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Total + Address */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)' }}>
              ${order.totalAmount?.toFixed(2)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isExpanded ? '▲ Hide' : '▼ Details'}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons — always visible on active cards */}
        {isActive && (
          <div
            style={{ padding: '0 16px 14px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}
            onClick={(e) => e.stopPropagation()}
          >
            {(order.status === 'Pending' || order.status === 'Processing') && (
              <button
                onClick={() => handleMarkOutForDelivery(order._id)}
                disabled={isUpdating}
                style={{
                  flex: 1, minWidth: '140px',
                  padding: '9px 14px', borderRadius: '9px',
                  border: 'none', cursor: isUpdating ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #D47151 100%)',
                  color: '#FFFFFF',
                  fontWeight: '700', fontSize: '13px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 3px 12px var(--accent-glow)',
                  transition: 'opacity 0.15s',
                  opacity: isUpdating ? 0.6 : 1,
                }}
              >
                <Bike size={15} /> {isUpdating ? 'Updating...' : 'Start Delivery'}
              </button>
            )}
            {(order.status === 'Out for Delivery' || order.status === 'Processing' || order.status === 'Pending') && (
              <button
                onClick={() => handleMarkDelivered(order._id)}
                disabled={isUpdating}
                style={{
                  flex: 1, minWidth: '140px',
                  padding: '9px 14px', borderRadius: '9px',
                  border: 'none', cursor: isUpdating ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #4ADE80, #16A34A)',
                  color: '#000',
                  fontWeight: '700', fontSize: '13px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 14px rgba(74, 222, 128, 0.25)',
                  opacity: isUpdating ? 0.6 : 1,
                }}
              >
                <CheckCircle2 size={15} /> {isUpdating ? 'Updating...' : 'Mark Delivered'}
              </button>
            )}
            {customer?.phone && (
              <a
                href={`tel:${customer.phone}`}
                style={{
                  padding: '9px 14px', borderRadius: '9px',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  textDecoration: 'none', backgroundColor: 'var(--bg-elevated)',
                }}
              >
                <Phone size={14} /> Call
              </a>
            )}
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Address Section */}
            <div style={{ backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '10px' }}>
              <MapPin size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Address</p>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>{order.shippingAddress}</p>
                {(order as any).district && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>District: {(order as any).district}</p>}
                {(order as any).landmark && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Landmark: {(order as any).landmark}</p>}
              </div>
            </div>

            {/* Customer Phone */}
            {customer && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', padding: '12px 16px' }}>
                <Phone size={16} color="#4ADE80" />
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Phone</p>
                  <a href={`tel:${customer.phone}`} style={{ fontSize: '14px', color: '#4ADE80', fontWeight: '700', textDecoration: 'none' }}>
                    {customer.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', padding: '12px 16px' }}>
              <Smartphone size={16} color="var(--accent)" />
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment</p>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Status: <span style={{ color: order.paymentStatus === 'Paid' ? '#4ADE80' : '#FBBF24', fontWeight: '700' }}>{order.paymentStatus}</span>
                </p>
                {order.transactionId && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Hash size={11} /> Txn: {order.transactionId}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Order Items
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {order.items.map((item, idx) => {
                  const foodName = typeof item.food === 'object' ? item.food.name : item.name || 'Item';
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                        × {item.quantity} {foodName}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid var(--border)', marginTop: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Total</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)' }}>${order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '8px' }}>
                <AlertCircle size={15} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: '#FBBF24' }}>{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {ToastComponent}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            🛵 Delivery Portal
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            Welcome, {user?.name?.split(' ')[0]}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Your active delivery orders and real-time status updates.
          </p>
        </div>
        <button
          onClick={() => fetchMyDeliveries()}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Active Orders', value: stats.active, icon: <Bike size={20} />, color: 'var(--accent)', bg: 'var(--accent-glow)' },
          { label: 'Delivered Today', value: stats.completed, icon: <CheckCircle2 size={20} />, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
          { label: 'Total Today', value: stats.totalToday, icon: <Package size={20} />, color: 'var(--accent)', bg: 'var(--accent-glow)' },
        ].map((stat) => (
          <div key={stat.label} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Orders */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Navigation size={18} color="var(--accent)" />
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Active Orders ({activeOrders.length})
          </h2>
          {activeOrders.length > 0 && (
            <span style={{ padding: '2px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
              LIVE
            </span>
          )}
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p>Loading your deliveries...</p>
            </div>
          </div>
        ) : activeOrders.length === 0 ? (
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '50px 20px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'var(--bg-elevated)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>No Active Orders</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>You're all caught up! New orders will appear here automatically.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeOrders.map(order => renderOrderCard(order, true))}
          </div>
        )}
      </section>

      {/* Recent Completed */}
      {completedOrders.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <CheckCircle2 size={18} color="#4ADE80" />
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Completed Today ({completedOrders.length})
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {completedOrders.slice(0, 5).map(order => renderOrderCard(order, false))}
          </div>
        </section>
      )}
    </div>
  );
}
