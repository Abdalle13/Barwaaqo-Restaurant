'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Utensils, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, tax, totalAmount, totalItems } = useCart();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: 'clamp(90px, 15vw, 120px) 0 60px' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Review & Order
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
                marginBottom: '8px',
              }}
            >
              Your Selections
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Confirm your dishes and proceed to our streamlined checkout.
            </p>
          </div>

          {items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '90px 24px',
                maxWidth: '520px',
                margin: '0 auto',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 165, 116, 0.1)',
                  border: '1px solid rgba(212, 165, 116, 0.25)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                }}
              >
                <ShoppingBag size={34} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                Your cart is empty
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
                Explore our signature Somali dishes and chef's creations to begin your dining experience.
              </p>
              <Link
                href="/menu"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-deep)',
                  fontWeight: '700',
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(212, 165, 116, 0.35)',
                  transition: 'all 0.25s',
                }}
              >
                <Utensils size={16} />
                <span>Explore The Menu</span>
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: '24px',
                alignItems: 'flex-start',
              }}
            >
              {/* Left: Cart Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>
                    Items in Cart ({totalItems})
                  </span>
                  <button
                    onClick={clearCart}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: '4px 8px',
                    }}
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.food._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '18px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      transition: 'border-color 0.25s ease',
                    }}
                  >
                    <img
                      src={item.food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                      alt={item.food.name}
                      style={{
                        width: 'clamp(60px, 10vw, 84px)',
                        height: 'clamp(60px, 10vw, 84px)',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        border: '1px solid var(--border)',
                      }}
                    />

                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          marginBottom: '4px',
                          color: 'var(--text-primary)',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.food.name}
                      </h4>
                      <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>

                    {/* Quantity Controller */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-deep)',
                        borderRadius: '10px',
                        padding: '4px 8px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                        aria-label="Decrease"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <Minus size={12} />
                      </button>

                      <span style={{ fontWeight: '700', fontSize: '13px', minWidth: '18px', textAlign: 'center', color: 'var(--text-primary)' }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                        aria-label="Increase"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--accent)',
                          color: 'var(--bg-deep)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <div style={{ fontWeight: '800', fontSize: '15px', minWidth: '64px', textAlign: 'right', color: 'var(--text-primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.food._id)}
                      aria-label="Remove item"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '6px',
                        transition: 'color 0.2s',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Right: Order Summary */}
              <div
                style={{
                  position: 'sticky',
                  top: '100px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  padding: '28px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '20px',
                  }}
                >
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <span>Delivery Fee</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${deliveryFee.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <span>Service Tax (5%)</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${tax.toFixed(2)}</span>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '18px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: 'var(--accent)', fontSize: '20px' }}>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-deep)',
                    fontWeight: '700',
                    fontSize: '15px',
                    textDecoration: 'none',
                    boxShadow: '0 6px 24px rgba(212, 165, 116, 0.35)',
                    transition: 'all 0.25s',
                  }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </Link>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '20px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <ShieldCheck size={16} color="var(--accent)" />
                  <span>Secure checkout & Instant EVC Plus confirmation</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
