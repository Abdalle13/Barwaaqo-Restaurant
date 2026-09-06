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
    }).catch((err) => {
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading dish editor...</div>;
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
          <span>Back to Menu List</span>
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>
          Edit Dish: {name}
        </h1>
      </div>

      <div className="card">
        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Dish Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Percentage (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="form-select"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
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
              >
                <option value="Available">Available</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Preparation Time (minutes)</label>
              <input
                type="number"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '26px' }}>
              <input
                type="checkbox"
                id="isPopularEdit"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="isPopularEdit" style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Featured / Popular Dish
              </label>
            </div>
          </div>

          {/* Current Image Preview & Upload Option */}
          <div
            style={{
              padding: '18px',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              marginBottom: '24px',
            }}
          >
            {imageUrl && (
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Current Dish Image:
                </span>
                <img
                  src={imageUrl}
                  alt={name}
                  style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            )}

            <label className="form-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
              style={{ marginBottom: '14px', fontSize: '13px' }}
            />

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Or update image URL:
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Link href="/admin/menu" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Updating...' : 'Save Dish Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
