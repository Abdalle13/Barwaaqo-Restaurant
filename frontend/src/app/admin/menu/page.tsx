'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Food, Category } from '@/types';
import { Utensils, Plus, Edit, Trash2, Search, Sparkles } from 'lucide-react';

export default function AdminMenuPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      let url = '/foods?limit=100';
      if (selectedCategory !== 'all') url += `&category=${selectedCategory}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const [foodRes, catRes] = await Promise.all([
        api.get(url),
        api.get('/categories'),
      ]);

      if (foodRes.data.success) setFoods(foodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, search]);

  const handleDeleteFood = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the menu?`)) return;

    try {
      await api.delete(`/foods/${id}`);
      fetchMenu();
    } catch (err) {
      alert('Failed to delete dish');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Menu Dishes Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Add, update, or curate dishes available on the guest-facing menu
          </p>
        </div>

        <Link
          href="/admin/menu/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            backgroundColor: 'var(--accent)',
            color: 'var(--bg-deep)',
            fontWeight: '700',
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(212, 165, 116, 0.3)',
          }}
        >
          <Plus size={18} />
          <span>Add New Dish</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: '16px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--accent)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }} />
          <input
            type="text"
            placeholder="e.g. Bariis, Suqaar, Sambusa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '42px',
              backgroundColor: 'var(--bg-deep)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              borderRadius: '10px',
            }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-select"
          style={{
            width: '200px',
            backgroundColor: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            borderRadius: '10px',
          }}
        >
          <option value="all" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Food Items Table */}
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
                <th style={{ padding: '16px 20px' }}>DISH</th>
                <th style={{ padding: '16px 20px' }}>CATEGORY</th>
                <th style={{ padding: '16px 20px' }}>PRICE</th>
                <th style={{ padding: '16px 20px' }}>PREP TIME</th>
                <th style={{ padding: '16px 20px' }}>STATUS</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    Loading menu dishes...
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    No dishes found. Click "Add New Dish" to create one.
                  </td>
                </tr>
              ) : (
                foods.map((dish) => (
                  <tr key={dish._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                          alt={dish.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                            border: '1px solid var(--border)',
                          }}
                        />
                        <div>
                          <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{dish.name}</p>
                          {dish.isPopular && (
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontSize: '10px',
                                fontWeight: '700',
                                backgroundColor: 'rgba(212, 165, 116, 0.15)',
                                color: 'var(--accent)',
                                marginTop: '3px',
                              }}
                            >
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      {typeof dish.category === 'object' && dish.category ? dish.category.name : 'General'}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      ${dish.price.toFixed(2)}
                      {dish.discount && dish.discount > 0 ? (
                        <span style={{ fontSize: '11px', color: 'var(--danger)', marginLeft: '6px' }}>
                          (-{dish.discount}%)
                        </span>
                      ) : null}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      {dish.preparationTime || 20} mins
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          backgroundColor:
                            dish.status === 'Available'
                              ? 'rgba(74, 222, 128, 0.12)'
                              : dish.status === 'Low Stock'
                              ? 'rgba(251, 191, 36, 0.12)'
                              : 'rgba(248, 113, 113, 0.12)',
                          color:
                            dish.status === 'Available'
                              ? '#4ADE80'
                              : dish.status === 'Low Stock'
                              ? '#FBBF24'
                              : '#F87171',
                          border: `1px solid ${
                            dish.status === 'Available'
                              ? 'rgba(74, 222, 128, 0.3)'
                              : dish.status === 'Low Stock'
                              ? 'rgba(251, 191, 36, 0.3)'
                              : 'rgba(248, 113, 113, 0.3)'
                          }`,
                        }}
                      >
                        {dish.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/admin/menu/${dish._id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-deep)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteFood(dish._id, dish.name)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-deep)',
                            border: '1px solid rgba(248, 113, 113, 0.25)',
                            color: 'var(--danger)',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
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
