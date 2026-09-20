'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FoodCard from '@/components/FoodCard';
import api from '@/lib/api';
import { Food, Category } from '@/types';
import { Search, Sparkles, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '120px 0 90px 0' }}>
        <div className="container">
          {/* Compact header */}
          <div style={{ marginBottom: '36px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              Our Menu
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Each recipe crafted with time-honored Somali cardamom, cloves, and freshly harvested spices.
            </p>
          </div>

          {/* Compact Search & Filter Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '36px',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                flexGrow: 1,
                minWidth: '220px',
              }}
            >
              <Search
                size={15}
                color="var(--text-secondary)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}
              />
              <input
                type="text"
                placeholder="e.g. Bariis, Suqaar, Sambusa"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '14px',
                  paddingTop: '9px',
                  paddingBottom: '9px',
                  fontSize: '13.5px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '2px',
                scrollbarWidth: 'none',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPage(1);
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedCategory === 'all' ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: selectedCategory === 'all' ? 'var(--accent)' : 'var(--bg-surface)',
                  color: selectedCategory === 'all' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                All
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
                      padding: '7px 16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--bg-deep)' : 'var(--text-secondary)',
                      fontWeight: '600',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
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
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '38px',
                  height: '38px',
                  border: '3px solid rgba(212, 165, 116, 0.15)',
                  borderTopColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '18px',
                }}
              />
              <p style={{ fontSize: '14px', letterSpacing: '0.5px' }}>Loading delicacies...</p>
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
                padding: '80px 20px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
              }}
            >
              <UtensilsCrossed size={48} color="var(--accent)" style={{ margin: '0 auto 16px auto', opacity: 0.6 }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
                No dishes found
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
                We couldn't locate any culinary selections matching your criteria. Try another category or clear your search keyword.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '28px',
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
                gap: '10px',
                marginTop: '60px',
              }}
            >
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: page === p ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: page === p ? 'var(--accent)' : 'var(--bg-surface)',
                    color: page === p ? 'var(--bg-deep)' : 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: page === p ? '0 4px 14px rgba(212, 165, 116, 0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
