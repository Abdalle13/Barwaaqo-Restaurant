'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FoodCard from '@/components/FoodCard';
import api from '@/lib/api';
import { Food, Category } from '@/types';
import { Search, Filter, Sparkles, UtensilsCrossed } from 'lucide-react';

export default function MenuPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.log('Error fetching categories:', err));
  }, []);

  // Fetch Foods with Debounce / Query
  useEffect(() => {
    setIsLoading(true);
    let url = `/foods?page=${page}&limit=9`;
    if (selectedCategory && selectedCategory !== 'all') {
      url += `&category=${selectedCategory}`;
    }
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    api.get(url)
      .then((res) => {
        if (res.data.success) {
          setFoods(res.data.data);
          setTotalPages(res.data.pagination?.pages || 1);
        }
      })
      .catch((err) => console.log('Error fetching foods:', err))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, searchQuery, page]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '40px 0 80px 0' }}>
        <div className="container">
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={14} />
              <span>Finest Somali & Continental Cuisine</span>
            </div>
            <h1 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '10px' }}>
              Our Delicious Menu
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto', fontSize: '15px' }}>
              From aromatic slow-cooked Bariis to sizzling grilled meat and freshly squeezed tropical juices.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '40px',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by dish name, spices, ingredients..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="form-input"
                style={{ paddingLeft: '46px', fontSize: '15px' }}
              />
            </div>

            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
              }}
            >
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPage(1);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === 'all' ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: selectedCategory === 'all' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: selectedCategory === 'all' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                All Categories
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat._id;
                return (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategory(cat._id);
                      setPage(1);
                    }}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dishes Grid */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '36px',
                  height: '36px',
                  border: '3px solid var(--border)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '16px',
                }}
              />
              <p>Fetching menu items...</p>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : foods.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '70px 20px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
              }}
            >
              <UtensilsCrossed size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                No dishes found
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                We couldn't find any meal matching your search criteria. Try selecting another category or clear your search query.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '50px',
              }}
            >
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: page === p ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: page === p ? 'var(--primary)' : 'var(--bg-surface)',
                    color: page === p ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
