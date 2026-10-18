'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Category } from '@/types';
import { ArrowLeft, Upload } from 'lucide-react';

export default function EditDishPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Available');
  const [preparationTime, setPreparationTime] = useState('20');
  const [isPopular, setIsPopular] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    Promise.all([
      api.get('/categories'),
      api.get(`/foods/${id}`),
    ]).then(([catRes, foodRes]) => {
      if (catRes.data.success) setCategories(catRes.data.data);
      if (foodRes.data.success) {
        const food = foodRes.data.data;
        setName(food.name || '');
        setDescription(food.description || '');
        setPrice(food.price?.toString() || '');
        setDiscount(food.discount?.toString() || '0');
        setCategory(typeof food.category === 'object' ? food.category._id : food.category);
        setStatus(food.status || 'Available');
        setPreparationTime(food.preparationTime?.toString() || '20');
        setIsPopular(food.isPopular || false);
        setImageUrl(food.image || '');
      }
    }).catch(() => {
      setError('Failed to load dish details');
    }).finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('discount', discount);
      formData.append('category', category);
      formData.append('status', status);
      formData.append('preparationTime', preparationTime);
      formData.append('isPopular', isPopular.toString());

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      const res = await api.put(`/foods/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        router.push('/admin/menu');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading dish editor...</div>;
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <Link
          href="/admin/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: '600',
            marginBottom: '10px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Menu List</span>
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
          Edit Dish: {name}
        </h1>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {error && (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(248, 113, 113, 0.12)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              color: 'var(--danger)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Dish Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              style={{
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              style={{
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div className="form-group">
              <label className="form-label">Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="form-input"
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Percentage (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="form-input"
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="form-select"
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="Available" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Available</option>
                <option value="Low Stock" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Low Stock</option>
                <option value="Out of Stock" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
            <div className="form-group">
              <label className="form-label">Preparation Time (minutes)</label>
              <input
                type="number"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="form-input"
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '28px' }}>
              <input
                type="checkbox"
                id="isPopularEdit"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
              />
              <label htmlFor="isPopularEdit" style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: 'var(--text-primary)' }}>
                Featured / Signature Dish
              </label>
            </div>
          </div>

          {/* Current Image Preview & Upload Option */}
          <div
            style={{
              padding: '22px',
              border: '1px dashed var(--border)',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-deep)',
              marginBottom: '28px',
            }}
          >
            {imageUrl && (
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Current Dish Image:
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={name}
                  style={{ width: '130px', height: '88px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border)' }}
                />
              </div>
            )}

            <label className="form-label" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
              <Upload size={16} />
              <span>Replace Image File</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}
            />

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Or update image URL:
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="form-input"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
            <Link
              href="/admin/menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 22px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 26px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-deep)',
                fontWeight: '700',
                fontSize: '14px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(212, 165, 116, 0.35)',
              }}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Dish Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
