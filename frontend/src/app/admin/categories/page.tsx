'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Category } from '@/types';
import {
  FolderTree, Plus, Edit2, Trash2, Check, X, Tag, Search, Utensils,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

const CATEGORY_COLORS = [
  { bg: 'rgba(212, 165, 116, 0.12)', border: 'rgba(212, 165, 116, 0.3)', icon: '#D4A574' },
  { bg: 'rgba(96, 165, 250, 0.12)',  border: 'rgba(96, 165, 250, 0.3)',  icon: '#60A5FA' },
  { bg: 'rgba(74, 222, 128, 0.12)',  border: 'rgba(74, 222, 128, 0.3)',  icon: '#4ADE80' },
  { bg: 'rgba(251, 191, 36, 0.12)',  border: 'rgba(251, 191, 36, 0.3)',  icon: '#FBBF24' },
  { bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.3)', icon: '#A78BFA' },
  { bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.3)', icon: '#F87171' },
  { bg: 'rgba(52, 211, 153, 0.12)',  border: 'rgba(52, 211, 153, 0.3)',  icon: '#34D399' },
  { bg: 'rgba(251, 146, 60, 0.12)',  border: 'rgba(251, 146, 60, 0.3)',  icon: '#FB923C' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { showToast, ToastComponent } = useToast();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await api.post('/categories', { name: newCatName.trim() });
      if (res.data.success) {
        setNewCatName('');
        fetchCategories();
        showToast(`Category "${newCatName.trim()}" created`, 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create category', 'error');
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
      showToast('Category updated', 'success');
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update', 'error');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      showToast(`Category "${deleteTarget.name}" deleted`, 'success');
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Menu Setup
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '5px' }}>
            Categories
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Keep your menu organized with clear, reusable sections.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '8px', padding: '12px 16px',
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '12px', color: 'var(--text-secondary)',
        }}>
          <span style={{ fontSize: '24px', lineHeight: 1, fontWeight: '800', color: 'var(--text-primary)' }}>{categories.length}</span>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>total categories</span>
        </div>
      </div>

      {/* Add + Search Row */}
      <div style={{
        display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap',
        padding: '16px 18px', backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)', borderRadius: '14px',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="e.g. Grills, Drinks, Seafood"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px',
              border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
              color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
            }}
          />
        </div>

        {/* Add Form */}
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', flex: '1 1 320px' }}>
          <input
            type="text"
            placeholder="e.g. Traditional Somali"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            required
            style={{
              flex: 1,
              padding: '10px 14px', borderRadius: '10px',
              border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
              color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
              minWidth: '150px',
            }}
          />
          <button
            type="submit"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px', backgroundColor: 'var(--accent)',
              color: 'var(--bg-deep)', fontWeight: '700', fontSize: '14px',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(212,165,116,0.3)', transition: 'all 0.2s',
            }}
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: '64px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px', border: '1px solid var(--border)', color: 'var(--text-secondary)',
        }}>
          <Utensils size={44} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>
            {searchQuery ? 'No categories match your search' : 'No categories yet'}
          </p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            {searchQuery ? 'Try a different keyword' : 'Add your first category above to get started'}
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.8px' }}>
                <tr>
                  <th style={{ padding: '12px 18px', fontWeight: '700' }}>CATEGORY NAME</th>
                  <th style={{ padding: '12px 18px', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
          {filtered.map((cat, idx) => {
            const col = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            const isEditing = editingId === cat._id;
            return (
              <tr
                key={cat._id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: isEditing ? 'var(--accent-muted)' : 'var(--bg-surface)',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9px', backgroundColor: col.bg, border: `1px solid ${col.border}`, color: col.icon }}>
                    <FolderTree size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(cat._id); if (e.key === 'Escape') setEditingId(null); }}
                        style={{
                          width: '100%', padding: '7px 10px', borderRadius: '8px',
                          border: '1px solid var(--accent)', backgroundColor: 'var(--bg-elevated)',
                          color: 'var(--text-primary)', fontSize: '14px', fontWeight: '700', outline: 'none',
                        }}
                      />
                    ) : (
                      <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cat.name}
                      </p>
                    )}
                  </div>
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(cat._id)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          padding: '7px 12px', borderRadius: '9px', backgroundColor: 'var(--accent)',
                          color: 'var(--bg-deep)', border: 'none', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer',
                        }}
                      >
                        <Check size={14} /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '7px 12px', borderRadius: '9px', backgroundColor: 'var(--bg-elevated)',
                          color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(cat)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          padding: '7px 12px', borderRadius: '9px', backgroundColor: 'var(--bg-elevated)',
                          color: 'var(--text-secondary)', border: '1px solid var(--border)',
                          fontWeight: '600', fontSize: '12.5px', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: cat._id, name: cat.name })}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '7px 10px', borderRadius: '9px',
                          backgroundColor: 'rgba(248,113,113,0.08)', color: '#F87171',
                          border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                  </div>
                </td>
              </tr>
            );
          })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Category"
          message={`Delete category "${deleteTarget.name}"? All menu items in this category will lose their category assignment.`}
          confirmLabel="Delete Category"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {ToastComponent}
    </div>
  );
}
