'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Category } from '@/types';
import { FolderTree, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setError('');

    try {
      const res = await api.post('/categories', { name: newCatName.trim() });
      if (res.data.success) {
        setNewCatName('');
        fetchCategories();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      await api.put(`/categories/${id}`, { name: editingName.trim() });
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Menu Categories</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Create and organize menu food sections (Traditional Somali, Drinks, Grill...)
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          {error}
        </div>
      )}

      {/* Add New Category Box */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} color="var(--primary)" />
          <span>Add New Category</span>
        </h3>

        <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="e.g. Seafood & Soups"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="form-input"
            required
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <span>Create</span>
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ backgroundColor: 'var(--bg-muted)' }}>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px' }}>
              <th style={{ padding: '14px 20px' }}>CATEGORY NAME</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No categories created yet.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    {editingId === cat._id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="form-input"
                        style={{ maxWidth: '300px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: '700' }}>{cat.name}</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {editingId === cat._id ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleSaveEdit(cat._id)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
