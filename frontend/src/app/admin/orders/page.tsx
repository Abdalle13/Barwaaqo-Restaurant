'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Order } from '@/types';
import { ShoppingBag, Search, Filter, CheckCircle, RefreshCw, Eye, X } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Orders Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Monitor and update live order delivery states
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: '180px' }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button onClick={fetchOrders} className="btn btn-secondary btn-sm">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ backgroundColor: 'var(--bg-muted)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '14px 20px' }}>ORDER ID</th>
                <th style={{ padding: '14px 20px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 20px' }}>ITEMS</th>
                <th style={{ padding: '14px 20px' }}>TOTAL</th>
                <th style={{ padding: '14px 20px' }}>PAYMENT</th>
                <th style={{ padding: '14px 20px' }}>STATUS</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--primary)' }}>
                      {ord.orderId}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: '600' }}>
                        {typeof ord.user === 'object' ? ord.user.name : 'Guest'}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {ord.paymentPhone}
                      </p>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      {ord.items.length} items
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '800' }}>
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>
                        {ord.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          fontWeight: '600',
                          fontSize: '12px',
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
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Order Breakdown</span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>
                  {selectedOrder.orderId}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>DELIVERY ADDRESS</p>
                <p style={{ fontSize: '14px' }}>{selectedOrder.shippingAddress}</p>
              </div>

              <div>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>PHONE NUMBER</p>
                <p style={{ fontSize: '14px' }}>{selectedOrder.paymentPhone}</p>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>SPECIAL NOTES</p>
                  <p style={{ fontSize: '14px', fontStyle: 'italic' }}>"{selectedOrder.notes}"</p>
                </div>
              )}
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Items Ordered</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {selectedOrder.items.map((it: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>
                    {it.quantity}x {typeof it.food === 'object' ? it.food.name : it.name || 'Dish'}
                  </span>
                  <span style={{ fontWeight: '600' }}>${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: '800',
              }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
