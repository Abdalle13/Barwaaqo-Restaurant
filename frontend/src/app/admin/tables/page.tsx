'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Table } from '@/types';
import { TableProperties, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [location, setLocation] = useState<'Main Hall' | 'Terrace' | 'VIP Room' | 'Window Side' | 'Outdoor Patio'>('Main Hall');
  const [status, setStatus] = useState<'Available' | 'Occupied' | 'Reserved'>('Available');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/tables');
      if (res.data.success) {
        setTables(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

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
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create table');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/tables/${id}`, { status: newStatus });
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTable = async (id: string, num: string) => {
    if (!confirm(`Delete table ${num}?`)) return;
    try {
      await api.delete(`/tables/${id}`);
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Dining Tables Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Configure restaurant floor seating, table capacities, and live occupancy status
        </p>
      </div>

      {/* Add New Table Form */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} color="var(--primary)" />
          <span>Add New Dining Table</span>
        </h3>

        <form onSubmit={handleCreateTable} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Table Code *</label>
            <input
              type="text"
              placeholder="e.g. T-07"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Capacity (Seats)</label>
            <input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Area / Location</label>
            <select
              value={location}
              onChange={(e: any) => setLocation(e.target.value)}
              className="form-select"
            >
              <option value="Main Hall">Main Hall</option>
              <option value="Terrace">Terrace</option>
              <option value="VIP Room">VIP Room</option>
              <option value="Window Side">Window Side</option>
              <option value="Outdoor Patio">Outdoor Patio</option>
            </select>
          </div>

          <div>
            <label className="form-label">Initial Status</label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="form-select"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
            <span>Add Table</span>
          </button>
        </form>
      </div>

      {/* Tables Grid View */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {isLoading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading tables...</p>
        ) : tables.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No tables configured.</p>
        ) : (
          tables.map((tbl) => (
            <div
              key={tbl._id}
              className="card"
              style={{
                borderTop: `4px solid ${
                  tbl.status === 'Available'
                    ? 'var(--success)'
                    : tbl.status === 'Occupied'
                    ? 'var(--danger)'
                    : 'var(--warning)'
                }`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{tbl.tableNumber}</h3>
                <span
                  className={`badge ${
                    tbl.status === 'Available'
                      ? 'badge-success'
                      : tbl.status === 'Occupied'
                      ? 'badge-danger'
                      : 'badge-warning'
                  }`}
                >
                  {tbl.status}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                <p>Location: <strong>{tbl.location}</strong></p>
                <p>Capacity: <strong>{tbl.capacity} Person(s)</strong></p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <select
                  value={tbl.status}
                  onChange={(e) => handleUpdateStatus(tbl._id, e.target.value)}
                  style={{
                    padding: '4px 6px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    fontSize: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>

                <button
                  onClick={() => handleDeleteTable(tbl._id, tbl.tableNumber)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
