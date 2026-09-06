'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Category } from '@/types';
import { ArrowLeft, Upload, Utensils, Image as ImageIcon } from 'lucide-react';

export default function NewDishPage() {
  const router = useRouter();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then((res) => {
      if (res.data.success) {
        setCategories(res.data.data);
        if (res.data.data.length > 0) setCategory(res.data.data[0]._id);
      }
    });
  }, []);

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

      const res = await api.post('/foods', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        router.push('/admin/menu');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
          <span>Back to Menu List</span>
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>
          Create New Food Item
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
              placeholder="e.g. Bariis Iskukaris with Hilib Ari"
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
              placeholder="Ingredients, cooking technique, side accompaniments..."
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
                placeholder="12.50"
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
                placeholder="0"
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
                id="isPopular"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="isPopular" style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Featured / Popular Dish
              </label>
            </div>
          </div>

          {/* Dish Image Upload & Direct URL Option */}
          <div
            style={{
              padding: '18px',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              marginBottom: '24px',
            }}
          >
            <label className="form-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={16} />
              <span>Upload Image File (via ImageKit)</span>
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
              Or provide direct image URL:
            </div>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
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
              {isSubmitting ? 'Saving Dish...' : 'Publish Food Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
