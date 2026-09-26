'use client';

import React, { useState } from 'react';
import { Food } from '@/types';
import { useCart } from '@/context/CartContext';
import FoodDetailModal from '@/components/FoodDetailModal';
import { Star, Clock, Plus, Minus, ShoppingBag } from 'lucide-react';

interface FoodCardProps {
  food: Food;
}

export default function FoodCard({ food }: FoodCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const cartItem = items.find((item) => item.food._id === food._id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const hasDiscount = Boolean(food.discount && food.discount > 0);
  const effectivePrice = hasDiscount
    ? Math.round(food.price * (1 - (food.discount || 0) / 100) * 100) / 100
    : food.price;

  const categoryName =
    typeof food.category === 'object' && food.category !== null
      ? food.category.name
      : typeof food.category === 'string'
      ? food.category
      : 'Signature Dish';

  const isAvailable = food.status !== 'Out of Stock';

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-border)';
          e.currentTarget.style.boxShadow = '0 12px 30px -10px rgba(0, 0, 0, 0.25), 0 0 1px var(--accent-border)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Dish Image Container */}
        <div
          style={{
            width: '100%',
            height: 'clamp(160px, 30vw, 210px)',
            position: 'relative',
            backgroundColor: 'var(--bg-elevated)',
            overflow: 'hidden',
          }}
        >
          <img
            src={
              food.image ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
            }
            alt={food.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
            }}
          />

          {/* Badges Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              gap: '6px',
              zIndex: 2,
            }}
          >
            {hasDiscount && (
              <span
                style={{
                  backgroundColor: 'var(--danger)',
                  color: '#ffffff',
                  padding: '4px 9px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.3px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                -{food.discount}%
              </span>
            )}
            {food.isPopular && (
              <span
                style={{
                  backgroundColor: 'rgba(212, 165, 116, 0.95)',
                  color: 'var(--bg-deep)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.3px',
                  backdropFilter: 'blur(4px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Star size={11} fill="var(--bg-deep)" color="var(--bg-deep)" />
                <span>Popular</span>
              </span>
            )}
          </div>

          {/* Preparation Time Badge */}
          {Boolean(food.preparationTime) && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#ffffff',
                padding: '4px 9px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Clock size={11} color="var(--accent)" />
              <span>{food.preparationTime} min</span>
            </div>
          )}
        </div>

        {/* Card Content Area */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Category & Rating Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              {categoryName}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={13} fill="#FBBF24" color="#FBBF24" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {food.rating || 5.0}
              </span>
            </div>
          </div>

          {/* Dish Title */}
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '16.5px',
              fontWeight: '700',
              marginBottom: '6px',
              lineHeight: '1.3',
              color: 'var(--text-primary)',
            }}
          >
            {food.name}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
              marginBottom: '16px',
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {food.description || 'Prepared fresh with premium ingredients and traditional spices.'}
          </p>

          {/* Pricing & Cart Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '14px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {/* Price */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  ${effectivePrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      textDecoration: 'line-through',
                    }}
                  >
                    ${food.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Cart Quantity Controller or Add Button */}
            {!isAvailable ? (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--danger)',
                  backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(248, 113, 113, 0.2)',
                }}
              >
                Sold Out
              </span>
            ) : currentQuantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-elevated)',
                  borderRadius: '10px',
                  padding: '3px 6px',
                  border: '1px solid var(--border-hover)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(food._id, currentQuantity - 1);
                  }}
                  aria-label="Decrease quantity"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <Minus size={13} />
                </button>

                <span style={{ fontWeight: '800', fontSize: '14px', minWidth: '20px', textAlign: 'center', color: 'var(--accent)' }}>
                  {currentQuantity}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(food, 1);
                  }}
                  aria-label="Increase quantity"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <Plus size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(food, 1);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: 'var(--accent-muted)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--bg-deep)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent-muted)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
              >
                <ShoppingBag size={14} />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <FoodDetailModal
        food={food}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}
