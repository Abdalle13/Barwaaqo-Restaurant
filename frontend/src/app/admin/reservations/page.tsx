'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Reservation, Table } from '@/types';
import { CalendarCheck, Clock, Users, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';

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
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Table Reservations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Review, confirm, and assign tables for customer dining bookings
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select"
          style={{ width: '180px' }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ backgroundColor: 'var(--bg-muted)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '14px 20px' }}>GUEST NAME</th>
                <th style={{ padding: '14px 20px' }}>DATE & TIME</th>
                <th style={{ padding: '14px 20px' }}>GUESTS</th>
                <th style={{ padding: '14px 20px' }}>ASSIGNED TABLE</th>
                <th style={{ padding: '14px 20px' }}>STATUS</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading reservations...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No bookings match your filter.
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: '700' }}>{res.customerName}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{res.customerPhone}</p>
                      {res.specialRequests && (
                        <p style={{ fontSize: '11px', color: 'var(--primary)', fontStyle: 'italic', marginTop: '2px' }}>
                          "{res.specialRequests}"
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: '600' }}>
                        {new Date(res.reservationDate).toLocaleDateString()}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{res.reservationTime}</p>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '700' }}>
                      {res.guests} people
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        value={res.table?._id || ''}
                        onChange={(e) => handleUpdateStatus(res._id, res.status, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                        }}
                      >
                        <option value="">Unassigned</option>
                        {tables.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.tableNumber} ({t.location})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        className={`badge ${
                          res.status === 'Confirmed'
                            ? 'badge-success'
                            : res.status === 'Cancelled'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {res.status !== 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'Confirmed')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                          >
                            Confirm
                          </button>
                        )}
                        {res.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'Cancelled')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)', padding: '4px 10px', fontSize: '12px' }}
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
