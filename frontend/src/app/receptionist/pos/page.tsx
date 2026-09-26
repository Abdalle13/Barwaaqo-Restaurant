'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Food, Category, Table } from '@/types';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  UtensilsCrossed,
  Coffee,
  Users,
  Smartphone,
  CheckCircle2,
  X,
  Receipt,
  ChevronDown,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface POSCartItem {
  food: Food;
  quantity: number;
  price: number;
}

export default function ReceptionistPOSPage() {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();

  // Data
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // POS state
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY'>('DINE_IN');
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('evc_plus');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [foodRes, catRes, tableRes] = await Promise.allSettled([
        api.get('/foods'),
        api.get('/categories'),
        api.get('/tables'),
      ]);
      if (foodRes.status === 'fulfilled' && foodRes.value.data.success) {
        setFoods((foodRes.value.data.data || []).filter((f: Food) => f.status === 'Available' && !f.isDeleted));
      }
      if (catRes.status === 'fulfilled' && catRes.value.data.success) {
        setCategories(catRes.value.data.data || []);
      }
      if (tableRes.status === 'fulfilled' && tableRes.value.data.success) {
        setTables(tableRes.value.data.data || []);
      }
    } catch (err) {
      showToast('Failed to load menu', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Filtered foods
  const filteredFoods = useMemo(() => {
    return foods.filter(f => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || f.name.toLowerCase().includes(q);
      const catId = typeof f.category === 'object' ? f.category._id : f.category;
      const matchesCat = selectedCategory === 'ALL' || catId === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [foods, searchQuery, selectedCategory]);

  // Cart helpers
  const addToCart = (food: Food) => {
    setCart(prev => {
      const existing = prev.find(c => c.food._id === food._id);
      if (existing) {
        return prev.map(c => c.food._id === food._id
          ? { ...c, quantity: c.quantity + 1, price: food.price }
          : c
        );
      }
      return [...prev, { food, quantity: 1, price: food.price }];
    });
  };

  const updateQty = (foodId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.food._id === foodId) {
        const newQty = c.quantity + delta;
        return newQty <= 0 ? c : { ...c, quantity: newQty };
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const removeFromCart = (foodId: string) => {
    setCart(prev => prev.filter(c => c.food._id !== foodId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedTable('');
    setNotes('');
    setPaymentMethod('evc_plus');
  };

  // Totals
  const subtotal = cart.reduce((sum, c) => sum + (c.price * c.quantity), 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  // Submit order
  const handleSubmitOrder = async () => {
    if (cart.length === 0) return showToast('Cart is empty', 'error');
    if (!customerPhone) return showToast('Please enter customer phone', 'error');
    if (orderType === 'DINE_IN' && !selectedTable) return showToast('Please select a table for dine-in', 'error');

    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map(c => ({
          food: c.food._id,
          name: c.food.name,
          quantity: c.quantity,
          price: c.price,
        })),
        orderType,
        shippingAddress: orderType === 'DINE_IN'
          ? `Dine-In - Table ${tables.find(t => t._id === selectedTable)?.tableNumber || ''}`
          : `Takeaway - ${customerName || 'Walk-in'}`,
        paymentPhone: customerPhone,
        paymentMethod,
        paymentStatus: 'Paid',
        table: orderType === 'DINE_IN' ? selectedTable : undefined,
        notes: notes || `POS Order by ${user?.name || 'Receptionist'}${customerName ? ` for ${customerName}` : ''}`,
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        setLastOrderId(res.data.data?.orderId || 'N/A');
        setShowSuccess(true);
        clearCart();
        showToast('✅ Order placed successfully!', 'success');
        // Auto-hide success after 4s
        setTimeout(() => setShowSuccess(false), 4000);
        // Refresh tables
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTables = tables.filter(t => t.status === 'Available');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div style={{
      display: 'flex',
      gap: '0',
      minHeight: 'calc(100vh - 80px)',
      maxHeight: 'calc(100vh - 80px)',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {ToastComponent}

      {/* ========== LEFT: MENU PANEL ========== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Search + Filters */}
        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '2px' }}>
              <button
                onClick={() => setOrderType('DINE_IN')}
                style={{
                  padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                  backgroundColor: orderType === 'DINE_IN' ? 'var(--accent)' : 'transparent',
                  color: orderType === 'DINE_IN' ? '#FFF' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s',
                }}
              >
                <UtensilsCrossed size={13} /> Dine-In
              </button>
              <button
                onClick={() => setOrderType('TAKEAWAY')}
                style={{
                  padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                  backgroundColor: orderType === 'TAKEAWAY' ? 'var(--accent)' : 'transparent',
                  color: orderType === 'TAKEAWAY' ? '#FFF' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s',
                }}
              >
                <Coffee size={13} /> Takeaway
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
            <button
              onClick={() => setSelectedCategory('ALL')}
              style={{
                padding: '5px 14px', borderRadius: '20px', border: `1px solid ${selectedCategory === 'ALL' ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: selectedCategory === 'ALL' ? 'var(--accent)' : 'var(--bg-surface)',
                color: selectedCategory === 'ALL' ? '#FFF' : 'var(--text-secondary)',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                style={{
                  padding: '5px 14px', borderRadius: '20px', border: `1px solid ${selectedCategory === cat._id ? 'var(--accent)' : 'var(--border)'}`,
                  backgroundColor: selectedCategory === cat._id ? 'var(--accent)' : 'var(--bg-surface)',
                  color: selectedCategory === cat._id ? '#FFF' : 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', scrollbarWidth: 'thin' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              Loading menu...
            </div>
          ) : filteredFoods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <Search size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <p>No items found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {filteredFoods.map(food => {
                const cartItem = cart.find(c => c.food._id === food._id);
                const imgSrc = food.image
                  ? (food.image.startsWith('http') ? food.image : `${API_BASE}${food.image.startsWith('/') ? '' : '/'}${food.image}`)
                  : null;
                return (
                  <div
                    key={food._id}
                    onClick={() => addToCart(food)}
                    style={{
                      backgroundColor: 'var(--bg-surface)', border: `1.5px solid ${cartItem ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: '12px', cursor: 'pointer', overflow: 'hidden',
                      transition: 'all 0.15s', position: 'relative',
                    }}
                  >
                    {/* Food Image */}
                    <div style={{ width: '100%', height: '90px', backgroundColor: 'var(--bg-elevated)', overflow: 'hidden' }}>
                      {imgSrc ? (
                        <img src={imgSrc} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <UtensilsCrossed size={24} color="var(--text-muted)" style={{ opacity: 0.3 }} />
                        </div>
                      )}
                    </div>
                    {/* Food Info */}
                    <div style={{ padding: '8px 10px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {food.name}
                      </p>
                      <p style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent)', marginTop: '2px' }}>
                        ${food.price.toFixed(2)}
                      </p>
                    </div>
                    {/* Cart badge */}
                    {cartItem && (
                      <div style={{
                        position: 'absolute', top: '6px', right: '6px',
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent), #D47151)',
                        color: '#FFF', fontSize: '11px', fontWeight: '800',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px var(--accent-glow)',
                      }}>
                        {cartItem.quantity}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========== RIGHT: ORDER PANEL ========== */}
      <div style={{
        width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column',
        backgroundColor: 'var(--bg-surface)', borderLeft: '1px solid var(--border)', overflow: 'hidden',
      }}>
        {/* Panel Header */}
        <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={18} color="var(--accent)" /> Current Order
            </h3>
            {cart.length > 0 && (
              <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Trash2 size={12} /> Clear
              </button>
            )}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {orderType === 'DINE_IN' ? '🍽️ Dine-In' : '☕ Takeaway'} · {cart.length} item{cart.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', scrollbarWidth: 'thin' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '13px' }}>Tap items to add to order</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cart.map(item => (
                <div key={item.food._id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '10px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.food.name}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '700' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => updateQty(item.food._id, -1)} style={{ width: '26px', height: '26px', borderRadius: '7px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQty(item.food._id, 1)} style={{ width: '26px', height: '26px', borderRadius: '7px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeFromCart(item.food._id)} style={{ width: '26px', height: '26px', borderRadius: '7px', border: 'none', background: 'rgba(248,113,113,0.1)', color: '#F87171', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '4px' }}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Details Form */}
          {cart.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

              {/* Table Selection (Dine-In only) */}
              {orderType === 'DINE_IN' && (
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>
                    Select Table *
                  </label>
                  <select
                    value={selectedTable}
                    onChange={e => setSelectedTable(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="">Choose table...</option>
                    {availableTables.map(t => (
                      <option key={t._id} value={t._id}>
                        Table {t.tableNumber} — {t.location} ({t.capacity} seats)
                      </option>
                    ))}
                  </select>
                  {availableTables.length === 0 && (
                    <p style={{ fontSize: '11px', color: '#F87171', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={11} /> No tables available
                    </p>
                  )}
                </div>
              )}

              {/* Customer Info */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>
                    Customer Name
                  </label>
                  <input
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Walk-in"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>
                  Phone *
                </label>
                <input
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0615..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
                  Payment
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { value: 'evc_plus', label: 'EVC Plus' },
                    { value: 'edahab', label: 'eDahab' },
                    { value: 'pay_on_delivery', label: 'Pay Later' },
                  ].map(pm => (
                    <button
                      key={pm.value}
                      onClick={() => setPaymentMethod(pm.value)}
                      style={{
                        flex: 1, padding: '7px 6px', borderRadius: '8px', cursor: 'pointer',
                        border: `1.5px solid ${paymentMethod === pm.value ? 'var(--accent)' : 'var(--border)'}`,
                        backgroundColor: paymentMethod === pm.value ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                        color: paymentMethod === pm.value ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: '11px', fontWeight: '700', transition: 'all 0.15s',
                      }}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Order notes (optional)"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          )}
        </div>

        {/* Totals + Submit */}
        {cart.length > 0 && (
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tax (5%)</span>
              <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent)' }}>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || cart.length === 0}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                background: isSubmitting ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent) 0%, #D47151 100%)',
                color: isSubmitting ? 'var(--text-muted)' : '#FFFFFF',
                fontWeight: '800', fontSize: '14px', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: isSubmitting ? 'none' : '0 4px 16px var(--accent-glow)',
                transition: 'all 0.2s',
              }}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <><CheckCircle2 size={16} /> Place Order — ${total.toFixed(2)}</>
              )}
            </button>
          </div>
        )}

        {/* Success overlay */}
        {showSuccess && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}>
            <div style={{
              backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '40px',
              textAlign: 'center', maxWidth: '320px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #4ADE80, #16A34A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', boxShadow: '0 6px 20px rgba(74,222,128,0.3)',
              }}>
                <CheckCircle2 size={32} color="#000" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Order Placed!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
                Order <strong style={{ color: 'var(--accent)' }}>{lastOrderId}</strong>
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                The kitchen has been notified.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                style={{
                  padding: '10px 30px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, var(--accent), #D47151)',
                  color: '#FFF', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 3px 12px var(--accent-glow)',
                }}
              >
                New Order
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
