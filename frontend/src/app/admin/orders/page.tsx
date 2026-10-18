'use client';

import React, { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Order } from '@/types';
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  Bike,
  Phone,
  MapPin,
  CheckCircle2,
  Printer,
  CreditCard,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import ReceiptModal from '@/components/admin/ReceiptModal';
import { useToast } from '@/components/ui/Toast';

interface DeliveryStaff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  role?: { name: string };
  vehicleType?: string;
  plateNumber?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryDrivers, setDeliveryDrivers] = useState<DeliveryStaff[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  // Printing & Receipt Modal State
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [restaurantSettings, setRestaurantSettings] = useState<any>({});

  // Auto-refresh State (e.g. 20s interval for live orders)
  const [autoRefresh, setAutoRefresh] = useState(true);
  const previousOrderCount = useRef<number>(0);
  const { showToast, ToastComponent } = useToast();

  const fetchOrdersAndDrivers = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
      const [orderRes, staffRes, settingsRes] = await Promise.allSettled([
        api.get(url),
        api.get('/staff'),
        api.get('/settings'),
      ]);

      if (orderRes.status === 'fulfilled' && orderRes.value.data.success) {
        const fetchedOrders: Order[] = orderRes.value.data.data;
        if (
          silent &&
          previousOrderCount.current > 0 &&
          fetchedOrders.length > previousOrderCount.current
        ) {
          showToast(`🔔 New Order received!`, 'info');
        }
        previousOrderCount.current = fetchedOrders.length;
        setOrders(fetchedOrders);
      }

      if (staffRes.status === 'fulfilled' && staffRes.value.data.success) {
        const drivers = staffRes.value.data.data.filter((s: any) => s.role?.name === 'DELIVERY');
        setDeliveryDrivers(drivers);
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value.data.success) {
        setRestaurantSettings(settingsRes.value.data.data || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndDrivers();
  }, [statusFilter]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchOrdersAndDrivers(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [autoRefresh, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrdersAndDrivers(true);
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleUpdatePaymentStatus = async (id: string, newPaymentStatus: string) => {
    try {
      await api.put(`/orders/${id}/status`, { paymentStatus: newPaymentStatus });
      fetchOrdersAndDrivers(true);
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus as any });
      }
      showToast(`Payment marked as ${newPaymentStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update payment status', 'error');
    }
  };

  const handleAssignDriver = async (id: string, driverId: string) => {
    try {
      await api.put(`/orders/${id}/status`, { assignedDeliveryBoy: driverId || null });
      fetchOrdersAndDrivers(true);
      if (selectedOrder && selectedOrder._id === id) {
        const found = deliveryDrivers.find((d) => d._id === driverId);
        setSelectedOrder({ ...selectedOrder, assignedDeliveryBoy: found || null });
      }
      showToast(driverId ? 'Driver assigned successfully' : 'Driver unassigned', 'success');
    } catch (err) {
      showToast('Failed to assign driver', 'error');
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const customerName = typeof ord.user === 'object' && ord.user ? ord.user.name.toLowerCase() : '';
    const phone = ord.paymentPhone ? ord.paymentPhone.toLowerCase() : '';
    const orderId = ord.orderId ? ord.orderId.toLowerCase() : '';
    const district = ord.district ? ord.district.toLowerCase() : '';
    const trx = ord.transactionId ? ord.transactionId.toLowerCase() : '';
    return (
      orderId.includes(query) ||
      customerName.includes(query) ||
      phone.includes(query) ||
      district.includes(query) ||
      trx.includes(query)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Live Dispatch & Kitchen
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            Orders Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
            Track counter sales, online deliveries across Mogadishu, and assign drivers.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: autoRefresh ? 'rgba(74, 222, 128, 0.1)' : 'var(--bg-surface)',
              border: autoRefresh ? '1px solid #4ADE80' : '1px solid var(--border)',
              color: autoRefresh ? '#4ADE80' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Clock size={14} />
            <span>Auto-Refresh (20s): {autoRefresh ? 'ON' : 'OFF'}</span>
          </button>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{
              width: '160px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              borderRadius: '10px',
              fontSize: '13px',
            }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => fetchOrdersAndDrivers(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ position: 'relative', maxWidth: '420px' }}>
        <Search
          size={16}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by Order ID, Customer, Phone, or Mogadishu District..."
          className="form-input"
          style={{
            width: '100%',
            paddingLeft: '38px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
          }}
        />
      </div>

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '18px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead style={{ backgroundColor: 'var(--bg-deep)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '11.5px', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 16px' }}>ORDER ID</th>
                <th style={{ padding: '14px 16px' }}>SERVICE / TABLE</th>
                <th style={{ padding: '14px 16px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 16px' }}>TOTAL</th>
                <th style={{ padding: '14px 16px' }}>PAYMENT</th>
                <th style={{ padding: '14px 16px' }}>ASSIGN DRIVER</th>
                <th style={{ padding: '14px 16px' }}>STATUS</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    Loading live orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord: any) => {
                  const assignedDriverId = ord.assignedDeliveryBoy?._id || ord.assignedDeliveryBoy || '';
                  const isPaid = ord.paymentStatus === 'Paid';

                  return (
                    <tr key={ord._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}>
                      {/* Order ID */}
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--accent)' }}>
                        {ord.orderId}
                      </td>

                      {/* Service / Table */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor:
                                ord.orderType === 'DINE_IN'
                                  ? 'rgba(56, 189, 248, 0.12)'
                                  : ord.orderType === 'TAKEAWAY'
                                  ? 'rgba(251, 191, 36, 0.12)'
                                  : 'rgba(212, 165, 116, 0.12)',
                              color:
                                ord.orderType === 'DINE_IN'
                                  ? '#38BDF8'
                                  : ord.orderType === 'TAKEAWAY'
                                  ? '#FBBF24'
                                  : 'var(--accent)',
                              border: '1px solid var(--border)',
                              fontSize: '11px',
                              fontWeight: '700',
                              width: 'fit-content',
                            }}
                          >
                            {ord.orderType === 'DINE_IN' ? 'Dine-In' : ord.orderType === 'TAKEAWAY' ? 'Takeaway' : 'Delivery'}
                          </span>
                          {ord.orderType === 'DINE_IN' && ord.table && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              Table {ord.table?.tableNumber || ord.table}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-primary)' }}>
                          {typeof ord.user === 'object' && ord.user?.name ? ord.user.name : 'Walk-in Guest'}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {ord.paymentPhone} {ord.district ? `• ${ord.district}` : ''}
                        </p>
                      </td>

                      {/* Total */}
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        ${ord.totalAmount?.toFixed(2)}
                      </td>

                      {/* Payment Status & Method */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdatePaymentStatus(ord._id, isPaid ? 'Pending' : 'Paid')}
                            title="Click to toggle payment status"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: isPaid ? 'rgba(74, 222, 128, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                              border: isPaid ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                              color: isPaid ? '#4ADE80' : '#F59E0B',
                              fontSize: '11px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              width: 'fit-content',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isPaid ? '#4ADE80' : '#F59E0B' }} />
                            {isPaid ? 'PAID' : 'PENDING'}
                          </button>
                          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                            {ord.paymentMethod === 'evc_plus'
                              ? 'EVC Plus'
                              : ord.paymentMethod === 'edahab'
                              ? 'eDahab'
                              : 'Pay on Delivery'}
                            {ord.transactionId ? ` (TX: ${ord.transactionId})` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Driver Assignment Dropdown */}
                      <td style={{ padding: '14px 16px' }}>
                        {ord.orderType === 'DELIVERY' ? (
                          <select
                            value={assignedDriverId}
                            onChange={(e) => handleAssignDriver(ord._id, e.target.value)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '8px',
                              border: assignedDriverId ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid var(--border)',
                              backgroundColor: assignedDriverId ? 'rgba(74, 222, 128, 0.08)' : 'var(--bg-deep)',
                              color: assignedDriverId ? '#4ADE80' : 'var(--text-secondary)',
                              fontWeight: '600',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              maxWidth: '160px',
                            }}
                          >
                            <option value="">— Select Driver —</option>
                            {deliveryDrivers.map((driver) => (
                              <option key={driver._id} value={driver._id}>
                                {driver.name} ({driver.phone})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Counter / Pickup</span>
                        )}
                      </td>

                      {/* Order Status Dropdown */}
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-deep)',
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: '11.5px',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {/* Print Receipt / Slip Button */}
                          <button
                            type="button"
                            title="Print Slip / Thermal Receipt"
                            onClick={() => {
                              setPrintOrder(ord);
                              setIsReceiptOpen(true);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 9px',
                              borderRadius: '7px',
                              backgroundColor: 'rgba(212, 165, 116, 0.1)',
                              border: '1px solid rgba(212, 165, 116, 0.3)',
                              color: 'var(--accent)',
                              cursor: 'pointer',
                              fontSize: '11.5px',
                              fontWeight: '700',
                            }}
                          >
                            <Printer size={13} />
                            <span>Slip</span>
                          </button>

                          {/* View Order Modal */}
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 9px',
                              borderRadius: '7px',
                              backgroundColor: 'var(--bg-deep)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              fontSize: '11.5px',
                              fontWeight: '600',
                            }}
                          >
                            <Eye size={13} />
                            <span>View</span>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'clamp(20px, 4vw, 32px)',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Order Breakdown
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '700', color: 'var(--accent)', marginTop: '2px' }}>
                  {selectedOrder.orderId}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setPrintOrder(selectedOrder);
                    setIsReceiptOpen(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--accent)',
                    color: '#000000',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Printer size={14} /> Print Slip
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '4px',
                  }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {/* Service & Payment Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>SERVICE TYPE</span>
                  <p style={{ margin: '3px 0 0', fontWeight: '700', fontSize: '13px' }}>
                    {selectedOrder.orderType}
                    {selectedOrder.table ? ` (Table ${selectedOrder.table?.tableNumber || selectedOrder.table})` : ''}
                  </p>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>PAYMENT</span>
                  <p style={{ margin: '3px 0 0', fontWeight: '700', fontSize: '13px', color: selectedOrder.paymentStatus === 'Paid' ? '#4ADE80' : '#F59E0B' }}>
                    {selectedOrder.paymentStatus?.toUpperCase()} ({selectedOrder.paymentMethod})
                  </p>
                </div>
              </div>

              {selectedOrder.transactionId && (
                <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                  <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: '700' }}>
                    EVC / eDahab Transaction Ref: {selectedOrder.transactionId}
                  </span>
                </div>
              )}

              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>
                  DELIVERY ADDRESS & DISTRICT
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '3px 0 0' }}>
                  {selectedOrder.shippingAddress} {selectedOrder.district ? `(Degmada ${selectedOrder.district})` : ''}
                </p>
              </div>

              {selectedOrder.landmark && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>
                    NEARBY LANDMARK
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '3px 0 0' }}>{selectedOrder.landmark}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>
                    PRIMARY PHONE
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '3px 0 0' }}>{selectedOrder.paymentPhone}</p>
                </div>
                {selectedOrder.alternativePhone && (
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>
                      ALT PHONE
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '3px 0 0' }}>{selectedOrder.alternativePhone}</p>
                  </div>
                )}
              </div>

              {/* Assigned Driver Box in Modal */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-deep)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bike size={18} color="var(--accent)" />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Assigned Driver</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {selectedOrder.assignedDeliveryBoy?.name || 'Unassigned'}
                    </span>
                  </div>
                </div>

                {selectedOrder.assignedDeliveryBoy?.phone && (
                  <a
                    href={`tel:${selectedOrder.assignedDeliveryBoy.phone}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(74, 222, 128, 0.12)',
                      color: '#4ADE80',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={13} />
                    <span>Call Driver</span>
                  </a>
                )}
              </div>

              {selectedOrder.notes && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>
                    SPECIAL NOTES
                  </p>
                  <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--accent)', margin: '3px 0 0' }}>
                    "{selectedOrder.notes}"
                  </p>
                </div>
              )}
            </div>

            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Items Ordered
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {selectedOrder.items.map((it: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {it.quantity}x {typeof it.food === 'object' ? it.food.name : it.name || 'Dish'}
                  </span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-primary)',
              }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--accent)', fontSize: '18px' }}>${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Thermal Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={printOrder}
        restaurantSettings={restaurantSettings}
      />

      {ToastComponent}
    </div>
  );
}
