'use client';

import React, { useState, useEffect } from 'react';
import { Food } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  X,
  Star,
  Clock,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Check,
} from 'lucide-react';

interface FoodDetailModalProps {
  food: Food | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FoodDetailModal({ food, isOpen, onClose }: FoodDetailModalProps) {
  const { items, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedProtein, setSelectedProtein] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Check if item is already in cart
  const cartItem = food ? items.find((item) => item.food._id === food._id) : null;
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  // Reset quantity when modal opens with new food
  useEffect(() => {
    if (isOpen && food) {
      setQuantity(1);
      setSelectedProtein('');
      setSelectedAddons([]);
      setSpecialInstructions('');
      setAddedAnimation(false);
    }
  }, [isOpen, food]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !food) return null;

  const hasDiscount = Boolean(food.discount && food.discount > 0);
  const baseEffectivePrice = hasDiscount
    ? Math.round(food.price * (1 - (food.discount || 0) / 100) * 100) / 100
    : food.price;

  // Additional price from add-ons
  const addonsExtraPrice = (selectedAddons.includes('Moos (Fresh Banana)') ? 0.5 : 0) +
    (selectedAddons.includes('Shaah Caddeys (Somali Spiced Tea)') ? 1.0 : 0);

  const effectivePrice = baseEffectivePrice + addonsExtraPrice;
  const totalPrice = (effectivePrice * quantity).toFixed(2);

  const categoryName =
    typeof food.category === 'object' && food.category !== null
      ? food.category.name
      : typeof food.category === 'string'
      ? food.category
      : 'Signature Dish';

  const isAvailable = food.status !== 'Out of Stock';

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(food, quantity, {
      selectedProtein: selectedProtein || undefined,
      selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  const handleIncrement = () => setQuantity((q) => Math.min(q + 1, 20));
  const handleDecrement = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <div
      onClick={onClose}
      className="food-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="food-modal-dialog"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92dvh',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px 24px 0 0',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Image Banner with Badges & Close Button */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(160px, 30vw, 250px)',
            backgroundColor: 'var(--bg-elevated)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img
            src={
              food.image ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80'
            }
            alt={food.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--bg-surface) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.6) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={18} />
          </button>

          {/* Badges Inside Image */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 5,
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontWeight: '700',
                  fontSize: '11.5px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                {categoryName}
              </span>

              {food.isPopular && (
                <span
                  style={{
                    backgroundColor: 'rgba(212, 165, 116, 0.95)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <Star size={12} fill="var(--bg-deep)" color="var(--bg-deep)" />
                  <span>Popular</span>
                </span>
              )}

              {hasDiscount && (
                <span
                  style={{
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '11.5px',
                    padding: '5px 10px',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  -{food.discount}% OFF
                </span>
              )}
            </div>

            {/* Preparation Time */}
            {Boolean(food.preparationTime) && (
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Clock size={13} color="var(--accent)" />
                <span>{food.preparationTime} mins</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Details */}
        <div
          style={{
            padding: '22px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Header Row: Title & Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  lineHeight: '1.2',
                  marginBottom: '6px',
                }}
              >
                {food.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={15} fill="#FBBF24" color="#FBBF24" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {food.rating || 5.0}
                  </span>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    ({food.numReviews || 24} reviews)
                  </span>
                </div>

                <span style={{ color: 'var(--border)' }}>•</span>

                {/* Stock Status */}
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color:
                      food.status === 'Out of Stock'
                        ? 'var(--danger)'
                        : food.status === 'Low Stock'
                        ? '#F59E0B'
                        : '#4ADE80',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor:
                        food.status === 'Out of Stock'
                          ? 'var(--danger)'
                          : food.status === 'Low Stock'
                          ? '#F59E0B'
                          : '#4ADE80',
                    }}
                  />
                  {food.status || 'Available'}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', justifyContent: 'flex-end' }}>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
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
              {hasDiscount && (
                <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: '700' }}>
                  Save ${(food.price - effectivePrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div
            style={{
              backgroundColor: 'var(--bg-deep)',
              borderRadius: '16px',
              padding: '14px 16px',
              border: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: 'var(--accent)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              About This Dish
            </span>
            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              {food.description ||
                'Carefully prepared using the finest traditional ingredients, authentic aromatic spices, and fresh herbs to deliver an unforgettable dining experience.'}
            </p>
          </div>

          {/* Dish Customization: Protein Selection */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-deep)',
              borderRadius: '14px',
              border: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: 'var(--accent)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Select Protein / Nooca Hilibka
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
              {[
                { id: '', label: 'Default / Standard' },
                { id: 'Hilib Ari (Goat Meat)', label: 'Hilib Ari (Goat)' },
                { id: 'Hilib Geel (Camel Meat)', label: 'Hilib Geel (Camel)' },
                { id: 'Digaag (Chicken)', label: 'Digaag (Chicken)' },
                { id: 'Kalluun (Fresh Fish)', label: 'Kalluun (Fish)' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProtein(p.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '9px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: selectedProtein === p.id ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                    backgroundColor: selectedProtein === p.id ? 'rgba(212, 165, 116, 0.15)' : 'var(--bg-surface)',
                    color: selectedProtein === p.id ? 'var(--accent)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dish Customization: Somali Extras & Add-ons */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-deep)',
              borderRadius: '14px',
              border: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: 'var(--accent)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Somali Extras & Sides / Kordhin
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Moos (Fresh Banana)', price: '+$0.50' },
                { name: 'Basbaas Shigni Dheeraad ah (Extra Chili)', price: 'Free' },
                { name: 'Maraq Dheeraad ah (Extra Broth)', price: 'Free' },
                { name: 'Shaah Caddeys (Somali Spiced Tea)', price: '+$1.00' },
              ].map((addon) => {
                const isSelected = selectedAddons.includes(addon.name);
                return (
                  <button
                    key={addon.name}
                    type="button"
                    onClick={() => toggleAddon(addon.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #4ADE80' : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'rgba(74, 222, 128, 0.08)' : 'var(--bg-surface)',
                      color: isSelected ? '#4ADE80' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      fontWeight: '600',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: isSelected ? '1.5px solid #4ADE80' : '1px solid var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          backgroundColor: isSelected ? '#4ADE80' : 'transparent',
                          color: '#000000',
                          fontWeight: '900',
                        }}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      <span>{addon.name}</span>
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: isSelected ? '#4ADE80' : 'var(--accent)' }}>
                      {addon.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Cooking Instructions */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-deep)',
              borderRadius: '14px',
              border: '1px solid var(--border)',
            }}
          >
            <label
              style={{
                fontSize: '11.5px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: 'var(--accent)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Special Cooking Instructions / Codsi Gaar ah
            </label>
            <input
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. No onions, less oil, extra crispy..."
              className="form-input"
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                padding: '8px 12px',
              }}
            />
          </div>

          {/* Current In-Cart Status Banner */}
          {inCartQuantity > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                backgroundColor: 'rgba(212, 165, 116, 0.1)',
                border: '1px solid var(--accent-border)',
                borderRadius: '12px',
                fontSize: '13px',
                color: 'var(--accent)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                <Sparkles size={15} />
                <span>You have <strong>{inCartQuantity}</strong> in your cart</span>
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>
                ${(effectivePrice * inCartQuantity).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Action Footer with Quantity Selector & Add Button */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          {/* Quantity Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-deep)',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              padding: '3px',
              gap: '2px',
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1 || !isAvailable}
              aria-label="Decrease quantity"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: quantity > 1 ? 'var(--bg-surface)' : 'transparent',
                color: quantity > 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: quantity > 1 && isAvailable ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
              }}
            >
              <Minus size={14} />
            </button>

            <span
              style={{
                minWidth: '24px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '13.5px',
                color: 'var(--text-primary)',
              }}
            >
              {quantity}
            </span>

            <button
              onClick={handleIncrement}
              disabled={!isAvailable}
              aria-label="Increase quantity"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
              }}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart CTA Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || addedAnimation}
            style={{
              flex: '1 1 0%',
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: addedAnimation ? '#4ADE80' : isAvailable ? 'var(--accent)' : 'var(--bg-elevated)',
              color: addedAnimation ? '#000000' : isAvailable ? 'var(--bg-deep)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: isAvailable && !addedAnimation ? 'pointer' : 'not-allowed',
              boxShadow: isAvailable && !addedAnimation ? '0 4px 16px rgba(212, 165, 116, 0.3)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: addedAnimation ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {addedAnimation ? (
              <>
                <Check size={15} style={{ flexShrink: 0 }} />
                <span>Added!</span>
              </>
            ) : !isAvailable ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag size={15} style={{ flexShrink: 0 }} />
                <span>Add to Cart • ${totalPrice}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
