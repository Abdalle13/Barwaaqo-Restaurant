'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Utensils } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, tax, totalAmount, totalItems } = useCart();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '50px 0 90px 0' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
              Your Shopping Cart
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              Review your selected dishes before proceeding to checkout.
            </p>
          </div>

          {items.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                Your cart is empty
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Looks like you haven't added any appetizing meals to your cart yet.
              </p>
              <Link href="/menu" className="btn btn-primary" style={{ margin: '0 auto' }}>
                <Utensils size={16} />
                <span>Browse Menu</span>
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
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
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>
                    Items ({totalItems})
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
                    }}
                  >
                    Clear Cart
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.food._id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                    }}
                  >
                    <img
                      src={item.food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                      alt={item.food.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          marginBottom: '4px',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.food.name}
                      </h4>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>

                    {/* Quantity Controller */}
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
                        onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                        aria-label="Decrease"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
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

                      <span style={{ fontWeight: '700', fontSize: '13px', minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                        aria-label="Increase"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'var(--primary)',
                          color: '#ffffff',
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
                    <div style={{ fontWeight: '800', fontSize: '15px', minWidth: '60px', textAlign: 'right' }}>
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
                className="card"
                style={{
                  position: 'sticky',
                  top: '100px',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '24px',
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <span>Delivery Fee</span>
                    <span style={{ fontWeight: '600' }}>${deliveryFee.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <span>Service Tax (5%)</span>
                    <span style={{ fontWeight: '600' }}>${tax.toFixed(2)}</span>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '18px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </Link>

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  ⚡ Fast Delivery & EVC Plus Mobile Payment Ready
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
