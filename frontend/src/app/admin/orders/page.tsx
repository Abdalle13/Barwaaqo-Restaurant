'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Order } from '@/types';
import { ShoppingBag, Search, Filter, RefreshCw, Eye, X, Bike, Phone, MapPin, CheckCircle2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrdersAndDrivers = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
      const [orderRes, staffRes] = await Promise.allSettled([
        api.get(url),
        api.get('/staff'),
      ]);

      if (orderRes.status === 'fulfilled' && orderRes.value.data.success) {
        setOrders(orderRes.value.data.data);
      }

      if (staffRes.status === 'fulfilled' && staffRes.value.data.success) {
        const drivers = staffRes.value.data.data.filter((s: any) => s.role?.name === 'DELIVERY');
        setDeliveryDrivers(drivers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndDrivers();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrdersAndDrivers();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignDriver = async (id: string, driverId: string) => {
    try {
      await api.put(`/orders/${id}/status`, { assignedDeliveryBoy: driverId || null });
      fetchOrdersAndDrivers();
      if (selectedOrder && selectedOrder._id === id) {
        const found = deliveryDrivers.find(d => d._id === driverId);
        setSelectedOrder({ ...selectedOrder, assignedDeliveryBoy: found || null });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Orders Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Monitor, assign delivery drivers, and update live orders across Mogadishu
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{
              width: '180px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              borderRadius: '10px',
            }}
          >
            <option value="" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>All Statuses</option>
            <option value="Pending" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Pending</option>
            <option value="Processing" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Processing</option>
            <option value="Out for Delivery" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Out for Delivery</option>
            <option value="Completed" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Completed</option>
            <option value="Cancelled" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Cancelled</option>
          </select>

          <button
            onClick={fetchOrdersAndDrivers}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead style={{ backgroundColor: 'var(--bg-deep)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '12px' }}>
                <th style={{ padding: '16px 18px' }}>ORDER ID</th>
                <th style={{ padding: '16px 18px' }}>TYPE</th>
                <th style={{ padding: '16px 18px' }}>CUSTOMER</th>
                <th style={{ padding: '16px 18px' }}>TOTAL</th>
                <th style={{ padding: '16px 18px' }}>ASSIGN DRIVER</th>
                <th style={{ padding: '16px 18px' }}>STATUS</th>
                <th style={{ padding: '16px 18px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord: any) => {
                  const assignedDriverId = ord.assignedDeliveryBoy?._id || ord.assignedDeliveryBoy || '';
                  const assignedDriverName = ord.assignedDeliveryBoy?.name;

                  return (
                    <tr key={ord._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 18px', fontWeight: '800', color: 'var(--accent)' }}>
                        {ord.orderId}
                      </td>

                      <td style={{ padding: '16px 18px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 9px', borderRadius: '6px', backgroundColor: ord.orderType === 'DINE_IN' ? 'var(--info-muted)' : ord.orderType === 'TAKEAWAY' ? 'var(--warning-muted)' : 'var(--accent-muted)', color: ord.orderType === 'DINE_IN' ? 'var(--info)' : ord.orderType === 'TAKEAWAY' ? 'var(--warning)' : 'var(--accent)', border: '1px solid var(--border)', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                          {ord.orderType === 'DINE_IN' ? 'Dine-in' : ord.orderType === 'TAKEAWAY' ? 'Takeaway' : 'Delivery'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 18px' }}>
                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-primary)' }}>
                          {typeof ord.user === 'object' ? ord.user.name : 'Guest'}
                        </p>
                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {ord.paymentPhone} {ord.district ? `• ${ord.district}` : ''}
                        </p>
                      </td>

                      <td style={{ padding: '16px 18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        ${ord.totalAmount.toFixed(2)}
                      </td>

                      {/* Driver Assignment Dropdown */}
                      <td style={{ padding: '16px 18px' }}>
                        {ord.orderType === 'DELIVERY' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <select
                              value={assignedDriverId}
                              onChange={(e) => handleAssignDriver(ord._id, e.target.value)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: assignedDriverId ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid var(--border)',
                                backgroundColor: assignedDriverId ? 'rgba(74, 222, 128, 0.08)' : 'var(--bg-deep)',
                                color: assignedDriverId ? '#4ADE80' : 'var(--text-secondary)',
                                fontWeight: '600',
                                fontSize: '12px',
                                cursor: 'pointer',
                                maxWidth: '170px',
                              }}
                            >
                              <option value="" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                                — Select Driver —
                              </option>
                              {deliveryDrivers.map((driver) => (
                                <option key={driver._id} value={driver._id} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                                  {driver.name} ({driver.phone})
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>N/A (Pickup/Dine-in)</span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td style={{ padding: '16px 18px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-deep)',
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Pending" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Pending</option>
                          <option value="Processing" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Processing</option>
                          <option value="Out for Delivery" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Out for Delivery</option>
                          <option value="Completed" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Completed</option>
                          <option value="Cancelled" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Cancelled</option>
                        </select>
                      </td>

                      <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-deep)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Order Breakdown
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '700', color: 'var(--accent)', marginTop: '2px' }}>
                  {selectedOrder.orderId}
                </h3>
              </div>

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>DELIVERY ADDRESS & DISTRICT</p>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '3px 0 0' }}>
                  {selectedOrder.shippingAddress} {selectedOrder.district ? `(Degmada ${selectedOrder.district})` : ''}
                </p>
              </div>

              {selectedOrder.landmark && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>NEARBY LANDMARK</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '3px 0 0' }}>{selectedOrder.landmark}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>PRIMARY PHONE</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '3px 0 0' }}>{selectedOrder.paymentPhone}</p>
                </div>
                {selectedOrder.alternativePhone && (
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>ALT PHONE</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '3px 0 0' }}>{selectedOrder.alternativePhone}</p>
                  </div>
                )}
              </div>

              {/* Assigned Driver Box in Modal */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-deep)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
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
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', margin: 0 }}>SPECIAL NOTES</p>
                  <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--accent)', margin: '3px 0 0' }}>"{selectedOrder.notes}"</p>
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
    </div>
  );
}
