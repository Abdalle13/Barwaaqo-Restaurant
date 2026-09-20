'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Reservation, Table } from '@/types';
import { CalendarCheck, Clock, Users, Phone, Mail } from 'lucide-react';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter ? `/reservations?status=${statusFilter}` : '/reservations';
      const [resRes, tblRes] = await Promise.all([
        api.get(url),
        api.get('/tables'),
      ]);

      if (resRes.data.success) setReservations(resRes.data.data);
      if (tblRes.data.success) setTables(tblRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string, tableId?: string) => {
    try {
      await api.put(`/reservations/${id}/status`, {
        status: newStatus,
        table: tableId || undefined,
      });
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Table Reservations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Review, confirm, and assign tables for customer dining bookings
          </p>
        </div>

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
          <option value="Confirmed" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Confirmed</option>
          <option value="Completed" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Completed</option>
          <option value="Cancelled" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Cancelled</option>
        </select>
      </div>

      {/* Reservations Table */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ backgroundColor: 'var(--bg-deep)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '12px' }}>
                <th style={{ padding: '16px 20px' }}>GUEST NAME</th>
                <th style={{ padding: '16px 20px' }}>DATE & TIME</th>
                <th style={{ padding: '16px 20px' }}>GUESTS</th>
                <th style={{ padding: '16px 20px' }}>ASSIGNED TABLE</th>
                <th style={{ padding: '16px 20px' }}>STATUS</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    Loading reservations...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    No bookings match your filter.
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{res.customerName}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{res.customerPhone}</p>
                      {res.specialRequests && (
                        <p style={{ fontSize: '11px', color: 'var(--accent)', fontStyle: 'italic', marginTop: '3px' }}>
                          "{res.specialRequests}"
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {new Date(res.reservationDate).toLocaleDateString()}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{res.reservationTime}</p>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {res.guests} people
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        value={res.table?._id || ''}
                        onChange={(e) => handleUpdateStatus(res._id, res.status, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--bg-deep)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                        }}
                      >
                        <option value="" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Unassigned</option>
                        {tables.map((t) => (
                          <option key={t._id} value={t._id} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                            {t.tableNumber} ({t.location})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          backgroundColor:
                            res.status === 'Confirmed'
                              ? 'rgba(74, 222, 128, 0.12)'
                              : res.status === 'Cancelled'
                              ? 'rgba(248, 113, 113, 0.12)'
                              : 'rgba(251, 191, 36, 0.12)',
                          color:
                            res.status === 'Confirmed'
                              ? '#4ADE80'
                              : res.status === 'Cancelled'
                              ? '#F87171'
                              : '#FBBF24',
                          border: `1px solid ${
                            res.status === 'Confirmed'
                              ? 'rgba(74, 222, 128, 0.3)'
                              : res.status === 'Cancelled'
                              ? 'rgba(248, 113, 113, 0.3)'
                              : 'rgba(251, 191, 36, 0.3)'
                          }`,
                        }}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {res.status !== 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'Confirmed')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              backgroundColor: 'var(--accent)',
                              color: 'var(--bg-deep)',
                              fontSize: '12px',
                              fontWeight: '700',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            Confirm
                          </button>
                        )}
                        {res.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'Cancelled')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              backgroundColor: 'var(--bg-deep)',
                              border: '1px solid rgba(248, 113, 113, 0.25)',
                              color: 'var(--danger)',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
