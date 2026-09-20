'use client';

import React from 'react';
import { Food } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, Clock, Plus, Minus, ShoppingBag } from 'lucide-react';

interface FoodCardProps {
  food: Food;
}

export default function FoodCard({ food }: FoodCardProps) {
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.food._id === food._id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const hasDiscount = Boolean(food.discount && food.discount > 0);
  const effectivePrice = hasDiscount
    ? Math.round(food.price * (1 - (food.discount || 0) / 100) * 100) / 100
    : food.price;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.25)';
        e.currentTarget.style.boxShadow = '0 8px 30px -8px rgba(212, 165, 116, 0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Dish Image Container */}
      <div
        style={{
          width: '100%',
          height: '220px',
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
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
          }}
        />

        {/* Dark gradient overlay at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(to top, var(--bg-surface) 0%, transparent 100%)',
            pointerEvents: 'none',
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
                background: 'var(--danger)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.3px',
              }}
            >
              -{food.discount}%
            </span>
          )}
          {food.isPopular && (
            <span
              style={{
                background: 'rgba(212, 165, 116, 0.9)',
                color: 'var(--text-inverse)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.3px',
                backdropFilter: 'blur(4px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Star size={11} fill="var(--text-inverse)" color="var(--text-inverse)" />
              <span>Popular</span>
            </span>
          )}
        </div>

        {/* Prep Time Badge */}
        {Boolean(food.preparationTime) && (
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              right: '12px',
              backgroundColor: 'var(--bg-glass)',
              color: 'var(--text-primary)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Clock size={11} />
            <span>{food.preparationTime} min</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Category & Rating */}
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
              letterSpacing: '1px',
            }}
          >
            {typeof food.category === 'object' && food.category ? food.category.name : 'Signature'}
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
            fontSize: '16px',
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

        {/* Pricing & Add to Cart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '14px',
            borderTop: '1px solid var(--border)',
          }}
        >
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

          {/* Cart Quantity Controller */}
          {currentQuantity > 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-elevated)',
                borderRadius: '8px',
                padding: '3px 6px',
                border: '1px solid var(--border-hover)',
              }}
            >
              <button
                onClick={() => updateQuantity(food._id, currentQuantity - 1)}
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

              <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '20px', textAlign: 'center', color: 'var(--accent)' }}>
                {currentQuantity}
              </span>

              <button
                onClick={() => addToCart(food, 1)}
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
              onClick={() => addToCart(food, 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.color = 'var(--bg-deep)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
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
  );
}
