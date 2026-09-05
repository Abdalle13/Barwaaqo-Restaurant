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

  const hasDiscount = food.discount && food.discount > 0;
  const effectivePrice = hasDiscount
    ? Math.round(food.price * (1 - (food.discount || 0) / 100) * 100) / 100
    : food.price;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dish Image Container */}
      <div
        style={{
          width: '100%',
          height: '210px',
          position: 'relative',
          backgroundColor: 'var(--bg-muted)',
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
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
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
            <span className="badge badge-danger">
              -{food.discount}% OFF
            </span>
          )}
          {food.isPopular && (
            <span className="badge badge-primary">
              Popular
            </span>
          )}
        </div>

        {/* Prep Time Badge */}
        {food.preparationTime && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Clock size={12} />
            <span>{food.preparationTime} mins</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {typeof food.category === 'object' && food.category ? food.category.name : 'Delicious'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {food.rating || 5.0}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              ({food.numReviews || 1})
            </span>
          </div>
        </div>

        {/* Dish Title */}
        <h3
          style={{
            fontSize: '17px',
            fontWeight: '700',
            marginBottom: '8px',
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
          {food.description || 'Prepared fresh with high quality ingredients and traditional spices.'}
        </p>

        {/* Pricing & Add to Cart Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                ${effectivePrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span
                  style={{
                    fontSize: '14px',
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
                gap: '8px',
                background: 'var(--bg-muted)',
                borderRadius: '8px',
                padding: '4px 8px',
                border: '1px solid var(--border)',
              }}
            >
              <button
                onClick={() => updateQuantity(food._id, currentQuantity - 1)}
                aria-label="Decrease quantity"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Minus size={14} />
              </button>

              <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '18px', textAlign: 'center' }}>
                {currentQuantity}
              </span>

              <button
                onClick={() => addToCart(food, 1)}
                aria-label="Increase quantity"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(food, 1)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ShoppingBag size={15} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
