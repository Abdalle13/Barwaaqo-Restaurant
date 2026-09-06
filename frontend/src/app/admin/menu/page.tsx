'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Food, Category } from '@/types';
import { Utensils, Plus, Edit, Trash2, Search, Star, Clock } from 'lucide-react';

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
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Menu Dishes CRUD</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Add, update, or remove dishes from the public restaurant menu
          </p>
        </div>

        <Link href="/admin/menu/new" className="btn btn-primary">
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
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search dish by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-select"
          style={{ width: '200px' }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Food Items Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ backgroundColor: 'var(--bg-muted)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '14px 20px' }}>DISH</th>
                <th style={{ padding: '14px 20px' }}>CATEGORY</th>
                <th style={{ padding: '14px 20px' }}>PRICE</th>
                <th style={{ padding: '14px 20px' }}>PREP TIME</th>
                <th style={{ padding: '14px 20px' }}>STATUS</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading menu dishes...
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No dishes found. Click "Add New Dish" to create one.
                  </td>
                </tr>
              ) : (
                foods.map((dish) => (
                  <tr key={dish._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                          alt={dish.name}
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <p style={{ fontWeight: '700' }}>{dish.name}</p>
                          {dish.isPopular && (
                            <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 6px' }}>
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                      {typeof dish.category === 'object' && dish.category ? dish.category.name : 'General'}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: '800' }}>
                      ${dish.price.toFixed(2)}
                      {dish.discount && dish.discount > 0 ? (
                        <span style={{ fontSize: '11px', color: 'var(--danger)', marginLeft: '4px' }}>
                          (-{dish.discount}%)
                        </span>
                      ) : null}
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                      {dish.preparationTime || 20} mins
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        className={`badge ${
                          dish.status === 'Available'
                            ? 'badge-success'
                            : dish.status === 'Low Stock'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {dish.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/menu/${dish._id}`} className="btn btn-secondary btn-sm">
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteFood(dish._id, dish.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
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
